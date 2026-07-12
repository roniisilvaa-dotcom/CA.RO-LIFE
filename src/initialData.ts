import { UserProfile, CoupleChallenge } from "./types";

export const initialRoniProfile: UserProfile = {
  id: "male",
  name: "Roni",
  gender: "male",
  type: "Perfil masculino",
  targetGoal: "condicionamento físico, caminhada, ganho de força e rotina saudável",
  currentWeight: 84.5,
  height: 182,
  streakDays: 8,
  aiInsights: "**Análise IA Semanal — Roni**\n\n• **Progresso de Cardio:** Seu ritmo nas caminhadas em Alphaville melhorou 7% nas últimas sessões. Excelente constância!\n• **Musculação:** Se você conseguiu completar todas as repetições de supino com 22 kg, experimente subir para 24 kg na primeira série do próximo Treino A.\n• **Dica de Recuperação:** Com 7.5 horas de sono médio, seu corpo está se recuperando bem. Tente focar em hidratação pré-treino.",
  workoutPlans: [
    {
      id: "male-a",
      name: "Treino A — Peito e Tríceps",
      description: "Foco em peito, ombros anteriores e extensão de tríceps",
      exercises: [
        {
          id: "m-a-1",
          name: "Supino reto",
          defaultDescription: "4 séries de 10 repetições",
          sets: [
            { weight: 22, reps: 10, completed: false },
            { weight: 22, reps: 10, completed: false },
            { weight: 22, reps: 10, completed: false },
            { weight: 22, reps: 10, completed: false }
          ]
        },
        {
          id: "m-a-2",
          name: "Supino inclinado",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 18, reps: 12, completed: false },
            { weight: 18, reps: 12, completed: false },
            { weight: 18, reps: 12, completed: false }
          ]
        },
        {
          id: "m-a-3",
          name: "Crucifixo na máquina",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 35, reps: 12, completed: false },
            { weight: 35, reps: 12, completed: false },
            { weight: 35, reps: 12, completed: false }
          ]
        },
        {
          id: "m-a-4",
          name: "Desenvolvimento de ombros",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false }
          ]
        },
        {
          id: "m-a-5",
          name: "Tríceps corda",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false }
          ]
        },
        {
          id: "m-a-6",
          name: "Tríceps francês",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false }
          ]
        }
      ]
    },
    {
      id: "male-b",
      name: "Treino B — Costas e Bíceps",
      description: "Costas superiores, dorsais e flexão de cotovelo",
      exercises: [
        {
          id: "m-b-1",
          name: "Puxada frontal",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 45, reps: 12, completed: false },
            { weight: 45, reps: 12, completed: false },
            { weight: 45, reps: 12, completed: false },
            { weight: 45, reps: 12, completed: false }
          ]
        },
        {
          id: "m-b-2",
          name: "Remada baixa",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 40, reps: 12, completed: false },
            { weight: 40, reps: 12, completed: false },
            { weight: 40, reps: 12, completed: false }
          ]
        },
        {
          id: "m-b-3",
          name: "Remada unilateral (Serrote)",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 16, reps: 10, completed: false },
            { weight: 16, reps: 10, completed: false },
            { weight: 16, reps: 10, completed: false }
          ]
        },
        {
          id: "m-b-4",
          name: "Rosca direta na barra W",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 10, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false }
          ]
        },
        {
          id: "m-b-5",
          name: "Rosca alternada com halteres",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false }
          ]
        }
      ]
    },
    {
      id: "male-c",
      name: "Treino C — Pernas",
      description: "Membros inferiores: quadríceps, isquiotibiais e panturrilha",
      exercises: [
        {
          id: "m-c-1",
          name: "Agachamento livre",
          defaultDescription: "4 séries de 10 repetições",
          sets: [
            { weight: 30, reps: 10, completed: false },
            { weight: 30, reps: 10, completed: false },
            { weight: 35, reps: 10, completed: false },
            { weight: 35, reps: 10, completed: false }
          ]
        },
        {
          id: "m-c-2",
          name: "Leg Press 45º",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 120, reps: 12, completed: false },
            { weight: 140, reps: 12, completed: false },
            { weight: 140, reps: 12, completed: false },
            { weight: 140, reps: 12, completed: false }
          ]
        },
        {
          id: "m-c-3",
          name: "Cadeira extensora",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 45, reps: 12, completed: false },
            { weight: 45, reps: 12, completed: false },
            { weight: 50, reps: 12, completed: false }
          ]
        },
        {
          id: "m-c-4",
          name: "Mesa flexora",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 30, reps: 10, completed: false },
            { weight: 30, reps: 10, completed: false },
            { weight: 30, reps: 10, completed: false }
          ]
        },
        {
          id: "m-c-5",
          name: "Panturrilha sentado",
          defaultDescription: "4 séries de 15 repetições",
          sets: [
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false }
          ]
        }
      ]
    }
  ],
  activities: [
    {
      id: "act-roni-1",
      type: "Caminhada",
      title: "Caminhada em Alphaville",
      date: "2026-07-12",
      duration: "00:28:45",
      seconds: 1725,
      distance: 3.20,
      avgPace: "08:59/km",
      calories: 195,
      feeling: "otimo",
      isCouple: false,
      route: [
        { latitude: -23.4688, longitude: -46.8523, timestamp: Date.now() - 1725000, accuracy: 5 },
        { latitude: -23.4701, longitude: -46.8532, timestamp: Date.now() - 1500000, accuracy: 5 },
        { latitude: -23.4715, longitude: -46.8545, timestamp: Date.now() - 1200000, accuracy: 4 },
        { latitude: -23.4728, longitude: -46.8522, timestamp: Date.now() - 800000, accuracy: 6 },
        { latitude: -23.4705, longitude: -46.8510, timestamp: Date.now() - 400000, accuracy: 5 },
        { latitude: -23.4689, longitude: -46.8521, timestamp: Date.now(), accuracy: 4 }
      ]
    },
    {
      id: "act-roni-2",
      type: "Corrida",
      title: "Treino Livre - Lago",
      date: "2026-07-10",
      duration: "00:32:10",
      seconds: 1930,
      distance: 5.40,
      avgPace: "05:57/km",
      calories: 420,
      feeling: "bom",
      isCouple: false,
      route: []
    },
    {
      id: "act-roni-couple-1",
      type: "Caminhada",
      title: "Caminhada de Domingo (Casal)",
      date: "2026-07-09",
      duration: "00:52:12",
      seconds: 3132,
      distance: 5.80,
      avgPace: "09:00/km",
      calories: 320,
      feeling: "radiante",
      isCouple: true,
      route: []
    }
  ],
  checkins: [
    {
      date: "2026-07-12",
      sleepHours: 7.5,
      energyLevel: 8,
      mood: "focado",
      musclePain: 3,
      disposition: 8,
      weight: 84.5
    },
    {
      date: "2026-07-11",
      sleepHours: 8.0,
      energyLevel: 9,
      mood: "radiante",
      musclePain: 2,
      disposition: 9,
      weight: 84.4
    }
  ],
  measurements: [
    {
      date: "2026-07-12",
      weight: 84.5,
      chest: 104,
      waist: 89,
      hips: 98,
      thighL: 60,
      thighR: 60,
      armL: 38.5,
      armR: 39
    }
  ],
  routine: [
    {
      id: "rot-roni-1",
      time: "07:00",
      title: "Check-in Diário",
      description: "Peso, sono, energia e humor de manhã.",
      completed: true,
      category: "health"
    },
    {
      id: "rot-roni-2",
      time: "12:30",
      title: "Meta de Hidratação",
      description: "Consumir 2 litros de água até o início da tarde.",
      completed: true,
      category: "health"
    },
    {
      id: "rot-roni-3",
      time: "18:30",
      title: "Treino A — Peito e Tríceps",
      description: "Academia · Duração estimada de 50 minutos.",
      completed: false,
      category: "workout"
    },
    {
      id: "rot-roni-4",
      time: "19:30",
      title: "Caminhada leve",
      description: "3 km em ritmo leve ao redor do condomínio.",
      completed: false,
      category: "cardio"
    }
  ]
};

