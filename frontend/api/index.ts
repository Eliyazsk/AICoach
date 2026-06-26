const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface AnalyzeResumeResponse {
  ats_score: number;
  missing_skills: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface ImproveResumeResponse {
  improved_resume: string;
}

export interface InterviewResponse {
  questions: string[];
}

export interface EvaluateAnswerResponse {
  feedback: string;
  score: number;
}

export async function uploadResume(file: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to upload and parse resume.');
  }

  return response.json();
}

export async function analyzeResume(text: string): Promise<AnalyzeResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to analyze resume.');
  }

  return response.json();
}

export async function improveResume(text: string): Promise<ImproveResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/improve-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to improve resume.');
  }

  return response.json();
}

export async function generateInterviewQuestions(text: string, jobRole: string): Promise<InterviewResponse> {
  const response = await fetch(`${API_BASE_URL}/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, job_role: jobRole }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to generate interview questions.');
  }

  return response.json();
}

export async function evaluateAnswer(question: string, answer: string): Promise<EvaluateAnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, answer }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to evaluate answer.');
  }

  return response.json();
}
