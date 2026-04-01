import { Globe, ArrowRightLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const countryData = [
    {
        country: 'India',
        code: 'INR',
        flag: '🇮🇳',
        pricePerGram: 7245.50,
        currencySymbol: '₹',
        exchangeRate: 1, // Base
        trend: '+0.15%'
    },
    {
        country: 'UAE (Dubai)',
        code: 'AED',
        flag: '🇦🇪',
        pricePerGram: 310.20,
        currencySymbol: 'د.إ',
        exchangeRate: 22.85,
        trend: '+0.10%'
    },
    {
        country: 'USA',
        code: 'USD',
        flag: '🇺🇸',
        pricePerGram: 86.15,
        currencySymbol: '$',
        exchangeRate: 83.95,
        trend: '-0.05%'
    },
    {
        country: 'United Kingdom',
        code: 'GBP',
        flag: '🇬🇧',
        pricePerGram: 68.45,
        currencySymbol: '£',
        exchangeRate: 106.30,
        trend: '+0.20%'
    }
];

const CountryComparison = () => {
    return (
        <div className="mt-12 bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden group">
            <div className="p-8 md:p-10 border-b border-slate-800/40 bg-slate-900/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-slate-950/50 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                        <Globe size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Global <span className="text-gold-500 italic">Arbitrage</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Real-time cross-border price index</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 bg-slate-950/50 px-4 py-2.5 rounded-2xl border border-slate-800 uppercase tracking-widest">
                    <ArrowRightLeft size={14} className="text-gold-500" />
                    <span>Hedge Base: INR (₹)</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/20 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="py-5 px-8">Market Region</th>
                            <th className="py-5 px-8">Locale Price</th>
                            <th className="py-5 px-8">INR Valuation</th>
                            <th className="py-5 px-8">Net Delta</th>
                            <th className="py-5 px-8 text-right">Momentum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {countryData.map((data, idx) => {
                            const inrEquivalent = data.pricePerGram * data.exchangeRate;
                            const diffFromIndia = inrEquivalent - countryData[0].pricePerGram;
                            const isCheaper = diffFromIndia < 0;
                            const isIndia = data.country === 'India';

                            return (
                                <tr key={idx} className="group/row hover:bg-slate-800/30 transition-all duration-300">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex items-center justify-center text-2xl group-hover/row:scale-110 transition-transform">
                                                {data.flag}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white tracking-tight">{data.country}</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{data.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="text-sm font-bold text-slate-300">{data.currencySymbol}{data.pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="text-sm font-black text-white">₹{inrEquivalent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        {isIndia ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Base Standard</span>
                                            </div>
                                        ) : (
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-widest ${isCheaper 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {isCheaper ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                                                {isCheaper ? '-' : '+'}₹{Math.abs(diffFromIndia).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className={`inline-flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest ${data.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                                            }`}>
                                            {data.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {data.trend}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-slate-950/20 border-t border-slate-800/40 flex justify-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Minus size={12} className="text-slate-800" />
                    Market spreads are indicative and subject to regional liquidity
                    <Minus size={12} className="text-slate-800" />
                </p>
            </div>
        </div>
    );
};

export default CountryComparison;
