import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQuotes } from '../../hooks/useQuotes';
import { CATEGORIES, User } from '../../types';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-5 border border-slate-700/80 shadow-lg">
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdminPanel: React.FC = () => {
    const { users } = useAuth();
    const { quotes } = useQuotes();

    const userArray = Object.values(users);
    userArray.sort((a: User, b: User) => b.createdAt - a.createdAt);

    const quotesByDay = React.useMemo(() => {
        const counts: { [key: string]: number } = {};
        quotes.forEach(quote => {
            const date = new Date(quote.createdAt).toLocaleDateString();
            counts[date] = (counts[date] || 0) + 1;
        });

        const data = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString();
            return {
                label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: counts[dateString] || 0,
            };
        }).reverse();

        return data;
    }, [quotes]);
    
    const quotesByCategory = React.useMemo(() => {
        const counts: { [key: string]: number } = {};
        CATEGORIES.forEach(cat => counts[cat] = 0);
        quotes.forEach(quote => {
            if (counts[quote.category] !== undefined) {
                counts[quote.category]++;
            }
        });
        return CATEGORIES.map(cat => ({
            label: cat,
            value: counts[cat],
        }));
    }, [quotes]);


    const userStats = userArray.map((user: User) => {
        const userQuotes = quotes.filter(q => q.authorId === user.id);
        const quoteCount = userQuotes.length;
        const likesReceived = userQuotes.reduce((sum, q) => sum + q.likes, 0);
        return { ...user, quoteCount, likesReceived };
    });

    return (
        <div className="bg-slate-900 text-slate-100 p-4 sm:p-6 animate-fade-in-up">
            <div className="container mx-auto">
                <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Mission Control</h2>
                <p className="text-slate-400 mb-8">Live overview of the Quote Studio ecosystem.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                     <StatCard 
                        title="Total Users" 
                        value={userArray.length} 
                        color="bg-sky-500/10 text-sky-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                    />
                    <StatCard 
                        title="Total Quotes" 
                        value={quotes.length} 
                        color="bg-teal-500/10 text-teal-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                    <StatCard 
                        title="Total Likes" 
                        value={quotes.reduce((acc, q) => acc + q.likes, 0)} 
                        color="bg-rose-500/10 text-rose-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-3 bg-slate-800 p-6 rounded-xl border border-slate-700/80 shadow-lg">
                        <h3 className="font-bold text-white text-lg mb-4">Quotes Over Time (Last 7 Days)</h3>
                        <div className="h-72">
                            <LineChart data={quotesByDay} />
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700/80 shadow-lg">
                        <h3 className="font-bold text-white text-lg mb-4">Category Popularity</h3>
                        <div className="h-72">
                            <BarChart data={quotesByCategory} />
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-800 rounded-xl border border-slate-700/80 shadow-lg overflow-hidden">
                    <h3 className="text-xl font-bold text-white p-5">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-700/50 text-xs text-slate-300 uppercase tracking-wider">
                                <tr>
                                    <th className="px-2 py-4 sm:p-4 font-semibold">User</th>
                                    <th className="px-2 py-4 sm:p-4 text-center font-semibold">Quotes</th>
                                    <th className="px-2 py-4 sm:p-4 text-center font-semibold">Likes Received</th>
                                    <th className="px-2 py-4 sm:p-4 font-semibold">Join Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {userStats.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/40 transition-colors">
                                        <td className="px-2 py-4 sm:p-4 flex items-center gap-4">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-medium text-white">{user.name}</span>
                                        </td>
                                        <td className="px-2 py-4 sm:p-4 text-slate-300 text-center font-mono">{user.quoteCount}</td>
                                        <td className="px-2 py-4 sm:p-4 text-slate-300 text-center font-mono">{user.likesReceived}</td>
                                        <td className="px-2 py-4 sm:p-4 text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
