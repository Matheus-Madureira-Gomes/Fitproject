import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const TrainerDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-white">Trainer Dashboard</h2>
           <p className="text-zinc-400">Manage your students and plans.</p>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-zinc-200">
           + Invite Student
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <KPICard icon={Users} label="Active Students" value="24" color="text-blue-400" />
         <KPICard icon={TrendingUp} label="Avg. Progress" value="+12%" color="text-emerald-400" />
         <KPICard icon={Calendar} label="Sessions Today" value="8" color="text-purple-400" />
         <KPICard icon={DollarSign} label="Monthly Revenue" value="$4,200" color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Student List */}
         <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
               <h3 className="font-bold text-white text-lg">My Students</h3>
               <button className="text-sm text-zinc-500 hover:text-white">View All</button>
            </div>
            <div className="divide-y divide-zinc-800">
               {[1,2,3,4].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-900/80 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
                        <div>
                           <h4 className="font-semibold text-white">Student Name {i}</h4>
                           <p className="text-xs text-zinc-500">Hypertrophy • Next check-in: Tomorrow</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="text-xs border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800">Edit Plan</button>
                        <button className="text-xs bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-700">Message</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Alerts / Tasks */}
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-lg mb-4">Action Items</h3>
            <div className="space-y-4">
               <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                     <p className="text-sm text-zinc-300">Update diet for <strong>Sarah</strong></p>
                     <span className="text-xs text-zinc-500">Weight plateaued for 2 weeks</span>
                  </div>
               </div>
               <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                     <p className="text-sm text-zinc-300">Review check-in photos: <strong>Mike</strong></p>
                     <span className="text-xs text-zinc-500">Submitted 2 hours ago</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
     <div className="flex items-center justify-between mb-2">
        <Icon size={20} className="text-zinc-500" />
        <span className={`font-bold text-xl ${color}`}>{value}</span>
     </div>
     <p className="text-zinc-400 text-sm">{label}</p>
  </div>
);

export default TrainerDashboard;
