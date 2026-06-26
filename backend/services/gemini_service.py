import os
import json
import logging
import google.generativeai as genai
from typing import List, Dict, Any

logger = logging.getLogger("aicoach")

class GeminiService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
            logger.warning("GEMINI_API_KEY is not set or is using placeholder. Gemini calls will fail.")
        genai.configure(api_key=api_key)
        # Using gemini-2.5-flash as it is fast and supports JSON output mode
        self.model_name = "gemini-2.5-flash"

    def _call_gemini_json(self, prompt: str) -> Dict[str, Any]:
        """
        Helper method to call Gemini and enforce JSON output.
        """
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            # Parse response text as JSON
            return json.loads(response.text)
        except json.JSONDecodeError as jde:
            logger.error(f"Failed to parse JSON from Gemini response: {jde}")
            raise ValueError("AI returned an invalid JSON response. Please try again.")
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            raise RuntimeError(f"Gemini API error: {str(e)}")

    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Analyzes the resume for ATS score, strengths, improvements, and missing skills.
        """
        prompt = f"""
You are an ATS (Applicant Tracking System).

Analyze the resume provided below. Assess skills match, experience, keywords, and overall formatting quality.
Return ONLY a valid JSON object matching this schema:
{{
  "ats_score": 0-100,
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "summary": "High level brief overview of the candidate profile and ATS alignment."
}}

Resume text:
{resume_text}
"""
        return self._call_gemini_json(prompt)

    def improve_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Rewrites the resume in a highly professional, ATS-optimized, clean format.
        """
        prompt = f"""
You are an expert resume writer and ATS optimization specialist.

Rewrite the following resume to be highly optimized for Applicant Tracking Systems. 
- Use active, professional action verbs.
- Highlight metrics, achievements, and impact.
- Structure it cleanly with clear headers (Contact, Summary, Experience, Education, Skills).
- Do not include markdown styling or formatting in the rewritten text itself (e.g. no bold stars '**'), write it as clean, readable plain-text.

Return ONLY a valid JSON object with the following schema:
{{
  "improved_resume": "The entire rewritten ATS-optimized resume text goes here"
}}

Original Resume:
{resume_text}
"""
        return self._call_gemini_json(prompt)

    def generate_interview_questions(self, resume_text: str, job_role: str) -> Dict[str, Any]:
        """
        Generates 5-10 technical/behavioral interview questions based on the candidate's resume and target role.
        """
        prompt = f"""
You are a technical interviewer hiring for the role of "{job_role}".

Review the candidate's resume text below and generate 5 to 8 interview questions tailored specifically to their experience, stack, and the target job.
Rules:
- Questions must be based ONLY on the resume context, or logical extensions of their documented tech stack/experience.
- Start with easy/warm-up questions, progress to medium technical, and finish with hard/challenging situational or deep technical questions.
- Focus on real-world engineering and experience. Do not ask generic or unrelated brainteasers.

Return ONLY a valid JSON object with the following schema:
{{
  "questions": [
    "Question 1 (Easy)...",
    "Question 2 (Medium)...",
    ...
  ]
}}

Candidate Resume:
{resume_text}
"""
        return self._call_gemini_json(prompt)

    def evaluate_answer(self, question: str, answer: str) -> Dict[str, Any]:
        """
        Evaluates a candidate's answer to a specific interview question.
        """
        prompt = f"""
You are a professional technical interviewer.

Evaluate the candidate's response to the given question.
Question: "{question}"
Candidate Answer: "{answer}"

Assess the response based on clarity, technical accuracy, relevance, and communication skills. Provide professional, constructive feedback and score it out of 100.

Return ONLY a valid JSON object matching this schema:
{{
  "feedback": "Constructive feedback detailing what they did well, what details they missed, and how to improve the response.",
  "score": 0-100
}}
"""
        return self._call_gemini_json(prompt)
