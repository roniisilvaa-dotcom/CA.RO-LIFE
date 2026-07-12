export interface ExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  defaultDescription: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

export interface Activity {
  id: string;
  type: string; // 'Caminhada', 'Corrida', 'Esteira', etc.
  title: string;
  date: string;
  duration: string; // "HH:MM:SS"
  seconds: number;
  distance: number; // in km
  avgPace: string; // "MM:SS/km" or "--:--"
  calories: number;
  feeling?: string; // 'otimo', 'bom', 'cansado', etc.
  notes?: string;
  isCouple: boolean;
  route: GPSPoint[];
}

export interface DailyCheckin {
  date: string;
  sleepHours: number;
  energyLevel: number; // 1 to 10
  mood: string; // 'radiante', 'focado', 'estavel', 'cansado'
  musclePain: number; // 1 to 10
  disposition: number; // 1 to 10
  weight: number;
  notes?: string;
}

export interface BodyMeasurement {
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thighL?: number;
  thighR?: number;
  armL?: number;
  armR?: number;
}

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'workout' | 'cardio' | 'health' | 'other';
}

export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  type: string;
  targetGoal: string;
  currentWeight: number;
  height: number;
  workoutPlans: WorkoutPlan[];
  activities: Activity[];
  checkins: DailyCheckin[];
  measurements: BodyMeasurement[];
  routine: RoutineItem[];
  aiInsights: string;
  streakDays: number;
}

export interface CoupleGoal {
  targetKm: number;
  currentKm: number;
  completed: boolean;
}

export interface CoupleChallenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
}
