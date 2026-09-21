# Backend
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 5055

# Frontend
cd frontend
npm install
npm run dev
