import { Menu, User, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center">
                <button className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors mr-4">
                    <Menu size={24} />
                </button>
                <div className="h-10 px-4 rounded-lg bg-slate-900/50 outline outline-1 outline-slate-700 flex items-center text-sm font-medium text-slate-300">
                    Live Market Open
                    <span className="ml-3 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-300 hover:text-gold-400 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-700/50 rounded-xl transition-all"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-slate-400">Premium Account</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gold-400 to-amber-600 p-[2px]">
                            <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                                <User size={18} />
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-slate-500 hidden md:block" />
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
