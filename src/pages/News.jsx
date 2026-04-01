import { useQuery } from '@tanstack/react-query';
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, Sparkles, Hash, Mail, ArrowRight } from 'lucide-react';
import { marketService } from '../services/api';
import Skeleton from '../components/Common/Skeleton';

const News = () => {
    // Fetch News via TanStack Query
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['market-news'],
        queryFn: marketService.getNews,
        staleTime: 300000, // 5 minutes
    });

    return (
        <div className="space-y-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Intel <span className="text-gold-500 italic">Feed</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Curated global market analysis and breaking updates</p>
                </div>
                {!isLoading && (
                    <div className="flex items-center gap-3 bg-gold-500/5 px-4 py-2 rounded-2xl border border-gold-500/10">
                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Live Updates</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 flex gap-8">
                                <Skeleton className="w-40 h-40 rounded-2xl hidden sm:block shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <Skeleton className="h-4 w-24 rounded" />
                                    <Skeleton className="h-8 w-full rounded" />
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                </div>
                            </div>
                        ))
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article.id || article._id} className="group relative bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-gold-500/30 transition-all duration-500 flex flex-col sm:flex-row">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold-500/10 transition-colors" />
                                
                                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden bg-slate-900 border-r border-slate-700/30">
                                    <img
                                        src={article.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400&h=250'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                
                                <div className="p-8 sm:w-3/5 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest bg-gold-500/10 px-2 py-1 rounded-lg border border-gold-500/20">{article.source}</span>
                                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-tighter">
                                                <Clock size={12} strokeWidth={2.5} />
                                                {article.time || 'Current'}
                                            </span>
                                        </div>
                                        {article.impact && (
                                            <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${article.impact === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    article.impact === 'Negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-slate-900/50 text-slate-400 border-slate-800'
                                                }`}>
                                                {article.impact === 'Positive' && <TrendingUp size={12} />}
                                                {article.impact === 'Negative' && <TrendingDown size={12} />}
                                                {article.impact}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-black text-white mb-4 leading-[1.2] group-hover:text-gold-400 transition-colors line-clamp-2 tracking-tight">
                                        {article.title}
                                    </h2>
                                    
                                    <p className="text-sm font-medium text-slate-400 line-clamp-2 mb-8 leading-relaxed">
                                        {article.summary}
                                    </p>

                                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-700/30">
                                        <a 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 group/link transition-all"
                                        >
                                            Explore Intelligence 
                                            <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </a>
                                        <div className="p-2 bg-slate-950/50 rounded-xl text-slate-700 group-hover:text-gold-500 transition-colors">
                                            <Sparkles size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center space-y-6 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 backdrop-blur-md">
                            <div className="p-6 bg-slate-950/50 rounded-3xl text-slate-800">
                                <Newspaper size={48} strokeWidth={1} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-500">Silence in the Markets</p>
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1 italic">No intelligence signals detected in this cycle</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl group overflow-hidden relative">
                         <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mb-16" />
                         
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-slate-950/50 rounded-2xl text-gold-500 shadow-inner">
                                <Hash size={20} strokeWidth={3} />
                            </div>
                            <h3 className="text-lg font-black text-white tracking-tight uppercase tracking-[0.1em]">Vectors</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2.5">
                            {['FedPolicy', 'Inflation', 'GlobalHedge', 'CentralBanks', 'ETFFlow', 'Geopolitics'].map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-slate-950/50 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-gold-500/50 hover:text-gold-400 cursor-pointer transition-all duration-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-tr from-gold-600 to-amber-400 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden group">
                        <div className="bg-slate-900 rounded-[2.3rem] p-8 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-gold-500/20 transition-colors" />
                            
                            <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-500 w-fit mb-6">
                                <Mail size={22} strokeWidth={2.5} />
                            </div>
                            
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Market Briefing</h3>
                            <p className="text-xs font-semibold text-slate-400 mb-8 leading-relaxed uppercase tracking-wider">High-fidelity analysis delivered daily to your secure inbox.</p>
                            
                            <div className="space-y-4">
                                <input 
                                    type="email" 
                                    placeholder="Enter secure address..." 
                                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-700" 
                                />
                                <button className="w-full bg-gradient-to-tr from-gold-600 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 group/btn">
                                    Subscribe
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
