import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp, MessageSquare, ChevronRight } from 'lucide-react';

const TrainerDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h2 className="text-3xl font-bold text-white">Coach Dashboard</h2>
             <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">PRO</span>
           </div>
           <p className="text-zinc-400">Manage your athletes and programming.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-zinc-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-zinc-700 border border-zinc-700">
                View Reports
            </button>
            <button className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-zinc-200 shadow-lg shadow-white/10">
            + New Athlete
            </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <KPICard icon={Users} label="Active Students" value="24" color="text-blue-400" />
         <KPICard icon={TrendingUp} label="Avg. Evolution" value="+12%" color="text-emerald-400" sub="vs last month" />
         <KPICard icon={Calendar} label="Check-ins Today" value="8" color="text-purple-400" />
         <KPICard icon={DollarSign} label="Revenue (MRR)" value="$4,200" color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Student List */}
         <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
               <h3 className="font-bold text-white text-lg">My Athletes</h3>
               <div className="flex gap-2">
                   <input type="text" placeholder="Search..." className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-sm text-white focus:outline-none" />
               </div>
            </div>
            <div className="divide-y divide-zinc-800">
               {[
                   { name: 'Sarah Connor', plan: 'Cutting / PPL', status: 'On Track', img: 'https://picsum.photos/seed/s1/40/40' },
                   { name: 'Mike Ross', plan: 'Bulking / ABC', status: 'Needs Attention', img: 'https://picsum.photos/seed/s2/40/40' },
                   { name: 'Jessica Pearson', plan: 'Maintenance', status: 'On Track', img: 'https://picsum.photos/seed/s3/40/40' },
                   { name: 'Harvey Specter', plan: 'Hypertrophy / 5 Day', status: 'Check-in Late', img: 'https://picsum.photos/seed/s4/40/40' },
               ].map((student, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-900/80 transition-colors group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <img src={student.img} className="w-10 h-10 rounded-full ring-2 ring-zinc-800" alt={student.name}/>
                        <div>
                           <h4 className="font-semibold text-white">{student.name}</h4>
                           <div className="flex items-center gap-2">
                               <p className="text-xs text-zinc-500">{student.plan}</p>
                               {student.status === 'Needs Attention' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white" title="Chat">
                            <MessageSquare size={16} />
                        </button>
                        <button className="text-xs border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800">Edit Plan</button>
                        <ChevronRight className="text-zinc-600" size={20} />
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-4 border-t border-zinc-800 text-center">
                <button className="text-sm text-zinc-500 hover:text-zinc-300">View All 24 Athletes</button>
            </div>
         </div>

         {/* Alerts / Chat Preview */}
         <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="font-bold text-white text-lg mb-4">Pending Check-ins</h3>
                <div className="space-y-4">
                <div className="flex gap-3 items-start p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/50">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                        <p className="text-sm text-zinc-300"><strong>Mike Ross</strong> submitted photos.</p>
                        <span className="text-xs text-zinc-500">Weight up 2kg. Needs diet review.</span>
                        <div className="mt-2 flex gap-2">
                            <button className="text-xs bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-600/30">Review</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white text-lg">Messages</h3>
                    <span className="text-xs bg-red-500 text-white px-1.5 rounded-full">3</span>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-white truncate">Sarah Connor</h5>
                            <p className="text-xs text-zinc-500 truncate">Can I swap rice for potato?</p>
                        </div>
                        <span className="text-[10px] text-zinc-600">2m</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-white truncate">Jessica Pearson</h5>
                            <p className="text-xs text-zinc-500 truncate">Shoulders hurting on lateral raise...</p>
                        </div>
                        <span className="text-[10px] text-zinc-600">1h</span>
                    </div>
                </div>
                <button className="w-full mt-4 py-2 text-xs text-zinc-400 hover:text-white border border-zinc-800 rounded-lg hover:bg-zinc-800">Open Chat Console</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, color, sub }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group">
     <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
         <Icon size={64} />
     </div>
     <div className="flex items-center justify-between mb-2 relative z-10">
        <Icon size={20} className="text-zinc-500" />
        {sub && <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400">{sub}</span>}
     </div>
     <div className="relative z-10">
        <span className={`font-bold text-2xl ${color}`}>{value}</span>
        <p className="text-zinc-400 text-sm font-medium mt-1">{label}</p>
     </div>
  </div>
);

export default TrainerDashboard;