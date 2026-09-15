import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "../lib/auth";

/**
 * Envolve o app: sem sessão mostra o login; com sessão libera o conteúdo.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <>
        <div className="app-bg" aria-hidden />
        <div className="auth-shell">
          <p className="script" style={{ fontSize: 40 }}>
            youga
          </p>
        </div>
      </>
    );
  }

  if (!session) return <Login />;
  return <>{children}</>;
}

type Mode = "signin" | "signup";

function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { needsConfirmation } = await signUp(email, password, fullName);
        if (needsConfirmation) {
          setNotice(
            "Conta criada! Confirme pelo link enviado ao seu email para entrar.",
          );
          setMode("signin");
        }
        // Se não precisa de confirmação, o onAuthStateChange já loga e troca a tela.
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(translateError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="app-bg" aria-hidden />
      <div className="auth-shell">
        <header className="auth-head fade-up">
          <p className="script" style={{ fontSize: 34 }}>
            respire fundo,
          </p>
          <h1 className="display" style={{ fontSize: 52 }}>
            YOUGA
          </h1>
          <p className="thin" style={{ fontSize: 15, color: "var(--taupe-600)" }}>
            sua receita de bem-estar,{" "}
            <span className="script" style={{ fontSize: 22 }}>
              em movimento
            </span>
          </p>
        </header>

        <form className="glass glass-strong auth-card fade-up" onSubmit={onSubmit}>
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              className={mode === "signin" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
            >
              Criar conta
            </button>
          </div>

          {mode === "signup" && (
            <label className="auth-field">
              <span className="eyebrow">Nome</span>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Como quer ser chamada"
                required
              />
            </label>
          )}

          <label className="auth-field">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </label>

          <label className="auth-field">
            <span className="eyebrow">Senha</span>
            <input
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-msg error">{error}</p>}
          {notice && <p className="auth-msg notice">{notice}</p>}

          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? "Um instante…" : mode === "signup" ? "Começar" : "Entrar"}
          </button>
        </form>

        <p className="thin auth-foot">
          {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
          >
            {mode === "signin" ? "Criar agora" : "Entrar"}
          </button>
        </p>
      </div>
    </>
  );
}

function translateError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/invalid login credentials/i.test(msg))
    return "Email ou senha incorretos.";
  if (/user already registered/i.test(msg))
    return "Esse email já tem conta. Tente entrar.";
  if (/password should be at least/i.test(msg))
    return "A senha precisa de pelo menos 6 caracteres.";
  if (/email.*invalid|invalid.*email/i.test(msg))
    return "Email inválido.";
  if (/rate limit|too many/i.test(msg))
    return "Muitas tentativas. Aguarde um pouco e tente de novo.";
  return msg;
}
