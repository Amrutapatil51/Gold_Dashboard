import { Globe, ArrowRightLeft } from 'lucide-react';

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
        <div className="mt-8 bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Global Price Comparison</h2>
                        <p className="text-sm text-slate-400">24K Gold price per gram across major markets</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
                    <ArrowRightLeft size={16} />
                    <span>Base: INR (₹)</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700 text-slate-400 text-sm">
                            <th className="pb-3 font-medium px-4">Country</th>
                            <th className="pb-3 font-medium px-4">Local Price</th>
                            <th className="pb-3 font-medium px-4">Price in INR</th>
                            <th className="pb-3 font-medium px-4">Difference</th>
                            <th className="pb-3 font-medium px-4 text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {countryData.map((data, idx) => {
                            const inrEquivalent = data.pricePerGram * data.exchangeRate;
                            const diffFromIndia = inrEquivalent - countryData[0].pricePerGram;
                            const isCheaper = diffFromIndia < 0;
                            const isIndia = data.country === 'India';

                            return (
                                <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{data.flag}</span>
                                            <div>
                                                <p className="font-semibold text-white">{data.country}</p>
                                                <p className="text-xs text-slate-500">{data.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium text-slate-200">
                                        {data.currencySymbol}{data.pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 px-4 font-medium text-white">
                                        ₹{inrEquivalent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 px-4">
                                        {isIndia ? (
                                            <span className="text-slate-500 text-sm">Base Price</span>
                                        ) : (
                                            <span className={`text-sm font-medium px-2 py-1 rounded bg-opacity-20 ${isCheaper ? 'text-emerald-400 bg-emerald-500' : 'text-rose-400 bg-rose-500'
                                                }`}>
                                                {isCheaper ? '-' : '+'}₹{Math.abs(diffFromIndia).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                            </span>
                                        )}
                                    </td>
                                    <td className={`py-4 px-4 text-right font-medium text-sm ${data.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                                        }`}>
                                        {data.trend}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CountryComparison;
