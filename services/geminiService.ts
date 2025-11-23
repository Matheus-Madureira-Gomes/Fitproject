import { GoogleGenAI, Type } from "@google/genai";
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
  experience: string
): Promise<WorkoutRoutine> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Create a detailed bodybuilding workout routine.
    Split: ${split}
    Focus: ${focus}
    Experience Level: ${experience}
    
    Return ONLY a valid JSON object with this structure:
    {
      "name": "Name of Routine",
      "description": "Short description mentioning methodology",
      "split": "${split}",
      "exercises": [
        {
          "id": "unique_id",
          "name": "Exercise Name",
          "muscleGroup": "Target Muscle",
          "sets": 3,
          "reps": "8-12",
          "notes": "Execution tip"
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
    Calculate daily calorie and macro needs for a person with these stats:
    Age: ${stats.age}, Weight: ${stats.weight}kg, Height: ${stats.height}cm, Gender: ${stats.gender}
    Activity: ${stats.activityLevel}, Goal: ${stats.goal} (Bodybuilding context).

    Then create a full day sample meal plan fitting these macros.
    
    Return ONLY valid JSON:
    {
      "macros": { "calories": 2500, "protein": 200, "carbs": 300, "fats": 80 },
      "meals": [
        {
          "id": "m1", "name": "Breakfast",
          "items": [ { "name": "Oats", "amount": "100g", "calories": 350, "protein": 10, "carbs": 60, "fats": 5 } ]
        },
        ... (Lunch, Pre-Workout, Dinner, Snack)
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
    My daily goal is: ${JSON.stringify(currentMacros)}.
    I unexpectedly ate/have already eaten: "${eatenFoodDescription}".
    
    Calculate what nutritional value this eaten food likely had.
    Then, re-balance the remaining meals (${remainingMealsName.join(', ')}) to try and hit the daily goal as close as possible.
    
    Return ONLY valid JSON:
    {
      "adjustmentAdvice": "Since you had a burger, we reduced fats in dinner...",
      "newMeals": [
        { "id": "rem1", "name": "${remainingMealsName[0] || 'Remaining'}", "items": [...] }
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

export const analyzeProgress = async (checkpoints: any[]): Promise<string> => {
   const model = "gemini-2.5-flash";
   const prompt = `
    Analyze this weight/body stats history: ${JSON.stringify(checkpoints)}.
    Act as a professional bodybuilding coach. 
    Is the progress consistent with a healthy rate? Should calories be increased or decreased?
    Provide a concise paragraph of feedback.
   `;
   const response = await ai.models.generateContent({ model, contents: prompt });
   return response.text || "No analysis available.";
};
