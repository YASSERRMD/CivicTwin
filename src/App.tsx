import { type CSSProperties, type ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Building2,
  CircleAlert,
  Clock,
  Eye,
  Gauge,
  Layers3,
  Leaf,
  Map as MapIcon,
  Play,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { cn } from './lib/utils';

interface StaggeredFadeProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

interface FadeDownProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend: string;
}

interface FeaturePillProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface ProgressMetric {
  label: string;
  value: number;
}

const chartData = [
  { name: 'Mon', value: 78 },
  { name: 'Tue', value: 81 },
  { name: 'Wed', value: 80 },
  { name: 'Thu', value: 84 },
  { name: 'Fri', value: 86 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 88 },
];

const progressMetrics: ProgressMetric[] = [
  { label: 'Roads', value: 82 },
  { label: 'Waste', value: 91 },
  { label: 'Lighting', value: 76 },
  { label: 'Parks', value: 88 },
];

const stats = [
  {
    icon: <Layers3 className="h-4 w-4" aria-hidden="true" />,
    label: 'Assets Monitored',
    value: '48,230',
    trend: '+2.8% this week',
  },
  {
    icon: <CircleAlert className="h-4 w-4" aria-hidden="true" />,
    label: 'Live Incidents',
    value: '126',
    trend: '18 critical',
  },
  {
    icon: <Clock className="h-4 w-4" aria-hidden="true" />,
    label: 'SLA Compliance',
    value: '94.7%',
    trend: '+4.1% vs target',
  },
  {
    icon: <Zap className="h-4 w-4" aria-hidden="true" />,
    label: 'Energy Saved',
    value: '18.4%',
    trend: 'AED 2.1M avoided',
  },
];

const features: FeaturePillProps[] = [
  {
    icon: <Eye className="h-5 w-5" aria-hidden="true" />,
    title: 'AI Incident Detection',
    description:
      'Detect potholes, overflowing bins, graffiti, road damage, and public-space issues from city vehicles and citizen reports.',
  },
  {
    icon: <MapIcon className="h-5 w-5" aria-hidden="true" />,
    title: 'GIS Operational Layer',
    description:
      'Visualize municipal assets, teams, service zones, and incident density on a live geographic layer.',
  },
  {
    icon: <Truck className="h-5 w-5" aria-hidden="true" />,
    title: 'SLA & Dispatch Intelligence',
    description:
      'Prioritize cases, assign nearest teams, and track resolution performance across departments.',
  },
  {
    icon: <Leaf className="h-5 w-5" aria-hidden="true" />,
    title: 'Environmental Monitoring',
    description:
      'Track air quality, noise, energy usage, water flow, greenery, and urban heat indicators.',
  },
];

