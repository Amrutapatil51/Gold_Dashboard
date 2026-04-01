import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, ShieldCheck, Zap, Info, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { marketService, portfolioService } from '../../services/api';
import Skeleton from '../Common/Skeleton';

const MarketInsights = () => {
    const { data: marketData, isLoading: marketLoading } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
    });

    const { data: portfolioItems = [], isLoading: portfolioLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: portfolioService.getItems,
    });

    if (marketLoading || portfolioLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
            </div>
        );
    }

    const currentPrice = marketData?.price || 72000;
    const changePercent = marketData?.changePercent || 0;

    // ROI Calculation
    const totalInvested = portfolioItems.reduce((acc, item) => acc + (item.buyPrice * item.weight), 0);
    const currentValue = portfolioItems.reduce((acc, item) => acc + (currentPrice * item.weight), 0);
    const totalProfit = currentValue - totalInvested;
    const roiPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Signal Logic
    const getSignal = () => {
        if (changePercent > 1) return { text: 'Bullish Surge', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        if (changePercent < -1) return { text: 'Strong Buy Zone', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' };
        if (changePercent > 0) return { text: 'Neutral-Positive', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        return { text: 'Consolidating', icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    };

    const signal = getSignal();

    const insights = [
        {
            title: 'Market Signal',
            value: signal.text,
            desc: `${changePercent > 0 ? '+' : ''}${changePercent}% intraday movement`,
            icon: signal.icon,
            color: signal.color,
            bg: signal.bg,
        },
        {
            title: 'Portfolio Alpha',
            value: `${roiPercentage > 0 ? '+' : ''}${roiPercentage.toFixed(2)}%`,
            desc: `₹${Math.abs(totalProfit).toLocaleString('en-IN')} net ${totalProfit >= 0 ? 'gain' : 'loss'}`,
            icon: Target,
            color: roiPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400',
            bg: roiPercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
        },
        {
            title: 'Hedge Status',
            value: 'Strong',
            desc: 'Gold is outperforming inflation by 4.2%',
            icon: ShieldCheck,
            color: 'text-gold-500',
            bg: 'bg-gold-500/10',
        },
        {
            title: 'Accumulation',
            value: portfolioItems.length > 0 ? 'Saturated' : 'Initiate',
            desc: portfolioItems.length > 0 ? 'Hold existing positions' : 'Start with 10g 24K SIP',
            icon: Info,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {insights.map((item, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2rem] p-6 hover:border-gold-500/20 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={14} className="text-slate-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.title}</p>
                        <h3 className={`text-xl font-black ${item.color} tracking-tight`}>{item.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MarketInsights;
