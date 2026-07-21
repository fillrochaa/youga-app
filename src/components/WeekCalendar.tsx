import { useEffect, useRef } from "react";
import { PRESCRIPTION, todayISO } from "../data/schedule";

interface Props {
  selectedDate: string;
  onSelect: (date: string) => void;
}

interface DayCell {
  iso: string;
  weekdayLabel: string;
  dayNumber: number;
  monthLabel: string;
  hasSession: boolean;
}

const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTH_LABELS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function buildDays(): DayCell[] {
  const dates = PRESCRIPTION.sessions.map((s) => s.date).sort();
  const first = new Date(dates[0] + "T00:00:00");
  const last = new Date(dates[dates.length - 1] + "T00:00:00");
  const sessionDates = new Set(dates);

  const days: DayCell[] = [];
  const cursor = new Date(first);
  while (cursor <= last) {
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    days.push({
      iso,
      weekdayLabel: WEEKDAY_LABELS[cursor.getDay()],
      dayNumber: cursor.getDate(),
      monthLabel: MONTH_LABELS[cursor.getMonth()],
      hasSession: sessionDates.has(iso),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const DAYS = buildDays();

export function WeekCalendar({ selectedDate, onSelect }: Props) {
  const stripRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Centraliza o dia selecionado no primeiro render
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  const today = todayISO();

  return (
    <section className="fade-up" style={{ animationDelay: "0.1s", marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <h2 className="display" style={{ fontSize: 22 }}>
          Cronograma
        </h2>
        <span className="script" style={{ fontSize: 24 }}>
          sua jornada
        </span>
      </div>

      <div
        ref={stripRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "4px 2px 10px",
          scrollSnapType: "x proximity",
        }}
      >
        {DAYS.map((d) => {
          const isSelected = d.iso === selectedDate;
          const isToday = d.iso === today;
          return (
            <button
              key={d.iso}
              ref={isSelected ? selectedRef : undefined}
              onClick={() => onSelect(d.iso)}
              className={isSelected ? "glass-strong glass" : "glass"}
              style={{
                scrollSnapAlign: "center",
                flex: "0 0 auto",
                width: 62,
                padding: "12px 0 10px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                border: isSelected
                  ? "1.5px solid var(--cocoa-900)"
                  : "1px solid var(--glass-border)",
                background: isSelected
                  ? "var(--cocoa-900)"
                  : "var(--glass-bg)",
                color: isSelected ? "var(--cream)" : "var(--cocoa-900)",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              <span
                className="eyebrow"
                style={{
                  fontSize: 10,
                  color: isSelected ? "var(--sand-200)" : "var(--taupe-600)",
                }}
              >
                {d.weekdayLabel}
              </span>
              <span style={{ fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                {d.dayNumber}
              </span>
              <span
                className="thin"
                style={{
                  fontSize: 10,
                  color: isSelected ? "var(--sand-200)" : "var(--taupe-600)",
                }}
              >
                {d.monthLabel}
              </span>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  marginTop: 2,
                  background: d.hasSession
                    ? isSelected
                      ? "var(--clay-400)"
                      : "var(--clay-500)"
                    : "transparent",
                }}
              />
              {isToday && (
                <span
                  className="eyebrow"
                  style={{
                    fontSize: 8,
                    marginTop: 1,
                    color: isSelected ? "var(--clay-400)" : "var(--clay-500)",
                  }}
                >
                  hoje
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
