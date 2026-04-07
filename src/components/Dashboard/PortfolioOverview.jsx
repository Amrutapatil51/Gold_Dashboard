import { useQuery } from '@tanstack/react-query';
import { Briefcase, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { portfolioService, marketService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../Common/Skeleton';
import { useCurrency } from '../../context/CurrencyContext';

const PortfolioOverview = () => {
    const navigate = useNavigate();
    const { formatValue } = useCurrency();

    const { data: portfolioItems, isLoading: isLoadingPortfolio } = useQuery({
        queryKey: ['portfolio-items'],
        queryFn: portfolioService.getItems,
    });

    const { data: marketData, isLoading: isLoadingMarket } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
    });

    const isLoading = isLoadingPortfolio || isLoadingMarket;

    if (isLoading) {
        return (
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 h-[380px] flex flex-col gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        );
    }

    const currentPrice = marketData?.price || 0;
    const pricePerGram = currentPrice / 10;

    const items = portfolioItems || [];
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    const totalValue = totalWeight * pricePerGram;

    const totalCost = items.reduce((acc, item) => acc + (item.weight * (item.purchasePrice / 10)), 0);
    const totalProfit = totalValue - totalCost;
    const isProfit = totalProfit >= 0;

    return (
        <div className="group relative bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 shadow-xl overflow-hidden flex flex-col h-full hover:border-gold-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-gold-500/10 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-gold-50 transition-colors">Net Worth</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Asset valuation summary</p>
                </div>
            </div>

            <div className="space-y-8 flex-1">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Current Value</p>
                    <h3 className="text-4xl font-black text-white tracking-tight group-hover:text-gold-100 transition-colors">
                        {formatValue(totalValue)}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30 backdrop-blur-sm group-hover:bg-slate-900/60 transition-colors">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Weight</p>
                        <p className="text-lg font-bold text-white">{totalWeight.toFixed(2)} <span className="text-xs text-slate-400 font-medium">g</span></p>
                    </div>

                    <div className={`rounded-2xl p-4 border backdrop-blur-sm group-hover:brightness-110 transition-all ${isProfit ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isProfit ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                            {isProfit ? 'Total P&L' : 'Total Loss'}
                        </p>
                        <div className={`flex items-center gap-1.5 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            <p className="text-lg font-bold">
                                {isProfit ? '+' : '-'}{formatValue(Math.abs(totalProfit))}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/portfolio')}
                    className="group/btn w-full mt-auto py-4 bg-slate-900/50 hover:bg-gold-500 border border-slate-700/50 hover:border-gold-400 rounded-2xl text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2 text-white hover:text-slate-950 shadow-lg hover:shadow-gold-500/20"
                >
                    Management Console
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default PortfolioOverview;

