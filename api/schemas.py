from pydantic import BaseModel, Field, field_validator


class SignUpRequest(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or "." not in normalized.split("@")[-1]:
            raise ValueError("Please enter a valid email address.")
        return normalized


class LoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or "." not in normalized.split("@")[-1]:
            raise ValueError("Please enter a valid email address.")
        return normalized


class SavePredictionRequest(BaseModel):
    image_path: str = Field(min_length=1)
    predicted_class: str = Field(min_length=1, max_length=255)
    confidence: float = Field(ge=0, le=100)
