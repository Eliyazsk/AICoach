import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sparkles, BarChart2, MessageSquare, ClipboardCheck } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  const navItems = [
    { name: 'ATS Dashboard', path: '/', icon: BarChart2 },
    { name: 'Optimize Resume', path: '/improve', icon: ClipboardCheck },
    { name: 'Mock Interview', path: '/interview', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-wide">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>AICoach</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-1 sm:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 shadow-sm border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
            Gemini Core Connected
          </span>
        </div>
      </div>
    </header>
  );
}
