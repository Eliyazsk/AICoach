from fastapi import APIRouter, HTTPException
from models.schemas import InterviewRequest, InterviewResponse, EvaluateAnswerRequest, EvaluateAnswerResponse
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

@router.post("/interview", response_model=InterviewResponse)
async def generate_interview(request: InterviewRequest):
    """
    Generates tailored interview questions based on the candidate's resume and target job role.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not request.job_role.strip():
        raise HTTPException(status_code=400, detail="Job role cannot be empty.")
        
    try:
        data = gemini_service.generate_interview_questions(request.text, request.job_role)
        return InterviewResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer(request: EvaluateAnswerRequest):
    """
    Evaluates the candidate's response to an interview question.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not request.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")
        
    try:
        data = gemini_service.evaluate_answer(request.question, request.answer)
        return EvaluateAnswerResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
