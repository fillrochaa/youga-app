import { PRESCRIPTION } from "../data/schedule";
import { useAuth } from "../lib/auth";

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full;
}

export function Header() {
  const { user, signOut } = useAuth();

  const metaName = (user?.user_metadata?.full_name as string | undefined)?.trim();
  const name = metaName ? firstName(metaName) : PRESCRIPTION.patientName;

  return (
    <header
      className="fade-up"
      style={{
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div>
        <p className="script" style={{ fontSize: 34, marginBottom: 2 }}>
          namastê,
        </p>
        <h1 className="display" style={{ fontSize: 52 }}>
          {name}
        </h1>
        <p
          className="thin"
          style={{ fontSize: 15, marginTop: 8, color: "var(--cocoa-700)" }}
        >
          Flua livremente.{" "}
          <span className="script" style={{ fontSize: 22 }}>
            viva com atenção.
          </span>
        </p>
      </div>

      <button
        className="btn-icon"
        style={{ flexShrink: 0 }}
        onClick={() => signOut()}
        aria-label="Sair da conta"
        title="Sair"
      >
        ⏻
      </button>
    </header>
  );
}
