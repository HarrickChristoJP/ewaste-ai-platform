from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout

app = Flask(__name__)
CORS(app)

# ---- REBUILD MODEL ARCHITECTURE ----
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation="relu"),
    Dropout(0.3),
    Dense(10, activation="softmax")
])

# ---- LOAD ONLY WEIGHTS ----
model.load_weights("e_waste_classifier.h5")

class_names = [
    "Battery", "Keyboard", "Microwave", "Mobile", "Mouse",
    "PCB", "Player", "Printer", "Television", "Washing Machine"
]

risk_info = {
    "Battery": {"risk": "High", "impact": "Toxic chemicals", "recycle": "Certified recyclers"},
    "PCB": {"risk": "High", "impact": "Heavy metals", "recycle": "E-waste centers"},
    "Mobile": {"risk": "Medium", "impact": "Rare metals", "recycle": "Take-back programs"},
    "Keyboard": {"risk": "Low", "impact": "Plastic waste", "recycle": "E-waste bins"},
    "Mouse": {"risk": "Low", "impact": "Plastic waste", "recycle": "E-waste bins"},
    "Printer": {"risk": "Medium", "impact": "Ink residue", "recycle": "Manufacturer return"},
    "Television": {"risk": "High", "impact": "Leaded glass", "recycle": "Authorized recyclers"},
    "Washing Machine": {"risk": "Medium", "impact": "Large e-waste", "recycle": "Scrap dealer"},
    "Microwave": {"risk": "Medium", "impact": "Electronic components", "recycle": "E-waste center"},
    "Player": {"risk": "Low", "impact": "Landfill waste", "recycle": "Electronics recycling"}
}

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    img = Image.open(file).convert("RGB").resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    idx = np.argmax(preds)
    label = class_names[idx]

    return jsonify({
        "class": label,
        "confidence": round(float(np.max(preds)) * 100, 2),
        "risk": risk_info[label]["risk"],
        "impact": risk_info[label]["impact"],
        "recycle": risk_info[label]["recycle"]
    })

if __name__ == "__main__":
    app.run(port=8000)
