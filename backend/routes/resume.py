from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import AnalyzeResumeRequest, AnalyzeResumeResponse
from services.resume_parser import ResumeParser
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF resume upload, extracts and returns the clean text.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        extracted_text = ResumeParser.extract_text_from_bytes(content)
        return {"text": extracted_text}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading: {str(e)}")

@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
async def analyze_resume(request: AnalyzeResumeRequest):
    """
    Analyzes the resume text using Gemini and returns ATS score and feedback.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Resume text content cannot be empty.")
        
    try:
        analysis = gemini_service.analyze_resume(request.text)
        return AnalyzeResumeResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
