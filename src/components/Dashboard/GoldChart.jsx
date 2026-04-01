import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { marketService, portfolioService } from '../../services/api';
import Skeleton from '../Common/Skeleton';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

const GoldChart = () => {
    const [timeframe, setTimeframe] = useState('1M');
    const [chartView, setChartView] = useState('market'); // 'market' or 'portfolio'
    
    // Fetch Market Data
    const { data: rawChartData, isLoading: isMarketLoading } = useQuery({
        queryKey: ['market-history', timeframe],
        queryFn: marketService.getPrice,
        select: (data) => data.historical || [],
    });

    // Fetch Portfolio Data
    const { data: portfolioItems = [], isLoading: isPortfolioLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: portfolioService.getItems,
    });

    const isLoading = isMarketLoading || isPortfolioLoading;

    // Process Chart Data
    const processedChartData = useMemo(() => {
        if (!rawChartData || rawChartData.length === 0) return [];
        
        const totalInvested = portfolioItems.reduce((acc, item) => acc + (item.buyPrice * item.weight), 0);
        const totalWeight = portfolioItems.reduce((acc, item) => acc + item.weight, 0);

        return rawChartData.map(point => {
            const portfolioValue = point.price * totalWeight;
            const absoluteRoi = portfolioValue - totalInvested;
            const roiPercentage = totalInvested > 0 ? (absoluteRoi / totalInvested) * 100 : 0;

            return {
                ...point,
                roi: parseFloat(roiPercentage.toFixed(2)),
                value: portfolioValue,
                invested: totalInvested
            };
        });
    }, [rawChartData, portfolioItems]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-4 rounded-2xl shadow-2xl min-w-[160px]">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">{label}</p>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Market Rate</span>
                            <span className="text-gold-400 text-sm font-black tracking-tight">₹{payload[0].payload.price?.toLocaleString('en-IN')}</span>
                        </div>
                        {chartView === 'portfolio' && (
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Portfolio ROI</span>
                                <span className={`text-sm font-black tracking-tight ${payload[0].payload.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {payload[0].payload.roi >= 0 ? '+' : ''}{payload[0].payload.roi}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col group hover:border-gold-500/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-gold-500/10 transition-all duration-700" />
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-slate-950/50 rounded-xl text-gold-500">
                             {chartView === 'market' ? <BarChart3 size={18} /> : <PieChart size={18} />}
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase tracking-[0.05em]">
                            {chartView === 'market' ? 'Global Market' : 'Yield Analysis'}
                        </h2>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">
                        {chartView === 'market' ? 'Live XAU price vectors (per 10g)' : 'Cumulative performance of your assets'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-slate-950/40 p-2 rounded-[1.5rem] border border-slate-800/60 backdrop-blur-md">
                    <div className="flex gap-1 border-r border-slate-800/80 pr-4 mr-1">
                        {[
                            { id: 'market', label: 'Market', icon: BarChart3 },
                            { id: 'portfolio', label: 'ROI', icon: TrendingUp }
                        ].map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setChartView(view.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${chartView === view.id
                                        ? 'bg-gold-500 text-slate-950 shadow-[0_4px_20px_rgba(212,174,67,0.3)]'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
                                    }`}
                            >
                                <view.icon size={12} strokeWidth={3} />
                                {view.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {['1D', '7D', '1M', '1Y'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${timeframe === tf
                                        ? 'text-white bg-slate-800 shadow-xl border border-slate-700/50'
                                        : 'text-slate-600 hover:text-slate-300'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[350px]">
                {isLoading ? (
                    <div className="h-full w-full flex flex-col gap-6 py-4">
                        <Skeleton className="flex-1 w-full rounded-[2rem]" />
                        <div className="flex justify-between px-4">
                            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-2 w-14" />)}
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartView === 'market' ? '#d4ae43' : '#10b981'} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={chartView === 'market' ? '#d4ae43' : '#10b981'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                stroke="#475569"
                                fontSize={10}
                                fontWeight={900}
                                tickLine={false}
                                axisLine={false}
                                dy={15}
                                tickFormatter={(v) => timeframe === '1Y' ? v.split('-')[0] : v}
                            />
                            <YAxis
                                stroke="#475569"
                                fontSize={10}
                                fontWeight={900}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => chartView === 'portfolio' ? `${value}%` : `₹${Math.round(value/1000)}k`}
                                domain={['auto', 'auto']}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey={chartView === 'market' ? 'price' : 'roi'}
                                stroke={chartView === 'market' ? '#d4ae43' : '#10b981'}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default GoldChart;


