import { createFileRoute } from "@tanstack/react-router";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  Zap,
  Flame,
  Heart,
  Wind,
  Move3d,
  ShieldAlert,
  Moon,
  TrendingUp,
  CircleDot,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitruvian Athlete OS — Cognitive Performance Dashboard" },
      {
        name: "description",
        content:
          "Elite human performance OS. Track biomotor symmetry, readiness, recovery and CNS load across six pillars.",
      },
    ],
  }),
  component: Dashboard,
});

// ---------- mock data ----------
const pillars = [
  { key: "strength", label: "Maximum Strength", value: 82, icon: Flame, color: "var(--chart-1)" },
  { key: "speed", label: "Speed", value: 71, icon: Zap, color: "var(--chart-2)" },
  { key: "power", label: "Power", value: 78, icon: Activity, color: "var(--chart-3)" },
  { key: "endurance", label: "Endurance", value: 64, icon: Heart, color: "var(--chart-4)" },
  { key: "agility", label: "Agility", value: 69, icon: Wind, color: "var(--chart-5)" },
  { key: "mobility", label: "Mobility", value: 58, icon: Move3d, color: "var(--chart-6)" },
];

const radarData = pillars.map((p) => ({ pillar: p.label.split(" ")[0], value: p.value, full: 100 }));

const trend = [
  { day: "Mon", readiness: 72, fatigue: 38, hrv: 64 },
  { day: "Tue", readiness: 78, fatigue: 42, hrv: 68 },
  { day: "Wed", readiness: 65, fatigue: 55, hrv: 58 },
  { day: "Thu", readiness: 81, fatigue: 30, hrv: 72 },
  { day: "Fri", readiness: 76, fatigue: 36, hrv: 70 },
  { day: "Sat", readiness: 70, fatigue: 44, hrv: 65 },
  { day: "Sun", readiness: 84, fatigue: 22, hrv: 76 },
];

const week = [
  { day: "MON", focus: "Power + Max Strength", cns: "High" },
  { day: "TUE", focus: "Speed + Agility", cns: "High" },
  { day: "WED", focus: "HIIT Endurance", cns: "Medium" },
  { day: "THU", focus: "Mobility + Active Recovery", cns: "Low" },
  { day: "FRI", focus: "Upper Strength + Power", cns: "High" },
  { day: "SAT", focus: "Aerobic Base / LISS", cns: "Low" },
  { day: "SUN", focus: "Full Recovery", cns: "—" },
];

// ---------- derived ----------
const avg = Math.round(pillars.reduce((s, p) => s + p.value, 0) / pillars.length);
const max = Math.max(...pillars.map((p) => p.value));
const min = Math.min(...pillars.map((p) => p.value));
const asymmetry = max - min;
const weakest = pillars.find((p) => p.value === min)!;
const strongest = pillars.find((p) => p.value === max)!;
const readiness = 81;
const fatigue = 30;
const hrv = 72;

