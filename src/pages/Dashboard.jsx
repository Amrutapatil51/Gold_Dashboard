import PriceCards from '../components/Dashboard/PriceCards';
import GoldChart from '../components/Dashboard/GoldChart';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import RecentNews from '../components/Dashboard/RecentNews';

const Dashboard = () => {
    return (
        <div className="space-y-6 pb-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Real-time gold market insights and trends</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all text-white">
                        Export Data
                    </button>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-900 shadow-[0_0_15px_rgba(212,174,67,0.3)] rounded-xl text-sm font-bold transition-all shadow-gold-500/20">
                        Buy Gold
                    </button>
                </div>
            </div>

            {/* Top row: Price Cards */}
            <PriceCards />

            {/* Middle row: Chart and Portfolio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-h-[400px]">
                    <GoldChart />
                </div>
                <div className="flex flex-col gap-6">
                    <PortfolioOverview />
                    <div className="flex-1 min-h-[250px]">
                        <RecentNews />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
