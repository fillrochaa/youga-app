import { PRESCRIPTION } from "../data/schedule";

export function Header() {
  return (
    <header className="fade-up" style={{ marginBottom: 24 }}>
      <p className="script" style={{ fontSize: 34, marginBottom: 2 }}>
        namastê,
      </p>
      <h1 className="display" style={{ fontSize: 52 }}>
        {PRESCRIPTION.patientName}
      </h1>
      <p className="thin" style={{ fontSize: 15, marginTop: 8, color: "var(--cocoa-700)" }}>
        Flua livremente. <span className="script" style={{ fontSize: 22 }}>viva com atenção.</span>
      </p>
    </header>
  );
}
