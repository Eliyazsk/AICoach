import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

# Import Routers
from routes import resume, ai, interview

# Ensure the uploads directory exists
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="AICoach API",
    description="Backend services for AICoach - The AI Career Assistant",
    version="1.0.0"
)

# CORS middleware to allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resume.router, tags=["Resume Upload & Analysis"])
app.include_router(ai.router, tags=["AI Optimization"])
app.include_router(interview.router, tags=["Mock Interview"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AICoach API server! Navigate to /docs for API documentation."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    # Run the server
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
