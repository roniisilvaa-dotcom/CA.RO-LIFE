import { GPSPoint, UserProfile } from "./types";

/**
 * Calculates the distance between two GPS coordinates using the Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // Distance in km
}

/**
 * Calculates the accumulated distance of a series of GPS points
 */
export function calculateRouteDistance(points: GPSPoint[]): number {
  if (points.length < 2) return 0;
  let totalDist = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDist += calculateDistance(
      points[i].latitude,
      points[i].longitude,
      points[i + 1].latitude,
      points[i + 1].longitude
    );
  }
  return totalDist;
}

/**
 * Formats duration in seconds to "HH:MM:SS" format
 */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0")
  ].join(":");
}

/**
 * Calculates the running/walking pace in "MM:SS/km" format
 */
export function calculatePace(seconds: number, distanceKm: number): string {
  if (distanceKm <= 0 || seconds <= 0) return "--:--";
  const totalMinutes = seconds / 60;
  const paceDec = totalMinutes / distanceKm;
  const paceMin = Math.floor(paceDec);
  const paceSec = Math.round((paceDec - paceMin) * 60);
  return `${paceMin.toString().padStart(2, "0")}:${paceSec.toString().padStart(2, "0")}/km`;
}

/**
 * Estimates active calories burned based on body weight, duration and activity type
 */
export function estimateCalories(
  type: string,
  durationSeconds: number,
  weightKg: number
): number {
  // Simple MET-based calorie formula: Calories = MET * weight (kg) * time (hours)
  let MET = 3.5; // Default light walk
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes("corrida")) {
    MET = 9.0;
  } else if (lowerType.includes("caminhada longa") || lowerType.includes("esteira")) {
    MET = 4.0;
  } else if (lowerType.includes("leve")) {
    MET = 3.0;
  } else if (lowerType.includes("caminhada")) {
    MET = 3.8;
  } else if (lowerType.includes("musculação") || lowerType.includes("treino")) {
    MET = 5.0;
  }

  const hours = durationSeconds / 3600;
  return Math.round(MET * weightKg * hours);
}

// LocalStorage Keys
const STORAGE_PREFIX = "carolife_v1_";

export function loadUserProfile(gender: "male" | "female", fallback: UserProfile): UserProfile {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}profile_${gender}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading profile from local storage", error);
  }
  return fallback;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}profile_${profile.gender}`, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving profile to local storage", error);
  }
}

export function saveCoupleChallenges(challenges: any[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}couple_challenges`, JSON.stringify(challenges));
  } catch (error) {
    console.error("Error saving challenges to local storage", error);
  }
}

export function loadCoupleChallenges(fallback: any[]): any[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}couple_challenges`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading challenges from local storage", error);
  }
  return fallback;
}

export async function fetchProfileFromBackend(gender: "male" | "female"): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/profiles/${gender}`);
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.error(`Error loading profile ${gender} from backend`, error);
  }
  return null;
}

export async function saveProfileToBackend(profile: UserProfile): Promise<void> {
  try {
    await fetch(`/api/profiles/${profile.gender}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
  } catch (error) {
    console.error(`Error saving profile ${profile.gender} to backend`, error);
  }
}

export async function fetchChallengesFromBackend(): Promise<any[] | null> {
  try {
    const res = await fetch("/api/challenges");
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.error("Error loading challenges from backend", error);
  }
  return null;
}

export async function saveChallengesToBackend(challenges: any[]): Promise<void> {
  try {
    await fetch("/api/challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challenges),
    });
  } catch (error) {
    console.error("Error saving challenges to backend", error);
  }
}

