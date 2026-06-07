import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
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
  Boxes,
  Camera,
  CheckCircle2,
  Lightbulb,
  MapPin,
  MessageSquare,
  RadioTower,
  Recycle,
  ShieldAlert,
  Siren,
  TrafficCone,
  ClipboardList,
  Filter,
  PieChart,
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
  'ROAD DAMAGE 86',
  'BIN OVERFLOW 74',
  'SLA 91.8%',
  'FIELD TEAMS 42',
  'AI VERIFIED 214',
  'HIGH PRIORITY 23',
  'AVG RESPONSE 18 MIN',
];

const workflowSteps = [
  {
    title: 'Detection',
    eyebrow: 'Edge AI',
    description:
      'Vehicle cameras and citizen reports flag road damage, bins, and public-space risks at the edge.',
    icon: <Camera className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Verification',
    eyebrow: 'GIS Lock',
    description:
      'The incident locks to the asset registry, service zone, and nearest operational team.',
    icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Assignment',
    eyebrow: 'SLA Engine',
    description:
      'Municipal rules rank severity, response time, and public impact before dispatch.',
    icon: <Siren className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Resolution',
    eyebrow: 'Field Team',
    description:
      'A route, work order, and live status update close the operational loop.',
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
  },
];

const intelligenceCards = [
  ['Infrastructure Health', <Activity className="h-5 w-5" aria-hidden="true" />],
  ['Waste Operations', <Recycle className="h-5 w-5" aria-hidden="true" />],
  ['Traffic Flow', <TrafficCone className="h-5 w-5" aria-hidden="true" />],
  ['Environmental Sensors', <RadioTower className="h-5 w-5" aria-hidden="true" />],
  ['Smart Lighting', <Lightbulb className="h-5 w-5" aria-hidden="true" />],
  ['Public Safety', <ShieldAlert className="h-5 w-5" aria-hidden="true" />],
  ['Citizen Reports', <MessageSquare className="h-5 w-5" aria-hidden="true" />],
  ['Asset Lifecycle', <Boxes className="h-5 w-5" aria-hidden="true" />],
] as const;

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

function OperationalBackgroundLabels() {
  const reducedMotion = useReducedMotion();
  const labels = [
    ['GIS 25.2048N 55.2708E', 'left-[7%] top-[22%]'],
    ['SLA WATCH 91.8%', 'right-[8%] top-[28%]'],
    ['ZONE A-14 LIVE', 'left-[10%] bottom-[24%]'],
    ['ASSET GRID 48,230', 'right-[10%] bottom-[18%]'],
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] hidden md:block">
      <div className={cn('city-intelligence-ring absolute left-[4%] top-[46%]', reducedMotion && 'motion-paused')} />
      {labels.map(([label, position], index) => (
        <motion.span
          key={label}
          className={cn(
            'absolute rounded-full border border-[#D4AF37]/20 bg-white/30 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#6B7280] backdrop-blur-md',
            position,
          )}
          animate={reducedMotion ? undefined : { y: [0, -8, 0], opacity: [0.42, 0.72, 0.42] }}
          transition={{
            duration: 7 + index,
            repeat: Infinity,
            ease: easeInOut,
            delay: index * 0.5,
          }}
        >
          {label}
        </motion.span>
      ))}
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
      <div className="heat-zone heat-zone-a" />
      <div className="heat-zone heat-zone-b" />
      <div className="heat-zone heat-zone-c" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 900 520"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M140 110 L340 76 L430 178 L355 296 L180 264 Z"
          className="zone-boundary"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: easeOut }}
        />
        <motion.path
          d="M520 105 L760 78 L822 244 L710 355 L540 286 Z"
          className="zone-boundary zone-boundary-gold"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.16, ease: easeOut }}
        />
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
      <span className="waste-route-dot" />
      <span className="inspection-route-dot" />
      <span className="dispatch-line" />

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
      <div className="incident-cluster left-[57%] top-[45%]">
        <span>8</span>
      </div>

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
      initial={{ opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.9, ease: easeOut }}
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
  x,
  y,
}: {
  children: ReactNode;
  className: string;
  delay: number;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.7, ease: easeOut },
        y: { delay, duration: 4 + delay * 2, repeat: Infinity, ease: easeInOut },
      }}
      style={{ x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }}
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
  const reducedMotion = useReducedMotion();
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div className="relative z-10 mt-8 overflow-hidden border-y border-white/50 bg-white/42 py-3 shadow-[0_18px_44px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className={cn('flex w-max items-center gap-6', !reducedMotion && 'ticker-track')}>
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

