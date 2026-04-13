  # SymptoSense 🩺
**AI-Powered Healthcare Analysis & Personalized Medical Recommendations**

SymptoSense is a premium medical AI platform designed to bridge the gap between initial symptoms and professional medical guidance. It leverages a custom Neural Network for primary disease prediction and orchestrates a team of specialized AI agents to provide deep, actionable health insights.

## 🚀 Key Features

- **Advanced Disease Prediction**: Utilizes a trained Neural Network to match symptoms against known medical conditions with high confidence.
- **Multi-Agent Orchestration**: A custom LangChain-based pipeline that executes four specialized agents in parallel:
    - **Clinical Insights Agent**: Provides actionable immediate steps and specialist referrals.
    - **Clinical Guidelines Agent**: Summarizes the latest evidence-based protocols from global health authorities (WHO, NICE, etc.).
    - **Treatment Exploration Agent**: Explores integrative treatment pathways across Allopathy, Ayurveda, and Homeopathy.
    - **Lifestyle & Diet Agent**: Delivers personalized nutrition, exercise, and wellness advice.
- **Medical Report Intelligence**: Built-in OCR pipeline to extract clinical symptoms and data from PDF or image-based medical reports.
- **State-of-the-Art Models**: Powered by the latest **Gemma 4-31B-IT** models via OpenRouter for clinical-grade reasoning.
- **Premium Experience**: A high-fidelity, dark-themed dashboard built with React and Tailwind CSS, featuring smooth animations and glassmorphic UI elements.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for high-performance, modern UI
- **Icons**: Lucide React
- **Connectivity**: Axios for robust API communication

### Backend
- **Core**: Python with Django/REST Framework
- **Orchestration**: LangChain for intelligent agent management
- **AI Models**: OpenRouter SDK (Gemma 4 series)
- **ML/OCR**: Custom Neural Network & document processing pipeline

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/Naga0203/symptosense.git
cd symptosense
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your OpenRouter and Firebase credentials
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your Firebase and API configuration
npm run dev
```

## ⚙️ Detailed Configuration

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Firebase Project**: Required for Authentication and Firestore.
- **OpenRouter API Key**: Required for AI Agent reasoning.

### Environment Variables
Both frontend and backend require `.env` files. See `.env.example` in respective directories for required keys.
- `OPENROUTER_API_KEY`: Found in OpenRouter dashboard.
- `FIREBASE_CREDENTIALS`: Path to your service account JSON.
- `VITE_FIREBASE_CONFIG`: Standard Firebase web config for the frontend.

## 📦 Project Structure

```bash
├── backend/            # Django API & ML Agents
│   ├── agents/         # LangChain Agent Definitions
│   ├── ml/             # OCR Services & Model Logic
│   └── api/            # API Endpoints & Views
├── frontend/           # React Application
│   ├── src/pages/      # Dashboard, Assessments, Analysis
│   └── src/components/ # Shared UI Components
└── Notebook_and_Code/  # Data Science research and model training
```

## ⚠️ Medical Disclaimer
SymptoSense is an AI-generated informational tool. It is **NOT** a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.

---
Developed with precision by Naga.
