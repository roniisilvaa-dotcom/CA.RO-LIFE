import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ActivityView from "./components/ActivityView";
import WorkoutView from "./components/WorkoutView";
import RoutineView from "./components/RoutineView";
import EvolutionView from "./components/EvolutionView";
import CoupleView from "./components/CoupleView";

import { UserProfile, Activity, WorkoutPlan, DailyCheckin, BodyMeasurement, RoutineItem, CoupleChallenge } from "./types";
import { initialRoniProfile, initialCamilaProfile, initialCoupleChallenges } from "./initialData";
import {
  loadUserProfile,
  saveUserProfile,
  loadCoupleChallenges,
  saveCoupleChallenges,
  fetchProfileFromBackend,
  saveProfileToBackend,
  fetchChallengesFromBackend,
  saveChallengesToBackend,
  requestNotificationPermission
} from "./utils";

export default function App() {
  const [currentProfileId, setCurrentProfileId] = useState<"male" | "female">("male");
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // Load individual profiles from local storage or fallback to initial data
  const [roniProfile, setRoniProfile] = useState<UserProfile>(() =>
    loadUserProfile("male", initialRoniProfile)
  );

  const [camilaProfile, setCamilaProfile] = useState<UserProfile>(() =>
    loadUserProfile("female", initialCamilaProfile)
  );

  // Load shared couple challenges
  const [coupleChallenges, setCoupleChallenges] = useState<CoupleChallenge[]>(() =>
    loadCoupleChallenges(initialCoupleChallenges)
  );

  // Get active profile references
  const currentProfile = useMemo(() => {
    return currentProfileId === "male" ? roniProfile : camilaProfile;
  }, [currentProfileId, roniProfile, camilaProfile]);

  // Synchronize initial data from backend database on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const roniDb = await fetchProfileFromBackend("male");
        if (roniDb) {
          setRoniProfile(roniDb);
        } else {
          // DB has no records, force reset local storage with clean slate
          setRoniProfile(initialRoniProfile);
          await saveProfileToBackend(initialRoniProfile);
        }

        const camilaDb = await fetchProfileFromBackend("female");
        if (camilaDb) {
          setCamilaProfile(camilaDb);
        } else {
          setCamilaProfile(initialCamilaProfile);
          await saveProfileToBackend(initialCamilaProfile);
        }

        const challengesDb = await fetchChallengesFromBackend();
        if (challengesDb) {
          setCoupleChallenges(challengesDb);
        } else {
          setCoupleChallenges(initialCoupleChallenges);
          await saveChallengesToBackend(initialCoupleChallenges);
        }
      } catch (err) {
        console.error("Failed to sync from database:", err);
      }
    }
    loadInitialData();
    requestNotificationPermission();
  }, []);

  // Persist profiles on changes
  useEffect(() => {
    saveUserProfile(roniProfile);
    saveProfileToBackend(roniProfile);
  }, [roniProfile]);

  useEffect(() => {
    saveUserProfile(camilaProfile);
    saveProfileToBackend(camilaProfile);
  }, [camilaProfile]);

  useEffect(() => {
    saveCoupleChallenges(coupleChallenges);
    saveChallengesToBackend(coupleChallenges);
  }, [coupleChallenges]);

  // Handle Switch Profile
  const handleSwitchProfile = (gender: "male" | "female") => {
    setCurrentProfileId(gender);
    setProfileModalOpen(false);
    setActiveView("dashboard");
  };

  // Activity saver handler
  const handleSaveActivity = (newAct: Activity) => {
    const updateProfile = (prev: UserProfile): UserProfile => {
      // Append activity and update streak
      const updatedActivities = [newAct, ...prev.activities];
      const nextStreak = prev.streakDays + 1;
      
      return {
        ...prev,
        activities: updatedActivities,
        streakDays: nextStreak,
      };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }

    // Update shared couple challenges if isCouple is active
    if (newAct.isCouple) {
      setCoupleChallenges((prev) =>
        prev.map((ch) => {
          if (ch.id === "challenge-1") {
            const nextVal = Math.min(ch.currentValue + newAct.distance, ch.targetValue);
            return {
              ...ch,
              currentValue: parseFloat(nextVal.toFixed(1)),
              completed: nextVal >= ch.targetValue,
            };
          }
          return ch;
        })
      );
    }
  };

  // Workout Session Saver
  const handleSaveWorkoutSession = (
    planId: string,
    durationSeconds: number,
    completedSetsCount: number
  ) => {
    const hoursPart = Math.floor(durationSeconds / 3600);
    const minutesPart = Math.floor((durationSeconds % 3600) / 60);
    const durationStr = `${hoursPart > 0 ? hoursPart + "h" : ""}${minutesPart}min`;

    // Also register a cardio style mock entry to represent active workouts log
    const mockActivity: Activity = {
      id: `workout-session-${Date.now()}`,
      type: "Musculação",
      title: `Treino de Musculação (${completedSetsCount} séries)`,
      date: new Date().toISOString().split("T")[0],
      duration: new Date(durationSeconds * 1000).toISOString().substr(11, 8),
      seconds: durationSeconds,
      distance: 0,
      avgPace: "--:--",
      calories: Math.round(completedSetsCount * 12.5), // calories based on sets
      isCouple: false,
      route: [],
    };

    const updateProfile = (prev: UserProfile): UserProfile => {
      const updatedActivities = [mockActivity, ...prev.activities];
      
      // Auto-complete any pending workout item inside routine schedule
      const updatedRoutine = prev.routine.map((item) => {
        if (item.category === "workout") {
          return { ...item, completed: true };
        }
        return item;
      });

      return {
        ...prev,
        activities: updatedActivities,
        routine: updatedRoutine,
        streakDays: prev.streakDays + 1,
      };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  // Customize Workout Plans
  const handleUpdateWorkoutPlans = (plans: WorkoutPlan[]) => {
    if (currentProfileId === "male") {
      setRoniProfile((prev) => ({ ...prev, workoutPlans: plans }));
    } else {
      setCamilaProfile((prev) => ({ ...prev, workoutPlans: plans }));
    }
  };

  // Toggle checklist tasks
  const handleToggleRoutineItem = (itemId: string) => {
    const updateProfile = (prev: UserProfile): UserProfile => {
      const updatedRoutine = prev.routine.map((item) => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      return { ...prev, routine: updatedRoutine };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  // Add routine item
  const handleAddRoutineItem = (newItem: Omit<RoutineItem, "id">) => {
    const item: RoutineItem = {
      ...newItem,
      id: `rot-item-${Date.now()}`,
    };

    const updateProfile = (prev: UserProfile): UserProfile => {
      return { ...prev, routine: [...prev.routine, item] };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  // Remove routine item
  const handleRemoveRoutineItem = (itemId: string) => {
    const updateProfile = (prev: UserProfile): UserProfile => {
      return { ...prev, routine: prev.routine.filter((r) => r.id !== itemId) };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  // Body measurements saver
  const handleSaveCheckin = (checkin: DailyCheckin) => {
    const updateProfile = (prev: UserProfile): UserProfile => {
      const updatedCheckins = [checkin, ...prev.checkins];
      return {
        ...prev,
        checkins: updatedCheckins,
        currentWeight: checkin.weight,
      };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  const handleSaveMeasurements = (meas: BodyMeasurement) => {
    const updateProfile = (prev: UserProfile): UserProfile => {
      const updatedMeasurements = [meas, ...prev.measurements];
      return {
        ...prev,
        measurements: updatedMeasurements,
        currentWeight: meas.weight,
      };
    };

    if (currentProfileId === "male") {
      setRoniProfile((prev) => updateProfile(prev));
    } else {
      setCamilaProfile((prev) => updateProfile(prev));
    }
  };

  // Calculate stats values for the active week
  const statsThisWeek = useMemo(() => {
    const roniKm = roniProfile.activities.reduce((sum, a) => sum + a.distance, 0);
    const camilaKm = camilaProfile.activities.reduce((sum, a) => sum + a.distance, 0);
    
    const combinedKm = roniKm + camilaKm;
    
    // Count active workouts completed
    const roniWorkouts = roniProfile.activities.filter(a => a.type.includes("Musculação") || a.type.includes("Treino")).length || 4;
    const camilaWorkouts = camilaProfile.activities.filter(a => a.type.includes("Musculação") || a.type.includes("Treino")).length || 3;

    // Active duration calculation
    const roniSeconds = roniProfile.activities.reduce((sum, a) => sum + a.seconds, 0) || 13320; // fallback default
    const camilaSeconds = camilaProfile.activities.reduce((sum, a) => sum + a.seconds, 0) || 10680; // fallback default

    const activeProfileSeconds = currentProfileId === "male" ? roniSeconds : camilaSeconds;
    const activeHrs = Math.floor(activeProfileSeconds / 3600);
    const activeMins = Math.floor((activeProfileSeconds % 3600) / 60);

    return {
      combinedKm,
      roniKm,
      camilaKm,
      activeProfileKm: currentProfileId === "male" ? roniKm : camilaKm,
      activeProfileWorkouts: currentProfileId === "male" ? roniWorkouts : camilaWorkouts,
      activeProfileTimeString: `${activeHrs}h${activeMins.toString().padStart(2, "0")}`,
    };
  }, [roniProfile, camilaProfile, currentProfileId]);

  const coupleProgressText = `Vocês já completaram ${statsThisWeek.combinedKm.toFixed(1).replace(".", ",")} km de 40 km nesta semana.`;

  return (
    <div className="app flex min-h-screen relative">
      {/* Premium Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        profile={currentProfile}
        onSwitchProfileClick={() => setProfileModalOpen(true)}
        coupleProgressText={coupleProgressText}
      />

      {/* Main Container Area */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {activeView === "dashboard" && (
            <DashboardView
              profile={currentProfile}
              activeView={activeView}
              setActiveView={setActiveView}
              onSwitchProfileClick={() => setProfileModalOpen(true)}
              totalKmThisWeek={statsThisWeek.activeProfileKm}
              totalWorkoutsThisWeek={statsThisWeek.activeProfileWorkouts}
              totalActiveTimeThisWeek={statsThisWeek.activeProfileTimeString}
            />
          )}

          {activeView === "activity" && (
            <ActivityView profile={currentProfile} onSaveActivity={handleSaveActivity} />
          )}

          {activeView === "workout" && (
            <WorkoutView
              profile={currentProfile}
              onSaveWorkoutSession={handleSaveWorkoutSession}
              onUpdateWorkoutPlans={handleUpdateWorkoutPlans}
            />
          )}

          {activeView === "routine" && (
            <RoutineView
              profile={currentProfile}
              onToggleRoutineItem={handleToggleRoutineItem}
              onAddRoutineItem={handleAddRoutineItem}
              onRemoveRoutineItem={handleRemoveRoutineItem}
            />
          )}

          {activeView === "evolution" && (
            <EvolutionView
              profile={currentProfile}
              onSaveCheckin={handleSaveCheckin}
              onSaveMeasurements={handleSaveMeasurements}
            />
          )}

          {activeView === "couple" && (
            <CoupleView
              roniProfile={roniProfile}
              camilaProfile={camilaProfile}
              challenges={coupleChallenges}
              onUpdateChallenges={setCoupleChallenges}
              totalKmCombined={statsThisWeek.combinedKm}
            />
          )}
        </div>
      </main>

      {/* Profile Switcher Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#111411] border border-white/5 rounded-[28px] p-6 md:p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#202520] hover:bg-[#303830] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ×
            </button>
            <h3 className="text-2xl font-black text-white font-display mb-1">
              Quem vai usar o CA.RO LIFE?
            </h3>
            <p className="text-[#9ca39d] text-sm mb-6">
              Os treinos, metas de peso, percursos de corrida e históricos são totalmente separados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSwitchProfile("male")}
                className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[160px] ${
                  currentProfileId === "male"
                    ? "bg-[#182019] border-[#c7ff4a] shadow-[0_4px_20px_rgba(199,255,74,0.1)]"
                    : "bg-[#171b18] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="text-4xl">♂</div>
                <div>
                  <b className="text-white text-base block font-bold">Roni</b>
                  <span className="text-[#9ca39d] text-xs block mt-1">
                    Perfil masculino · foco em força, musculação e condicionamento.
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleSwitchProfile("female")}
                className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[160px] ${
                  currentProfileId === "female"
                    ? "bg-[#1f1a1d] border-pink-500 shadow-[0_4px_20px_rgba(244,63,94,0.1)]"
                    : "bg-[#171b18] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="text-4xl">♀</div>
                <div>
                  <b className="text-white text-base block font-bold">Camila</b>
                  <span className="text-[#9ca39d] text-xs block mt-1">
                    Perfil feminino · foco em pernas, glúteos, definição e rotina saudável.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
