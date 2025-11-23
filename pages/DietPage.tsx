import React, { useState } from 'react';
import { calculateMacrosAndDiet, adjustDietForDay, rebalanceDietWithNewMacros } from '../services/geminiService';
import { UserStats, MacroTarget, DietPlan, Meal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw, Calculator, Plus, Minus, ArrowRight, Loader2, Utensils, Edit3, Check } from 'lucide-react';

const DietPage: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    age: 25, weight: 80, height: 180, gender: 'male', goal: 'bulk', activityLevel: 'active'
  });
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [rebalanceLoading, setRebalanceLoading] = useState(false);
  
  // "I ate this" state
  const [ateFood, setAteFood] = useState("");
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);

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

  const handleQuickAdjust = async (type: 'calories' | 'protein', amount: number) => {
    if (!plan) return;
    setRebalanceLoading(true);

    const newMacros = { ...plan.macros };
    if (type === 'calories') {
       newMacros.calories += amount;
       // Simply scale others proportionally for simplicity in this demo, 
       // but in a real app, you might want to ask the AI specifically how to distribute.
       const ratio = newMacros.calories / plan.macros.calories;
       newMacros.carbs = Math.round(newMacros.carbs * ratio);
       newMacros.fats = Math.round(newMacros.fats * ratio);
       newMacros.protein = Math.round(newMacros.protein * ratio);
    } else if (type === 'protein') {
       newMacros.protein += amount;
       // Adjust calories to match protein change (4kcal per g)
       newMacros.calories += (amount * 4); 
    }

    try {
        const updatedPlan = await rebalanceDietWithNewMacros(plan, newMacros);
        setPlan(updatedPlan);
    } catch (e) {
        alert("Could not rebalance diet.");
    } finally {
        setRebalanceLoading(false);
    }
  };

  const handleAdjustForEatenFood = async () => {
    if (!plan || !ateFood) return;
    setAdjustmentLoading(true);
    try {
        // Assume breakfast is done or just rebalance remaining for the day
        const remainingMeals = plan.meals.map(m => m.name); 
        const result = await adjustDietForDay(plan.macros, ateFood, remainingMeals);
        
        // Merge logic: Replace the planned meals with the AI suggested new versions
        // In a full app, we would match IDs. Here we match names or replace list.
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
    const data = [{ name: 'val', value: value }, { name: 'rest', value: Math.max(0, total - value) }];
    return (
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
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
            <span className="text-xs text-zinc-500 mt-2 font-medium uppercase tracking-wide">{label}</span>
        </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Setup (Width 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calculator size={18} className="text-emerald-500" /> Stats & Goals
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase">Weight (kg)</label>
                        <input type="number" value={stats.weight} onChange={e => setStats({...stats, weight: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase">Height (cm)</label>
                        <input type="number" value={stats.height} onChange={e => setStats({...stats, height: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase">Age</label>
                        <input type="number" value={stats.age} onChange={e => setStats({...stats, age: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white mt-1" />
                    </div>
                     <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase">Activity</label>
                        <select 
                            value={stats.activityLevel} 
                            onChange={e => setStats({...stats, activityLevel: e.target.value as any})} 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-white text-sm mt-1"
                        >
                            <option value="sedentary">Sedentary</option>
                            <option value="moderate">Moderate</option>
                            <option value="active">Active</option>
                            <option value="very_active">Athlete</option>
                        </select>
                    </div>
                </div>
                <div>
                     <label className="text-xs text-zinc-500 font-bold uppercase">Goal</label>
                     <div className="flex bg-zinc-950 rounded-lg p-1 mt-1 border border-zinc-800">
                        {['cut', 'maintain', 'bulk'].map(g => (
                            <button key={g} onClick={() => setStats({...stats, goal: g as any})} className={`flex-1 text-xs py-2 capitalize rounded-md transition-colors font-medium ${stats.goal === g ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>{g}</button>
                        ))}
                     </div>
                </div>
                <button 
                    onClick={handleCreatePlan} 
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={16}/> : <Utensils size={16} />}
                    Create Nutrition Plan
                </button>
            </div>
          </div>
          
          {plan && (
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-2">Track & Adjust</h3>
                 <p className="text-xs text-zinc-400 mb-4">Ate off-plan? Input what you ate, and AI will recalculate the rest of your day to keep you on track.</p>
                 
                 <div className="relative">
                    <textarea 
                        value={ateFood}
                        onChange={(e) => setAteFood(e.target.value)}
                        placeholder="e.g. I ate a double cheeseburger and fries..." 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
                    ></textarea>
                    {ateFood && (
                        <button 
                            onClick={handleAdjustForEatenFood}
                            disabled={adjustmentLoading}
                            className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors shadow-lg"
                        >
                            {adjustmentLoading ? <Loader2 className="animate-spin" size={16}/> : <ArrowRight size={16} />}
                        </button>
                    )}
                 </div>
             </div>
          )}
        </div>

        {/* Right Column: Results (Width 8/12) */}
        <div className="lg:col-span-8">
           {plan ? (
             <div className="space-y-6">
                 {/* Macros Header with Quick Adjust */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div>
                            <div className="flex items-end gap-2 mb-1">
                                <h2 className="text-4xl font-bold text-white tracking-tighter">{plan.macros.calories}</h2>
                                <span className="text-zinc-500 font-medium mb-1">kcal</span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleQuickAdjust('calories', -50)}
                                    disabled={rebalanceLoading}
                                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded border border-zinc-700 flex items-center gap-1"
                                >
                                    <Minus size={10} /> 50
                                </button>
                                <button 
                                    onClick={() => handleQuickAdjust('calories', 50)}
                                    disabled={rebalanceLoading}
                                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded border border-zinc-700 flex items-center gap-1"
                                >
                                    <Plus size={10} /> 50
                                </button>
                                {rebalanceLoading && <Loader2 size={14} className="animate-spin text-emerald-500 ml-2" />}
                            </div>
                        </div>
                        <div className="flex gap-6 md:gap-10">
                            <MacroRing value={plan.macros.protein} total={250} color="#34d399" label="Protein" />
                            <MacroRing value={plan.macros.carbs} total={400} color="#60a5fa" label="Carbs" />
                            <MacroRing value={plan.macros.fats} total={100} color="#fbbf24" label="Fats" />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center md:justify-start border-t border-zinc-800 pt-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide mr-2 py-1">Quick Actions:</span>
                        <button onClick={() => handleQuickAdjust('protein', 10)} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md border border-emerald-500/20 font-medium transition-colors">
                            Increase Protein
                        </button>
                        <button onClick={() => handleQuickAdjust('calories', -200)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1 rounded-md border border-red-500/20 font-medium transition-colors">
                            Cut Calories (-200)
                        </button>
                    </div>
                 </div>

                 {/* Meals List */}
                 <div className="space-y-4">
                    {plan.meals.map((meal) => (
                        <div key={meal.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-colors group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                                        {meal.name.includes('Breakfast') ? '🍳' : meal.name.includes('Lunch') ? '🍗' : meal.name.includes('Dinner') ? '🥩' : '🍎'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg leading-none">{meal.name}</h4>
                                        <span className="text-xs text-zinc-500">{meal.items.reduce((a,b) => a + b.calories, 0)} kcal</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex text-xs text-zinc-500 gap-3 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                                   <span className="font-mono"><span className="text-emerald-500">P</span> {meal.items.reduce((a,b) => a + b.protein, 0)}g</span>
                                   <span className="font-mono"><span className="text-blue-500">C</span> {meal.items.reduce((a,b) => a + b.carbs, 0)}g</span>
                                   <span className="font-mono"><span className="text-yellow-500">F</span> {meal.items.reduce((a,b) => a + b.fats, 0)}g</span>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {meal.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between text-sm py-2 border-b border-zinc-800/50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-zinc-200 font-medium">{item.name}</span>
                                            {item.isSubstitution && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded border border-blue-500/20">Sub</span>}
                                        </div>
                                        <span className="text-zinc-400 font-medium bg-zinc-900 px-2 py-0.5 rounded">{item.amount}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 flex gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                                    <Edit3 size={12} /> Swap Food
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl text-center min-h-[400px]">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Utensils size={40} className="text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Build Your Nutrition Plan</h3>
                <p className="text-zinc-500 max-w-md">Input your stats on the left. The AI uses metabolic formulas to calculate your exact caloric needs for {stats.goal}.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DietPage;