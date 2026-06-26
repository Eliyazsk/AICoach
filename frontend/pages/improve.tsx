import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { improveResume } from '../api';
import { 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Download, 
  Check, 
  ChevronRight, 
  FileText, 
  Cpu 
} from 'lucide-react';

export default function ImproveResume() {
  const [originalText, setOriginalText] = useState<string>('');
  const [improvedText, setImprovedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const cachedText = localStorage.getItem('aicoach_resume_text');
    if (cachedText) {
      setOriginalText(cachedText);
    }
    const cachedImproved = localStorage.getItem('aicoach_resume_improved');
    if (cachedImproved) {
      setImprovedText(cachedImproved);
    }
  }, []);

  const handleOptimize = async () => {
    if (!originalText) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await improveResume(originalText);
      setImprovedText(response.improved_resume);
      localStorage.setItem('aicoach_resume_improved', response.improved_resume);
    } catch (err: any) {
      setError(err.message || 'An error occurred during optimization.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!improvedText) return;
    navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!improvedText) return;
    const element = document.createElement('a');
    const file = new Blob([improvedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'ATS_Optimized_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setImprovedText('');
    localStorage.removeItem('aicoach_resume_improved');
  };

  return (
    <>
      <Head>
        <title>AICoach - Optimize & Rewrite Resume</title>
        <meta name="description" content="Use advanced Gemini models to rewrite and format your resume in a professional, ATS-optimized structure." />
      </Head>

      <div className="space-y-8 animate-fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">ATS Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-200">Optimize Resume</span>
        </div>

        {/* Hero title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            AI Resume <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Rewriter</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Leverage AI to rewrite your bullet points, inject active verbs, structure sections, and maximize keyword density for recruiters.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/40 p-4 text-red-200">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!originalText ? (
          // No original resume state
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center max-w-2xl mx-auto">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-500 shadow-inner">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">No Resume Uploaded</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              We need a resume to optimize! Go back to the dashboard and upload a PDF resume.
            </p>
            <Link 
              href="/" 
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </div>
        ) : (
          // Show comparator view
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Original Resume Panel */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
              <div className="flex items-center gap-2 bg-slate-900/50 border-b border-slate-800 px-5 py-4">
                <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                <h3 className="text-sm font-semibold text-slate-350">Original Resume</h3>
              </div>
              <div className="p-5 overflow-y-auto max-h-[520px] text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-slate-400">
                {originalText}
              </div>
            </div>

            {/* Optimized Resume Panel */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden relative">
              <div className="flex items-center justify-between bg-slate-900/50 border-b border-slate-800 px-5 py-4 min-h-[61px]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <h3 className="text-sm font-semibold text-white">AI-Optimized Output</h3>
                </div>
                {improvedText && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white px-2.5 py-1 text-xs font-semibold text-slate-300 transition-all"
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white px-2.5 py-1 text-xs font-semibold text-slate-300 transition-all"
                      title="Download as .txt"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-center items-center min-h-[400px]">
                {isLoading ? (
                  // Loading Indicator
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto h-12 w-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Gemini is rewriting your resume...</h4>
                      <p className="text-xs text-slate-400 mt-1">Applying structural standards, professional metrics, and keywords.</p>
                    </div>
                  </div>
                ) : improvedText ? (
                  // Shows improved resume content
                  <div className="w-full text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-slate-200 overflow-y-auto max-h-[480px] text-left">
                    {improvedText}
                  </div>
                ) : (
                  // Call-to-action state
                  <div className="text-center p-6 space-y-6 max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400">
                      <Cpu className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-base">Optimize Your Profile</h4>
                      <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                        Click the button below to generate a professionally structured and rewritten resume. This text can be copied or downloaded.
                      </p>
                    </div>
                    <button
                      onClick={handleOptimize}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform active:scale-[0.98]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Optimize with Gemini AI
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
