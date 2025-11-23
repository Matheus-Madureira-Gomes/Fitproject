import React, { useState } from 'react';
import { generateWorkout } from '../services/geminiService';
import { WorkoutRoutine, Exercise } from '../types';
import { Play, Plus, Sliders, CheckCircle2, MoreHorizontal, Loader2 } from 'lucide-react';

const WorkoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-plan' | 'create'>('my-plan');
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(false);

  // Creation State
  const [split, setSplit] = useState('PPL');
  const [focus, setFocus] = useState('Hypertrophy');
  const [experience, setExperience] = useState('Intermediate');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const routine = await generateWorkout(split, focus, experience);
      setRoutines([routine, ...routines]);
      setActiveTab('my-plan');
    } catch (e) {
      alert("Failed to generate workout. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white">Workout Routines</h2>
        <div className="flex bg-zinc-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('my-plan')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'my-plan' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            My Plans
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'create' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2"><Plus size={16} /> Create New</span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6">AI Workout Generator</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Training Split</label>
              <div className="grid grid-cols-3 gap-3">
                {['ABC', 'ABCD', 'PPL', 'UpperLower', 'FullBody', 'Custom'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSplit(opt)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      split === opt 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Goal / Focus</label>
                <select 
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Hypertrophy</option>
                  <option>Strength</option>
                  <option>Endurance</option>
                  <option>Fat Loss</option>
                </select>
               </div>
               <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Experience</label>
                <select 
                   value={experience}
                   onChange={(e) => setExperience(e.target.value)}
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
               </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Play size={20} fill="currentColor" />}
              Generate Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {routines.length === 0 && (
             <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
               <DumbbellIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-white">No routines yet</h3>
               <p className="text-zinc-500 mb-6">Create your first AI-powered workout plan to get started.</p>
               <button onClick={() => setActiveTab('create')} className="text-emerald-500 font-medium hover:underline">Create now</button>
             </div>
           )}
           {routines.map((routine) => (
             <WorkoutCard key={routine.id} routine={routine} />
           ))}
        </div>
      )}
    </div>
  );
};

const WorkoutCard: React.FC<{ routine: WorkoutRoutine }> = ({ routine }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">{routine.name}</h3>
            {routine.createdBy === 'AI' && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20">AI Generated</span>
            )}
          </div>
          <p className="text-zinc-400 text-sm max-w-xl">{routine.description}</p>
          <div className="flex gap-4 mt-4">
            <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
               <span className="text-zinc-300 font-semibold">{routine.split}</span> Split
            </div>
            <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
               <span className="text-zinc-300 font-semibold">{routine.exercises.length}</span> Exercises
            </div>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
        >
          {expanded ? 'Hide Details' : 'View Workout'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
          {routine.exercises.map((ex, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{ex.name}</h4>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                   <span>{ex.muscleGroup}</span>
                   <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                   <span>{ex.sets} sets × {ex.reps}</span>
                </div>
              </div>
              {ex.notes && (
                 <div className="hidden md:block text-xs text-zinc-500 max-w-xs bg-zinc-900 p-2 rounded border border-zinc-800">
                    💡 {ex.notes}
                 </div>
              )}
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise execution")}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
                title="Watch Execution"
              >
                <Play size={18} />
              </a>
            </div>
          ))}
          <div className="flex justify-end pt-4">
             <button className="text-sm text-emerald-500 font-medium hover:text-emerald-400">Modify Exercises (AI)</button>
          </div>
        </div>
      )}
    </div>
  );
};

const DumbbellIcon = ({className}: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
)

export default WorkoutPage;
