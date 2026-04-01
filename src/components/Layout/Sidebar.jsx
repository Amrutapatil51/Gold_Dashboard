import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bell, Newspaper, Calculator, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Insights', path: '/', icon: LayoutDashboard },
        { name: 'Portfolio', path: '/portfolio', icon: Wallet },
        { name: 'Calculator', path: '/calculator', icon: Calculator },
        { name: 'Market Alerts', path: '/alerts', icon: Bell },
        { name: 'Market News', path: '/news', icon: Newspaper },
    ];

    return (
        <aside className="w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800/50 min-h-screen hidden lg:flex flex-col">
            <div className="p-8">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-amber-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,174,67,0.3)] group-hover:scale-110 transition-transform duration-300">
                        <span className="text-slate-950 font-black text-xl italic">G</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-white">
                            GOLD<span className="text-gold-500 italic font-medium tracking-normal ml-0.5">VAULT</span>
                        </h2>
                        <div className="h-1 w-8 bg-gold-500/50 rounded-full mt-0.5 group-hover:w-full transition-all duration-500" />
                    </div>
                </div>
            </div>

            <nav className="flex-1 mt-4 px-6 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Navigation</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-gold-500 text-slate-950 shadow-[0_10px_20px_rgba(187,148,43,0.15)] font-bold'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:pl-6'
                                }`}
                        >
                            <Icon size={20} className={`transition-colors ${isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-gold-400'}`} />
                            <span className="text-sm tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto border-t border-slate-800/50">
                <button 
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
