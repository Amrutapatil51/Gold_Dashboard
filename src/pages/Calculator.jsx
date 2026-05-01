import { useState } from 'react';
<<<<<<< HEAD
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calculator as CalcIcon, Percent, Info, ArrowRight, Gauge, Scale, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import CountryComparison from '../components/Calculator/CountryComparison';
import { marketService, portfolioService } from '../services/api';
import Skeleton from '../components/Common/Skeleton';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

const CalculatorPage = () => {
    const { formatValue, currency, getSymbol } = useCurrency();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [orderToast, setOrderToast] = useState(null); // null | 'success' | 'error'
=======
import { useQuery } from '@tanstack/react-query';
import { Calculator as CalcIcon, Percent, Info, ArrowRight, Gauge, Scale, Sparkles } from 'lucide-react';
import CountryComparison from '../components/Calculator/CountryComparison';
import { marketService } from '../services/api';
import Skeleton from '../components/Common/Skeleton';
import { useCurrency } from '../context/CurrencyContext';

const CalculatorPage = () => {
    const { formatValue, currency, getSymbol } = useCurrency();
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    const [weight, setWeight] = useState(10);
    const [purity, setPurity] = useState('24K');
    const [makingChargesPercent, setMakingChargesPercent] = useState(8);
    const [gstPercent] = useState(3); 

    const { data: marketData, isLoading } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
    });

    const base24K = (marketData?.price || 72000) / 10;
    const liveRates = {
        '24K': base24K,
        '22K': base24K * 0.9167,
        '18K': base24K * 0.75
    };

    const basePrice = (liveRates[purity] * weight);
    const makingCharges = (basePrice * makingChargesPercent) / 100;
    const subTotal = basePrice + makingCharges;
    const targetGst = (subTotal * gstPercent) / 100;
    const finalPrice = subTotal + targetGst;

<<<<<<< HEAD
    const addMutation = useMutation({
        mutationFn: portfolioService.addItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio-items']);
            queryClient.invalidateQueries(['portfolio']);
            setOrderToast('success');
            setTimeout(() => navigate('/portfolio'), 1800);
        },
        onError: () => {
            setOrderToast('error');
            setTimeout(() => setOrderToast(null), 3000);
        },
    });

    const handleExecuteOrder = () => {
        if (weight <= 0) return;
        addMutation.mutate({
            weight: Number(weight),
            purity,
            purchasePrice: Number(finalPrice.toFixed(2)),
            date: new Date().toISOString().split('T')[0],
            notes: `Ordered via Calculator — ${weight}g ${purity} @ ${formatValue(liveRates[purity])}/g, Making ${makingChargesPercent}%, GST ${gstPercent}%`,
        });
    };

