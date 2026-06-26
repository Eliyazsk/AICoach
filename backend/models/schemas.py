from pydantic import BaseModel, Field
from typing import List, Optional

# --- Resume Analysis ---
class AnalyzeResumeRequest(BaseModel):
    text: str = Field(..., description="The plain text of the resume to analyze")

class AnalyzeResumeResponse(BaseModel):
    ats_score: int = Field(..., description="ATS Score between 0 and 100")
    missing_skills: List[str] = Field(default_factory=list, description="Skills missing from the resume for a competitive profile")
    strengths: List[str] = Field(default_factory=list, description="Key strengths identified in the resume")
    improvements: List[str] = Field(default_factory=list, description="Recommended improvement actions")
    summary: str = Field(..., description="A high-level summary of the resume analysis")

# --- Resume Improvement ---
class ImproveResumeRequest(BaseModel):
    text: str = Field(..., description="The original resume text")

class ImproveResumeResponse(BaseModel):
    improved_resume: str = Field(..., description="The rewritten, ATS-optimized resume in professional format")

# --- Interview Mock ---
class InterviewRequest(BaseModel):
    text: str = Field(..., description="The candidate's resume text")
    job_role: str = Field(..., description="The target job role (e.g. Software Engineer, Product Manager)")

class InterviewResponse(BaseModel):
    questions: List[str] = Field(..., description="List of interview questions tailored to the resume and role")

# --- Interview Evaluation ---
class EvaluateAnswerRequest(BaseModel):
    question: str = Field(..., description="The interview question asked")
    answer: str = Field(..., description="The answer provided by the user")

class EvaluateAnswerResponse(BaseModel):
    feedback: str = Field(..., description="Constructive feedback on the answer")
    score: int = Field(..., description="Score for the answer, between 0 and 100")
