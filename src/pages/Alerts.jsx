import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react';
import { alertService } from '../services/api';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        targetPrice: '',
        condition: 'below',
        metal: 'gold',
        currency: 'INR'
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const data = await alertService.getAlerts();
            setAlerts(data);
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlert = async (e) => {
        e.preventDefault();
        try {
            const newAlert = await alertService.createAlert({
                ...formData,
                targetPrice: Number(formData.targetPrice)
            });
            setAlerts([...alerts, newAlert]);
            setIsModalOpen(false);
            setFormData({
                targetPrice: '',
                condition: 'below',
                metal: 'gold',
                currency: 'INR'
            });
        } catch (err) {
            console.error('Failed to create alert:', err);
        }
    };

    const deleteAlert = async (id) => {
        if (window.confirm('Delete this alert?')) {
            try {
                await alertService.deleteAlert(id);
                setAlerts(alerts.filter(a => a._id !== id));
            } catch (err) {
                console.error('Failed to delete alert:', err);
            }
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Price Alerts</h1>
                    <p className="text-slate-400 mt-1">Get notified when gold hits your target price</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-900 shadow-[0_0_15px_rgba(212,174,67,0.3)] rounded-xl text-sm font-bold transition-all shadow-gold-500/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Alert
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-4 top-4 text-slate-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Set Price Alert</h2>
                        <form onSubmit={handleCreateAlert} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Target Price (₹)</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="e.g. 70000"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                    value={formData.targetPrice}
                                    onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
                                <select 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                                >
                                    <option value="below">Drops Below</option>
                                    <option value="above">Rises Above</option>
                                </select>
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
                                    Set Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
                        <Bell size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Active & Past Alerts</h2>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-10 flex justify-center">
                            <Loader2 className="animate-spin text-gold-500" size={32} />
                        </div>
                    ) : alerts.length > 0 ? alerts.map((alert) => (
                        <div key={alert._id} className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all bg-slate-800/80 border-slate-600`}>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-gold-400">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white uppercase">{alert.metal}</span>
                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-700 text-slate-300 uppercase">
                                            {alert.condition === 'below' ? 'Drops Below' : 'Rises Above'}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                        ₹{alert.targetPrice.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-700">
                                <div className="flex gap-2 ml-auto">
                                    <button
                                        onClick={() => deleteAlert(alert._id)}
                                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-10 text-center text-slate-500">
                            No alerts set. Create one to be notified of price changes.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alerts;
