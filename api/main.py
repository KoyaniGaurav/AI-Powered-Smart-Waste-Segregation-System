import io
import json
import os
import uuid
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

import numpy as np
import tensorflow as tf
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from tensorflow.keras.applications.efficientnet import preprocess_input

from database import SessionLocal, engine
from models import Base, User, UserSession, WastePrediction
from schemas import LoginRequest, SavePredictionRequest, SignUpRequest
from security import create_session_token, hash_password, verify_password

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = Path(os.getenv("UPLOADS_DIR", BASE_DIR / "uploads")).resolve()
MODEL_PATH = Path(os.getenv("MODEL_PATH", BASE_DIR / "models" / "best_waste_model.h5")).resolve()
CLASS_LABELS_PATH = Path(os.getenv("CLASS_LABELS_PATH", BASE_DIR / "class_labels.json")).resolve()
WASTE_INFO_PATH = Path(os.getenv("WASTE_INFO_PATH", BASE_DIR / "waste_info.json")).resolve()

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000").rstrip("/")

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


def parse_allowed_origins() -> list[str]:
    raw_value = os.getenv("CORS_ALLOWED_ORIGINS", "")
    configured_origins = [origin.strip() for origin in raw_value.split(",") if origin.strip()]

    if not configured_origins:
        return DEFAULT_ALLOWED_ORIGINS

    return list(dict.fromkeys([*DEFAULT_ALLOWED_ORIGINS, *configured_origins]))


def extract_filename(image_path: str) -> str:
    normalized_path = str(image_path or "").replace("\\", "/")
    return normalized_path.rsplit("/", 1)[-1]

def ensure_database_schema():
    inspector = inspect(engine)

    if "users" not in inspector.get_table_names():
        User.__table__.create(bind=engine)

    if "user_sessions" not in inspector.get_table_names():
        UserSession.__table__.create(bind=engine)

    if "waste_predictions" not in inspector.get_table_names():
        WastePrediction.__table__.create(bind=engine)
        return

    prediction_columns = {column["name"] for column in inspector.get_columns("waste_predictions")}
    with engine.begin() as connection:
        if "user_id" not in prediction_columns:
            connection.execute(
                text("ALTER TABLE waste_predictions ADD COLUMN user_id INTEGER NULL")
            )
        if "created_at" not in prediction_columns:
            connection.execute(
                text(
                    "ALTER TABLE waste_predictions "
                    "ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
                )
            )


ensure_database_schema()
Base.metadata.create_all(bind=engine)

model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)

with CLASS_LABELS_PATH.open("r", encoding="utf-8") as file:
    class_indices = json.load(file)

class_names = sorted(class_indices, key=class_indices.get)

with WASTE_INFO_PATH.open("r", encoding="utf-8") as file:
    waste_info = json.load(file)

app = FastAPI(
    title="AI Powered Smart Waste Segregation API",
    version="1.0",
    description="Waste classification and recycling analysis system",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_FOLDER)), name="uploads")

IMG_SIZE = 224
CONFIDENCE_THRESHOLD = 0.75
CONFIDENCE_GAP_THRESHOLD = 0.10


def preprocess_image(image):
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image)
    image = image.astype("float32")
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)
    return image


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def normalize_prediction(predicted_label: str):
    analysis = waste_info.get(
        predicted_label,
        {
            "waste_type": "Unknown",
            "recyclable": False,
            "hazardous": False,
            "bin_color": "Unknown",
            "carbon_impact": "Unknown",
            "disposal_method": "Consult local waste authority",
            "earning_potential": False,
            "recycling_value": {
                "estimated_value": "Unknown",
                "valuable_materials": [],
                "selling_method": "Unknown",
            },
            "reuse_suggestions": [],
            "environmental_impact": "Unknown",
            "safety_precautions": [],
        },
    )
    return analysis


def get_uploaded_file_url(image_path: str) -> str:
    filename = extract_filename(image_path)
    return f"{BACKEND_BASE_URL}/uploads/{quote(filename)}"


def normalize_image_path(image_path: str) -> str:
    filename = extract_filename(image_path)
    candidate = (UPLOAD_FOLDER / filename).resolve()
    uploads_root = UPLOAD_FOLDER.resolve()

    if uploads_root not in candidate.parents and candidate != uploads_root / filename:
        raise HTTPException(status_code=400, detail="Invalid image path.")

    if not candidate.exists():
        raise HTTPException(status_code=400, detail="Uploaded image file was not found.")

    return str(candidate)


