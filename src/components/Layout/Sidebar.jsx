import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bell, Newspaper, Calculator } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Portfolio', path: '/portfolio', icon: Wallet },
        { name: 'Calculator', path: '/calculator', icon: Calculator },
        { name: 'Alerts', path: '/alerts', icon: Bell },
        { name: 'Market News', path: '/news', icon: Newspaper },
    ];

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen hidden md:block">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    Smart Gold
                </h2>
                <p className="text-slate-400 text-sm mt-1">Investment Dashboard</p>
            </div>

            <nav className="mt-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-gold-400' : 'text-slate-400'} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