function StaggeredFade({ text, className, style }: StaggeredFadeProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.h1
      ref={ref}
      className={cn(
        'text-center text-xl font-bold leading-tight text-[#31463B] sm:text-4xl md:text-6xl md:leading-[4rem]',
        className,
      )}
      style={style}
      aria-label={text}
    >
      {text.split('').map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.025, duration: 0.35 }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function FadeDown({ children, delay = 0, className }: FadeDownProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="liquid-glass rounded-3xl p-4 lg:p-3"
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#31463B]/10 text-[#31463B]">
          {icon}
        </div>
        <span className="rounded-full bg-[#5A733C]/10 px-2 py-1 text-[0.64rem] font-semibold text-[#4E6B3A]">
          {trend}
        </span>
      </div>
      <div className="relative z-10 mt-4 lg:mt-3">
        <p className="text-2xl font-semibold text-[#263A2F] lg:text-xl">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium uppercase text-[#6F7C72]">
          {label}
        </p>
      </div>
    </motion.article>
  );
}

function CityMapMock() {
  const buildings = [
    'left-[9%] top-[18%] h-12 w-16',
    'left-[18%] top-[35%] h-14 w-12',
    'left-[32%] top-[17%] h-16 w-20',
    'left-[49%] top-[28%] h-12 w-14',
    'left-[65%] top-[15%] h-14 w-24',
    'left-[75%] top-[42%] h-16 w-16',
    'left-[55%] top-[62%] h-12 w-20',
    'left-[24%] top-[68%] h-14 w-16',
  ];

  const pins = [
    'left-[14%] top-[26%]',
    'left-[38%] top-[39%]',
    'left-[71%] top-[26%]',
    'left-[81%] top-[59%]',
    'left-[29%] top-[74%]',
  ];

  const incidents = [
    'left-[48%] top-[44%]',
    'left-[62%] top-[54%]',
    'left-[21%] top-[53%]',
  ];

  const mobilityDots = [
    'left-[41%] top-[61%]',
    'left-[45%] top-[58%]',
    'left-[50%] top-[55%]',
    'left-[55%] top-[51%]',
    'left-[58%] top-[48%]',
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.3 }}
      className="liquid-glass relative h-[320px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E9EFE6] via-[#F7F7F2] to-[#F8F2E4] lg:h-[420px]"
      role="img"
      aria-label="Generated digital twin map showing roads, service zones, mobility signals, and incidents"
    >
      <div className="absolute inset-0 map-grid opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_28%,rgba(90,115,60,0.16),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(207,169,86,0.18),transparent_26%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 900 520"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-20 370 C170 270 250 310 390 205 C520 106 650 180 930 70"
          stroke="#AFB889"
          strokeWidth="38"
          strokeLinecap="round"
          opacity="0.32"
        />
        <path
          d="M-20 370 C170 270 250 310 390 205 C520 106 650 180 930 70"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="20 20"
          opacity="0.76"
        />
        <path
          d="M100 530 C140 385 260 350 320 245 C382 138 420 76 590 -15"
          stroke="#D6C391"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M100 530 C140 385 260 350 320 245 C382 138 420 76 590 -15"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="16 18"
          opacity="0.68"
        />
        <path
          d="M-30 150 C170 126 250 175 360 260 C500 368 675 362 930 270"
          stroke="#9FB0B5"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.34"
        />
      </svg>

      {buildings.map((building) => (
        <div
          key={building}
          className={cn(
            'absolute rounded-xl border border-white/50 bg-white/55 shadow-[0_18px_38px_rgba(49,70,59,0.12)]',
            building,
          )}
        >
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-white/40 to-[#DDE7D7]/55" />
        </div>
      ))}

      {pins.map((pin, index) => (
        <div
          key={pin}
          className={cn(
            'absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#31463B] text-white shadow-[0_10px_30px_rgba(49,70,59,0.28)]',
            pin,
          )}
          style={{ animation: `pulseGlow 2.8s ${index * 0.24}s infinite` }}
        >
          <MapIcon className="h-4 w-4" aria-hidden="true" />
        </div>
      ))}

      {incidents.map((incident) => (
        <div
          key={incident}
          className={cn(
            'absolute h-3.5 w-3.5 rounded-full bg-[#C9813A] shadow-[0_0_0_7px_rgba(201,129,58,0.18)]',
            incident,
          )}
        />
      ))}

      {mobilityDots.map((dot, index) => (
        <div
          key={dot}
          className={cn(
            'absolute h-2.5 w-2.5 rounded-full bg-[#4E7C8A] shadow-[0_0_18px_rgba(78,124,138,0.35)]',
            dot,
          )}
          style={{ opacity: 0.55 + index * 0.08 }}
        />
      ))}

      <div className="absolute inset-y-0 left-[48%] w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-70 scan-beam" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.55 }}
        className="liquid-glass absolute bottom-5 left-5 w-[min(20rem,calc(100%-2.5rem))] rounded-2xl p-4 text-sm text-[#263A2F]"
      >
        <div className="relative z-10 flex items-center justify-between">
          <p className="font-semibold">Zone A-14</p>
          <span className="rounded-full bg-[#5A733C]/12 px-2.5 py-1 text-xs font-semibold text-[#4E6B3A]">
            Synced
          </span>
        </div>
        <div className="relative z-10 mt-3 grid gap-2 text-xs text-[#5C6B60]">
          <p>Infrastructure Health: 91%</p>
          <p>Waste Collection: On Track</p>
          <p>Mobility Flow: Moderate</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[#263A2F]">{payload[0].value}%</p>
      <p className="text-[#6F7C72]">City health</p>
    </div>
  );
}

