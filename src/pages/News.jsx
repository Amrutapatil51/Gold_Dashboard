import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { marketService } from '../services/api';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await marketService.getNews();
                setArticles(data);
            } catch (err) {
                console.error('Failed to fetch news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="space-y-6 pb-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Market News</h1>
                <p className="text-slate-400 mt-1">Latest updates and analysis on global gold markets</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="py-20 flex justify-center bg-slate-800/40 rounded-2xl border border-slate-700/50">
                            <Loader2 className="animate-spin text-gold-500" size={40} />
                        </div>
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article.id || article._id} className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg group hover:border-slate-500 transition-colors flex flex-col sm:flex-row">
                                <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden bg-slate-900">
                                    <img
                                        src={article.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400&h=250'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="font-semibold text-gold-400">{article.source}</span>
                                                <span className="text-slate-500 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {article.time || 'Today'}
                                                </span>
                                            </div>
                                            {article.impact && (
                                                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${article.impact === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        article.impact === 'Negative' ? 'bg-rose-500/10 text-rose-400' :
                                                            'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {article.impact === 'Positive' && <TrendingUp size={12} />}
                                                    {article.impact === 'Negative' && <TrendingDown size={12} />}
                                                    {article.impact} Impact
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-gold-400 transition-colors line-clamp-2">
                                            {article.title}
                                        </h2>
                                        <p className="text-sm text-slate-400 line-clamp-2">
                                            {article.summary}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                        <a 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors w-fit"
                                        >
                                            Read full article <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-slate-500 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                            No recent news found.
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Newspaper className="text-blue-400" />
                            Trending Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Federal Reserve', 'Inflation data', 'Central Banks', 'Jewelry Demand', 'ETF Outflows', 'Geopolitics'].map((tag) => (
                                <span key={tag} className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:border-gold-500/50 hover:text-gold-400 cursor-pointer transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gold-900/40 to-amber-900/20 border border-gold-500/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                        <h3 className="text-lg font-bold text-gold-400 mb-2">Daily Market Briefing</h3>
                        <p className="text-sm text-slate-300 mb-4">Get the latest gold market analysis delivered straight to your inbox every morning.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Your email address" className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-gold-500/50" />
                            <button className="bg-gold-500 hover:bg-gold-400 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-gold-500/20">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
