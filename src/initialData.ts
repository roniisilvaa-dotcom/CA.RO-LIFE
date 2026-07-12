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
      id: "male-seg",
      name: "SEGUNDA — Peito e Tríceps",
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
          name: "Tríceps corda",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false },
            { weight: 25, reps: 12, completed: false }
          ]
        }
      ]
    },
    {
      id: "male-ter",
      name: "TERÇA — Costas e Bíceps",
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
          name: "Rosca direta na barra W",
          defaultDescription: "3 séries de 12 repetições",
          sets: [
            { weight: 10, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false }
          ]
        }
      ]
    },
    {
      id: "male-qua",
      name: "QUARTA — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
    },
    {
      id: "male-qui",
      name: "QUINTA — Pernas",
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
        }
      ]
    },
    {
      id: "male-sex",
      name: "SEXTA — Ombros e Abdômen",
      description: "Foco em deltoides e fortalecimento do core",
      exercises: [
        {
          id: "m-d-1",
          name: "Desenvolvimento de ombros",
          defaultDescription: "3 séries de 10 repetições",
          sets: [
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false },
            { weight: 12, reps: 10, completed: false }
          ]
        },
        {
          id: "m-d-2",
          name: "Elevação lateral",
          defaultDescription: "4 séries de 12 repetições",
          sets: [
            { weight: 8, reps: 12, completed: false },
            { weight: 8, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false },
            { weight: 10, reps: 12, completed: false }
          ]
        },
        {
          id: "m-d-3",
          name: "Abdominal supra",
          defaultDescription: "3 séries de 20 repetições",
          sets: [
            { weight: 0, reps: 20, completed: false },
            { weight: 0, reps: 20, completed: false },
            { weight: 0, reps: 20, completed: false }
          ]
        }
      ]
    },
    {
      id: "male-sab",
      name: "SÁBADO — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
    },
    {
      id: "male-dom",
      name: "DOMINGO — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
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
      title: "Treino do Dia",
      description: "Academia · Duração estimada de 50 minutos.",
      completed: false,
      category: "workout"
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
      id: "female-seg",
      name: "SEGUNDA — Pernas e Glúteos (Anterior)",
      description: "Ênfase em quadríceps, glúteo máximo e panturrilha",
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
        }
      ]
    },
    {
      id: "female-ter",
      name: "TERÇA — Superiores",
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
        }
      ]
    },
    {
      id: "female-qua",
      name: "QUARTA — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
    },
    {
      id: "female-qui",
      name: "QUINTA — Posterior e Glúteos",
      description: "Ênfase em isquiotibiais, glúteo médio e panturrilhas",
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
        }
      ]
    },
    {
      id: "female-sex",
      name: "SEXTA — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
    },
    {
      id: "female-sab",
      name: "SÁBADO — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
    },
    {
      id: "female-dom",
      name: "DOMINGO — Descanso",
      description: "Dia de descanso e recuperação muscular",
      exercises: []
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
      thighL: 52,
      thighR: 52,
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
      title: "Treino do Dia",
      description: "Academia · Duração estimada de 55 minutos.",
      completed: false,
      category: "workout"
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
    description: "Alcançar 3.000 kcal in atividades aeróbicas conjuntas.",
    targetValue: 3000,
    currentValue: 2150,
    unit: "kcal",
    completed: false
  }
];