def serialize_user(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


def serialize_prediction(prediction: WastePrediction):
    analysis = normalize_prediction(prediction.predicted_class)
    return {
        "id": prediction.id,
        "image_path": prediction.image_path,
        "image_url": get_uploaded_file_url(prediction.image_path),
        "predicted_class": prediction.predicted_class,
        "confidence": round(float(prediction.confidence), 2),
        "created_at": prediction.created_at.isoformat() if prediction.created_at else None,
        "analysis": analysis,
    }


def get_token_from_header(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )
    return token


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    token = get_token_from_header(authorization)
    session = (
        db.query(UserSession)
        .filter(UserSession.token == token, UserSession.is_active.is_(True))
        .first()
    )

    if not session or not session.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid.",
        )

    return session.user


@app.get("/")
def home():
    return {"message": "AI Waste Segregation API Running Successfully"}


@app.post("/auth/signup")
def signup(payload: SignUpRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_session_token()
    session = UserSession(user_id=user.id, token=token, is_active=True)
    db.add(session)
    db.commit()

    return {
        "message": "Account created successfully.",
        "token": token,
        "user": serialize_user(user),
    }


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_session_token()
    session = UserSession(user_id=user.id, token=token, is_active=True)
    db.add(session)
    db.commit()

    return {
        "message": "Login successful.",
        "token": token,
        "user": serialize_user(user),
    }


@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"user": serialize_user(current_user)}


@app.post("/auth/logout")
def logout(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    token = get_token_from_header(authorization)
    session = (
        db.query(UserSession)
        .filter(UserSession.token == token, UserSession.is_active.is_(True))
        .first()
    )
    if session:
        session.is_active = False
        db.commit()

    return {"message": "Logged out successfully."}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        file_extension = Path(file.filename or "upload.jpg").suffix or ".jpg"
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        image_path = UPLOAD_FOLDER / unique_filename

        with image_path.open("wb") as saved_file:
            saved_file.write(image_bytes)

        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image, verbose=0)[0]

        if np.isnan(predictions).any():
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": "Invalid prediction values"},
            )

        top_2_indices = predictions.argsort()[-2:][::-1]
        predicted_index = int(np.argmax(predictions))
        predicted_label = class_names[predicted_index]
        confidence = float(predictions[predicted_index])
        confidence_gap = float(predictions[top_2_indices[0]] - predictions[top_2_indices[1]])

        if confidence < CONFIDENCE_THRESHOLD or confidence_gap < CONFIDENCE_GAP_THRESHOLD:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "message": (
                        "Unable to confidently identify the waste item. "
                        "Please upload a clearer image with proper lighting "
                        "and a visible waste object."
                    ),
                    "tips": [
                        "Use good lighting",
                        "Avoid blurry images",
                        "Capture a single waste object",
                        "Keep the object closer to camera",
                    ],
                },
            )

        analysis = normalize_prediction(predicted_label)
        image_path_str = str(image_path)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "prediction": {
                    "class": predicted_label,
                    "confidence": round(confidence * 100, 2),
                    "image_path": image_path_str,
                    "image_url": get_uploaded_file_url(image_path_str),
                },
                "analysis": analysis,
            },
        )

    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(exc)},
        )


@app.post("/predictions")
def save_prediction(
    payload: SavePredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prediction = WastePrediction(
        user_id=current_user.id,
        image_path=normalize_image_path(payload.image_path),
        predicted_class=payload.predicted_class,
        confidence=payload.confidence,
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return {
        "message": "Prediction saved successfully.",
        "prediction": serialize_prediction(prediction),
    }


@app.get("/predictions")
def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    predictions = (
        db.query(WastePrediction)
        .filter(WastePrediction.user_id == current_user.id)
        .order_by(WastePrediction.created_at.desc())
        .all()
    )
    return {"predictions": [serialize_prediction(prediction) for prediction in predictions]}


@app.get("/predictions/{prediction_id}")
def get_prediction_detail(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prediction = (
        db.query(WastePrediction)
        .filter(
            WastePrediction.id == prediction_id,
            WastePrediction.user_id == current_user.id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found.")

    return {"prediction": serialize_prediction(prediction)}


@app.delete("/predictions/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prediction = (
        db.query(WastePrediction)
        .filter(
            WastePrediction.id == prediction_id,
            WastePrediction.user_id == current_user.id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found.")

    db.delete(prediction)
    db.commit()
    return {"message": "Prediction deleted successfully."}
