import { PRESCRIPTION } from "../data/schedule";

interface Props {
  completedCount: number;
  totalCount: number;
}

export function PrescriptionCard({ completedCount, totalCount }: Props) {
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <section
      className="glass fade-up"
      style={{ padding: 20, marginBottom: 24, animationDelay: "0.05s" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="eyebrow">Sua receita de bem-estar</p>
          <p style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>
            {PRESCRIPTION.goal}
          </p>
          <p className="thin" style={{ fontSize: 13, marginTop: 4, color: "var(--taupe-600)" }}>
            {PRESCRIPTION.doctorName} · {PRESCRIPTION.weeks} semanas
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 64,
          }}
        >
          <span className="display" style={{ fontSize: 30 }}>
            {pct}%
          </span>
          <span className="eyebrow" style={{ fontSize: 9 }}>
            concluído
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 6,
          borderRadius: 999,
          background: "rgba(74,61,49,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, var(--clay-400), var(--clay-500))",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </section>
  );
}
