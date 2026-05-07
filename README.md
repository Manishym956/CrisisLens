<div align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0CT2LUTYL63du1re5-5ZXMS_KFg7iWc5dPxO2nsqLqibGzhRe9SoraUZQ2P7yKtrC8HvQZVjaN-DNokAu7wSEDCYGA43tYU9Azooxl1C4Za4PFRmoiqeQZWVmC4ZkXtcrgAo83LjGJmZWSCdH4dUM_qhU3OluhyChcct2mLnYdH2FOwDYi9ncqeO_f-vvJAH2e2vpR7xJA077H_YCuDL-vl-TtQ0V0w4ngyZ4eBcTfZ_EdYMWMT387BD2tWz4K3FoPy2SBz5HxK0" alt="CrisisLens Banner" width="100%" />

  <h1>CrisisLens 🛡️</h1>
  <p><strong>AI-Powered Misinformation Intelligence & Early Warning Platform</strong></p>

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📖 Overview

**CrisisLens** is an advanced, multi-layered cyber-intelligence dashboard built to combat the rapid spread of misinformation, deepfakes, and information warfare. By utilizing a **Triple-LLM Consensus Engine** alongside a **Deepfake Forensic Lab**, CrisisLens can instantly detect, rank, and combat malicious narratives before they reach critical mass.

## ✨ Core Features

1. **Multi-AI Consensus Engine:** 
   - Routes suspicious news excerpts simultaneously through **OpenAI (GPT-4)**, **Google Gemini**, and **Groq (Llama 3)**. 
   - Forces strict Boolean (True/False) evaluations and utilizes a Truth Table (majority rules) to officially classify a narrative as Fake or Legit.

2. **Automated Threat Ranker (1-10 Scale):**
   - Ranks threats mathematically based on **Panic/Safety impact (40%)**, **Political volatility (30%)**, and **Virality velocity (30%)**.
   - Outputs a clean **Rank 1 (Most Critical) to Rank 10 (Lowest Threat)** categorization.

3. **Multi-Tier Automated Dispatch Architecture:**
   - 🚨 **Ranks 1 & 2:** Triggers immediate emergency email dispatches to relevant authorities.
   - 📢 **Ranks 3 to 6:** Automatically formats and dispatches debunking posts to simulated social media platform APIs to combat the narrative publicly.
   - 🗄️ **Ranks 7 to 10:** Safely stores low-level noise in a dedicated `low_threat_news` database, aggregated for a daily end-of-day digest.

4. **Deepfake Forensic Lab:**
   - Upload media for forensic analysis against generative GAN artifacts using Vision Transformer architecture simulations.

5. **Real-Time Global Command Center:**
   - Live WebSocket feed pushing verified threats directly to the dashboard interface the moment the AI Consensus engine flags them.

6. **Secure Infrastructure:**
   - Fully protected by **Google OAuth 2.0** integrated on the Next.js frontend, backed by secure, stateless custom **JWTs** verified on the FastAPI backend.

---

## 🛠️ Technology Stack

### Backend
* **Python 3.10+** & **FastAPI** (High-performance async API)
* **MongoDB (Motor)** (Async NoSQL data storage)
* **PyJWT & Google Auth** (Security & Session management)
* **OpenAI, Google Generative AI, Groq SDKs** (LLM Integrations)

### Frontend
* **Next.js 14 (App Router)** & **React 18**
* **Tailwind CSS v4** (Glassmorphism & Cyber-Intelligence UI design)
* **Zustand** (Global State Management)
* **@react-oauth/google** (Authentication)
* **Recharts** (Predictive Data Visualizations)
* **Axios** (Configured with automated JWT interceptors)

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* Python 3.10+
* MongoDB URI (Local or Atlas)
* API Keys (OpenAI, Gemini, Groq, Google OAuth Client ID)

### 1. Clone the Repository
```bash
git clone https://github.com/Trigger2k26Hack24/ClueBox.git
cd ClueBox
```

### 2. Backend Setup
```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env with your MongoDB URI, LLM API keys, and JWT configurations.

# Start the FastAPI Server
uvicorn main:app --reload
# Backend will be running at http://localhost:8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env.local file in the frontend directory
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here" > .env.local

# Start the Next.js Development Server
npm run dev
# Frontend will be running at http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User navigates to `http://localhost:3000/login`.
2. Authenticates securely via the **Google OAuth** popup.
3. Frontend receives Google `credential` and POSTs it to `http://localhost:8000/api/v1/auth/google`.
4. FastAPI verifies the token against Google's public JWKs, registers the user in MongoDB, and signs a custom short-lived JWT.
5. The JWT is returned and stored securely in Zustand via `localStorage`.
6. Axios interceptors attach the `Bearer <token>` to all subsequent requests to protect sensitive endpoints (e.g., `/api/v1/news/store-news`).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is built for the Trigger2k26Hack24. All rights reserved.