// ---------- ui ----------
function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <BackdropGrid />
      <header className="relative z-10 border-b border-border/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <VitruvianMark />
            <div>
              <h1 className="font-display text-lg tracking-[0.2em] text-primary">
                VITRUVIAN ATHLETE OS
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Cognitive Performance Architecture · v1.0
              </p>
            </div>
          </div>
          <div className="hidden gap-6 md:flex">
            <NavItem active>Dashboard</NavItem>
            <NavItem>Training</NavItem>
            <NavItem>Recovery</NavItem>
            <NavItem>Nutrition</NavItem>
            <NavItem>Analytics</NavItem>
          </div>
          <div className="flex items-center gap-3">
            <StatusDot label="All systems nominal" />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] space-y-6 px-6 py-8">
        {/* HERO STRIP */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Symmetry Index"
            value={`${avg}%`}
            sub={`σ asymmetry ${asymmetry}pts`}
            tone={asymmetry > 25 ? "warn" : "ok"}
            icon={CircleDot}
          />
          <MetricCard
            label="Readiness"
            value={`${readiness}`}
            sub="HRV-adjusted · AM"
            tone="ok"
            icon={TrendingUp}
          />
          <MetricCard
            label="CNS Fatigue"
            value={`${fatigue}%`}
            sub="Velocity loss 6.2%"
            tone={fatigue > 60 ? "warn" : "ok"}
            icon={ShieldAlert}
          />
          <MetricCard
            label="HRV (rMSSD)"
            value={`${hrv}ms`}
            sub="7d baseline 68ms"
            tone="ok"
            icon={Moon}
          />
        </section>

        {/* RADAR + PILLARS */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel
              eyebrow="Biomotor Geometry"
              title="The Vitruvian Radar"
              hint="Six pillars · target symmetry"
            >
              <div className="relative h-[420px] w-full">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[78%] w-[78%] rounded-full border border-primary/10" />
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="78%">
                    <PolarGrid stroke="var(--primary)" strokeOpacity={0.18} />
                    <PolarAngleAxis
                      dataKey="pillar"
                      tick={{
                        fill: "var(--foreground)",
                        fontSize: 11,
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.15em",
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                      stroke="var(--primary)"
                      strokeOpacity={0.1}
                    />
                    <Radar
                      dataKey="full"
                      stroke="var(--primary)"
                      strokeOpacity={0.25}
                      strokeDasharray="3 4"
                      fill="transparent"
                    />
                    <Radar
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="var(--primary)"
                      fillOpacity={0.18}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                <span>
                  Strongest: <span className="text-primary">{strongest.label}</span>
                </span>
                <span>
                  Weakest: <span className="text-accent">{weakest.label}</span>
                </span>
                <span>Polygon area · 0.62 / 1.00</span>
              </div>
            </Panel>
          </div>

          <div className="space-y-3">
            {pillars.map((p) => (
              <PillarRow key={p.key} pillar={p} />
            ))}
          </div>
        </section>

        {/* TRENDS + ALERTS */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel
              eyebrow="Adaptive Telemetry"
              title="7-Day Autoregulation"
              hint="Readiness · Fatigue · HRV"
            >
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                    <XAxis
                      dataKey="day"
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="readiness"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="fatigue"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="hrv"
                      stroke="var(--chart-4)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Legend />
            </Panel>
          </div>

          <Panel eyebrow="Cognitive Layer" title="System Advisories">
            <ul className="space-y-3 text-sm">
              <Advisory
                tone="warn"
                title="Mobility lagging"
                body="Pillar at 58% vs strongest 82% — schedule 2× corrective sessions this micro-cycle."
              />
              <Advisory
                tone="ok"
                title="Recovery sustainable"
                body="HRV +6% vs 7d baseline. Cleared for AM speed work."
              />
              <Advisory
                tone="info"
                title="Interference watch"
                body="Maintain ≥6h between today's strength and Wed HIIT to protect adaptation."
              />
              <Advisory
                tone="ok"
                title="Nutrition adherence"
                body="EPA/DHA + polyphenol load on target. ROS reduction window optimal."
              />
            </ul>
          </Panel>
        </section>

        {/* WEEK MATRIX */}
        <section>
          <Panel
            eyebrow="Hyper-Periodized Engine"
            title="Weekly Distribution Matrix"
            hint="CNS-load balanced"
          >
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
              {week.map((d) => (
                <div
                  key={d.day}
                  className="group rounded-md border border-border/60 bg-card/40 p-3 transition hover:border-primary/60"
                >
                  <div className="font-display text-xs tracking-[0.25em] text-primary">{d.day}</div>
                  <div className="mt-2 text-sm leading-tight text-foreground">{d.focus}</div>
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>CNS</span>
                    <span
                      className={
                        d.cns === "High"
                          ? "text-accent"
                          : d.cns === "Medium"
                            ? "text-primary"
                            : "text-muted-foreground"
                      }
                    >
                      {d.cns}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <footer className="pb-8 pt-4 text-center text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          Safety · Science · Symmetry · Sustainability
        </footer>
      </main>
    </div>
  );
}

// ---------- pieces ----------
function BackdropGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 75%)",
      }}
    />
  );
}

function VitruvianMark() {
  return (
    <div className="relative grid h-10 w-10 place-items-center rounded-full border border-primary/60">
      <div className="absolute inset-1 rounded-full border border-primary/30" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}

function NavItem({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href="#"
      className={`text-xs uppercase tracking-[0.25em] transition hover:text-primary ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </a>
  );
}

function StatusDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
    </div>
  );
}

function Panel({
  children,
  eyebrow,
  title,
  hint,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <h2 className="font-display text-base tracking-[0.15em] text-foreground">{title}</h2>
        </div>
        {hint && (
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {hint}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "ok" | "warn";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
        <Icon
          className={`h-4 w-4 ${tone === "warn" ? "text-accent" : "text-primary"}`}
        />
      </div>
      <div className="mt-3 font-display text-3xl text-foreground">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
      <div
        className={`absolute bottom-0 left-0 h-[2px] w-full ${
          tone === "warn" ? "bg-accent/60" : "bg-primary/60"
        }`}
      />
    </div>
  );
}

function PillarRow({
  pillar,
}: {
  pillar: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string };
}) {
  const { label, value, icon: Icon, color } = pillar;
  return (
    <div className="rounded-md border border-border/60 bg-card/40 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          <span className="font-display text-xs tracking-[0.2em] text-foreground">
            {label.toUpperCase()}
          </span>
        </div>
        <span className="font-display text-sm" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Advisory({
  tone,
  title,
  body,
}: {
  tone: "ok" | "warn" | "info";
  title: string;
  body: string;
}) {
  const color =
    tone === "warn" ? "var(--accent)" : tone === "ok" ? "var(--chart-4)" : "var(--primary)";
  return (
    <li className="border-l-2 pl-3" style={{ borderColor: color }}>
      <div
        className="font-display text-[11px] uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}

function Legend() {
  const items = [
    { l: "Readiness", c: "var(--chart-1)" },
    { l: "Fatigue", c: "var(--chart-2)" },
    { l: "HRV", c: "var(--chart-4)" },
  ];
  return (
    <div className="mt-3 flex items-center gap-5 border-t border-border/50 pt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {items.map((i) => (
        <div key={i.l} className="flex items-center gap-2">
          <span className="h-[2px] w-5" style={{ background: i.c }} />
          {i.l}
        </div>
      ))}
    </div>
  );
}
