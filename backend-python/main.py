from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import re

# Load model and vectorizer
vectorizer, model = joblib.load("cyberbullying_pipeline_deploy.pkl")

app = FastAPI()

class InputText(BaseModel):
    text: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  

def is_meaningful(text: str) -> bool:
    text = text.strip().lower()
    if len(text) < 5:
        return False
    # At least 2 alphabet characters anywhere in the input
    if len(re.findall(r'[a-zA-Z]', text)) < 2:
        return False
    # Reject if input is entirely digits, symbols, or emojis
    if re.fullmatch(r'[\d\W_]+', text):
        return False
    return True

@app.post("/predict")
def predict(data: InputText):
    input_text = data.text.strip()

    if not is_meaningful(input_text):
        return {
            "prediction": "invalid",
            "confidence": 0.0,
            "message": "Input does not appear to be meaningful text."
        }

    X = vectorizer.transform([input_text])
    proba = model.predict_proba(X)[0]
    label = model.predict(X)[0]
    confidence = round(max(proba), 2)
    return {
    "prediction": "cyberbullying" if label == 1 else "not cyberbullying",
    "confidence": confidence
}
