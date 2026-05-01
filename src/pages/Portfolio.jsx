import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
<<<<<<< HEAD
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Activity, Percent, ArrowRight, Calendar, Weight, ShieldCheck, Edit3, X } from 'lucide-react';
=======
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Activity, Percent, ArrowRight, Calendar, Weight, ShieldCheck, Edit3 } from 'lucide-react';
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
import { portfolioService, marketService } from '../services/api';
import Skeleton from '../components/Common/Skeleton';
import { useCurrency } from '../context/CurrencyContext';

const Portfolio = () => {
    const queryClient = useQueryClient();
    const { formatValue, currency, getSymbol } = useCurrency();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    
    // Fetch Portfolio Data
    const { data: entries = [], isLoading: isLoadingEntries } = useQuery({
        queryKey: ['portfolio-items'],
        queryFn: portfolioService.getItems,
    });

    // Fetch Market Price
    const { data: marketData, isLoading: isLoadingMarket } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: portfolioService.addItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio-items']);
            handleCloseModal();
        },
<<<<<<< HEAD
        onError: (error) => {
            console.error('Add Portfolio Item Error:', error);
            alert(error.response?.data?.message || 'Failed to log new purchase. Please check your connection.');
        }
=======
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}) => portfolioService.updateItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio-items']);
            handleCloseModal();
        },
<<<<<<< HEAD
        onError: (error) => {
            console.error('Update Portfolio Item Error:', error);
            alert(error.response?.data?.message || 'Failed to update asset log.');
        }
