import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SplitRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: keyof JSX.IntrinsicElements;
}

export function SplitReveal({ text, className = '', delay = 0, as: Tag = 'span' }: SplitRevealProps) {
    const words = text.split(' ');
    return (
        <Tag className={className} aria-label={text}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                        className="inline-block"
                        initial={{ y: '115%', opacity: 0, rotate: 2 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {word}
                        {i < words.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}

interface SplitLinesProps {
    lines: string[];
    className?: string;
    delay?: number;
}

export function SplitLines({ lines, className = '', delay = 0 }: SplitLinesProps) {
    return (
        <span className={className}>
            {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                    <motion.span
                        className="block"
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.85, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

interface RevealProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    x?: number;
    blur?: number;
    scale?: number;
    className?: string;
    once?: boolean;
    margin?: string;
}

export function Reveal({
    children,
    delay = 0,
    y = 28,
    x = 0,
    blur = 0,
    scale = 1,
    className = '',
    once = true,
    margin = '-70px',
}: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y, x, scale, filter: blur ? `blur(${blur}px)` : 'blur(0px)' }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once, margin: margin as never }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}

interface StaggerProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
}

export function Stagger({ children, className = '', stagger = 0.08, delay = 0 }: StaggerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
    y?: number;
}

export function StaggerItem({ children, className = '', y = 24 }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y, filter: 'blur(6px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
            }}
        >
            {children}
        </motion.div>
    );
}

interface TiltFrameProps {
    children: ReactNode;
    className?: string;
    intensity?: number;
}

export function TiltFrame({ children, className = '', intensity = 10 }: TiltFrameProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 180, damping: 22 });
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 180, damping: 22 });

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    }
    function onLeave() {
        mx.set(0);
        my.set(0);
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {children}
        </motion.div>
    );
}

interface MarqueeProps {
    items: string[];
    className?: string;
    speed?: number;
}

export function Marquee({ items, className = '', speed = 30 }: MarqueeProps) {
    const line = items.join(' · ') + ' · ';
    const doubled = line + line;
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                className="flex w-max whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
            >
                <span className="px-6">{doubled}</span>
            </motion.div>
        </div>
    );
}

interface FloatingOrbsProps {
    count?: number;
    className?: string;
    colors?: string[];
}

export function FloatingOrbs({
    count = 6,
    className = '',
    colors = [
        'radial-gradient(circle, rgba(255,111,145,0.45) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(138,77,255,0.4) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(200,161,90,0.35) 0%, transparent 70%)',
    ],
}: FloatingOrbsProps) {
    const orbs = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 80 + (i % 3) * 60,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${10 + ((i * 23) % 75)}%`,
        delay: i * 1.4,
        duration: 14 + (i % 4) * 4,
        bg: colors[i % colors.length],
    }));
    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            {orbs.map((o) => (
                <motion.span
                    key={o.id}
                    className="absolute rounded-full blur-3xl"
                    style={{ width: o.size, height: o.size, left: o.left, top: o.top, background: o.bg }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, 20, 0],
                        scale: [1, 1.2, 0.9, 1],
                        opacity: [0.25, 0.5, 0.3, 0.25],
                    }}
                    transition={{ duration: o.duration, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}

interface MagneticProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export function Magnetic({ children, className = '', strength = 0.22 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 18 });
    const sy = useSpring(y, { stiffness: 260, damping: 18 });

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
    }
    function onLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div ref={ref} className={className} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
            {children}
        </motion.div>
    );
}
