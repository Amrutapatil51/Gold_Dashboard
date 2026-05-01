import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Star, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Member since 2024';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="space-y-10 pb-12 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-2xl transition-all duration-300"
                    title="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Profile <span className="text-gold-500 italic">Overview</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Your account details and tier status</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="relative bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-gold-600 to-amber-400 p-[2px] shadow-2xl shadow-gold-500/20">
                            <div className="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center text-gold-400">
                                <span className="text-5xl font-black">
                                    {user?.name ? user.name[0].toUpperCase() : <User size={48} />}
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Star size={14} className="text-slate-950 fill-slate-950" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {user?.name || 'Investor'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">{user?.email || 'No email on record'}</p>

                        <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                            <span className="px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5">
                                <Star size={11} className="fill-gold-400" /> Gold Tier
                            </span>
                            <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5">
                                <Shield size={11} /> Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-7 flex items-center gap-5 group hover:border-gold-500/30 transition-all duration-300 shadow-xl">
                    <div className="p-3.5 bg-slate-950/50 rounded-2xl text-gold-500 group-hover:scale-110 transition-transform">
                        <User size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
                        <p className="text-lg font-black text-white">{user?.name || '—'}</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-7 flex items-center gap-5 group hover:border-gold-500/30 transition-all duration-300 shadow-xl">
                    <div className="p-3.5 bg-slate-950/50 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                        <Mail size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Address</p>
                        <p className="text-lg font-black text-white break-all">{user?.email || '—'}</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-7 flex items-center gap-5 group hover:border-gold-500/30 transition-all duration-300 shadow-xl">
                    <div className="p-3.5 bg-slate-950/50 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                        <Shield size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Status</p>
                        <p className="text-lg font-black text-emerald-400">Active &amp; Verified</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-7 flex items-center gap-5 group hover:border-gold-500/30 transition-all duration-300 shadow-xl">
                    <div className="p-3.5 bg-slate-950/50 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                        <Calendar size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Member Since</p>
                        <p className="text-lg font-black text-white">{joinDate}</p>
                    </div>
                </div>
            </div>

            {/* Tier Info */}
            <div className="bg-gradient-to-tr from-gold-600/10 to-amber-400/5 border border-gold-500/20 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gold-500/10 rounded-2xl">
                        <Star size={22} className="text-gold-500 fill-gold-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white">Gold Tier Member</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Premium access to all intelligence modules</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {['Live Market Data', 'Portfolio Tracking', 'Price Alerts', 'Intel Feed', 'CSV Export', 'Gold Calculator'].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sign Out */}
            <button
                id="profile-signout-btn"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-400 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300"
            >
                <LogOut size={18} />
                Sign Out of GoldVault
            </button>
        </div>
    );
};

export default Profile;
