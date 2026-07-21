import type { ScheduledSession } from "../data/schedule";

interface Props {
  sessions: ScheduledSession[];
  completed: Set<string>;
  onOpen: (session: ScheduledSession) => void;
}

const INTENSITY_COLOR: Record<string, string> = {
  Suave: "var(--olive-500)",
  Moderada: "var(--clay-400)",
  Intensa: "var(--clay-500)",
};

export function SessionList({ sessions, completed, onOpen }: Props) {
  if (sessions.length === 0) {
    return (
      <div
        className="glass fade-up"
        style={{ padding: 28, textAlign: "center" }}
      >
        <p className="script" style={{ fontSize: 30 }}>
          dia de descanso
        </p>
        <p className="thin" style={{ fontSize: 14, marginTop: 6, color: "var(--taupe-600)" }}>
          Nenhuma aula prescrita para este dia. Aproveite para relaxar.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {sessions.map((s, i) => {
        const isDone = completed.has(s.key);
        return (
          <button
            key={s.key}
            onClick={() => onOpen(s)}
            className="glass fade-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              textAlign: "left",
              animationDelay: `${0.12 + i * 0.05}s`,
              opacity: isDone ? 0.75 : 1,
            }}
          >
            {/* Horário */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 56,
                paddingRight: 14,
                borderRight: "1px solid rgba(74,61,49,0.15)",
              }}
            >
              <span className="display" style={{ fontSize: 20 }}>
                {s.time}
              </span>
              <span className="thin" style={{ fontSize: 11, color: "var(--taupe-600)" }}>
                {s.yogaClass.durationMin} min
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 750, fontSize: 16, lineHeight: 1.2 }}>
                {s.yogaClass.title}
              </p>
              <p className="thin" style={{ fontSize: 13, marginTop: 3, color: "var(--cocoa-700)" }}>
                {s.yogaClass.focus}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 7,
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--cream)",
                  background: INTENSITY_COLOR[s.yogaClass.intensity],
                }}
              >
                {s.yogaClass.intensity}
              </span>
            </div>

            {/* Status / play */}
            <div
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                flexShrink: 0,
                background: isDone ? "var(--olive-500)" : "var(--cocoa-900)",
                color: "var(--cream)",
                fontSize: isDone ? 16 : 13,
              }}
            >
              {isDone ? "✓" : "▶"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