=======
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    });

    const deleteMutation = useMutation({
        mutationFn: portfolioService.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio-items']);
        },
<<<<<<< HEAD
        onError: (error) => {
            console.error('Delete Portfolio Item Error:', error);
            alert('Failed to delete asset from ledger.');
        }
=======
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    });

    const [formData, setFormData] = useState({
        weight: '',
        purity: '24K',
        purchasePrice: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                weight: item.weight,
                purity: item.purity,
                purchasePrice: item.purchasePrice,
                date: new Date(item.date).toISOString().split('T')[0],
                notes: item.notes || ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            weight: '',
            purity: '24K',
            purchasePrice: '',
            date: new Date().toISOString().split('T')[0],
            notes: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            weight: Number(formData.weight),
            purchasePrice: Number(formData.purchasePrice)
        };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem._id, data });
        } else {
            addMutation.mutate(data);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Confirm deletion of this high-value asset?')) {
            deleteMutation.mutate(id);
        }
    };

    const purityMultipliers = { '24K': 1, '22K': 0.916, '18K': 0.75 };
    const liveRate = (marketData?.price || 72000) / 10;

    const totalInvestment = entries.reduce((acc, curr) => acc + curr.purchasePrice, 0);
    const currentValue = entries.reduce((acc, curr) => {
        const val = curr.weight * liveRate * (purityMultipliers[curr.purity] || 1);
        return acc + val;
    }, 0);
    const absoluteProfit = currentValue - totalInvestment;
    const roi = totalInvestment > 0 ? ((absoluteProfit) / totalInvestment) * 100 : 0;
    const isProfitable = absoluteProfit >= 0;

    const isLoading = isLoadingEntries || isLoadingMarket;

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Asset <span className="text-gold-500 italic">Portfolio</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Precision management of your gold holdings</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="px-8 py-3.5 bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 shadow-[0_10px_20px_rgba(187,148,43,0.2)] hover:shadow-gold-500/40 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2.5"
                >
                    <Plus size={18} strokeWidth={3} />
                    Log New Purchase
                </button>
            </div>

            {/* Asset Log Modal (Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900/90 border border-slate-800/50 backdrop-blur-2xl rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
<<<<<<< HEAD
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">{editingItem ? 'Edit' : 'Secure'} <span className="text-gold-500 italic">Asset Log</span></h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Acquisition Ledger Entry</p>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="p-2 text-slate-500 hover:text-white bg-slate-950/50 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
=======
                        <h2 className="text-2xl font-black text-white mb-8 tracking-tight">{editingItem ? 'Edit' : 'Secure'} <span className="text-gold-500 italic">Asset Log</span></h2>
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Date OF Transaction</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-gold-500/50 outline-none transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Fine Weight (g)</label>
                                    <div className="relative">
                                        <Weight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            required
                                            placeholder="0.00"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-gold-500/50 outline-none transition-all"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Asset Purity</label>
                                    <div className="relative">
                                        <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                                        <select 
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white appearance-none focus:border-gold-500/50 outline-none transition-all"
                                            value={formData.purity}
                                            onChange={(e) => setFormData({...formData, purity: e.target.value})}
                                        >
                                            <option value="24K">Investment Grade (24K)</option>
                                            <option value="22K">Standard Jewel (22K)</option>
                                            <option value="18K">Decorative (18K)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Acquisition Cost ({getSymbol()})</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                                        <input 
                                            type="number" 
                                            required
                                            placeholder={currency === 'INR' ? "Total Price in ₹" : "Total Price in $"}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-gold-500/50 outline-none transition-all"
                                            value={formData.purchasePrice}
                                            onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Transaction Memo</label>
                                <textarea 
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-5 text-sm text-white focus:border-gold-500/50 outline-none transition-all h-28 resize-none"
                                    placeholder="Add acquisition details, vendor info, or certificates..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-4 bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={addMutation.isPending || updateMutation.isPending}
                                    className="flex-1 px-6 py-4 bg-gradient-to-tr from-gold-600 to-amber-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-gold-500/30 transition-all disabled:opacity-50"
                                >
                                    {addMutation.isPending || updateMutation.isPending ? 'Syncing...' : (editingItem ? 'Update Asset' : 'Confirm Entry')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Summary Cards aligned with Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)
                ) : (
                    <>
                        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 shadow-xl group hover:border-gold-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-slate-950/50 rounded-xl text-slate-500 group-hover:text-gold-500 transition-colors">
                                    <DollarSign size={18} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Total Invested</h3>
                            </div>
                            <p className="text-3xl font-black text-white tracking-tight">{formatValue(totalInvestment)}</p>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 shadow-xl group hover:border-indigo-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-slate-950/50 rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    <Activity size={18} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Current Value</h3>
                            </div>
                            <p className="text-3xl font-black text-white tracking-tight">{formatValue(currentValue)}</p>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300">
                            <div className={`absolute right-0 top-0 w-24 h-24 blur-3xl rounded-full opacity-10 pointer-events-none ${isProfitable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 bg-slate-950/50 rounded-xl ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isProfitable ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Net Profit</h3>
                                </div>
                            </div>
                            <p className={`text-3xl font-black tracking-tight ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isProfitable ? '+' : '-'}{formatValue(Math.abs(absoluteProfit))}
                            </p>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 shadow-xl group hover:border-gold-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-slate-950/50 rounded-xl text-slate-500 group-hover:text-gold-500 transition-colors">
                                    <Percent size={18} className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Portfolio ROI</h3>
                            </div>
                            <p className={`text-3xl font-black tracking-tight ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {roi.toFixed(2)}%
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Holdings Table */}
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-800/40 bg-slate-900/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Holdings <span className="text-gold-500 italic">Ledger</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Transaction history & performance</p>
                    </div>
                </div>

                <div className="p-0">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/20 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="py-5 px-8">Acquisition Date</th>
                                        <th className="py-5 px-8">Purity</th>
                                        <th className="py-5 px-8">Weight</th>
                                        <th className="py-5 px-8">Cost Basis</th>
                                        <th className="py-5 px-8">Current Value</th>
                                        <th className="py-5 px-8">Profit / Loss</th>
                                        <th className="py-5 px-8 text-right">Commands</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40">
                                    {entries.length > 0 ? entries.map((entry) => {
                                        const currentVal = entry.weight * liveRate * (purityMultipliers[entry.purity] || 1);
                                        const profit = currentVal - entry.purchasePrice;
                                        const isEntryProfitable = profit >= 0;

                                        return (
                                            <tr key={entry._id} className="group hover:bg-slate-800/30 transition-all duration-300">
                                                <td className="py-6 px-8 text-sm font-bold text-slate-300">
                                                    {new Date(entry.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="py-6 px-8">
                                                    <span className="px-3 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-xl text-[10px] font-black tracking-widest uppercase">
                                                        {entry.purity}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-8 text-sm font-black text-white">{entry.weight}<span className="text-[10px] text-slate-500 ml-1">g</span></td>
                                                <td className="py-6 px-8 text-sm font-bold text-slate-400">{formatValue(entry.purchasePrice)}</td>
                                                <td className="py-6 px-8 text-sm font-black text-white">{formatValue(currentVal)}</td>
                                                <td className={`py-6 px-8 text-sm font-black ${isEntryProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    <div className="flex items-center gap-1.5">
                                                        {isEntryProfitable ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        {formatValue(Math.abs(profit))}
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(entry)}
<<<<<<< HEAD
                                                            className="p-3 text-slate-500 hover:text-gold-400 hover:bg-gold-500/10 rounded-2xl transition-all duration-300"
=======
                                                            className="p-3 text-slate-600 hover:text-gold-400 hover:bg-gold-500/10 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
                                                            title="Edit Transaction"
                                                        >
                                                            <Edit3 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entry._id)}
<<<<<<< HEAD
                                                            className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300"
=======
                                                            className="p-3 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
                                                            title="Delete Transaction"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="7" className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="p-4 bg-slate-900/50 rounded-3xl text-slate-700">
                                                        <ShieldCheck size={48} strokeWidth={1} />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-black text-slate-400">No Assets Under Management</p>
                                                        <p className="text-xs font-medium text-slate-600 mt-1 uppercase tracking-widest">Logged transactions will appear in this ledger</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-slate-950/20 border-t border-slate-800/40 flex justify-center">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-gold-500" />
                        Live Valuation active in <span className="text-white">{currency}</span> based on current market spread
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