=======
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    return (
        <div className="space-y-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Precision <span className="text-gold-500 italic">Calculator</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Real-time valuation with transparent tax & labor breakdown</p>
                </div>
                {!isLoading && (
                    <div className="flex items-center gap-3 bg-gold-500/5 px-4 py-2 rounded-2xl border border-gold-500/10">
                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Market Live</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-gold-500/10 transition-colors duration-500" />
                    
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3.5 bg-slate-950/50 rounded-2xl text-gold-500 shadow-inner">
                            <CalcIcon size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">Configuration</h2>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block px-1">Selected Purity</label>
                            <div className="grid grid-cols-3 gap-4">
                                {Object.keys(liveRates).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPurity(p)}
                                        className={`group relative py-4 rounded-2xl font-black text-sm transition-all duration-300 border overflow-hidden ${purity === p
                                            ? 'bg-gold-500 text-slate-950 border-gold-400 shadow-[0_10px_20px_rgba(187,148,43,0.2)]'
                                            : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                                            }`}
                                    >
                                        {p}
                                        {purity === p && <Sparkles size={12} className="absolute top-2 right-2 opacity-50" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Mass</label>
                                <div className="text-sm font-black text-white flex items-center gap-1.5">
                                    <Scale size={14} className="text-slate-500" />
                                    {weight}<span className="text-gold-500 italic">g</span>
                                </div>
                            </div>
                            <div className="relative group/input">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value) || 0)}
                                    className="w-full bg-slate-950/50 border-2 border-slate-900 rounded-2xl py-4 pl-6 pr-12 text-sm font-bold text-white focus:outline-none focus:border-gold-500/30 transition-all placeholder:text-slate-700"
                                    placeholder="Enter weight in grams..."
                                />
                                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                                    <span className="text-[10px] font-black text-slate-600 uppercase">Mass</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Crafting Premium</label>
                                <span className="text-sm font-black text-gold-500 flex items-center gap-1.5">
                                    <Gauge size={14} className="text-slate-500" />
                                    {makingChargesPercent}%
                                </span>
                            </div>
                            <div className="px-1 py-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="25"
                                    step="1"
                                    value={makingChargesPercent}
                                    onChange={(e) => setMakingChargesPercent(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-full appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 transition-all duration-300"
                                />
                                <div className="flex justify-between text-[10px] font-black text-slate-700 mt-4 uppercase tracking-widest">
                                    <span>Industrial</span>
                                    <span>Artisanal</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-950/40 rounded-3xl border border-slate-800/50 flex gap-4 items-start group-hover:border-gold-500/20 transition-colors duration-300">
                            <div className="p-2 bg-gold-500/10 rounded-xl text-gold-500 mt-0.5">
                                <Info size={16} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spot Valuation</p>
                                <p className="text-sm font-bold text-slate-200">
                                    Current {purity} Rate: <span className="text-gold-500 font-black">{formatValue(liveRates[purity])}</span> <span className="text-[10px] text-slate-600">/ g</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-0 shadow-2xl overflow-hidden flex flex-col group">
                    <div className="p-10 border-b border-slate-800/40">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3.5 bg-slate-950/50 rounded-2xl text-emerald-400 shadow-inner">
                                <Percent size={22} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Audit Trail</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group/item">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover/item:text-slate-300 transition-colors">Intrinsic Value</span>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">{formatValue(basePrice)}</p>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter mt-0.5">{weight}g @ {purity}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center group/item">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover/item:text-slate-300 transition-colors">Crafting Labor</span>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">+ {formatValue(makingCharges)}</p>
                                    <p className="text-[9px] font-black text-gold-500/50 uppercase tracking-tighter mt-0.5">{makingChargesPercent}% Premium</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-800/50 w-full" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Net Subtotal</span>
                                <span className="text-base font-black text-white">{formatValue(subTotal)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center group/item">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover/item:text-slate-300 transition-colors">Tax Allocation</span>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">+ {formatValue(targetGst)}</p>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter mt-0.5">{currency === 'INR' ? '3.0% Standard GST' : 'Global Duty Scale'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-slate-950/40 flex-1 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] -mr-32 -mb-32" />
                        
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 text-center">Total Acquisition Cost</p>
                        <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-gold-600 via-amber-400 to-gold-300 text-center tracking-tighter drop-shadow-xl">
                            {formatValue(finalPrice)}
                        </div>

<<<<<<< HEAD
                        {/* Toast feedback */}
                        {orderToast === 'success' && (
                            <div className="flex items-center gap-3 mb-6 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in duration-300">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Order logged! Redirecting to Portfolio…</p>
                            </div>
                        )}
                        {orderToast === 'error' && (
                            <div className="flex items-center gap-3 mb-6 px-5 py-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl animate-in fade-in duration-300">
                                <AlertCircle size={18} className="text-rose-400 shrink-0" />
                                <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Failed to log order. Please try again.</p>
                            </div>
                        )}

                        <button
                            id="execute-order-btn"
                            onClick={handleExecuteOrder}
                            disabled={addMutation.isPending || weight <= 0}
                            className="w-full mt-4 py-5 bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(187,148,43,0.15)] hover:shadow-gold-500/40 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addMutation.isPending ? 'Processing…' : 'Execute Order'}
                            {!addMutation.isPending && <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />}
=======
                        <button className="w-full mt-12 py-5 bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(187,148,43,0.15)] hover:shadow-gold-500/40 active:scale-[0.98] flex items-center justify-center gap-3 group">
                            Execute Order
                            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
                        </button>
                    </div>
                </div>
            </div>

            <CountryComparison />
        </div>
    );
};

export default CalculatorPage;
