import { useState, useEffect } from 'react';
import Head from 'next/head';
import { uploadResume, analyzeResume, AnalyzeResumeResponse } from '../api';
import { 
  Upload, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from cache if present
  useEffect(() => {
    const cachedText = localStorage.getItem('aicoach_resume_text');
    const cachedAnalysis = localStorage.getItem('aicoach_resume_analysis');
    if (cachedText) setResumeText(cachedText);
    if (cachedAnalysis) {
      try {
        setAnalysis(JSON.parse(cachedAnalysis));
      } catch (e) {
        console.error('Failed to parse cached analysis', e);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadAndAnalyze = async (selectedFile: File) => {
    setIsUploading(true);
    setError(null);
    try {
      // 1. Upload & Parse PDF
      const uploadRes = await uploadResume(selectedFile);
      const text = uploadRes.text;
      setResumeText(text);
      localStorage.setItem('aicoach_resume_text', text);

      // 2. Analyze
      setIsUploading(false);
      setIsAnalyzing(true);
      const analysisRes = await analyzeResume(text);
      setAnalysis(analysisRes);
      localStorage.setItem('aicoach_resume_analysis', JSON.stringify(analysisRes));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during processing.');
      console.error(err);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf')) {
        setFile(droppedFile);
        handleUploadAndAnalyze(droppedFile);
      } else {
        setError('Only PDF resumes are supported.');
      }
    }
  };

  const resetState = () => {
    setFile(null);
    setResumeText('');
    setAnalysis(null);
    setError(null);
    localStorage.removeItem('aicoach_resume_text');
    localStorage.removeItem('aicoach_resume_analysis');
  };

  return (
    <>
      <Head>
        <title>AICoach - AI Career Assistant & ATS Score Checker</title>
        <meta name="description" content="Get instant ATS score, missing skills feedback, and resume optimization with AICoach." />
      </Head>

      <div className="space-y-8 animate-fade-in">
        {/* Header Hero Section */}
        <div className="text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-400">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            Empower Your Career with AI Coaching
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:max-w-2xl leading-[1.1]">
            Elevate Your Resume to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">ATS Perfection</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Upload your resume to receive a real-time professional ATS score, list of key strengths, missing skills, and detailed AI feedback.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/40 p-4 text-red-200">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Upload / Preview */}
          <div className="lg:col-span-5 space-y-6">
            {!resumeText ? (
              // Upload State
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 p-10 text-center transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/60"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-850 text-indigo-400 shadow-inner group-hover:scale-110 group-hover:bg-indigo-600/10 transition-all duration-300">
                  <Upload className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-white">Upload your resume</h3>
                <p className="mb-6 text-sm text-slate-400 max-w-xs">
                  Drag and drop your PDF resume here, or browse files on your device.
                </p>
                <label className="relative cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                  <span>Browse PDF</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf"
                    onChange={(e) => {
                      handleFileChange(e);
                      if (e.target.files && e.target.files[0]) {
                        handleUploadAndAnalyze(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              // Loaded State Preview
              <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Parsed Resume Content</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF text extracted</p>
                    </div>
                  </div>
                  <button
                    onClick={resetState}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Upload New
                  </button>
                </div>
                <div className="max-h-[480px] overflow-y-auto p-5 text-sm text-slate-350 font-mono whitespace-pre-wrap leading-relaxed">
                  {resumeText}
                </div>
              </div>
            )}

            {/* Status indicators */}
            {(isUploading || isAnalyzing) && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6 text-center space-y-4">
                <div className="relative mx-auto h-12 w-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {isUploading ? 'Extracting Resume Text...' : 'Running ATS System Analysis...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isUploading 
                      ? 'PyMuPDF is processing and loading your document lines.' 
                      : 'Gemini is evaluating formatting, keyword density, strengths & skills.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: ATS Score & Feedback */}
          <div className="lg:col-span-7 space-y-6">
            {analysis ? (
              <div className="space-y-6">
                {/* Score Panel */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm">
                  {/* Subtle decorative glow */}
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Radial Score Gauge */}
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-slate-900/80 shadow-lg border border-slate-800">
                      <svg className="h-24 w-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          className="text-slate-850"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          className="text-indigo-500 transition-all duration-1000 ease-out"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - analysis.ats_score / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-extrabold text-white">{analysis.ats_score}</span>
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">ATS Score</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-white">
                        <Award className="h-5 w-5 text-indigo-400" />
                        <h2 className="text-xl font-bold">Applicant Tracking System Report</h2>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strengths & Missing Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-emerald-500/10 bg-emerald-950/5 p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <h3 className="font-bold text-white text-sm">Key Strengths</h3>
                    </div>
                    {analysis.strengths.length > 0 ? (
                      <ul className="space-y-2.5">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex gap-2.5 text-xs sm:text-sm text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No significant strengths highlighted.</p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div className="rounded-2xl border border-rose-500/10 bg-rose-950/5 p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                      <h3 className="font-bold text-white text-sm">Missing Skills & Keywords</h3>
                    </div>
                    {analysis.missing_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Excellent! No missing skills identified.</p>
                    )}
                  </div>
                </div>

                {/* Actionable Improvements */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <FileCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <h3 className="font-bold text-white text-sm">Actionable Improvements</h3>
                  </div>
                  {analysis.improvements.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex gap-3 text-xs sm:text-sm text-slate-300">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-indigo-400 font-bold text-[10px]">
                            {index + 1}
                          </div>
                          <span className="leading-normal">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No recommendations. Your resume is fully optimized!</p>
                  )}
                </div>
              </div>
            ) : (
              // Unanalyzed State UI Placeholder
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center h-full min-h-[300px]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-600 shadow-inner">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-400">Analysis Awaiting Upload</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-sm">
                  Please drag/upload a PDF resume in the left panel. Our AI will automatically parse the layout, verify keyword density, and compute scores.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
