# AICoach - AI Career Assistant & Mock Interviewer

AICoach is a production-ready AI career assistant designed to analyze resumes, calculate ATS alignment scores, identify missing keywords, rewrite/optimize resumes, and conduct interactive mock interviews based on candidate history.

## Project Structure

```
AICoach/
│
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── routes/
│   │   ├── resume.py          # upload + parsing APIs
│   │   ├── ai.py              # AI endpoints
│   │   ├── interview.py       # interview logic
│   │
│   ├── services/
│   │   ├── gemini_service.py  # all AI calls
│   │   ├── resume_parser.py   # PDF text extraction
│   │
│   ├── models/
│   │   ├── schemas.py         # request/response models
│   │
│   ├── utils/
│   │   ├── helpers.py         # utilities
│   │
│   ├── uploads/               # uploaded files directory
│   ├── .env                   # backend environmental configuration
│   └── requirements.txt       # backend python dependencies
│
├── frontend/                  # Next.js frontend with Tailwind CSS
│   ├── pages/                 # client pages
│   ├── components/            # shared components
│   ├── styles/                # global CSS styles
│   └── api/                   # API request integration layer
│
└── README.md
```

---

## Getting Started

### 1. Backend Setup (FastAPI)

1. Navigate to the `backend/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your Google Gemini API key inside `.env`:
   ```ini
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
4. Run the FastAPI development server:
   ```bash
   python main.py
   ```
   The backend server will run on `http://localhost:8000`. You can visit `http://localhost:8000/docs` to see the Swagger interactive documentation.

### 2. Frontend Setup (Next.js)

1. Navigate to the `frontend/` directory.
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

---

## Key Features

1. **ATS Checker**: Upload a PDF resume and check your score. View key strengths, missing skills, and step-by-step instructions.
2. **AI Rewrite**: Transform your current resume into an optimized format designed to beat Applicant Tracking System algorithms.
3. **Mock Interviews**: Specify a target job role and answer 5-10 tailored questions. Receive instant scoring and constructive critique on every response.
