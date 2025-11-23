import React, { useState, useEffect } from 'react';
import { calculateMacrosAndDiet, adjustDietForDay } from '../services/geminiService';
import { UserStats, MacroTarget, DietPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw, Calculator, Plus, ArrowRight, Loader2 } from 'lucide-react';

const DietPage: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    age: 25, weight: 75, height: 175, gender: 'male', goal: 'bulk', activityLevel: 'moderate'
  });
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);
  const [ateFood, setAteFood] = useState("");

  const handleCreatePlan = async () => {
    setLoading(true);
    try {
      const result = await calculateMacrosAndDiet(stats);
      setPlan({ id: 'd1', macros: result.macros, meals: result.meals });
    } catch (e) {
      alert("Error generating diet.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!plan || !ateFood) return;
    setAdjustmentLoading(true);
    try {
        const remainingMeals = plan.meals.slice(1).map(m => m.name); // Mock: assume breakfast passed
        const result = await adjustDietForDay(plan.macros, ateFood, remainingMeals);
        
        // Update plan with new suggested meals (Mock update logic)
        const updatedMeals = plan.meals.map(m => {
            const adjusted = result.newMeals.find((nm: any) => nm.name === m.name);
            return adjusted || m;
        });

        setPlan({ ...plan, meals: updatedMeals });
        alert(`AI Advice: ${result.adjustmentAdvice}`);
        setAteFood("");
    } catch (e) {
        alert("Failed to adjust diet.");
    } finally {
        setAdjustmentLoading(false);
    }
  };

  const MacroRing = ({ value, total, color, label }: any) => {
    const data = [{ name: 'val', value: value }, { name: 'rest', value: total - value }];
    return (
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} innerRadius={35} outerRadius={42} startAngle={90} endAngle={-270} dataKey="value">
                            <Cell fill={color} />
                            <Cell fill="#27272a" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-sm font-bold text-white">{value}g</span>
                </div>
            </div>
            <span className="text-xs text-zinc-500 mt-2">{label}</span>
        </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Setup */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calculator size={18} /> Stats & Goals
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-zinc-500">Weight (kg)</label>
                        <input type="number" value={stats.weight} onChange={e => setStats({...stats, weight: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500">Height (cm)</label>
                        <input type="number" value={stats.height} onChange={e => setStats({...stats, height: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
                    </div>
                </div>
                <div>
                     <label className="text-xs text-zinc-500">Goal</label>
                     <div className="flex bg-zinc-950 rounded-lg p-1 mt-1 border border-zinc-800">
                        {['cut', 'maintain', 'bulk'].map(g => (
                            <button key={g} onClick={() => setStats({...stats, goal: g as any})} className={`flex-1 text-xs py-1.5 capitalize rounded-md transition-colors ${stats.goal === g ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>{g}</button>
                        ))}
                     </div>
                </div>
                <button 
                    onClick={handleCreatePlan} 
                    disabled={loading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors flex justify-center items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={16}/>}
                    Generate Diet Plan
                </button>
            </div>
          </div>
          
          {plan && (
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Quick Adjust</h3>
                 <p className="text-xs text-zinc-400 mb-3">Ate something off-plan? Tell the AI to rebalance your day.</p>
                 <textarea 
                    value={ateFood}
                    onChange={(e) => setAteFood(e.target.value)}
                    placeholder="e.g. I ate 2 slices of pepperoni pizza" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[80px]"
                 ></textarea>
                 <button 
                    onClick={handleAdjust}
                    disabled={adjustmentLoading || !ateFood}
                    className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors flex justify-center items-center gap-2"
                 >
                    {adjustmentLoading ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={16} />}
                    Recalculate Remaining Meals
                 </button>
             </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
           {plan ? (
             <div className="space-y-6">
                 {/* Macros Header */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white">{plan.macros.calories}</h2>
                        <p className="text-zinc-500 text-sm">Daily Calories</p>
                    </div>
                    <div className="flex gap-4 md:gap-8">
                        <MacroRing value={plan.macros.protein} total={250} color="#34d399" label="Protein" />
                        <MacroRing value={plan.macros.carbs} total={400} color="#60a5fa" label="Carbs" />
                        <MacroRing value={plan.macros.fats} total={100} color="#fbbf24" label="Fats" />
                    </div>
                 </div>

                 {/* Meals List */}
                 <div className="space-y-4">
                    {plan.meals.map((meal) => (
                        <div key={meal.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-white text-lg">{meal.name}</h4>
                                <div className="text-xs text-zinc-500 flex gap-3">
                                   <span>P: {meal.items.reduce((a,b) => a + b.protein, 0)}g</span>
                                   <span>C: {meal.items.reduce((a,b) => a + b.carbs, 0)}g</span>
                                   <span>F: {meal.items.reduce((a,b) => a + b.fats, 0)}g</span>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {meal.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-zinc-300">{item.name}</span>
                                        </div>
                                        <span className="text-zinc-500 font-medium">{item.amount}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                                <button className="text-xs text-indigo-400 hover:text-indigo-300">Find Substitutes</button>
                                <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">+ Add Item</button>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <Utensils size={32} className="text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white">No Diet Plan Created</h3>
                <p className="text-zinc-500 mt-2 max-w-md">Input your stats and goals on the left to let the AI build a scientifically accurate nutrition plan for you.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const Utensils = ({size, className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
)

export default DietPage;
