# 🔥 FireGuard AI – Forest Fire Prediction System

---

## 📌 Problem Statement

Forest fires are becoming increasingly frequent and destructive due to changing climate conditions. Early detection and risk assessment are critical, but traditional systems often lack accessibility, real-time analysis, and user-friendly interfaces. There is a need for a system that can analyze environmental factors and provide quick, reliable fire risk predictions.

---

## 💡 Solution

FireGuard AI is a full-stack application that predicts forest fire risk using machine learning and environmental data. It combines a web-based interface with a backend system and an ML model to provide real-time risk analysis.

The system allows users to input or fetch environmental conditions and instantly receive predictions about the likelihood of a forest fire.

---

## 🚀 Key Idea and Features

- 🔍 **Real-time Risk Prediction**  
  Predicts fire probability based on environmental inputs.

- 🧠 **Machine Learning Integration**  
  Uses a trained ML model to analyze patterns in fire-related data.

- 🌍 **Environmental Data Processing**  
  Incorporates parameters like temperature, humidity, vegetation, etc.

- 🖥️ **Full-Stack Architecture**  
  - Frontend: React (Vite)  
  - Backend: Node.js (Express)  
  - ML Service: Python (Flask)

- 🔗 **API-Based Communication**  
  Seamless interaction between frontend, backend, and ML model.

---

## 🛠️ How to Use

Step 1: Start ML Backend

```bash
cd server/model
python app.py

Step 2: Start Node Backend
cd server
npm install
npm start

Step 3: Start Frontend
cd fireguard-ai
npm install
npm run dev

Step 4: Open Application

Visit:
http://localhost:3000
Use the interface to perform live risk analysis

⚙️ Environment Setup Guidelines
🔹 Python Setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
🔹 Node Setup
npm install
🔹 Environment Variables
Create a .env file in required directories and add:
MONGO_URI=your_mongo_uri
API_KEYS=your_api_keys

This project is part of ongoing work and may be considered for patenting in the future.
The code is shared publicly for demonstration and learning purposes only.

All rights are reserved. Unauthorized use, reproduction, or distribution of this project is not permitted without prior permission.

👤 Author
Diksha Tank