export const initialCamilaProfile: UserProfile = {
  id: "female",
  name: "Camila",
  gender: "female",
  type: "Perfil feminino",
  targetGoal: "condicionamento, definição, foco em pernas, glúteos e rotina saudável",
  currentWeight: 59.2,
  height: 165,
  streakDays: 6,
  aiInsights: "**Análise IA Semanal — Camila**\n\n• **Progresso de Cardio:** Constância fantástica! Suas caminhadas em Alphaville estão em ritmo excelente e estável.\n• **Membros Inferiores:** Mantenha a carga de 45 kg na elevação pélvica, mas tente focar na contração isométrica de 2 segundos no pico do movimento.\n• **Equilíbrio diário:** Ótimo aproveitamento de sono de 8 horas. Seu nível de disposição está excelente hoje.",
  workoutPlans: [
    {
      id: "female-a",
      name: "Treino A — Pernas e Glúteos (Foco Anterior)",
      description: "Enfase em quadríceps, glúteo máximo e panturrilha",
      exercises: [
        {
          id: "f-a-1",
          name: "Agachamento livre",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false }
          ]
        },
        {
          id: "f-a-2",
          name: "Elevação pélvica",
          defaultDescription: "4 séries de 10 repetições",
          sets: [
            { weight: 45, reps: 10, completed: false },
            { weight: 45, reps: 10, completed: false },
            { weight: 45, reps: 10, completed: false },
            { weight: 45, reps: 10, completed: false }
          ]
        },
        {
          id: "f-a-3",
          name: "Leg press 45º",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 80, reps: 12, completed: false },
            { weight: 80, reps: 12, completed: false },
            { weight: 90, reps: 12, completed: false },
            { weight: 90, reps: 12, completed: false }
          ]
        },
        {
          id: "f-a-4",
          name: "Cadeira abdutora",
          defaultDescription: "3 séries de 15 repetições",
          sets: [
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false },
            { weight: 40, reps: 15, completed: false }
          ]
        },
        {
          id: "f-a-5",
          name: "Stiff com halteres",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 12, reps: 12, completed: false },
            { weight: 12, reps: 12, completed: false },
            { weight: 12, reps: 12, completed: false }
          ]
        },
        {
          id: "f-a-6",
          name: "Panturrilha em pé",
          defaultDescription: "3 séries de 15 repetições",
          sets: [
            { weight: 10, reps: 15, completed: false },
            { weight: 10, reps: 15, completed: false },
            { weight: 10, reps: 15, completed: false }
          ]
        }
      ]
    },
    {
      id: "female-b",
      name: "Treino B — Superiores",
      description: "Treino completo de costas, peito, ombros e braços",
      exercises: [
        {
          id: "f-b-1",
          name: "Puxada frontal pulley",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false }
          ]
        },
        {
          id: "f-b-2",
          name: "Remada sentada máquina",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false }
          ]
        },
        {
          id: "f-b-3",
          name: "Desenvolvimento com halteres",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 6, reps: 10, completed: false },
            { weight: 6, reps: 10, completed: false },
            { weight: 6, reps: 10, completed: false }
          ]
        },
        {
          id: "f-b-4",
          name: "Elevação lateral",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 4, reps: 12, completed: false },
            { weight: 4, reps: 12, completed: false },
            { weight: 4, reps: 12, completed: false }
          ]
        },
        {
          id: "f-b-5",
          name: "Rosca martelo bíceps",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 6, reps: 12, completed: false },
            { weight: 6, reps: 12, completed: false },
            { weight: 6, reps: 12, completed: false }
          ]
        },
        {
          id: "f-b-6",
          name: "Tríceps pulley",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 15, reps: 12, completed: false },
            { weight: 15, reps: 12, completed: false },
            { weight: 15, reps: 12, completed: false }
          ]
        }
      ]
    },
    {
      id: "female-c",
      name: "Treino C — Posterior e Glúteos",
      description: "Enfase em isquiotibiais, glúteo médio e panturrilhas",
      exercises: [
        {
          id: "f-c-1",
          name: "Stiff barra",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false }
          ]
        },
        {
          id: "f-c-2",
          name: "Mesa flexora de pernas",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 20, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false }
          ]
        },
        {
          id: "f-c-3",
          name: "Agachamento sumô",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 16, reps: 12, completed: false },
            { weight: 16, reps: 12, completed: false },
            { weight: 20, reps: 12, completed: false }
          ]
        },
        {
          id: "f-c-4",
          name: "Glúteo coice na polia",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 15, reps: 12, completed: false },
            { weight: 15, reps: 12, completed: false },
            { weight: 15, reps: 12, completed: false }
          ]
        },
        {
          id: "f-c-5",
          name: "Cadeira abdutora inclinada",
          defaultDescription: "3 séries de 15 repetições",
          sets: [
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false },
            { weight: 35, reps: 15, completed: false }
          ]
        }
      ]
    }
  ],
  activities: [
    {
      id: "act-camila-1",
      type: "Caminhada",
      title: "Caminhada Leve Alphaville",
      date: "2026-07-12",
      duration: "00:25:10",
      seconds: 1510,
      distance: 2.50,
      avgPace: "10:04/km",
      calories: 140,
      feeling: "otimo",
      isCouple: false,
      route: [
        { latitude: -23.4690, longitude: -46.8525, timestamp: Date.now() - 1510000, accuracy: 5 },
        { latitude: -23.4700, longitude: -46.8530, timestamp: Date.now() - 1200000, accuracy: 4 },
        { latitude: -23.4710, longitude: -46.8540, timestamp: Date.now() - 900000, accuracy: 6 },
        { latitude: -23.4715, longitude: -46.8530, timestamp: Date.now() - 600000, accuracy: 5 },
        { latitude: -23.4691, longitude: -46.8524, timestamp: Date.now(), accuracy: 4 }
      ]
    },
    {
      id: "act-camila-2",
      type: "Caminhada",
      title: "Caminhada de Domingo (Casal)",
      date: "2026-07-09",
      duration: "00:52:12",
      seconds: 3132,
      distance: 5.80,
      avgPace: "09:00/km",
      calories: 240,
      feeling: "radiante",
      isCouple: true,
      route: []
    }
  ],
  checkins: [
    {
      date: "2026-07-12",
      sleepHours: 8.0,
      energyLevel: 9,
      mood: "radiante",
      musclePain: 2,
      disposition: 9,
      weight: 59.2
    }
  ],
  measurements: [
    {
      date: "2026-07-12",
      weight: 59.2,
      chest: 88,
      waist: 66,
      hips: 95,
      thighL: 54,
      thighR: 54,
      armL: 26,
      armR: 26.5
    }
  ],
  routine: [
    {
      id: "rot-camila-1",
      time: "07:00",
      title: "Check-in Diário",
      description: "Peso, sono, energia e humor de manhã.",
      completed: true,
      category: "health"
    },
    {
      id: "rot-camila-2",
      time: "12:30",
      title: "Meta de Hidratação",
      description: "Consumir 1,5 litros de água até o almoço.",
      completed: true,
      category: "health"
    },
    {
      id: "rot-camila-3",
      time: "18:30",
      title: "Treino de Pernas e Glúteos",
      description: "Academia · Duração estimada de 55 minutos.",
      completed: false,
      category: "workout"
    },
    {
      id: "rot-camila-4",
      time: "19:30",
      title: "Caminhada leve",
      description: "2,5 km em Alphaville.",
      completed: false,
      category: "cardio"
    }
  ]
};

export const initialCoupleChallenges: CoupleChallenge[] = [
  {
    id: "challenge-1",
    title: "Meta de Quilometragem Semanal",
    description: "Caminhar ou correr 40 km juntos esta semana.",
    targetValue: 40.0,
    currentValue: 31.4,
    unit: "km",
    completed: false
  },
  {
    id: "challenge-2",
    title: "Dias Ativos em Casal",
    description: "Sincronizar treinos ou caminhadas no mesmo dia por 5 dias.",
    targetValue: 5,
    currentValue: 4,
    unit: "dias",
    completed: false
  },
  {
    id: "challenge-3",
    title: "Total de Calorias Queimadas",
    description: "Alcançar 3.000 kcal em atividades aeróbicas conjuntas.",
    targetValue: 3000,
    currentValue: 2150,
    unit: "kcal",
    completed: false
  }
];