function SectionBridge({
  label,
  secondary,
}: {
  label: string;
  secondary: string;
}) {
  return (
    <div className="section-bridge relative z-10 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-hidden rounded-full border border-white/45 bg-white/38 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6B7280] shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <span className="whitespace-nowrap text-[#0F172A]">{label}</span>
        <span className="bridge-line h-px flex-1" />
        <span className="bridge-dot h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
        <span className="whitespace-nowrap text-[#8A6A0A]">{secondary}</span>
      </div>
    </div>
  );
}

function DashboardDensitySection() {
  const incidents = [
    ['INC-2041', 'Road damage', 'High', 'Zone A-14'],
    ['INC-2038', 'Bin overflow', 'Medium', 'Zone C-02'],
    ['INC-2032', 'Light outage', 'High', 'Zone B-09'],
  ];
  const feed = [
    'AI verified 23 road-surface alerts',
    'Team 07 accepted dispatch route',
    'Waste truck ETA updated to 18 min',
    'Zone B-09 escalated to priority lane',
  ];

  return (
    <motion.section
      className="relative z-10 px-4 py-8 md:px-8"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6A0A]">
              Executive Operations View
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#0F172A] md:text-4xl">
              Live municipal command density
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['24/7 Ops', 'GIS Synced', 'SLA Guardrails'].map((chip) => (
              <span
                key={chip}
                className="liquid-glass rounded-full px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <span className="relative z-10">{chip}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr_1fr]">
          <motion.article
            className="liquid-glass command-card rounded-[1.5rem] p-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeOut }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Incident Severity
              </h3>
              <PieChart className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div className="relative z-10 mt-5 grid grid-cols-[8rem_1fr] items-center gap-5">
              <div className="severity-donut flex h-32 w-32 items-center justify-center rounded-full">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 text-center text-sm font-semibold text-[#0F172A]">
                  23
                  <br />
                  High
                </div>
              </div>
              <div className="grid gap-3 text-xs font-medium text-[#6B7280]">
                {[
                  ['High priority', '23', '#D4AF37'],
                  ['Medium', '71', '#1E293B'],
                  ['Low', '102', '#E8D49A'],
                ].map(([name, value, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {name}
                    </span>
                    <span className="font-semibold text-[#0F172A]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            className="liquid-glass command-card rounded-[1.5rem] p-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08, ease: easeOut }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                SLA Trend & Zone Performance
              </h3>
              <Gauge className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div className="relative z-10 mt-4 h-28">
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
                    animationDuration={1600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="relative z-10 mt-4 grid gap-2">
              {[
                ['Zone A-14', 91],
                ['Zone B-09', 84],
                ['Zone C-02', 77],
              ].map(([zone, value]) => (
                <div key={zone}>
                  <div className="mb-1 flex justify-between text-xs font-semibold text-[#6B7280]">
                    <span>{zone}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0F172A]/10">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-[#0F172A] to-[#D4AF37]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: easeOut }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="liquid-glass command-card rounded-[1.5rem] p-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.16, ease: easeOut }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Live Activity Feed
              </h3>
              <ClipboardList className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div className="relative z-10 mt-4 grid gap-3">
              {feed.map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/48 p-3 text-xs text-[#6B7280]"
                  initial={{ opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: easeOut }}
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.article>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.article
            className="liquid-glass command-card rounded-[1.5rem] p-5"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeOut }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Dispatch Funnel
              </h3>
              <Filter className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div className="relative z-10 mt-5 grid gap-3">
              {[
                ['Detected', 214],
                ['Verified', 168],
                ['Assigned', 94],
                ['Resolved', 71],
              ].map(([label, value], index) => (
                <div key={label} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 text-xs font-semibold text-[#6B7280]">
                  <span>{label}</span>
                  <div className="h-8 rounded-full bg-[#0F172A]/8">
                    <motion.div
                      className="h-8 rounded-full bg-gradient-to-r from-[#0F172A] to-[#D4AF37]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${88 - index * 16}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.08, ease: easeOut }}
                    />
                  </div>
                  <span className="text-right text-[#0F172A]">{value}</span>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="liquid-glass command-card rounded-[1.5rem] p-5"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08, ease: easeOut }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                High Priority Incident Table
              </h3>
              <CircleAlert className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-white/50">
              {incidents.map(([id, type, severity, zone], index) => (
                <div
                  key={id}
                  className="grid grid-cols-[0.8fr_1.3fr_0.8fr_0.8fr] gap-3 border-b border-white/45 bg-white/38 px-4 py-3 text-xs last:border-b-0"
                >
                  <span className="font-semibold text-[#0F172A]">{id}</span>
                  <span className="text-[#6B7280]">{type}</span>
                  <span className={cn('font-semibold', index === 1 ? 'text-[#8A6A0A]' : 'text-[#0F172A]')}>{severity}</span>
                  <span className="text-right text-[#6B7280]">{zone}</span>
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </motion.section>
  );
}

function ScrollProgressLayer() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#D4AF37]"
      style={{ scaleX }}
    />
  );
}

function ScrollColorWash() {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.34, 0.68, 1],
    ['#F8F9FB', '#EEF1F6', '#F7F3E8', '#F8F9FB'],
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor }}
    />
  );
}

function SplitHeading({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');

  return (
    <motion.h2
      className={cn(
        'mx-auto max-w-5xl text-center text-3xl font-semibold leading-tight text-[#0F172A] md:text-5xl',
        className,
      )}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          {word}
          {index < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </motion.h2>
  );
}

function WorkflowVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className="liquid-glass relative h-[28rem] overflow-hidden rounded-[2rem] p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.96 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="absolute inset-6"
        >
          {activeStep === 0 && (
            <div className="workflow-visual ai-frame h-full rounded-[1.5rem]">
              <div className="detection-box" />
              <div className="detection-pulse left-[28%] top-[58%]" />
              <div className="detection-pulse left-[68%] top-[34%]" />
              <p className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Edge AI Detection
              </p>
            </div>
          )}

          {activeStep === 1 && (
            <div className="workflow-visual gis-lock h-full rounded-[1.5rem]">
              <div className="absolute inset-0 map-grid opacity-60" />
              <motion.div
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F172A] text-[#D4AF37]"
                animate={{ scale: [0.9, 1.12, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: easeInOut }}
              >
                <MapPin className="h-7 w-7" aria-hidden="true" />
              </motion.div>
              <p className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                GIS Location Lock
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <div className="workflow-visual sla-meter h-full rounded-[1.5rem]">
              <p className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                SLA Priority Engine
              </p>
              <div className="absolute inset-x-8 bottom-16 h-5 rounded-full bg-white/60">
                <motion.div
                  className="h-5 rounded-full bg-gradient-to-r from-[#E8D49A] via-[#C9A227] to-[#0F172A]"
                  initial={{ width: '12%' }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 1.2, ease: easeOut }}
                />
              </div>
              <div className="absolute bottom-28 left-8 right-8 grid grid-cols-3 gap-3 text-xs font-semibold text-[#0F172A]">
                <span>LOW</span>
                <span className="text-center">MEDIUM</span>
                <span className="text-right text-[#D4AF37]">CRITICAL</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="workflow-visual dispatch-route h-full rounded-[1.5rem]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 360" fill="none" aria-hidden="true">
                <motion.path
                  d="M64 260 C130 210 154 248 210 174 C256 112 315 148 365 80"
                  stroke="#D4AF37"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: easeOut }}
                />
              </svg>
              <div className="absolute bottom-[4.1rem] left-[3.6rem] h-5 w-5 rounded-full bg-[#0F172A]" />
              <div className="absolute right-[3rem] top-[4.3rem] flex h-14 w-14 items-center justify-center rounded-full bg-[#0F172A] text-[#D4AF37]">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Dispatch Route Active
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StickyWorkflowSection() {
  const workflowRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: workflowRef,
    offset: ['start start', 'end end'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setActiveStep(Math.min(3, Math.floor(latest * 4)));
    });
  }, [scrollYProgress]);

  return (
    <section ref={workflowRef} className="relative z-10 h-[300vh] px-4 md:px-8">
      <div className="sticky top-0 flex min-h-screen items-center py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SplitHeading
              text="From Detection To Resolution"
              className="mx-0 max-w-xl text-left"
            />
            <p className="mt-5 max-w-xl text-base leading-7 text-[#6B7280]">
              A municipal workflow that stays pinned while the story advances:
              AI detection, GIS validation, SLA priority, and dispatch closure.
            </p>

            <div className="relative mt-10 grid gap-4">
              <div className="absolute bottom-8 left-6 top-8 w-px bg-[#0F172A]/10">
                <motion.div
                  className="h-full origin-top bg-[#D4AF37]"
                  style={{ scaleY: reducedMotion ? 1 : lineScale }}
                />
              </div>
              {workflowSteps.map((step, index) => {
                const isActive = activeStep === index;
                const isPast = activeStep > index;
                return (
                  <motion.article
                    key={step.title}
                    className={cn(
                      'liquid-glass relative z-10 ml-12 rounded-2xl p-5 transition-colors duration-500',
                      isActive && 'border-[#D4AF37]/70 bg-[#0F172A]/95 text-white',
                    )}
                    initial={{ opacity: 0, y: 80, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{
                      opacity: isActive ? 1 : isPast ? 0.32 : 0.68,
                      y: isPast ? -16 : 0,
                      scale: isActive ? 1 : 0.96,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: easeOut }}
                  >
                    <span
                      className={cn(
                        'absolute -left-[3.28rem] top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-white text-[#0F172A]',
                        isActive && 'step-node-active bg-[#D4AF37] text-[#0F172A]',
                      )}
                    >
                      {step.icon}
                    </span>
                    <p className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6A0A]', isActive && 'text-[#E8D49A]')}>
                      {step.eyebrow}
                    </p>
                    <h3 className={cn('mt-2 text-xl font-semibold text-[#0F172A]', isActive && 'text-white')}>
                      {step.title}
                    </h3>
                    <p className={cn('mt-2 text-sm leading-6 text-[#6B7280]', isActive && 'text-white/70')}>
                      {step.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <WorkflowVisual activeStep={activeStep} />
        </div>
      </div>
    </section>
  );
}

function IntelligenceLayersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -2320]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 28 });

  return (
    <section ref={sectionRef} className="relative z-10 h-[250vh] overflow-hidden px-4 md:px-8">
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-7xl">
          <SplitHeading text="City Intelligence Layers" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#6B7280]">
            Each operational layer moves as a connected intelligence surface,
            revealing the systems that feed the digital twin.
          </p>
          <motion.div
            className="mt-10 flex w-max gap-5"
            style={{ x: reducedMotion ? 0 : smoothX }}
          >
            {intelligenceCards.map(([title, icon], index) => (
              <motion.article
                key={title}
                className="liquid-glass intelligence-card h-[420px] w-[360px] rounded-[1.6rem] p-5"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: index * 0.05, ease: easeOut }}
              >
                <div className="relative z-10 rounded-2xl bg-[#0F172A] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                      {icon}
                    </span>
                    <span className="live-pill rounded-full bg-white/10 px-3 py-1 text-xs text-[#E8D49A]">
                      Live Layer
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                </div>
                <div className="relative z-10 mt-6 h-44 rounded-2xl bg-white/42 p-4">
                  <div className="mini-network">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end gap-2">
                    {[52, 72, 48, 86, 64, 92].map((height, barIndex) => (
                      <motion.span
                        key={`${title}-${barIndex}`}
                        className="flex-1 rounded-full bg-gradient-to-t from-[#0F172A] to-[#D4AF37]"
                        initial={{ height: 0 }}
                        whileInView={{ height }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: barIndex * 0.08, ease: easeOut }}
                      />
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CinematicPanels() {
  const panels = [
    ['AI Vehicle Patrol', 'patrol-panel', 'Animated road line, moving vehicle dot, detection pulse.'],
    ['Municipal Command Center', 'command-panel', 'Dashboard grid, live chart, blinking operators.'],
    ['Resolution Intelligence', 'resolution-panel', 'Route line, field team marker, completed status.'],
  ];

  return (
    <section className="relative z-10 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SplitHeading text="City operations should not live in disconnected systems." />
        <SplitHeading
          text="Every incident, asset, team, and SLA belongs in one operational layer."
          className="mt-6 text-2xl text-[#6B7280] md:text-4xl"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {panels.map(([title, className, body], index) => (
            <motion.article
              key={title}
              className="liquid-glass command-card rounded-[1.75rem] p-5"
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: easeOut }}
            >
              <div className={cn('cinematic-panel relative h-64 overflow-hidden rounded-2xl', className)} />
              <h3 className="relative z-10 mt-5 text-xl font-semibold text-[#0F172A]">
                {title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-6 text-[#6B7280]">
                {body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <motion.section
      className="relative z-10 overflow-hidden px-4 py-24 md:px-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-120px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.14 } },
      }}
    >
      <motion.div
        className="cta-circle absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F172A]"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          show: { scale: 18, opacity: 1 },
        }}
        transition={{ duration: 1.4, ease: easeOut }}
      />
      <div className="gold-grid absolute inset-0" />
      <div className="relative mx-auto max-w-4xl text-center text-white">
        <motion.h2
          className="text-4xl font-semibold leading-tight md:text-6xl"
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          Build The City Intelligence Layer
        </motion.h2>
        <motion.p
          className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg"
          variants={{
            hidden: { opacity: 0, y: 28 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          A premium digital twin experience for municipal leaders, operations
          teams, and future-ready smart city programs.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={{
            hidden: { opacity: 0, y: 44 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          <button className="ripple-button rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-[#0F172A]">
            Request Executive Demo
          </button>
          <button className="ripple-button rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl">
            View Command Layer
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function App() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 120,
    damping: 30,
  });
  const headingY = useTransform(smoothHeroProgress, [0, 1], [0, -80]);
  const mapY = useTransform(smoothHeroProgress, [0, 1], [0, -140]);
  const dashboardY = useTransform(smoothHeroProgress, [0, 1], [0, -60]);
  const backgroundY = useTransform(smoothHeroProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(smoothHeroProgress, [0, 1], [1, 0.25]);
  const heroScale = useTransform(smoothHeroProgress, [0, 1], [1, 0.94]);
  const mapScale = useTransform(smoothHeroProgress, [0, 0.45, 1], [0.95, 1.08, 0.98]);
  const mapRotateX = useTransform(smoothHeroProgress, [0, 0.45, 1], [0, 3, 0]);
  const mapOpacity = useTransform(smoothHeroProgress, [0, 0.75, 1], [1, 1, 0.35]);
  const badgeLiveX = useTransform(smoothHeroProgress, [0, 1], [0, -40]);
  const badgeLiveY = useTransform(smoothHeroProgress, [0, 1], [0, -120]);
  const badgeEdgeX = useTransform(smoothHeroProgress, [0, 1], [0, 60]);
  const badgeEdgeY = useTransform(smoothHeroProgress, [0, 1], [0, -80]);
  const badgeSlaX = useTransform(smoothHeroProgress, [0, 1], [0, 20]);
  const badgeSlaY = useTransform(smoothHeroProgress, [0, 1], [0, -150]);
  const badgeTeamsX = useTransform(smoothHeroProgress, [0, 1], [0, -80]);
  const badgeTeamsY = useTransform(smoothHeroProgress, [0, 1], [0, -100]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F9FB] text-[#111827]">
      <ScrollColorWash />
      <AnimatedBackground />
      <OperationalBackgroundLabels />
      <ScrollProgressLayer />

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
        <motion.section
          ref={heroRef}
          className="relative z-10 px-4 pb-10 pt-4 md:px-8 md:pt-8"
          style={{
            opacity: reducedMotion ? 1 : heroOpacity,
            scale: reducedMotion ? 1 : heroScale,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ y: reducedMotion ? 0 : backgroundY }}
          />
          <div className="mx-auto max-w-7xl">
            <motion.div style={{ y: reducedMotion ? 0 : headingY }}>
              <FadeDown className="flex justify-center">
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
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
            </motion.div>

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
              <FloatingBadge
                className="-left-2 top-10"
                delay={0.9}
                x={badgeLiveX}
                y={badgeLiveY}
              >
                LIVE GIS
              </FloatingBadge>
              <FloatingBadge
                className="left-[36%] top-3"
                delay={1.05}
                x={badgeEdgeX}
                y={badgeEdgeY}
              >
                EDGE AI
              </FloatingBadge>
              <FloatingBadge
                className="bottom-10 left-[48%]"
                delay={1.2}
                x={badgeSlaX}
                y={badgeSlaY}
              >
                SLA ACTIVE
              </FloatingBadge>
              <FloatingBadge
                className="right-[24%] top-[48%]"
                delay={1.45}
                x={badgeTeamsX}
                y={badgeTeamsY}
              >
                FIELD TEAMS ONLINE
              </FloatingBadge>
              <FloatingBadge className="left-[16%] bottom-16" delay={1.65}>
                ASSET MONITORING
              </FloatingBadge>
              <FloatingBadge className="right-4 top-5" delay={1.85}>
                ENVIRONMENTAL SENSORS
              </FloatingBadge>

              <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <motion.div
                  style={{
                    y: reducedMotion ? 0 : mapY,
                    scale: reducedMotion ? 1 : mapScale,
                    rotateX: reducedMotion ? 0 : mapRotateX,
                    opacity: reducedMotion ? 1 : mapOpacity,
                    transformPerspective: 1000,
                  }}
                >
                  <CityMapMock />
                </motion.div>

                <motion.div
                  className="grid gap-4"
                  style={{ y: reducedMotion ? 0 : dashboardY }}
                >
                  <MiniDashboard />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    {stats.map((stat) => (
                      <StatCard key={stat.label} {...stat} />
                    ))}
                  </div>
                  <OperationsPulse />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        <SectionBridge label="Telemetry bridge" secondary="Incidents, teams, routes, assets" />
        <DashboardDensitySection />
        <SectionBridge label="Workflow lock" secondary="Detection to resolution" />
        <StickyWorkflowSection />
        <SectionBridge label="Layer transition" secondary="Operational intelligence surface" />
        <IntelligenceLayersSection />
        <SectionBridge label="Command panels" secondary="Patrol, control, resolution" />
        <CinematicPanels />
        <SectionBridge label="Core capabilities" secondary="Municipal platform modules" />

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

        <SectionBridge label="Executive handoff" secondary="Future-ready municipality platform" />
        <FinalCTA />
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
