import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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

interface CountUpProps {
  end: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend: string;
  countTo: number;
  decimals?: number;
  suffix?: string;
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

const easeOut = [0.16, 1, 0.3, 1] as const;
const easeInOut = [0.65, 0, 0.35, 1] as const;

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

const stats: StatCardProps[] = [
  {
    icon: <Layers3 className="h-4 w-4" aria-hidden="true" />,
    label: 'Assets Monitored',
    value: '48,230',
    trend: '+2.8% this week',
    countTo: 48230,
  },
  {
    icon: <CircleAlert className="h-4 w-4" aria-hidden="true" />,
    label: 'Live Incidents',
    value: '126',
    trend: '18 critical',
    countTo: 126,
  },
  {
    icon: <Clock className="h-4 w-4" aria-hidden="true" />,
    label: 'SLA Compliance',
    value: '94.7%',
    trend: '+4.1% vs target',
    countTo: 94.7,
    decimals: 1,
    suffix: '%',
  },
  {
    icon: <Zap className="h-4 w-4" aria-hidden="true" />,
    label: 'Energy Saved',
    value: '18.4%',
    trend: 'AED 2.1M avoided',
    countTo: 18.4,
    decimals: 1,
    suffix: '%',
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

const tickerItems = [
  'ROAD HEALTH 91%',
  'SLA COMPLIANCE 94.7%',
  'LIVE INCIDENTS 126',
  'TRAFFIC NORMAL',
  'WASTE OPERATIONS ACTIVE',
  'AIR QUALITY GOOD',
  'ENERGY SAVINGS +18.4%',
  'FIELD TEAMS 42',
];

function CountUp({
  end,
  decimals = 0,
  duration = 2,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setValue(end);
      return;
    }

    let frame = 0;
    let startTime = 0;

    const tick = (time: number) => {
      if (!startTime) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, end, inView, reducedMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

function StaggeredFade({ text, className, style }: StaggeredFadeProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const words = text.split(' ');

  return (
    <motion.h1
      ref={ref}
      className={cn(
        'headline-sweep text-center text-xl font-bold leading-tight text-[#020617] sm:text-4xl md:text-6xl md:leading-[4rem]',
        className,
      )}
      style={style}
      aria-label={text}
    >
      {words.map((word, wordIndex) => {
        const highlight =
          word === 'Digital' ||
          word === 'Twin' ||
          word === 'City' ||
          word === 'Operation';
        const priorCharacters = words
          .slice(0, wordIndex)
          .join(' ')
          .concat(wordIndex ? ' ' : '').length;

        return (
          <span
            key={`${word}-${wordIndex}`}
            className={cn('inline-block', highlight && 'text-[#C9A227]')}
          >
            {word.split('').map((letter, letterIndex) => {
              const index = priorCharacters + letterIndex;
              return (
                <motion.span
                  key={`${letter}-${index}`}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                  transition={{
                    delay: index * 0.025,
                    duration: 0.55,
                    ease: easeOut,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
          </span>
        );
      })}
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
      transition={{ duration: 0.8, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedBackground() {
  const nodes = [
    [9, 24],
    [21, 17],
    [32, 38],
    [47, 20],
    [59, 42],
    [71, 18],
    [84, 32],
    [18, 68],
    [39, 72],
    [63, 66],
    [79, 77],
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.34),transparent_68%)]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: easeInOut }}
      />
      <motion.div
        className="absolute -bottom-32 right-0 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.33),transparent_66%)]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.26, 0.52, 0.26] }}
        transition={{ duration: 12, repeat: Infinity, ease: easeInOut, delay: 2 }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.05),transparent_36%,rgba(201,162,39,0.08))]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.slice(0, -1).map(([x, y], index) => {
          const [x2, y2] = nodes[index + 1];
          return (
            <motion.line
              key={`${x}-${y}`}
              x1={x}
              y1={y}
              x2={x2}
              y2={y2}
              stroke="#0F172A"
              strokeWidth="0.12"
              strokeDasharray="0.4 0.8"
              opacity="0.2"
              pathLength={0}
              animate={{ pathLength: [0, 1, 1], opacity: [0.08, 0.28, 0.08] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: easeInOut,
                delay: index * 0.28,
              }}
            />
          );
        })}
        {nodes.map(([x, y], index) => (
          <motion.circle
            key={`${x}-${y}-node`}
            cx={x}
            cy={y}
            r="0.34"
            fill="#C9A227"
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.55, 1] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: easeInOut,
              delay: index * 0.18,
            }}
          />
        ))}
      </svg>
      <div className="data-streams absolute inset-0" />
      <div className="particle-field absolute inset-0" />
      <div className="noise-layer pointer-events-none absolute inset-0 opacity-[0.04]" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  trend,
  countTo,
  decimals,
  suffix,
}: StatCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
      transition={{ duration: 0.75, ease: easeOut }}
      className="liquid-glass command-card rounded-3xl p-4 lg:p-3"
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-[#D4AF37] shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
          {icon}
        </div>
        <span className="live-pill rounded-full bg-[#C9A227]/12 px-2 py-1 text-[0.64rem] font-semibold text-[#8A6A0A]">
          {trend}
        </span>
      </div>
      <div className="relative z-10 mt-4 lg:mt-3">
        <p className="text-2xl font-semibold text-[#0F172A] lg:text-xl">
          <CountUp end={countTo} decimals={decimals} suffix={suffix} />
        </p>
        <p className="mt-1 text-xs font-medium uppercase text-[#6B7280]">
          {label}
        </p>
      </div>
    </motion.article>
  );
}

function CityMapMock() {
  const mapRef = useRef<HTMLDivElement | null>(null);
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

  const assets = [
    ['water', 'left-[14%] top-[26%]', <Activity className="h-3.5 w-3.5" />],
    ['road', 'left-[38%] top-[39%]', <Route className="h-3.5 w-3.5" />],
    ['light', 'left-[71%] top-[26%]', <Zap className="h-3.5 w-3.5" />],
    ['waste', 'left-[81%] top-[59%]', <Truck className="h-3.5 w-3.5" />],
    ['team', 'left-[29%] top-[74%]', <Users className="h-3.5 w-3.5" />],
  ] as const;

  const incidents = [
    'left-[48%] top-[44%]',
    'left-[62%] top-[54%]',
    'left-[21%] top-[53%]',
  ];

  const sensors = [
    'left-[41%] top-[61%]',
    'left-[50%] top-[55%]',
    'left-[58%] top-[48%]',
    'left-[72%] top-[72%]',
  ];

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) {
      return;
    }

    const rect = mapRef.current.getBoundingClientRect();
    mapRef.current.style.setProperty(
      '--mouse-x',
      `${event.clientX - rect.left}px`,
    );
    mapRef.current.style.setProperty(
      '--mouse-y',
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <motion.div
      ref={mapRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.006 }}
      transition={{ duration: 0.9, ease: easeOut }}
      className="liquid-glass map-glow relative h-[320px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F8F9FB] via-white to-[#F5EBC9] lg:h-[420px]"
      role="img"
      aria-label="Animated digital twin map showing roads, municipal assets, dispatch teams, environmental sensors, and AI incident events"
    >
      <div className="absolute inset-0 map-grid opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_28%,rgba(15,23,42,0.12),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(212,175,55,0.24),transparent_28%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 900 520"
        fill="none"
        aria-hidden="true"
      >
        {[
          'M-20 370 C170 270 250 310 390 205 C520 106 650 180 930 70',
          'M100 530 C140 385 260 350 320 245 C382 138 420 76 590 -15',
          'M-30 150 C170 126 250 175 360 260 C500 368 675 362 930 270',
        ].map((path, index) => (
          <g key={path}>
            <path
              d={path}
              stroke={index === 2 ? '#1E293B' : '#0F172A'}
              strokeWidth={index === 1 ? 28 : 34}
              strokeLinecap="round"
              opacity="0.14"
            />
            <motion.path
              d={path}
              stroke={index === 2 ? '#D4AF37' : '#C9A227'}
              strokeWidth={index === 1 ? 7 : 9}
              strokeLinecap="round"
              strokeDasharray="18 22"
              opacity="0.76"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.18, ease: easeOut }}
            />
          </g>
        ))}
      </svg>

      <span className="vehicle vehicle-a" />
      <span className="vehicle vehicle-b" />
      <span className="vehicle vehicle-c" />
      <span className="dispatch dispatch-a" />
      <span className="dispatch dispatch-b" />

      {buildings.map((building, index) => (
        <motion.div
          key={building}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 + index * 0.04, duration: 0.8, ease: easeOut }}
          className={cn(
            'absolute rounded-xl border border-white/60 bg-white/62 shadow-[0_18px_38px_rgba(15,23,42,0.10)]',
            building,
          )}
        >
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-white/70 to-[#E8D49A]/35" />
        </motion.div>
      ))}

