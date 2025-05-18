from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

# Load model and vectorizer
vectorizer, model = joblib.load("cyberbullying_pipeline_deploy.pkl")

app = FastAPI()

class InputText(BaseModel):
    text: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/predict")
def predict(data: InputText):
    X = vectorizer.transform([data.text])
    proba = model.predict_proba(X)[0]
    label = model.predict(X)[0]
    confidence = round(max(proba), 2)
    return {
        "prediction": "cyberbullying" if label == 1 else "not cyberbullying",
        "confidence": confidence
    }
