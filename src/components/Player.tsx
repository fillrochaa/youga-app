import { useEffect } from "react";
import type { ScheduledSession } from "../data/schedule";

interface Props {
  session: ScheduledSession;
  isDone: boolean;
  onToggleDone: () => void;
  onClose: () => void;
}

const WEEKDAY_FULL = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

export function Player({ session, isDone, onToggleDone, onClose }: Props) {
  const { yogaClass } = session;
  const date = new Date(session.date + "T00:00:00");
  const dateLabel = `${WEEKDAY_FULL[date.getDay()]}, ${date.getDate()}/${String(date.getMonth() + 1).padStart(2, "0")}`;

  // Trava o scroll do fundo enquanto o player está aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--cocoa-900)",
        display: "flex",
        flexDirection: "column",
        animation: "slide-in 0.3s ease both",
      }}
    >
      {/* Vídeo vertical ocupando o máximo da tela */}
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <iframe
          key={yogaClass.videoId}
          src={`https://www.youtube.com/embed/${yogaClass.videoId}?playsinline=1&rel=0&modestbranding=1&autoplay=1`}
          title={yogaClass.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />

        {/* Barra superior em vidro */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "calc(12px + var(--safe-top)) 16px 12px",
            pointerEvents: "none",
          }}
        >
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Voltar"
            style={{ pointerEvents: "auto" }}
          >
            ←
          </button>
        </div>
      </div>

      {/* Painel de informações em vidro escuro */}
      <div
        style={{
          background: "var(--glass-bg-dark)",
          borderTop: "1px solid var(--glass-border-dark)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          padding: `18px 20px calc(18px + var(--safe-bottom))`,
          color: "var(--cream)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p className="eyebrow" style={{ color: "var(--sand-200)" }}>
            {dateLabel} · {session.time}
          </p>
          <span className="script" style={{ fontSize: 22, color: "var(--clay-400)" }}>
            {yogaClass.intensity.toLowerCase()}
          </span>
        </div>

        <h2 className="display" style={{ fontSize: 30, color: "var(--cream)", marginTop: 6 }}>
          {yogaClass.title}
        </h2>

        <p className="thin" style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.55, color: "var(--sand-200)" }}>
          <strong style={{ fontWeight: 700 }}>Nota da médica: </strong>
          {yogaClass.doctorNote}
        </p>

        <button
          onClick={onToggleDone}
          className={`btn-primary${isDone ? " done" : ""}`}
          style={{ marginTop: 16, background: isDone ? "var(--olive-500)" : "var(--clay-500)" }}
        >
          {isDone ? "✓ Aula concluída" : "Concluir aula"}
        </button>
      </div>
    </div>
  );
}
