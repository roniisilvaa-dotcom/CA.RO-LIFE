import { UserProfile, CoupleChallenge } from "./types";

export const initialRoniProfile: UserProfile = {
  id: "male",
  name: "Roni",
  gender: "male",
  type: "Perfil masculino",
  targetGoal: "condicionamento físico, caminhada, ganho de força e rotina saudável",
  currentWeight: 84.5,
  height: 182,
  streakDays: 0,
  aiInsights: "Seja bem-vindo ao CA.RO LIFE! Registre suas primeiras atividades e check-ins para que a Inteligência Artificial comece a gerar seus insights semanais personalizados.",
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
  activities: [],
  checkins: [],
  measurements: [],
  routine: [
    {
      id: "rot-roni-1",
      time: "20:15",
      title: "Treino de Musculação",
      description: "Ficha de Segunda-feira (Peito e Tríceps).",
      completed: false,
      category: "workout"
    },
    {
      id: "rot-roni-2",
      time: "21:15",
      title: "Caminhada Funcional",
      description: "Caminhada leve ao redor de Alphaville.",
      completed: false,
      category: "cardio"
    },
    {
      id: "rot-roni-3",
      time: "22:00",
      title: "Ceia Proteica",
      description: "Meta de hidratação e refeição proteica final.",
      completed: false,
      category: "health"
    },
    {
      id: "rot-roni-4",
      time: "22:30",
      title: "Check-in da Noite & Sono",
      description: "Registrar humor, disposição e sono.",
      completed: false,
      category: "health"
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
  streakDays: 0,
  aiInsights: "Seja bem-vinda ao CA.RO LIFE! Registre suas primeiras atividades e check-ins para que a Inteligência Artificial comece a gerar seus insights semanais personalizados.",
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
  activities: [],
  checkins: [],
  measurements: [],
  routine: [
    {
      id: "rot-camila-1",
      time: "20:15",
      title: "Treino de Musculação",
      description: "Ficha de Segunda-feira (Pernas e Glúteos).",
      completed: false,
      category: "workout"
    },
    {
      id: "rot-camila-2",
      time: "21:15",
      title: "Caminhada Funcional",
      description: "Caminhada leve ao redor de Alphaville.",
      completed: false,
      category: "cardio"
    },
    {
      id: "rot-camila-3",
      time: "22:00",
      title: "Ceia Proteica",
      description: "Meta de hidratação e refeição proteica final.",
      completed: false,
      category: "health"
    },
    {
      id: "rot-camila-4",
      time: "22:30",
      title: "Check-in da Noite & Sono",
      description: "Registrar humor, disposição e sono.",
      completed: false,
      category: "health"
    }
  ]
};

export const initialCoupleChallenges: CoupleChallenge[] = [
  {
    id: "challenge-1",
    title: "Meta de Quilometragem Semanal",
    description: "Caminhar ou correr 40 km juntos esta semana.",
    targetValue: 40.0,
    currentValue: 0,
    unit: "km",
    completed: false
  },
  {
    id: "challenge-2",
    title: "Dias Ativos em Casal",
    description: "Sincronizar treinos ou caminhadas no mesmo dia por 5 dias.",
    targetValue: 5,
    currentValue: 0,
    unit: "dias",
    completed: false
  },
  {
    id: "challenge-3",
    title: "Total de Calorias Queimadas",
    description: "Alcançar 3.000 kcal em atividades aeróbicas conjuntas.",
    targetValue: 3000,
    currentValue: 0,
    unit: "kcal",
    completed: false
  }
];
