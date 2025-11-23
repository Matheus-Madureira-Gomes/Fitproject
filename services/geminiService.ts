import { GoogleGenAI } from "@google/genai";
import { UserStats, MacroTarget, WorkoutRoutine, DietPlan, Meal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper to get clean JSON from text ---
function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

export const generateWorkout = async (
  split: string,
  focus: string,
  experience: string,
  methodology: string = "Scientific Hypertrophy"
): Promise<WorkoutRoutine> => {
  const model = "gemini-2.5-flash";
  
  // Methodological Guidelines to inject "Pro" knowledge
  const scienceGuidelines = `
    - Apply "${methodology}" principles.
    - Ensure 48-72h rest for synergistic muscle groups (e.g., don't do Heavy Triceps day immediately before Chest day).
    - Suggest RPE (Rate of Perceived Exertion) between 7-9 for working sets.
    - Include advanced techniques (Dropsets, Rest-Pause) only for the last set of isolation exercises if experience is Intermediate/Advanced.
    - Provide specific rest times (e.g., 180s for Compounds, 90s for Isolations).
  `;

  const prompt = `
    Act as an elite bodybuilding coach (Ph.D. in Sports Science). Create a detailed workout routine.
    
    User Profile:
    - Split: ${split}
    - Focus: ${focus}
    - Experience: ${experience}
    - Methodology Style: ${methodology}
    
    Guidelines:
    ${scienceGuidelines}
    
    Return ONLY a valid JSON object with this structure:
    {
      "name": "Creative Name based on Methodology",
      "description": "Description explaining the 'why' behind the exercise selection and volume.",
      "split": "${split}",
      "methodology": "${methodology}",
      "exercises": [
        {
          "id": "unique_id",
          "name": "Standard Exercise Name",
          "muscleGroup": "Primary Muscle",
          "sets": 4,
          "reps": "8-12",
          "rpe": 8,
          "restTimeSec": 90,
          "technique": "Straight Set", 
          "notes": "Bio-mechanical cue for better contraction"
        }
      ]
    }
    Valid technique values: 'Straight Set', 'Dropset', 'Rest-Pause', 'Superset', 'FST-7'.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text || "{}";
    return { ...JSON.parse(cleanJson(text)), createdBy: 'AI', id: Date.now().toString() };
  } catch (error) {
    console.error("Gemini Workout Error", error);
    throw error;
  }
};

export const calculateMacrosAndDiet = async (stats: UserStats): Promise<{ macros: MacroTarget, meals: Meal[] }> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Calculate scientifically accurate daily calories and macros (Harris-Benedict or Mifflin-St Jeor) for:
    Age: ${stats.age}, Weight: ${stats.weight}kg, Height: ${stats.height}cm, Gender: ${stats.gender}
    Activity: ${stats.activityLevel}, Goal: ${stats.goal} (Bodybuilding context).

    Then create a full day meal plan. 
    - Distribute protein evenly across meals to maximize muscle protein synthesis.
    - Place more carbs around the workout window (Pre/Post).
    
    Return ONLY valid JSON:
    {
      "macros": { "calories": 2500, "protein": 200, "carbs": 300, "fats": 80 },
      "meals": [
        {
          "id": "m1", "name": "Breakfast",
          "items": [ { "name": "Oats", "amount": "100g", "calories": 350, "protein": 10, "carbs": 60, "fats": 5 } ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Diet Error", error);
    throw error;
  }
};

export const adjustDietForDay = async (
  currentMacros: MacroTarget,
  eatenFoodDescription: string,
  remainingMealsName: string[]
): Promise<{ adjustmentAdvice: string, newMeals: Meal[] }> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Daily Goal: ${JSON.stringify(currentMacros)}.
    User unexpectedly ate: "${eatenFoodDescription}".
    
    1. Estimate the macros of the eaten food.
    2. Subtract from Daily Goal.
    3. RE-DISTRIBUTE the REMAINING macros into the remaining meals: ${remainingMealsName.join(', ')}.
    
    Return ONLY valid JSON:
    {
      "adjustmentAdvice": "Since you had a burger (High Fat), we removed the avocado from dinner and reduced rice portion.",
      "newMeals": [
        { "id": "rem1", "name": "${remainingMealsName[0] || 'Next Meal'}", "items": [...] }
      ]
    }
  `;

  try {
     const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
  } catch (e) {
    console.error("Adjustment Error", e);
    throw e;
  }
};

export const rebalanceDietWithNewMacros = async (
  oldPlan: DietPlan,
  newMacros: MacroTarget
): Promise<DietPlan> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    The user wants to adjust their diet plan to hit NEW MACRO TARGETS.
    
    Old Plan Structure (Keep the food choices similar, just adjust amounts/quantities): 
    ${JSON.stringify(oldPlan.meals)}
    
    NEW TARGET MACROS: ${JSON.stringify(newMacros)}
    
    Return ONLY valid JSON with the updated "meals" array and the "macros" object matching the new target.
    {
       "macros": { ... },
       "meals": [ ... ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const res = JSON.parse(cleanJson(response.text || "{}"));
    return { id: oldPlan.id, macros: res.macros, meals: res.meals };
  } catch (e) {
    console.error("Rebalance Error", e);
    throw e;
  }
}

export const analyzeProgress = async (checkpoints: any[]): Promise<string> => {
   const model = "gemini-2.5-flash";
   const prompt = `
    Analyze this weight/body stats history: ${JSON.stringify(checkpoints)}.
    Act as a professional bodybuilding coach. 
    Is the progress consistent with a healthy rate (e.g., 0.5-1% bodyweight per week for loss)? 
    Should calories be increased or decreased based on the trend?
    Provide a concise paragraph of feedback.
   `;
   const response = await ai.models.generateContent({ model, contents: prompt });
   return response.text || "No analysis available.";
};