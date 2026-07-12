import { UserProfile, CoupleChallenge, RoutineItem } from "./types";

const createDailyRoutine = (gender: "male" | "female", day: string, workoutName: string): RoutineItem[] => {
  const isRest = workoutName.toLowerCase().includes("descanso");
  const routine: RoutineItem[] = [
    {
      id: `rot-${gender}-${day}-1`,
      time: "05:00",
      title: "Despertar & Hidratação 💧",
      description: "Acordar e tomar 500ml de água imediatamente.",
      completed: false,
      category: "health" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-2`,
      time: "05:30",
      title: "Planejamento Diário 📚",
      description: "Foco mental, leitura ou organização do dia.",
      completed: false,
      category: "other" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-3`,
      time: "06:30",
      title: "Café da Manhã Saudável 🍳",
      description: "Refeição nutritiva e limpa para iniciar o dia.",
      completed: false,
      category: "health" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-4`,
      time: "08:00",
      title: "Foco Produtivo 💻",
      description: "Início das atividades de trabalho ou estudos.",
      completed: false,
      category: "other" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-5`,
      time: "12:30",
      title: "Almoço Balanceado 🥗",
      description: "Proteínas magras, vegetais e carboidratos complexos.",
      completed: false,
      category: "health" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-6`,
      time: "15:00",
      title: "Hidratação da Tarde 🥤",
      description: "Beber mais 1 litro de água para manter o foco.",
      completed: false,
      category: "health" as const,
      day
    }
  ];

  if (!isRest) {
    routine.push(
      {
        id: `rot-${gender}-${day}-7`,
        time: "18:30",
        title: `Musculação: ${workoutName} 🏋️‍♂️`,
        description: "Treino planejado na academia.",
        completed: false,
        category: "workout" as const,
        day
      },
      {
        id: `rot-${gender}-${day}-8`,
        time: "20:00",
        title: "Caminhada Funcional 🏃‍♂️",
        description: "Meta de cardio leve de fim de tarde.",
        completed: false,
        category: "cardio" as const,
        day
      }
    );
  } else {
    routine.push(
      {
        id: `rot-${gender}-${day}-7`,
        time: "18:30",
        title: "Recuperação Ativa / Alongamento 🧘‍♂️",
        description: "Mobilidade ou caminhada leve opcional.",
        completed: false,
        category: "cardio" as const,
        day
      }
    );
  }

  routine.push(
    {
      id: `rot-${gender}-${day}-9`,
      time: "22:00",
      title: "Ceia Proteica 🥛",
      description: "Alimentação final leve para suporte muscular.",
      completed: false,
      category: "health" as const,
      day
    },
    {
      id: `rot-${gender}-${day}-10`,
      time: "22:30",
      title: "Desconexão & Sono 🛌",
      description: "Registrar humor/peso e preparar para o descanso.",
      completed: false,
      category: "health" as const,
      day
    }
  );

  return routine;
};

// Generate full weekly routine for Roni
const roniRoutine = [
  ...createDailyRoutine("male", "Seg", "Peito e Tríceps"),
  ...createDailyRoutine("male", "Ter", "Costas e Bíceps"),
  ...createDailyRoutine("male", "Qua", "Descanso"),
  ...createDailyRoutine("male", "Qui", "Pernas"),
  ...createDailyRoutine("male", "Sex", "Ombros e Abdômen"),
  ...createDailyRoutine("male", "Sáb", "Descanso"),
  ...createDailyRoutine("male", "Dom", "Descanso")
];

// Generate full weekly routine for Camila
const camilaRoutine = [
  ...createDailyRoutine("female", "Seg", "Pernas e Glúteos (Anterior)"),
  ...createDailyRoutine("female", "Ter", "Superiores"),
  ...createDailyRoutine("female", "Qua", "Descanso"),
  ...createDailyRoutine("female", "Qui", "Posterior e Glúteos"),
  ...createDailyRoutine("female", "Sex", "Descanso"),
  ...createDailyRoutine("female", "Sáb", "Descanso"),
  ...createDailyRoutine("female", "Dom", "Descanso")
];

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
  routine: roniRoutine
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
  routine: camilaRoutine
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
