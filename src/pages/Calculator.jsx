import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, DollarSign, Percent, Info, Loader2 } from 'lucide-react';
import CountryComparison from '../components/Calculator/CountryComparison';
import { marketService } from '../services/api';

const CalculatorPage = () => {
    const [liveRates, setLiveRates] = useState({
        '24K': 7245.50,
        '22K': 6649.00,
        '18K': 5434.12
    });
    const [loading, setLoading] = useState(true);
    const [weight, setWeight] = useState(10);
    const [purity, setPurity] = useState('24K');
    const [makingChargesPercent, setMakingChargesPercent] = useState(8);
    const [gstPercent] = useState(3); // Standard India GST for Gold

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await marketService.getPrice();
                if (data && data.price) {
                    const base24K = data.price;
                    setLiveRates({
                        '24K': base24K,
                        '22K': base24K * 0.9167,
                        '18K': base24K * 0.75
                    });
                }
            } catch (err) {
                console.error('Failed to fetch live rates:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    const basePrice = (liveRates[purity] * weight);
    const makingCharges = (basePrice * makingChargesPercent) / 100;
    const subTotal = basePrice + makingCharges;
    const targetGst = (subTotal * gstPercent) / 100;
    const finalPrice = subTotal + targetGst;

    return (
        <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Gold Calculator</h1>
                    <p className="text-slate-400 mt-1">Calculate exact costs including making charges and taxes</p>
                </div>
                {loading && <Loader2 className="animate-spin text-gold-500" size={24} />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <CalcIcon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Investment Details</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Gold Purity</label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.keys(liveRates).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPurity(p)}
                                        className={`py-3 rounded-xl font-semibold border transition-all ${purity === p
                                            ? 'bg-gold-500/20 text-gold-400 border-gold-500/50 shadow-[0_0_10px_rgba(212,174,67,0.1)]'
                                            : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Weight (Grams)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value) || 0)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                    g
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-slate-300">Making Charges</label>
                                <span className="text-gold-400 font-bold">{makingChargesPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="25"
                                step="1"
                                value={makingChargesPercent}
                                onChange={(e) => setMakingChargesPercent(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>0%</span>
                                <span>25%</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50 flex gap-3 text-sm text-slate-400">
                            <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                            <p>Current {purity} Rate: <span className="text-white font-medium">₹{liveRates[purity].toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> per gram</p>
                        </div>
                    </div>
                </div>

                {/* Breakdown Section */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-0 shadow-lg overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-bold text-white mb-6">Cost Breakdown</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Gold Value ({weight}g × ₹{liveRates[purity].toLocaleString('en-IN', { maximumFractionDigits: 2 })}/g)</span>
                                <span className="font-medium text-white">₹{basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Making Charges ({makingChargesPercent}%)</span>
                                <span className="font-medium text-white">+ ₹{makingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-px bg-slate-700/50 w-full my-2"></div>
                            <div className="flex justify-between items-center text-slate-200 font-medium">
                                <span>Subtotal</span>
                                <span>₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>GST (3%)</span>
                                <span className="font-medium text-white">+ ₹{targetGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 flex-1 flex flex-col justify-center">
                        <p className="text-sm text-slate-400 mb-1 text-center">Final Payable Amount</p>
                        <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-500 text-center tracking-tight drop-shadow-sm">
                            ₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>

                        <button className="w-full mt-8 py-4 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-900 rounded-xl text-base font-bold transition-all shadow-[0_0_20px_rgba(212,174,67,0.2)]">
                            Continue to Purchase
                        </button>
                    </div>
                </div>
            </div>

            <CountryComparison />
        </div>
    );
};

export default CalculatorPage;
