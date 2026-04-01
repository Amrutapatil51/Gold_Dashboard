import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, Activity, Percent, Loader2 } from 'lucide-react';
import { portfolioService, marketService } from '../services/api';

const Portfolio = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liveRate, setLiveRate] = useState(7245.50); // Default fallback
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [portfolioData, marketData] = await Promise.all([
                    portfolioService.getItems(),
                    marketService.getPrice()
                ]);
                setEntries(portfolioData);
                if (marketData && marketData.price) {
                    setLiveRate(marketData.price / 10); // assuming price per 10g from API
                }
            } catch (err) {
                console.error('Failed to load portfolio data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const [formData, setFormData] = useState({
        weight: '',
        purity: '24K',
        purchasePrice: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const newItem = await portfolioService.addItem({
                ...formData,
                weight: Number(formData.weight),
                purchasePrice: Number(formData.purchasePrice)
            });
            setEntries([newItem, ...entries]);
            setIsModalOpen(false);
            setFormData({
                weight: '',
                purity: '24K',
                purchasePrice: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
        } catch (err) {
            console.error('Failed to add item:', err);
            alert('Error adding investment. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this investment?')) {
            try {
                await portfolioService.deleteItem(id);
                setEntries(entries.filter(e => e._id !== id));
            } catch (err) {
                console.error('Failed to delete item:', err);
            }
        }
    };

    const purityMultipliers = { '24K': 1, '22K': 0.916, '18K': 0.75 };

    const totalInvestment = entries.reduce((acc, curr) => acc + curr.purchasePrice, 0);
    const currentValue = entries.reduce((acc, curr) => {
        const val = curr.weight * liveRate * (purityMultipliers[curr.purity] || 1);
        return acc + val;
    }, 0);
    const totalProfit = currentValue - totalInvestment;
    const roi = totalInvestment > 0 ? ((totalProfit) / totalInvestment) * 100 : 0;
    const isProfitable = totalProfit >= 0;

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Portfolio</h1>
                    <p className="text-slate-400 mt-1">Manage and track your gold investments</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-900 shadow-[0_0_15px_rgba(212,174,67,0.3)] rounded-xl text-sm font-bold transition-all shadow-gold-500/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Purchase
                </button>
            </div>

            {/* Add Purchase Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Investment</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Date of Purchase</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Weight (grams)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        placeholder="e.g. 10"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Purity</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                        value={formData.purity}
                                        onChange={(e) => setFormData({...formData, purity: e.target.value})}
                                    >
                                        <option value="24K">24K Gold</option>
                                        <option value="22K">22K Gold</option>
                                        <option value="18K">18K Gold</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Total Purchase Price (₹)</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="e.g. 72000"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                    value={formData.purchasePrice}
                                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
                                <textarea 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none h-20"
                                    placeholder="Store name, invoice #, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-gold-400"
                                >
                                    Save Investment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <DollarSign size={18} />
                        <h3 className="text-sm font-medium">Total Investment</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{totalInvestment.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Activity size={18} />
                        <h3 className="text-sm font-medium">Current Value</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{Math.round(currentValue).toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <div className={`absolute right-0 top-0 w-24 h-24 blur-3xl rounded-full opacity-20 pointer-events-none ${isProfitable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div className="flex items-center justify-between mb-2 text-slate-400">
                        <h3 className="text-sm font-medium">Overall Profit/Loss</h3>
                        {isProfitable ? <TrendingUp size={18} className="text-emerald-400" /> : <TrendingDown size={18} className="text-rose-400" />}
                    </div>
                    <p className={`text-2xl font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfitable ? '+' : '-'}₹{Math.abs(Math.round(totalProfit)).toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Percent size={18} className="w-4 h-4" />
                        <h3 className="text-sm font-medium">Net ROI</h3>
                    </div>
                    <p className={`text-2xl font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {roi.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg mt-8">
                <h2 className="text-xl font-bold text-white mb-6">Investment History</h2>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-gold-500" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                    <th className="pb-3 font-medium px-4">Date</th>
                                    <th className="pb-3 font-medium px-4">Weight</th>
                                    <th className="pb-3 font-medium px-4">Purity</th>
                                    <th className="pb-3 font-medium px-4">Invested</th>
                                    <th className="pb-3 font-medium px-4">Current Value</th>
                                    <th className="pb-3 font-medium px-4">Return</th>
                                    <th className="pb-3 font-medium px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {entries.length > 0 ? entries.map((entry) => {
                                    const currentVal = entry.weight * liveRate * (purityMultipliers[entry.purity] || 1);
                                    const profit = currentVal - entry.purchasePrice;
                                    const isEntryProfitable = profit >= 0;

                                    return (
                                        <tr key={entry._id} className="hover:bg-slate-700/20 transition-colors">
                                            <td className="py-4 px-4 text-slate-300 font-medium">
                                                {new Date(entry.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-4 text-white font-medium">{entry.weight}g</td>
                                            <td className="py-4 px-4">
                                                <span className="px-2.5 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded text-xs font-semibold">
                                                    {entry.purity}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-slate-300">₹{entry.purchasePrice.toLocaleString('en-IN')}</td>
                                            <td className="py-4 px-4 text-white font-medium">₹{Math.round(currentVal).toLocaleString('en-IN')}</td>
                                            <td className={`py-4 px-4 font-medium ${isEntryProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {isEntryProfitable ? '+' : ''}₹{Math.round(profit).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors" title="Edit entry">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entry._id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition-colors"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-slate-500">
                                            No investments found. Add a purchase to see it here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
