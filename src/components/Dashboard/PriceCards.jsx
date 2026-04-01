import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { marketService } from '../../services/api';

const PriceCards = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await marketService.getPrice();
                // Map the API data to the format expected by the component
                // Since our API currently returns a simplified mock, we'll adapt it
                const formattedPrices = [
                    {
                        type: '24K Gold',
                        price: data.price,
                        unit: 'per 10g',
                        change: data.change * 10, // approximate 10g change
                        percentChange: data.changePercent,
                        isUp: data.change > 0
                    },
                    {
                        type: '22K Gold',
                        price: data.price * 0.916,
                        unit: 'per 10g',
                        change: data.change * 9.16,
                        percentChange: data.changePercent,
                        isUp: data.change > 0
                    },
                    {
                        type: '18K Gold',
                        price: data.price * 0.75,
                        unit: 'per 10g',
                        change: data.change * 7.5,
                        percentChange: data.changePercent,
                        isUp: data.change > 0
                    },
                    {
                        type: 'Silver',
                        price: 92.50, // Static for now if API doesn't provide
                        unit: 'per gram',
                        change: 1.25,
                        percentChange: 1.35,
                        isUp: true
                    }
                ];
                setPrices(formattedPrices);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch prices:', err);
                setError('Failed to load market data');
                setLoading(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[160px]">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center">
                        <Loader2 className="animate-spin text-gold-500" size={24} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {prices.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all shadow-lg"
                >
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-slate-400 font-medium text-sm">{item.type}</h3>
                            <p className="text-xs text-slate-500 mt-1">{item.unit}</p>
                        </div>
                        <div className={`p-2 rounded-lg ${item.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {item.isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                    </div>

                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>
                    </div>

                    <div className={`flex items-center text-sm font-medium ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                        <span>₹{Math.abs(item.change).toFixed(2)} ({Math.abs(item.percentChange)}%)</span>
                        <span className="text-slate-500 ml-2 font-normal">vs yesterday</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PriceCards;
