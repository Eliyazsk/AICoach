import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { generateInterviewQuestions, evaluateAnswer } from '../api';
import { 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  MessageSquare, 
  Briefcase, 
  Play, 
  Send, 
  Award, 
  RefreshCw, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface QuestionEvaluation {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export default function MockInterview() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('Software Engineer');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  
  // Interview state
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  
  // Current question response state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<QuestionEvaluation | null>(null);
  
  // History of evaluations
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedText = localStorage.getItem('aicoach_resume_text');
    if (cachedText) {
      setResumeText(cachedText);
    }
  }, []);

  const handleStartInterview = async () => {
    if (!resumeText || !jobRole.trim()) return;
    setIsGeneratingQuestions(true);
    setError(null);
    try {
      const response = await generateInterviewQuestions(resumeText, jobRole);
      setQuestions(response.questions);
      setInterviewStarted(true);
      setCurrentIdx(0);
      setEvaluations([]);
      setCurrentEvaluation(null);
      setUserAnswer('');
    } catch (err: any) {
      setError(err.message || 'Failed to start interview questions generation.');
      console.error(err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setError(null);
    const questionText = questions[currentIdx];
    try {
      const response = await evaluateAnswer(questionText, userAnswer);
      
      const newEval: QuestionEvaluation = {
        question: questionText,
        answer: userAnswer,
        feedback: response.feedback,
        score: response.score
      };
      
      setCurrentEvaluation(newEval);
      setEvaluations(prev => [...prev, newEval]);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate answer.');
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setCurrentEvaluation(null);
    setUserAnswer('');
    setCurrentIdx(prev => prev + 1);
  };

  const handleRestart = () => {
    setInterviewStarted(false);
    setQuestions([]);
    setCurrentIdx(0);
    setEvaluations([]);
    setCurrentEvaluation(null);
    setUserAnswer('');
  };

  // Compute average score
  const averageScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length)
    : 0;

  return (
    <>
      <Head>
        <title>AICoach - AI-Based Technical Mock Interviews</title>
        <meta name="description" content="Simulate real-world technical and behavioral mock interviews tailored directly to your resume background." />
      </Head>

      <div className="space-y-8 animate-fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">ATS Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-200">Mock Interview</span>
        </div>

        {/* Hero title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Interactive AI <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">Mock Interview</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Train for interviews with real-time feedback. Gemini builds customized questions based on your unique experiences.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/40 p-4 text-red-200">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!resumeText ? (
          // No original resume state
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center max-w-2xl mx-auto">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-500 shadow-inner">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">No Resume Uploaded</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              An interview can only be conducted once we analyze your background. Go back to the dashboard and upload a PDF resume.
            </p>
            <Link 
              href="/" 
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </div>
        ) : !interviewStarted ? (
          // Setup State
          <div className="max-w-xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/20 p-8 space-y-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Select Job Role</h3>
                <p className="text-xs text-slate-550 uppercase tracking-widest">Setup Interview Profile</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Target Role</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer, Product Manager"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 text-xs text-slate-400 leading-relaxed">
                🚀 **What happens next?** Gemini will inspect your uploaded experience levels, keywords, and frameworks. It will then generate a set of custom, realistic questions graded from Easy to Hard.
              </div>

              <button
                onClick={handleStartInterview}
                disabled={isGeneratingQuestions || !jobRole.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-teal-400 hover:to-indigo-500 disabled:opacity-50 transition-all duration-300"
              >
                {isGeneratingQuestions ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating Tailored Interview...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    Start Session
                  </>
                )}
              </button>
            </div>
          </div>
        ) : currentIdx < questions.length ? (
          // Active Question Answering flow
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Box: Active Question & Editor */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-5 backdrop-blur-sm relative">
                {/* Progress Indicators */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span className="text-teal-400 font-mono">
                    {Math.round(((currentIdx + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-1">
                  <div 
                    className="bg-teal-500 h-1 rounded-full transition-all duration-500" 
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question */}
                <div className="flex gap-4 items-start bg-slate-950 p-5 rounded-xl border border-slate-900">
                  <HelpCircle className="h-6 w-6 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium text-slate-205 leading-relaxed">
                    {questions[currentIdx]}
                  </p>
                </div>

                {/* Textarea answer input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your Answer</label>
                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isEvaluating || currentEvaluation !== null}
                    placeholder="Type your comprehensive response here. Reference actual metrics, technologies, or experience where relevant."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none transition-colors disabled:opacity-75 resize-none leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                {!currentEvaluation ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Answer
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-all active:scale-[0.99]"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Box: Live Answer Feedback */}
            <div className="lg:col-span-5">
              {currentEvaluation ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 backdrop-blur-sm animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                    <div className="flex items-center gap-2 text-white">
                      <Award className="h-5 w-5 text-teal-400" />
                      <h3 className="font-bold text-sm">Evaluation Output</h3>
                    </div>
                    <div className="rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 text-center">
                      <span className="text-xl font-black text-teal-400">{currentEvaluation.score}</span>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Score</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Feedback Summary</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {currentEvaluation.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20 p-8 text-center h-full min-h-[250px]">
                  <MessageSquare className="h-7 w-7 text-slate-600 mb-4" />
                  <h4 className="text-sm font-semibold text-slate-400">Feedback Panel</h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
                    Submit your answer to get instant AI scoring and review on how you can align better with standard tech expectations.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Final Scorecard state
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Scorecard Hero */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-tr from-slate-900/50 to-indigo-950/20 p-8 text-center space-y-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl"></div>
              
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400">
                <Award className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">Mock Interview Finished!</h3>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest">Job Role: {jobRole}</p>
              </div>

              <div className="inline-flex flex-col rounded-xl bg-slate-950 border border-slate-850 px-6 py-3.5">
                <span className="text-4xl font-extrabold text-teal-400">{averageScore}%</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-1">Average Score</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white px-4 py-2 border border-slate-750 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restart Interview
                </button>
              </div>
            </div>

            {/* Detailed reviews */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
                Question-by-Question Breakdown
              </h4>

              <div className="space-y-4">
                {evaluations.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-800 bg-slate-900/10 overflow-hidden">
                    <div className="flex justify-between items-center bg-slate-900/40 border-b border-slate-850 px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <span>Question {index + 1}</span>
                      <span className="text-teal-400 font-mono">Score: {item.score}/100</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Question</span>
                        <p className="text-sm font-medium text-slate-200 mt-1">{item.question}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Your Answer</span>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900 whitespace-pre-wrap font-mono">
                          {item.answer}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Evaluation</span>
                        <p className="text-xs sm:text-sm text-slate-350 mt-1 leading-relaxed">
                          {item.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
