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
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTimeSec?: number; // Rest between sets in seconds
  technique?: 'Straight Set' | 'Dropset' | 'Rest-Pause' | 'Superset' | 'FST-7';
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  split: 'ABC' | 'ABCD' | 'ABCDE' | 'PPL' | 'UpperLower' | 'FullBody' | 'Custom';
  methodology?: string; // e.g. "High Volume", "Heavy Duty"
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
  studentsCount: number;
}

export interface Checkpoint {
  date: string;
  weight: number;
  bodyFat?: number;
  photo?: string;
}