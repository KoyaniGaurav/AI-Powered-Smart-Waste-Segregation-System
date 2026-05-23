# README.md

# AI Powered Smart Waste Segregation & Recycling Analysis System

An AI-powered waste classification and recycling analysis platform that uses Deep Learning and Computer Vision to identify waste items, recommend the correct waste bin, and provide recycling insights.

The system supports:

* AI waste prediction
* Smart bin recommendation
* Recycling guidance
* Hazardous waste alerts
* User authentication
* Personalized prediction history

---

# Features

## AI Waste Classification

Upload an image and the system predicts the waste category using a trained EfficientNetB0 deep learning model.

## Smart Bin Recommendation

Automatically recommends the correct waste bin:

* Green Bin
* Blue Bin
* Black Bin

## Recycling & Disposal Analysis

Provides:

* Waste type
* Recyclability
* Disposal method
* Environmental impact
* Reuse suggestions
* Recycling value

## User Authentication

Users can:

* Create account
* Login securely
* Access personalized prediction history

## Prediction History

Users can save predictions manually and view their own previous waste analysis records.

---

# Tech Stack

## Frontend

* React
* Tailwind CSS
* Framer Motion

## Backend

* FastAPI
* SQLAlchemy

## Database

* MySQL

## AI / Deep Learning

* TensorFlow
* EfficientNetB0

---

# Project Structure

```bash
project/
│
├── frontend/
│
├── api/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── waste_info.json
│   ├── class_labels.json
│   ├── uploads/
│   └── models/
│
├── Model_Dataset/
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
```

---

# Backend Setup

## Create Virtual Environment

```bash
python -m venv tfenv
```

## Activate Environment

### Linux / WSL

```bash
source tfenv/bin/activate
```

### Windows

```bash
tfenv\Scripts\activate
```

---

# Install Dependencies

```bash
pip install -r requirements.txt
```

---

# MySQL Setup

## Create Database

```sql
CREATE DATABASE waste_segmentation_db;
```

## Create User

```sql
CREATE USER 'gaurav'@'localhost'
IDENTIFIED BY 'YOUR_PASSWORD';
```

## Grant Permissions

```sql
GRANT ALL PRIVILEGES
ON waste_segmentation_db.*
TO 'gaurav'@'localhost';

FLUSH PRIVILEGES;
```

---

# Run Backend

```bash
python -m uvicorn main:app --reload
```

---

# Frontend Setup

```bash
npm install
npm run dev
```

---

# Model Training

The model is trained using:

* EfficientNetB0
* Transfer Learning
* TensorFlow/Keras

Features:

* Data augmentation
* Early stopping
* Reduce LR on plateau
* Model checkpointing

---

# API Features

## Prediction API

* Upload/Capture waste image
* AI classification
* Waste analysis response

## Authentication APIs

* Register
* Login
* User session management

## History APIs

* Save prediction
* View prediction history
* Delete saved prediction

---

# Future Improvements

* AWS Deployment
* Docker Support
* Waste Analytics Dashboard
* Admin Panel
* Mobile App
* Multi-language Support

