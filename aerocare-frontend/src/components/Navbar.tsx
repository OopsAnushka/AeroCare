'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Search, MapPin, Loader2, Map, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency' },
  { href: '/first-aid', label: 'First Aid' },
  { href: '/profile', label: 'Medical ID' },
];

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' hospital')}&limit=5`
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch { setResults([]); }
      setSearching(false);
    }, 300);
  };

  const selectResult = (r: SearchResult) => {
    setSearchOpen(false);
    setSearchQuery('');
    setResults([]);
    setMobileOpen(false);
    router.push(`/emergency?tab=hospitals&lat=${r.lat}&lon=${r.lon}`);
  };

  const openMapDirect = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setResults([]);
    setMobileOpen(false);
    router.push('/emergency?tab=hospitals');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl shadow-lg' : 'bg-black'}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[60px] md:h-[68px] flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-md group-hover:shadow-red-500/40 transition-shadow">A</div>
          <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">AeroCare</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 bg-white/[0.06] rounded-full p-1 border border-white/[0.06]">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`relative px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                {active && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/[0.12] rounded-full" transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Search */}
        <div ref={searchRef} className="relative flex-1 max-w-sm hidden md:block">
          <div className={`flex items-center bg-white/[0.08] border rounded-full transition-all ${searchOpen ? 'border-white/20 bg-white/[0.12]' : 'border-white/[0.06]'}`}>
            <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search hospitals..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white font-medium placeholder:text-gray-500 focus:outline-none"
            />
            {searching && <Loader2 className="w-4 h-4 text-gray-400 mr-3 animate-spin shrink-0" />}
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Open map action */}
                <button onClick={openMapDirect} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100">
                  <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0"><Map className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm text-gray-800 font-bold">Open Hospital Map</p>
                    <p className="text-[11px] text-gray-400 font-medium">Search near your location</p>
                  </div>
                </button>
                {results.map((r, i) => (
                  <button key={i} onClick={() => selectResult(r)} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium line-clamp-2">{r.display_name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="hidden lg:flex items-center gap-1 text-white/50 hover:text-white text-xs font-medium px-2.5 py-2 rounded-full hover:bg-white/[0.06] transition-colors">
            <Globe className="w-3.5 h-3.5" />EN
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {profile && 'fullName' in profile ? profile.fullName.charAt(0).toUpperCase() : profile && 'hospitalName' in profile ? profile.hospitalName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-semibold max-w-[100px] truncate">
                {profile && 'fullName' in profile ? profile.fullName.split(' ')[0] : profile && 'hospitalName' in profile ? profile.hospitalName.split(' ')[0] : 'User'}
              </span>
              <button onClick={signOut} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/[0.06] transition-colors">Log in</Link>
              <Link href="/login?tab=signup" className="hidden md:inline-flex bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Sign up</Link>
            </>
          )}

          {/* Mobile search */}
          <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }} aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          {/* Mobile menu */}
          <button className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors" onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); }} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden">
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center bg-white/10 rounded-xl px-3 py-2.5 gap-2">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Search hospitals near you..." className="w-full bg-transparent text-sm text-white font-medium placeholder:text-gray-500 focus:outline-none" autoFocus />
                {searching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" />}
              </div>

              {/* Open map CTA */}
              <button onClick={openMapDirect} className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0"><Map className="w-4 h-4" /></div>
                <div className="text-left">
                  <p className="text-sm text-white font-bold">Open Hospital Map</p>
                  <p className="text-[11px] text-gray-400">Find hospitals near your location</p>
                </div>
              </button>

              {results.map((r, i) => (
                <button key={i} onClick={() => selectResult(r)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left">
                  <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-300 font-medium line-clamp-2">{r.display_name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${pathname === link.href ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{link.label}</Link>
              ))}
              {user ? (
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 py-3 mt-3 rounded-xl font-bold text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              ) : (
                <div className="flex gap-2 mt-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 rounded-xl font-bold text-sm text-white border border-white/20">Log in</Link>
                  <Link href="/login?tab=signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 rounded-xl font-bold text-sm bg-white text-black">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
