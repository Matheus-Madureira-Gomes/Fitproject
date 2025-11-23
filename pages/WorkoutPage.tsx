import React, { useState } from 'react';
import { generateWorkout } from '../services/geminiService';
import { WorkoutRoutine } from '../types';
import { Play, Plus, Sliders, CheckCircle2, Timer, Gauge, Zap, Loader2 } from 'lucide-react';

const WorkoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-plan' | 'create'>('my-plan');
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(false);

  // Creation State
  const [split, setSplit] = useState('ABC');
  const [focus, setFocus] = useState('Hypertrophy');
  const [experience, setExperience] = useState('Intermediate');
  const [methodology, setMethodology] = useState('Scientific Hypertrophy');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const routine = await generateWorkout(split, focus, experience, methodology);
      setRoutines([routine, ...routines]);
      setActiveTab('my-plan');
    } catch (e) {
      alert("Failed to generate workout. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Workout Plans</h2>
          <p className="text-zinc-400 text-sm">Create scientific routines or hire a personal trainer.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl self-start">
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
            <span className="flex items-center gap-2"><Plus size={16} /> New AI Plan</span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
             <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center">
               <Zap size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white">AI Coach Setup</h3>
               <p className="text-zinc-400 text-sm">Define your parameters based on exercise science.</p>
             </div>
          </div>
          
          <div className="space-y-8">
            {/* Split Selection */}
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-3">Training Split</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['ABC', 'ABCD', 'ABCDE', 'PPL', 'UpperLower', 'FullBody', 'Custom'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSplit(opt)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      split === opt 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Primary Goal</label>
                <select 
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>Hypertrophy (Muscle Growth)</option>
                  <option>Strength (Powerlifting)</option>
                  <option>Endurance / Conditioning</option>
                  <option>Fat Loss / Cutting</option>
                </select>
               </div>
               <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Training Age</label>
                <select 
                   value={experience}
                   onChange={(e) => setExperience(e.target.value)}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>Beginner (0-1 years)</option>
                  <option>Intermediate (1-3 years)</option>
                  <option>Advanced (3+ years)</option>
                </select>
               </div>
            </div>

            {/* Methodology Selector - New Feature */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Methodology / Style</label>
                <p className="text-xs text-zinc-500 mb-3">Choose a training philosophy to guide the AI.</p>
                <select 
                   value={methodology}
                   onChange={(e) => setMethodology(e.target.value)}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Scientific Hypertrophy">Scientific Optimal (Volume/Frequency Balance)</option>
                  <option value="High Intensity (Heavy Duty)">High Intensity (Low Volume, Failure)</option>
                  <option value="High Volume (Arnold Style)">High Volume (Old School Bodybuilding)</option>
                  <option value="FST-7">Fascia Stretch Training (FST-7 Style)</option>
                  <option value="Powerbuilding">Powerbuilding (Strength + Size)</option>
                </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
              Build My Program
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
           {routines.length === 0 && (
             <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
               <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Sliders className="text-zinc-600" size={32} />
               </div>
               <h3 className="text-lg font-medium text-white">No active routines</h3>
               <p className="text-zinc-500 mb-6 max-w-md mx-auto">Start by creating an AI-generated plan based on scientific principles or browse community routines.</p>
               <button onClick={() => setActiveTab('create')} className="text-emerald-500 font-bold hover:underline">Start Creation</button>
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
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700">
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{routine.name}</h3>
            {routine.createdBy === 'AI' && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">AI COACH</span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700">{routine.methodology}</span>
          </div>
          <p className="text-zinc-400 text-sm max-w-2xl">{routine.description}</p>
        </div>
        <div className="flex gap-3">
            <div className="text-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 min-w-[80px]">
               <span className="block text-xs text-zinc-500 uppercase font-bold">Split</span>
               <span className="text-emerald-400 font-bold">{routine.split}</span>
            </div>
            <div className="text-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 min-w-[80px]">
               <span className="block text-xs text-zinc-500 uppercase font-bold">Exercises</span>
               <span className="text-white font-bold">{routine.exercises.length}</span>
            </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/30">
          <div className="divide-y divide-zinc-800">
          {routine.exercises.map((ex, idx) => (
            <div key={idx} className="p-5 hover:bg-zinc-900/40 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                 {/* Number / Status */}
                 <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm">
                        {idx + 1}
                    </div>
                 </div>

                 {/* Details */}
                 <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{ex.name}</h4>
                        <a 
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " proper form tutorial")}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs flex items-center gap-1 text-zinc-500 hover:text-red-400 transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                        >
                            <Play size={12} fill="currentColor" /> Watch Video
                        </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400 mt-2">
                       <span className="flex items-center gap-1.5"><strong className="text-white">{ex.sets}</strong> Sets</span>
                       <span className="flex items-center gap-1.5"><strong className="text-white">{ex.reps}</strong> Reps</span>
                       {ex.rpe && (
                          <span className="flex items-center gap-1.5" title="Rate of Perceived Exertion (1-10)">
                            <Gauge size={14} className="text-orange-400"/> RPE <strong className="text-orange-400">{ex.rpe}</strong>
                          </span>
                       )}
                       {ex.restTimeSec && (
                          <span className="flex items-center gap-1.5">
                            <Timer size={14} className="text-blue-400"/> Rest <strong className="text-blue-400">{ex.restTimeSec}s</strong>
                          </span>
                       )}
                    </div>
                    
                    {/* Advanced Technique Badge */}
                    {ex.technique && ex.technique !== 'Straight Set' && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider">
                           <Zap size={10} fill="currentColor" /> {ex.technique}
                        </div>
                    )}

                    {ex.notes && (
                        <div className="mt-3 text-sm text-zinc-500 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                            <span className="text-zinc-400 font-medium">Coach Tip:</span> {ex.notes}
                        </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
          </div>
          <div className="p-4 bg-zinc-900 flex justify-between items-center border-t border-zinc-800">
             <button className="text-sm text-zinc-400 hover:text-white font-medium">Customize Exercises</button>
             <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-emerald-900/20">
                Start Workout Now
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;