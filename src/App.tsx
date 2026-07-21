import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { PrescriptionCard } from "./components/PrescriptionCard";
import { WeekCalendar } from "./components/WeekCalendar";
import { SessionList } from "./components/SessionList";
import { Player } from "./components/Player";
import {
  PRESCRIPTION,
  sessionsByDate,
  todayISO,
  type ScheduledSession,
} from "./data/schedule";
import { getCompleted, toggleCompleted } from "./lib/storage";

const WEEKDAY_FULL = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [openSession, setOpenSession] = useState<ScheduledSession | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(() => getCompleted());

  const daySessions = useMemo(
    () => sessionsByDate(selectedDate),
    [selectedDate],
  );

  const dayLabel = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    return `${WEEKDAY_FULL[d.getDay()]}, ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [selectedDate]);

  return (
    <>
      <div className="app-bg" aria-hidden />
      <div className="shell">
        <Header />
        <PrescriptionCard
          completedCount={completed.size}
          totalCount={PRESCRIPTION.sessions.length}
        />
        <WeekCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 12,
          }}
        >
          <h2 className="display" style={{ fontSize: 22 }}>
            Aulas do dia
          </h2>
          <span className="thin" style={{ fontSize: 13, color: "var(--taupe-600)" }}>
            {dayLabel}
          </span>
        </div>

        <SessionList
          sessions={daySessions}
          completed={completed}
          onOpen={setOpenSession}
        />
      </div>

      {openSession && (
        <Player
          session={openSession}
          isDone={completed.has(openSession.key)}
          onToggleDone={() =>
            setCompleted(new Set(toggleCompleted(openSession.key)))
          }
          onClose={() => setOpenSession(null)}
        />
      )}
    </>
  );
}
