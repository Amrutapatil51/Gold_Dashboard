import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { marketService } from '../../services/api';
import Skeleton from '../Common/Skeleton';

const PriceCards = () => {
    const { data: marketData, isLoading, isError } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
        refetchInterval: 60000, // Update every minute
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 h-[160px] flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center">
                Failed to load market data. Please try again later.
            </div>
        );
    }

    // Map the API data to the format expected by the component
    const prices = [
        {
            type: '24K Gold',
            price: marketData.price,
            unit: 'per 10g',
            change: marketData.change,
            percentChange: marketData.changePercent,
            isUp: marketData.change >= 0
        },
        {
            type: '22K Gold',
            price: marketData.price * 0.916,
            unit: 'per 10g',
            change: marketData.change * 0.916,
            percentChange: marketData.changePercent,
            isUp: marketData.change >= 0
        },
        {
            type: '18K Gold',
            price: marketData.price * 0.75,
            unit: 'per 10g',
            change: marketData.change * 0.75,
            percentChange: marketData.changePercent,
            isUp: marketData.change >= 0
        },
        {
            type: 'Silver',
            price: 92.50, // Static for now
            unit: 'per gram',
            change: 1.25,
            percentChange: 1.35,
            isUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {prices.map((item, idx) => (
                <div
                    key={idx}
                    className="group relative overflow-hidden bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 hover:border-gold-500/40 transition-all duration-300 shadow-xl"
                >
                    {/* Animated gradient background on hover */}
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-slate-400 font-medium text-sm transition-colors group-hover:text-slate-300">{item.type}</h3>
                            <p className="text-xs text-slate-500 mt-1">{item.unit}</p>
                        </div>
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${item.isUp ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20'}`}>
                            {item.isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                    </div>

                    <div className="mb-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white group-hover:text-gold-50 transition-colors">
                            ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center text-sm font-semibold ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.isUp ? <ArrowUpRight size={16} className="mr-0.5" /> : <ArrowDownRight size={16} className="mr-0.5" />}
                            <span>{item.percentChange}%</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">vs yesterday</span>
                    </div>

                    {/* Subtle micro-glow */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
            ))}
        </div>
    );
};

export default PriceCards;
