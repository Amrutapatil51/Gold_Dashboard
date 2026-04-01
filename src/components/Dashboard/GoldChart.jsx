import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { marketService } from '../../services/api';

const GoldChart = () => {
    const [timeframe, setTimeframe] = useState('1M');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await marketService.getPrice();
                // In a real app, we'd fetch specific historical data for the timeframe
                // For now, using the 'historical' array from our mock API response
                setData(response.historical || []);
            } catch (err) {
                console.error('Failed to fetch historical data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [timeframe]);

    return (
        <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Gold Price Trend (24K)</h2>
                    <p className="text-sm text-slate-400">Historical performance representation</p>
                </div>

                <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700">
                    {['1D', '7D', '1M', '1Y'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${timeframe === tf
                                    ? 'bg-gold-500/20 text-gold-400 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                {loading ? (
                    <Loader2 className="animate-spin text-gold-500" size={32} />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d4ae43" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#d4ae43" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={20}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '0.5rem',
                                color: '#f8fafc'
                            }}
                            itemStyle={{ color: '#d4ae43' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#d4ae43"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
            </div>
        </div>
    );
};

export default GoldChart;
