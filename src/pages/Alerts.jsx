import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle2, X, ShieldAlert, Zap, ArrowUpRight, ArrowDownRight, Smartphone, BellOff } from 'lucide-react';
import { alertService, marketService } from '../services/api';
import Skeleton from '../components/Common/Skeleton';

const Alerts = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const [triggeredAlerts, setTriggeredAlerts] = useState(new Set());
    
    // Fetch Alerts
    const { data: alerts = [], isLoading: isAlertsLoading } = useQuery({
        queryKey: ['alerts'],
        queryFn: alertService.getAlerts,
    });

    // Fetch Current Price for live monitoring
    const { data: marketData } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
        refetchInterval: 10000, // Check every 10 seconds
    });

    const currentPrice = marketData?.price;

    // Permissions Handling
    const requestPermission = async () => {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    // Live Monitoring Effect
    useEffect(() => {
        if (!currentPrice || !alerts.length || notificationPermission !== 'granted') return;

        alerts.forEach(alert => {
            const isTriggered = alert.condition === 'below' 
                ? currentPrice <= alert.targetPrice 
                : currentPrice >= alert.targetPrice;

            if (isTriggered && !triggeredAlerts.has(alert._id)) {
                new Notification('Gold Price Alert Triggered!', {
                    body: `Gold has reached ₹${currentPrice.toLocaleString('en-IN')}. Target was ₹${alert.targetPrice.toLocaleString('en-IN')} (${alert.condition}).`,
                    icon: '/favicon.ico'
                });
                setTriggeredAlerts(prev => new Set(prev).add(alert._id));
            } else if (!isTriggered && triggeredAlerts.has(alert._id)) {
                // Reset trigger if price moves back (optional, but keeps it "live")
                setTriggeredAlerts(prev => {
                    const next = new Set(prev);
                    next.delete(alert._id);
                    return next;
                });
            }
        });
    }, [currentPrice, alerts, notificationPermission, triggeredAlerts]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: alertService.createAlert,
        onSuccess: () => {
            queryClient.invalidateQueries(['alerts']);
            setIsModalOpen(false);
            setFormData({
                targetPrice: '',
                condition: 'below',
                metal: 'gold',
                currency: 'INR'
            });
        },
        onError: (error) => {
            console.error('Create Alert Error:', error);
            alert(error.response?.data?.message || 'Failed to deploy trigger sequence. Please check your connection.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: alertService.deleteAlert,
        onSuccess: () => {
            queryClient.invalidateQueries(['alerts']);
        },
        onError: (error) => {
            console.error('Delete Alert Error:', error);
            alert('Failed to terminate monitoring sequence.');
        }
    });

    const [formData, setFormData] = useState({
        targetPrice: '',
        condition: 'below',
        metal: 'gold',
        currency: 'INR'
    });

    const handleCreateAlert = (e) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            targetPrice: Number(formData.targetPrice)
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Terminate this price monitoring sequence?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Market <span className="text-gold-500 italic">Watch</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Active price triggers and automated monitoring</p>
                </div>
                <div className="flex gap-4">
                    {notificationPermission !== 'granted' && (
                        <button 
                            onClick={requestPermission}
                            className="px-6 py-3.5 bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5"
                        >
                            <BellOff size={18} />
                            Enable Alerts
                        </button>
                    )}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3.5 bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 shadow-[0_10px_20px_rgba(187,148,43,0.2)] hover:shadow-gold-500/40 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2.5"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Deploy Trigger
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900/90 border border-slate-800/50 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Configure <span className="text-gold-500 italic">Alert</span></h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Set automated price entry points</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-500 hover:text-white bg-slate-950/50 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAlert} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Threshold Price (₹)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-500 font-bold">₹</div>
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="75,000"
                                        className="w-full bg-slate-950/50 border-2 border-slate-900 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-gold-500/30 transition-all"
                                        value={formData.targetPrice}
                                        onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 block">Trigger Condition</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, condition: 'below'})}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${formData.condition === 'below' 
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-lg' 
                                            : 'bg-slate-950/50 text-slate-600 border-slate-900 hover:border-slate-800'}`}
                                    >
                                        <ArrowDownRight size={16} />
                                        Drops Below
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, condition: 'above'})}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${formData.condition === 'above' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-lg' 
                                            : 'bg-slate-950/50 text-slate-600 border-slate-900 hover:border-slate-800'}`}
                                    >
                                        <ArrowUpRight size={16} />
                                        Rises Above
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 bg-slate-950/40 rounded-3xl border border-slate-800/50 flex gap-4 items-start">
                                <Zap size={18} className="text-gold-500 mt-1 flex-shrink-0" />
                                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                                    System will process market spread data 24/7 with <span className="text-white font-bold">Smart Notifications</span> enabled.
                                </p>
                            </div>

                            <button 
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full py-5 bg-gradient-to-tr from-gold-600 to-amber-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-gold-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Syncing...' : 'Initialize Monitoring'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-slate-950/50 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Bell size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Active <span className="text-rose-500 italic">Sequences</span></h2>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Ongoing market surveillance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isAlertsLoading ? (
                        [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)
                    ) : alerts.length > 0 ? alerts.map((alert) => (
                        <div key={alert._id} className="relative group/card bg-slate-950/30 border border-slate-900 rounded-3xl p-8 hover:border-slate-700/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl border ${alert.condition === 'below' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                        {alert.condition === 'below' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{alert.metal} index</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-black text-white uppercase tracking-tighter">
                                                {alert.condition === 'below' ? 'Drop Sequence' : 'Surge Sequence'}
                                            </p>
                                            {triggeredAlerts.has(alert._id) && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse shadow-[0_0_8px_rgba(212,174,67,1)]" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(alert._id)}
                                    className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Target Value</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">₹{alert.targetPrice.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${triggeredAlerts.has(alert._id) ? 'bg-gold-500 text-slate-950 border-gold-400 shadow-lg shadow-gold-500/20' : 'bg-slate-900 text-gold-500 border-slate-800'}`}>
                                        {triggeredAlerts.has(alert._id) ? 'Triggered' : 'Priority'}
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Active Status</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="p-5 bg-slate-950/50 rounded-3xl text-slate-800">
                                <ShieldAlert size={48} strokeWidth={1} />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-black text-slate-500">No Triggers Found</p>
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1">Configure an alert to begin market monitoring</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-4 p-8 bg-slate-900/20 border border-slate-800/40 rounded-[2.5rem] group">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <h3 className="text-base font-black text-white tracking-tight">System Reliability</h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Latency-optimized surveillance Active with 10s precision Sync</p>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
