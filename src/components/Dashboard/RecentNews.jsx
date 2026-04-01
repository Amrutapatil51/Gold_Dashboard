import { useState, useEffect } from 'react';
import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import { marketService } from '../../services/api';

const RecentNews = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await marketService.getNews();
                setNewsItems(data);
            } catch (err) {
                console.error('Failed to fetch news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);
    return (
        <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Market News</h2>
                    <p className="text-sm text-slate-400">Latest updates on gold</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <ArrowRight size={20} />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-gold-500" size={24} />
                    </div>
                ) : newsItems.map((news) => (
                    <div key={news.id} className="group p-4 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:border-slate-600 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-gold-400 border border-slate-700">
                                {news.tag || 'Market News'}
                            </span>
                            <div className="flex items-center text-xs text-slate-500">
                                <Clock size={12} className="mr-1" />
                                {news.time}
                            </div>
                        </div>

                        <h3 className="text-[15px] font-medium text-slate-200 group-hover:text-gold-400 transition-colors leading-snug">
                            {news.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-2 font-medium">Source: {news.source}</p>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-sm font-medium text-slate-300 rounded-xl transition-colors border border-slate-700">
                View All News
            </button>
        </div>
    );
};

export default RecentNews;
