import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeProgress } from '../services/geminiService';
import { Camera, Scale } from 'lucide-react';

const data = [
  { name: 'Jan', weight: 80, bodyFat: 20 },
  { name: 'Feb', weight: 79, bodyFat: 19 },
  { name: 'Mar', weight: 78, bodyFat: 18.5 },
  { name: 'Apr', weight: 77.5, bodyFat: 17.8 },
  { name: 'May', weight: 76, bodyFat: 16.5 },
  { name: 'Jun', weight: 75, bodyFat: 15.5 },
];

const ProgressPage: React.FC = () => {
  const [analysis, setAnalysis] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    // Mock loading
    setAnalysis("Analyzing...");
    try {
        const result = await analyzeProgress(data);
        setAnalysis(result);
    } catch (e) {
        setAnalysis("Could not generate analysis.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Evolution Tracking</h2>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          <Scale size={18} /> New Checkpoint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Weight History</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                   <XAxis dataKey="name" stroke="#71717a" />
                   <YAxis stroke="#71717a" />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                   />
                   <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="space-y-6">
            {/* Photos */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-white">Physique Update</h3>
                   <Camera size={18} className="text-zinc-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="aspect-[3/4] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs">Jan 1</div>
                   <div className="aspect-[3/4] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs">Jun 1</div>
                </div>
            </div>

            {/* AI Feedback */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-indigo-200 mb-2">AI Coach Analysis</h3>
                <p className="text-sm text-zinc-300 leading-relaxed min-h-[100px]">
                    {analysis || "Click analyze to get professional feedback on your current trend based on your metrics and goals."}
                </p>
                {!analysis && (
                    <button onClick={handleAnalyze} className="mt-4 text-sm font-bold text-indigo-400 hover:text-indigo-300">Run Analysis</button>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProgressPage;
