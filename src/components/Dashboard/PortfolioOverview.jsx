import { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, Loader2 } from 'lucide-react';
import { portfolioService, marketService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const PortfolioOverview = () => {
    const [stats, setStats] = useState({ totalValue: 0, totalWeight: 0, totalProfit: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolioStats = async () => {
            try {
                const [items, marketData] = await Promise.all([
                    portfolioService.getItems(),
                    marketService.getPrice()
                ]);

                const currentPrice = marketData.price; // assuming price per 10g
                const pricePerGram = currentPrice / 10;

                const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
                const totalValue = totalWeight * pricePerGram;
                
                const totalCost = items.reduce((acc, item) => acc + (item.weight * (item.purchasePrice / 10)), 0);
                const totalProfit = totalValue - totalCost;

                setStats({ totalValue, totalWeight, totalProfit });
            } catch (err) {
                console.error('Failed to fetch portfolio stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioStats();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin text-gold-500" size={32} />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Your Portfolio</h2>
                    <p className="text-sm text-slate-400">Summary of investments</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                    <p className="text-sm text-slate-400 mb-1">Total Current Value</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                        ₹{stats.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-1">Total Weight</p>
                        <p className="text-lg font-semibold text-white">{stats.totalWeight.toFixed(2)} g</p>
                    </div>
                    <div className={`rounded-xl p-4 border ${stats.totalProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                        <p className={`text-xs mb-1 ${stats.totalProfit >= 0 ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                            {stats.totalProfit >= 0 ? 'Total Profit' : 'Total Loss'}
                        </p>
                        <div className={`flex items-center gap-1 ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            <TrendingUp size={16} className={stats.totalProfit < 0 ? 'rotate-180' : ''} />
                            <p className="text-lg font-semibold">
                                {stats.totalProfit >= 0 ? '+' : ''}₹{Math.abs(stats.totalProfit).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/portfolio')}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 text-white"
                >
                    View Full Portfolio
                </button>
            </div>
        </div>
    );
};

export default PortfolioOverview;
