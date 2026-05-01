import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock } from 'lucide-react';
import { marketService } from '../../services/api';
import Skeleton from '../Common/Skeleton';

const RecentNews = () => {
    const { data: newsItems, isLoading, isError } = useQuery({
        queryKey: ['market-news'],
        queryFn: marketService.getNews,
<<<<<<< HEAD
        select: (data) => data.slice(0, 3), // Only show top 3 in dashboard to fit layout
=======
        select: (data) => data.slice(0, 4), // Only show top 4 in dashboard
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    });

    return (
        <div className="group relative bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 shadow-xl h-full flex flex-col hover:border-gold-500/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-gold-50 transition-colors">Market Pulse</h2>
                    <p className="text-sm text-slate-500 mt-1">Latest gold market shifts</p>
                </div>
                <button className="p-2.5 text-slate-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-xl transition-all duration-300">
                    <ArrowRight size={20} />
                </button>
            </div>

<<<<<<< HEAD
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
=======
            <div className="flex-1 space-y-4">
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ))
                ) : isError ? (
                    <div className="h-full flex items-center justify-center text-rose-400 text-sm bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
                        Unable to load latest news
                    </div>
                ) : newsItems.map((news) => (
                    <div 
                        key={news.id} 
                        className="group/item p-4 rounded-2xl bg-slate-900/30 border border-slate-700/20 hover:border-gold-500/30 hover:bg-slate-900/50 transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20 group-hover/item:bg-gold-500 group-hover/item:text-slate-950 transition-colors duration-300">
                                {news.tag || 'MARKET'}
                            </span>
                            <div className="flex items-center text-[10px] font-bold text-slate-500 group-hover/item:text-slate-400 uppercase tracking-widest">
                                <Clock size={12} className="mr-1" />
                                {news.time}
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors leading-relaxed line-clamp-2">
                            {news.title}
                        </h3>

                        <div className="flex items-center justify-between mt-3">
                            <p className="text-[10px] font-bold text-slate-600 group-hover/item:text-slate-400 uppercase tracking-widest">
                                {news.source}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3.5 bg-slate-900/50 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-2xl transition-all duration-300 border border-slate-700/50 hover:border-slate-600 uppercase tracking-widest">
                Explore Full Analysis
            </button>
        </div>
    );
};

export default RecentNews;
