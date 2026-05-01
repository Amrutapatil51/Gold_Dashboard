import PriceCards from '../components/Dashboard/PriceCards';
import GoldChart from '../components/Dashboard/GoldChart';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import RecentNews from '../components/Dashboard/RecentNews';
import MarketInsights from '../components/Dashboard/MarketInsights';
import { useQuery } from '@tanstack/react-query';
import { portfolioService, marketService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { formatValue, currency, getSymbol } = useCurrency();
    
    // Fetch data for export
    const { data: portfolioItems = [] } = useQuery({
        queryKey: ['portfolio'],
        queryFn: portfolioService.getItems,
    });

    const { data: marketData } = useQuery({
        queryKey: ['market-price'],
        queryFn: marketService.getPrice,
    });

    const handleExportCSV = () => {
        if (!portfolioItems.length || !marketData) {
            alert('Insufficient data for export. Syncing with market...');
            return;
        }

        const currentPrice = marketData.price;
        const symbol = getSymbol();
        const headers = ['Asset', 'Weight (g)', `Purchase Price (${symbol})`, `Current Rate (${symbol})`, `Total Value (${symbol})`, `P/L (${symbol})` ];
        
        const rows = portfolioItems.map(item => {
            const totalValue = (currentPrice * item.weight);
            const totalPurchase = (item.buyPrice * item.weight);
            const pl = totalValue - totalPurchase;
            
            return [
                'Gold', 
                item.weight, 
                formatValue(item.buyPrice), 
                formatValue(currentPrice), 
                formatValue(totalValue), 
                formatValue(pl)
            ];
        });

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `Gold_Portfolio_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight group">
                        Executive <span className="text-gold-500 italic">Insights</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                        Real-time market analysis & asset performance
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-900/50 border border-slate-800/60 hover:bg-slate-800 hover:text-gold-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-slate-400 backdrop-blur-md shadow-lg hover:shadow-slate-900/50 group"
                    >
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        Export Report
                    </button>
                    <button 
                        onClick={() => navigate('/calculator')}
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 shadow-[0_10px_20px_rgba(187,148,43,0.2)] hover:shadow-gold-500/40 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Purchase Asset
                    </button>
                </div>
            </div>

            <MarketInsights />
            <PriceCards />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 h-[480px]">
                    <GoldChart />
                </div>
                <div className="lg:col-span-1 h-[480px]">
                    <PortfolioOverview />
                </div>
                <div className="lg:col-span-1 h-[480px]">
                    <RecentNews />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
