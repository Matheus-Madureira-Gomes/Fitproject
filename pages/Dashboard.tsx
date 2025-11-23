import React from 'react';
import { UserRole } from '../types';
import { Activity, Flame, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ role: UserRole }> = ({ role }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {role === UserRole.USER ? 'John' : 'Coach Mike'}</h2>
        <p className="text-zinc-400">Here's your daily summary.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={Flame} 
          label="Calories Consumed" 
          value="1,240 / 2,800" 
          sub="44% of daily goal"
          color="text-orange-400"
          bg="bg-orange-500/10"
        />
        <StatCard 
          icon={Activity} 
          label="Workout Status" 
          value="Leg Day" 
          sub="Scheduled for 6:00 PM"
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard 
          icon={Trophy} 
          label="Current Streak" 
          value="12 Days" 
          sub="Keep it up!"
          color="text-purple-400"
          bg="bg-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <Link to="/workout" className="p-6 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition-colors group">
               <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                 <Activity size={20} />
               </div>
               <h4 className="font-semibold text-white">Start Workout</h4>
               <p className="text-sm text-zinc-500 mt-1">Legs (Hypertrophy)</p>
             </Link>
             <Link to="/diet" className="p-6 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition-colors group">
               <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                 <Flame size={20} />
               </div>
               <h4 className="font-semibold text-white">Log Meal</h4>
               <p className="text-sm text-zinc-500 mt-1">Track your macros</p>
             </Link>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 3 0 0 0-4-3m-6-1v2m-4-6V2"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-100 mb-2">AI Coach Insight</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Based on your last 3 workouts, your volume on quadriceps has been high. I recommend reducing today's leg extension sets by 1 to prevent overtraining, or increasing your carbohydrate intake by 50g to support recovery.
              </p>
              <button className="mt-4 text-sm text-indigo-300 font-medium flex items-center hover:text-indigo-200">
                Adjust Plan <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, bg }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        <p className={`text-xs ${color} mt-1`}>{sub}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
