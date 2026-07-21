// ============================================
// Receita de bem-estar (dados mockados)
// Simula a programação criada pela médica.
// ============================================

export interface YogaClass {
  id: string;
  title: string;
  focus: string;
  durationMin: number;
  intensity: "Suave" | "Moderada" | "Intensa";
  videoId: string; // YouTube video ID (vídeo vertical)
  doctorNote: string;
}

export interface ScheduledSession {
  /** id único da sessão = date + classId */
  key: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  yogaClass: YogaClass;
}

export interface Prescription {
  doctorName: string;
  patientName: string;
  weeks: number;
  goal: string;
  sessions: ScheduledSession[];
}

// ---------- Aulas do programa ----------
const CLASSES: Record<string, YogaClass> = {
  despertar: {
    id: "despertar",
    title: "Despertar Suave",
    focus: "Mobilidade matinal",
    durationMin: 15,
    intensity: "Suave",
    videoId: "v7AYKMP6rOE",
    doctorNote:
      "Comece o dia ativando a circulação com movimentos lentos. Respire pelo nariz durante toda a prática.",
  },
  alongamento: {
    id: "alongamento",
    title: "Alongamento Profundo",
    focus: "Coluna & quadril",
    durationMin: 20,
    intensity: "Moderada",
    videoId: "g_tea8ZNk5A",
    doctorNote:
      "Prescrito para aliviar a tensão lombar acumulada. Não force além do confortável.",
  },
  forca: {
    id: "forca",
    title: "Força & Equilíbrio",
    focus: "Core & pernas",
    durationMin: 25,
    intensity: "Intensa",
    videoId: "Eml2xnoLpYE",
    doctorNote:
      "Fortalecimento progressivo do core. Hidrate-se bem antes desta prática.",
  },
  respiracao: {
    id: "respiracao",
    title: "Respiração & Calma",
    focus: "Pranayama",
    durationMin: 12,
    intensity: "Suave",
    videoId: "aXItOY0sLRY",
    doctorNote:
      "Prática noturna para melhorar a qualidade do sono. Faça em ambiente silencioso.",
  },
  flow: {
    id: "flow",
    title: "Flow Energizante",
    focus: "Vinyasa",
    durationMin: 30,
    intensity: "Intensa",
    videoId: "9kOCY0KNByw",
    doctorNote:
      "Sequência fluida para condicionamento. Respeite as pausas sugeridas no vídeo.",
  },
  restaurativa: {
    id: "restaurativa",
    title: "Yoga Restaurativa",
    focus: "Relaxamento",
    durationMin: 20,
    intensity: "Suave",
    videoId: "BiWDsfZ3zbo",
    doctorNote:
      "Recuperação do fim de semana. Use uma almofada para apoiar os joelhos.",
  },
};

// ---------- Grade semanal (0 = domingo … 6 = sábado) ----------
const WEEKLY_PLAN: Array<{ weekday: number; time: string; classId: string }> = [
  { weekday: 1, time: "07:30", classId: "despertar" },
  { weekday: 2, time: "19:00", classId: "alongamento" },
  { weekday: 3, time: "07:30", classId: "forca" },
  { weekday: 4, time: "19:00", classId: "respiracao" },
  { weekday: 5, time: "07:30", classId: "flow" },
  { weekday: 6, time: "09:00", classId: "restaurativa" },
];

const WEEKS = 4;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Segunda-feira da semana corrente */
function mondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 dom … 6 sáb
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function buildSessions(): ScheduledSession[] {
  const start = mondayOfCurrentWeek();
  const sessions: ScheduledSession[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (const slot of WEEKLY_PLAN) {
      const d = new Date(start);
      // slot.weekday: 1(seg)…6(sáb) — offset a partir da segunda
      d.setDate(start.getDate() + w * 7 + (slot.weekday - 1));
      const date = toISODate(d);
      const yogaClass = CLASSES[slot.classId];
      sessions.push({
        key: `${date}_${yogaClass.id}`,
        date,
        time: slot.time,
        yogaClass,
      });
    }
  }
  return sessions;
}

export const PRESCRIPTION: Prescription = {
  doctorName: "Dra. Helena Costa",
  patientName: "Ana",
  weeks: WEEKS,
  goal: "Reduzir tensão e melhorar o sono",
  sessions: buildSessions(),
};

export function sessionsByDate(date: string): ScheduledSession[] {
  return PRESCRIPTION.sessions
    .filter((s) => s.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function todayISO(): string {
  return toISODate(new Date());
}
