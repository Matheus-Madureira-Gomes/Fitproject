export enum UserRole {
  USER = 'USER',
  TRAINER = 'TRAINER'
}

export interface UserStats {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  goal: 'cut' | 'bulk' | 'maintain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  notes?: string;
  videoUrl?: string; // Placeholder for search link
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  split: 'ABC' | 'ABCD' | 'PPL' | 'UpperLower' | 'FullBody' | 'Custom';
  exercises: Exercise[];
  createdBy: 'AI' | 'USER' | 'TRAINER';
}

export interface MealItem {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isSubstitution?: boolean;
}

export interface Meal {
  id: string;
  name: string; // Breakfast, Lunch, etc.
  items: MealItem[];
}

export interface DietPlan {
  id: string;
  macros: MacroTarget;
  meals: Meal[];
}

export interface Post {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  isOnline: boolean;
}

export interface Checkpoint {
  date: string;
  weight: number;
  bodyFat?: number;
  photo?: string;
}