      {assets.map(([name, position, icon], index) => (
        <div
          key={name}
          className={cn(
            'asset-marker absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F172A] text-[#D4AF37] shadow-[0_10px_30px_rgba(15,23,42,0.24)]',
            position,
          )}
          style={{ animationDelay: `${index * 0.26}s` }}
        >
          {icon}
        </div>
      ))}

      {incidents.map((incident, index) => (
        <div
          key={incident}
          className={cn('incident-marker absolute', incident)}
          style={{ animationDelay: `${index * 0.45}s` }}
        />
      ))}

      {sensors.map((sensor, index) => (
        <div
          key={sensor}
          className={cn('sensor-node absolute', sensor)}
          style={{ animationDelay: `${index * 0.35}s` }}
        />
      ))}

      <div className="health-ring absolute left-[63%] top-[32%]" />
      <div className="absolute inset-y-0 left-[48%] w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-70 scan-beam" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: easeOut }}
        className="liquid-glass absolute bottom-5 left-5 w-[min(20rem,calc(100%-2.5rem))] rounded-2xl p-4 text-sm text-[#111827]"
      >
        <div className="relative z-10 flex items-center justify-between">
          <p className="font-semibold">Zone A-14</p>
          <span className="live-pill rounded-full bg-[#C9A227]/14 px-2.5 py-1 text-xs font-semibold text-[#8A6A0A]">
            Synced
          </span>
        </div>
        <div className="relative z-10 mt-3 grid gap-2 text-xs text-[#6B7280]">
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
    <div className="liquid-glass rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="relative z-10 font-semibold text-[#0F172A]">
        {payload[0].value}%
      </p>
      <p className="relative z-10 text-[#6B7280]">City health</p>
    </div>
  );
}

function CityHealthRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 43;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="kpi-glow absolute inset-0 rounded-full" />
      <svg className="relative z-10 h-24 w-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="#D4AF37"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          whileInView={{ strokeDasharray: `${dash} ${circumference}` }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: easeOut }}
        />
      </svg>
      <div className="liquid-glass absolute inset-4 flex items-center justify-center rounded-full">
        <span className="relative z-10 text-sm font-semibold text-[#0F172A]">
          <CountUp end={value} decimals={1} suffix="%" duration={1.8} />
        </span>
      </div>
    </div>
  );
}

function MiniDashboard() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.75, ease: easeOut }}
      className="liquid-glass command-card rounded-3xl p-5 lg:p-4"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">
            City Health Index
          </p>
          <p className="mt-2 text-4xl font-semibold text-[#0F172A]">
            <CountUp end={87.6} decimals={1} duration={1.8} />
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="live-pill inline-flex items-center gap-1.5 rounded-full bg-[#C9A227]/12 px-3 py-1.5 text-xs font-semibold text-[#8A6A0A]">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            Live
          </span>
          <CityHealthRing value={87.6} />
        </div>
      </div>

      <div className="relative z-10 mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: -12, right: 4 }}>
            <Tooltip content={<ChartTooltip />} cursor={false} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#D4AF37"
              strokeWidth={3}
              dot={false}
              isAnimationActive
              animationDuration={1800}
              activeDot={{ r: 5, fill: '#0F172A', stroke: '#D4AF37' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-2">
        {progressMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: easeOut }}
          >
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>{metric.label}</span>
              <span>{metric.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#0F172A]/10">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#0F172A] to-[#D4AF37]"
                initial={{ width: 0 }}
                whileInView={{ width: `${metric.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.12 + index * 0.08, ease: easeOut }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

function FeaturePill({ icon, title, description }: FeaturePillProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.75, ease: easeOut }}
      className="liquid-glass command-card group rounded-2xl p-5"
    >
      <motion.div
        whileHover={{ rotate: 8 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#0F172A] text-[#D4AF37]"
      >
        {icon}
      </motion.div>
      <div className="relative z-10 mt-5">
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">{description}</p>
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.75, ease: easeOut }}
      className="liquid-glass command-card rounded-3xl p-5 lg:p-4"
    >
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A]">Operations Pulse</p>
        <Activity className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
      </div>
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2">
        {items.map(([label, value], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: easeOut }}
            className="rounded-2xl bg-white/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] lg:p-2.5"
          >
            <p className="text-lg font-semibold text-[#0F172A] lg:text-base">
              {value}
            </p>
            <p className="mt-1 text-[0.68rem] font-medium uppercase text-[#6B7280]">
              {label}
            </p>
          </motion.div>
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
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.7, ease: easeOut },
        y: { delay, duration: 4 + delay * 2, repeat: Infinity, ease: easeInOut },
      }}
      className={cn(
        'liquid-glass pointer-events-none absolute z-20 hidden rounded-full px-4 py-2 text-xs font-semibold text-[#0F172A] shadow-lg lg:inline-flex',
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </motion.div>
  );
}

function DataTicker() {
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div className="relative z-10 mt-8 overflow-hidden border-y border-white/50 bg-white/42 py-3 shadow-[0_18px_44px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="ticker-track flex w-max items-center gap-6">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-6 whitespace-nowrap text-xs font-semibold tracking-[0.18em] text-[#0F172A]"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F9FB] text-[#111827]">
      <AnimatedBackground />

      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="relative z-20 flex items-center justify-between px-4 py-5 md:px-8"
      >
        <a href="/" className="flex items-center gap-3" aria-label="CivicTwin home">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B] text-[#D4AF37] shadow-[0_14px_34px_rgba(15,23,42,0.25)]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold leading-5 text-[#0F172A]">
              CivicTwin
            </span>
            <span className="block text-xs font-medium text-[#6B7280]">
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
              className="nav-link text-sm font-medium text-[#6B7280] transition duration-500 hover:text-[#0F172A]"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="ripple-button hidden rounded-full border border-[#D4AF37]/45 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition duration-500 hover:bg-white/70 hover:shadow-[0_14px_30px_rgba(201,162,39,0.18)] sm:block">
            Sign In
          </button>
          <button className="ripple-button group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#020617] via-[#0F172A] to-[#1E293B] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.22)] transition duration-500 hover:scale-[1.04] hover:shadow-[0_0_32px_rgba(212,175,55,0.34)] sm:px-5">
            Request Demo
            <ArrowRight className="h-4 w-4 text-[#D4AF37] transition duration-500 group-hover:rotate-[-12deg]" aria-hidden="true" />
          </button>
        </div>
      </motion.nav>

      <main>
        <section className="relative z-10 px-4 pb-10 pt-4 md:px-8 md:pt-8">
          <div className="mx-auto max-w-7xl">
            <FadeDown className="flex justify-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: easeInOut }}
                className="badge-glass liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#0F172A]"
              >
                <Sparkles className="relative z-10 h-4 w-4 text-[#D4AF37]" />
                <span className="relative z-10">Municipal Intelligence Platform</span>
                <span className="relative z-10 h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span className="relative z-10">Live City Operations</span>
              </motion.div>
            </FadeDown>

            <StaggeredFade
              text="One Digital Twin For Every City Operation"
              className="mx-auto mt-5 max-w-6xl text-4xl font-normal leading-[0.95] tracking-tight-custom sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: '#020617' }}
            />

            <FadeDown
              delay={0.4}
              className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-[#6B7280] md:text-lg"
            >
              CivicTwin brings infrastructure, mobility, environment, incidents,
              field teams, and service performance into one real-time
              operational layer for smarter municipal decisions.
            </FadeDown>

            <FadeDown
              delay={0.65}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button className="ripple-button group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#020617] via-[#0F172A] to-[#1E293B] px-6 py-3 font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition duration-500 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(212,175,55,0.38)]">
                <MapIcon className="h-5 w-5 text-[#D4AF37] transition duration-500 group-hover:rotate-[-10deg]" aria-hidden="true" />
                Explore City Layer
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37]/18">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                </span>
              </button>
              <button className="ripple-button inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/54 px-6 py-3 font-semibold text-[#0F172A] shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-500 hover:bg-white/80 hover:shadow-[0_0_26px_rgba(212,175,55,0.22)]">
                <Play className="h-5 w-5 fill-[#0F172A] text-[#0F172A]" aria-hidden="true" />
                Watch Control Room
              </button>
            </FadeDown>

            <DataTicker />

            <div className="relative mt-7 md:mt-8">
              <FloatingBadge className="-left-2 top-10" delay={0.9}>
                LIVE GIS
              </FloatingBadge>
              <FloatingBadge className="left-[36%] top-3" delay={1.05}>
                EDGE AI
              </FloatingBadge>
              <FloatingBadge className="bottom-10 left-[48%]" delay={1.2}>
                SLA ACTIVE
              </FloatingBadge>
              <FloatingBadge className="right-[24%] top-[48%]" delay={1.45}>
                FIELD TEAMS ONLINE
              </FloatingBadge>
              <FloatingBadge className="left-[16%] bottom-16" delay={1.65}>
                ASSET MONITORING
              </FloatingBadge>
              <FloatingBadge className="right-4 top-5" delay={1.85}>
                ENVIRONMENTAL SENSORS
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

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="relative z-10 px-4 pb-10 md:px-8"
          id="digital-twin"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <FeaturePill key={feature.title} {...feature} />
            ))}
          </div>
        </motion.section>
      </main>

      <div className="liquid-glass pointer-events-none fixed bottom-6 right-6 z-20 hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#0F172A] md:flex">
        <Radar className="relative z-10 h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
        <span className="relative z-10">Municipal Ops Synced</span>
        <Gauge className="relative z-10 h-4 w-4 text-[#C9A227]" aria-hidden="true" />
        <ShieldCheck className="relative z-10 h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
        <Users className="relative z-10 h-4 w-4 text-[#1E293B]" aria-hidden="true" />
        <Route className="relative z-10 h-4 w-4 text-[#0F172A]" aria-hidden="true" />
      </div>
    </div>
  );
}