function MiniDashboard() {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="liquid-glass rounded-3xl p-5 lg:p-4"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#31463B]">
            City Health Index
          </p>
          <p className="mt-2 text-4xl font-semibold text-[#263A2F]">87.6</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5A733C]/12 px-3 py-1.5 text-xs font-semibold text-[#4E6B3A]">
          <span className="h-2 w-2 rounded-full bg-[#5A733C]" />
          Live
        </span>
      </div>

      <div className="relative z-10 mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: -12, right: 4 }}>
            <Tooltip content={<ChartTooltip />} cursor={false} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#5A733C"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#31463B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-2">
        {progressMetrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#5C6B60]">
              <span>{metric.label}</span>
              <span>{metric.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#31463B]/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#3C684D] to-[#CFA956]"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function FeaturePill({ icon, title, description }: FeaturePillProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="liquid-glass rounded-2xl p-5"
    >
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#31463B] text-white">
        {icon}
      </div>
      <div className="relative z-10 mt-5">
        <h2 className="text-base font-semibold text-[#263A2F]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#5C6B60]">{description}</p>
      </div>
    </motion.article>
  );
}

function OperationsPulse() {
  const items = [
    ['Active Teams', '42'],
    ['Average Response', '14 min'],
    ['Critical Zones', '6'],
    ['Public Satisfaction', '92%'],
  ];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="liquid-glass rounded-3xl p-5 lg:p-4"
    >
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#31463B]">Operations Pulse</p>
        <Activity className="h-4 w-4 text-[#5A733C]" aria-hidden="true" />
      </div>
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/35 p-3 lg:p-2.5">
            <p className="text-lg font-semibold text-[#263A2F] lg:text-base">
              {value}
            </p>
            <p className="mt-1 text-[0.68rem] font-medium uppercase text-[#6F7C72]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function FloatingBadge({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        'liquid-glass pointer-events-none absolute z-20 hidden rounded-full px-4 py-2 text-xs font-semibold text-[#31463B] shadow-lg lg:inline-flex',
        className,
      )}
      style={{ animation: 'float 5s ease-in-out infinite' }}
    >
      <span className="relative z-10">{children}</span>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F7F2] text-[#263A2F]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(90,115,60,0.18),transparent_32%),radial-gradient(circle_at_86%_92%,rgba(207,169,86,0.22),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,247,242,0.72))]" />
      <div className="noise-layer pointer-events-none fixed inset-0 opacity-[0.035]" />

      <nav className="relative z-20 flex items-center justify-between px-4 py-5 md:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="CivicTwin home">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#31463B] to-[#5A733C] text-white shadow-[0_14px_34px_rgba(49,70,59,0.22)]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold leading-5">
              CivicTwin
            </span>
            <span className="block text-xs font-medium text-[#6F7C72]">
              Smart City Digital Twin
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {[
            'Overview',
            'Digital Twin',
            'Operations',
            'Analytics',
            'Mobility',
            'Sustainability',
          ].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
              className="text-sm font-medium text-[#4E5F52] transition hover:text-[#263A2F]"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-[#31463B] transition hover:border-[#31463B]/30 hover:bg-white/45 sm:block">
            Sign In
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#263A2F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#31463B] sm:px-5">
            Request Demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <main>
        <section className="relative z-10 px-4 pb-10 pt-4 md:px-8 md:pt-8">
          <div className="mx-auto max-w-7xl">
            <FadeDown className="flex justify-center">
              <div className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#31463B]">
                <Sparkles className="relative z-10 h-4 w-4 text-[#CFA956]" />
                <span className="relative z-10">Municipal Intelligence Platform</span>
                <span className="relative z-10 h-1 w-1 rounded-full bg-[#CFA956]" />
                <span className="relative z-10">Live City Operations</span>
              </div>
            </FadeDown>

            <StaggeredFade
              text="One Digital Twin For Every City Operation"
              className="mx-auto mt-5 max-w-6xl text-4xl font-normal leading-[0.95] tracking-tight-custom sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: '#31463B' }}
            />

            <FadeDown
              delay={0.45}
              className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-[#5C6B60] md:text-lg"
            >
              CivicTwin brings infrastructure, mobility, environment, incidents,
              field teams, and service performance into one real-time
              operational layer for smarter municipal decisions.
            </FadeDown>

            <FadeDown
              delay={0.65}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#3C684D] to-[#5A733C] px-6 py-3 font-semibold text-white shadow-[0_18px_36px_rgba(60,104,77,0.22)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_42px_rgba(60,104,77,0.28)]">
                <MapIcon className="h-5 w-5" aria-hidden="true" />
                Explore City Layer
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 font-semibold text-[#31463B] transition hover:border-[#31463B]/25 hover:bg-[#FAFAF5]">
                <Play className="h-5 w-5 fill-[#31463B]" aria-hidden="true" />
                Watch Control Room
              </button>
            </FadeDown>

            <div className="relative mt-7 md:mt-8">
              <FloatingBadge className="-left-2 top-10" delay={0.9}>
                Live GIS Layer
              </FloatingBadge>
              <FloatingBadge className="left-[47%] top-3" delay={1.05}>
                AI Verified
              </FloatingBadge>
              <FloatingBadge className="bottom-10 left-[53%]" delay={1.2}>
                SLA Tracking
              </FloatingBadge>

              <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <CityMapMock />

                <div className="grid gap-4">
                  <MiniDashboard />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    {stats.map((stat) => (
                      <StatCard key={stat.label} {...stat} />
                    ))}
                  </div>
                  <OperationsPulse />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-4 pb-10 md:px-8" id="digital-twin">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <FeaturePill key={feature.title} {...feature} />
            ))}
          </div>
        </section>
      </main>

      <div className="pointer-events-none fixed bottom-6 right-6 z-20 hidden items-center gap-2 rounded-full border border-white/55 bg-white/50 px-4 py-2 text-xs font-semibold text-[#31463B] shadow-lg backdrop-blur-md md:flex">
        <Radar className="h-4 w-4 text-[#5A733C]" aria-hidden="true" />
        <span>Municipal Ops Synced</span>
        <Gauge className="h-4 w-4 text-[#CFA956]" aria-hidden="true" />
        <ShieldCheck className="h-4 w-4 text-[#5A733C]" aria-hidden="true" />
        <Users className="h-4 w-4 text-[#4E7C8A]" aria-hidden="true" />
        <Route className="h-4 w-4 text-[#31463B]" aria-hidden="true" />
      </div>
    </div>
  );
}
