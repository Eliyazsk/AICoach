from fastapi import APIRouter, HTTPException
from models.schemas import ImproveResumeRequest, ImproveResumeResponse
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

@router.post("/improve-resume", response_model=ImproveResumeResponse)
async def improve_resume(request: ImproveResumeRequest):
    """
    Rewrites the resume text using Gemini to be ATS-optimized.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Original resume text cannot be empty.")
        
    try:
        improved = gemini_service.improve_resume(request.text)
        return ImproveResumeResponse(**improved)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
