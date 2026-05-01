import { Menu, User, Bell, LogOut, ChevronDown, Search, LayoutDashboard, Briefcase, Calculator, BellRing, Newspaper, ArrowRight, Globe, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { currency, toggleCurrency } = useCurrency();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const currencyRef = useRef(null);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, keywords: ['home', 'main', 'index', 'overview', 'insights'] },
        { name: 'Portfolio', path: '/portfolio', icon: Briefcase, keywords: ['assets', 'holding', 'investment', 'my gold', 'profit'] },
        { name: 'Calculator', path: '/calculator', icon: Calculator, keywords: ['price', 'convert', 'gst', 'valuation', 'gold check'] },
        { name: 'Market Alerts', path: '/alerts', icon: BellRing, keywords: ['notify', 'price trigger', 'watch', 'monitor'] },
        { name: 'Intel Feed', path: '/news', icon: Newspaper, keywords: ['market news', 'updates', 'analysis', 'global'] },
    ];

    const filteredResults = searchQuery.trim() === ''
        ? []
        : navItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsMobileMenuOpen(false);
                searchRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(e.target)) {
                setIsCurrencyMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <>
            <header className="h-24 bg-slate-950/20 backdrop-blur-xl border-b border-slate-800/40 flex items-center justify-between px-8 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-8 flex-1">
                    {/* Hamburger — wired to mobile sidebar */}
                    <button
                        id="hamburger-menu-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-3 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-2xl transition-all duration-300"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:block relative w-full max-w-md group" ref={searchRef}>
                        <div className={`flex items-center gap-3 bg-slate-900/40 border rounded-2xl px-5 py-2.5 w-full transition-all duration-300 overflow-hidden ${isSearchOpen ? 'border-gold-500/50 bg-slate-900/80 shadow-[0_0_20px_rgba(212,174,67,0.1)]' : 'border-slate-800/50 focus-within:border-gold-500/50'}`}>
                            <Search size={18} className={`${isSearchOpen ? 'text-gold-400' : 'text-slate-500'} group-focus-within:text-gold-400 transition-colors`} />
                            <input
                                type="text"
                                placeholder="Search intelligence, assets, or tools..."
                                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-600 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                            />
                            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-700/50">
                                <span className="text-[12px]">⌘</span>K
                            </div>
                        </div>

                        {isSearchOpen && (searchQuery.trim() !== '' || filteredResults.length > 0) && (
                            <div className="absolute top-full left-0 w-full mt-3 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="px-4 mb-3">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence</p>
                                </div>

                                {filteredResults.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredResults.map((item) => (
                                            <button
                                                key={item.path}
                                                onClick={() => handleNavigate(item.path)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-500/10 group/item transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-slate-950 rounded-xl text-slate-500 group-hover/item:text-gold-500 group-hover/item:bg-gold-500/5 transition-all">
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-black text-white uppercase tracking-tight">{item.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.path}</p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <ArrowRight size={14} className="text-gold-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-8 text-center">
                                        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-4">
                                            <Search size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No matching insights found</p>
                                        <p className="text-[9px] font-medium text-slate-700 uppercase tracking-widest mt-1 italic">Try searching for "Portfolio" or "Valuation"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Currency Selector */}
                    <div className="relative" ref={currencyRef}>
                        <button
                            onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/40 border border-slate-800/60 hover:border-gold-500/30 rounded-xl transition-all duration-300 group"
                        >
                            <Globe size={16} className="text-gold-500/70 group-hover:text-gold-500" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">{currency}</span>
                            <ChevronDown size={12} className={`text-slate-600 transition-transform ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCurrencyMenuOpen && (
                            <div className="absolute right-0 mt-3 w-32 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
                                {['INR', 'USD'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            if (currency !== c) toggleCurrency();
                                            setIsCurrencyMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${currency === c ? 'bg-gold-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                                    >
                                        {c}
                                        {currency === c && <div className="w-1 h-1 rounded-full bg-slate-950" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden sm:flex h-10 px-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 items-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        <span className="relative flex h-2 w-2 mr-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live
                    </div>

                    <div className="h-8 w-px bg-slate-800/50 hidden lg:block" />

                    {/* Bell → navigate to /alerts */}
                    <button
                        id="navbar-bell-btn"
                        onClick={() => navigate('/alerts')}
                        className="p-3 text-slate-400 hover:text-gold-400 hover:bg-gold-500/5 rounded-2xl transition-all duration-300 relative group hidden sm:block"
                        title="Market Alerts"
                    >
                        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-gold-500 ring-4 ring-slate-950"></span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            id="navbar-user-menu-btn"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-4 p-1.5 bg-slate-900/40 border border-slate-800/50 hover:border-gold-500/30 rounded-2xl transition-all duration-300 group"
                        >
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-600 p-[1.5px] shadow-lg group-hover:shadow-gold-500/20 transition-all">
                                <div className="h-full w-full rounded-xl bg-slate-950 flex items-center justify-center text-gold-400 font-bold overflow-hidden">
                                    {user?.name ? user.name[0].toUpperCase() : <User size={20} />}
                                </div>
                            </div>
                            <div className="hidden lg:block text-left pr-2">
                                <p className="text-xs font-black text-white uppercase tracking-tight">{user?.name || 'Investor'}</p>
                                <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mt-0.5">Gold Tier</p>
                            </div>
                            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-4 w-56 bg-slate-900/90 backdrop-blur-2xl border border-slate-800/60 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                                <div className="px-4 py-2 border-b border-slate-800/50 mb-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Settings</p>
                                </div>
                                {/* Profile Overview → navigate to /profile */}
                                <button
                                    id="navbar-profile-btn"
                                    onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors text-sm font-medium"
                                >
                                    <User size={18} className="text-slate-500" />
                                    Profile Overview
                                </button>
                                <button
                                    id="navbar-logout-btn"
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-rose-500/5 hover:text-rose-400 transition-colors text-sm font-bold"
                                >
                                    <LogOut size={18} className="text-rose-500/70" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900/95 border-r border-slate-800/50 backdrop-blur-2xl flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="p-8 flex items-center justify-between border-b border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-tr from-gold-600 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-slate-950 font-black text-lg italic">G</span>
                                </div>
                                <h2 className="text-lg font-black tracking-tighter text-white">
                                    GOLD<span className="text-gold-500 italic font-medium tracking-normal ml-0.5">VAULT</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex-1 p-6 space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Navigation</p>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-300"
                                >
                                    <item.icon size={20} className="text-slate-500" />
                                    <span className="text-sm tracking-tight">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-6 border-t border-slate-800/50">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
                            >
                                <LogOut size={20} />
                                <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
