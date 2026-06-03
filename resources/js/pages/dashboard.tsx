import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';

type Snapshot = {
    wellness_score: number;
    risk_level: string;
    trend: number[];
    latest_assessment?: {
        id: number;
        score: number;
        level: string;
        summary?: string;
        completed_at: string;
        title: string;
    } | null;
    recent_journal: Array<{
        title: string;
        mood: string;
        mood_score: number;
        created_at: string;
    }>;
    evaluations_count: number;
    active_days: number;
    improvement: number;
    achievements: Array<{
        title: string;
        active: boolean;
    }>;
    distribution: {
        positive: number;
        neutral: number;
        difficult: number;
        has_data: boolean;
    };
    history: Array<{
        title: string;
        type: string;
        score: number;
        level: string;
        completed_at: string;
        wellness_pct: number;
    }>;
};

type PageProps = {
    snapshot: Snapshot;
    user: {
        name: string;
        email: string;
        role: string;
        status: string;
    };
};

export default function Dashboard() {
    const { snapshot, user } = usePage<PageProps>().props;

    // Count how many achievements are active
    const activeAchievementsCount = snapshot.achievements.filter(a => a.active).length;

    // Calculate consisteciaUser dynamically based on completed evaluations
    const consistenciaUser = snapshot.evaluations_count >= 4 ? 95 : (snapshot.evaluations_count >= 2 ? 80 : (snapshot.evaluations_count === 1 ? 40 : 0));

    return (
        <>
            <Head title="Mi Progreso" />
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
                
                {/* Welcome summary header panel */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Mi Progreso</p>
                            <h1 className="text-3xl font-extrabold mt-1 tracking-tight">¡Hola, {user.name}!</h1>
                            <p className="text-sm text-muted-foreground mt-2 font-light">Aquí está tu resumen de progreso emocional en tiempo real.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-muted/65 border border-border p-4 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado actual:</span>
                            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                                snapshot.risk_level === 'Bajo' || snapshot.risk_level === 'Estable'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : snapshot.risk_level === 'Moderado'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                            }`}>
                                {snapshot.risk_level}
                            </span>
                        </div>
                    </div>

                    {/* Key Mini Stats Grid */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center shadow-3xs">
                            <span className="block text-3xl font-black text-foreground">{snapshot.evaluations_count}</span>
                            <span className="block mt-1.5 text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Cuestionarios</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center shadow-3xs">
                            <span className="block text-3xl font-black text-foreground">{snapshot.active_days}</span>
                            <span className="block mt-1.5 text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Días Activo</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center shadow-3xs">
                            <span className="block text-3xl font-black text-foreground">{activeAchievementsCount}</span>
                            <span className="block mt-1.5 text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Logros</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center shadow-3xs">
                            <span className="block text-3xl font-black text-foreground">{snapshot.improvement}%</span>
                            <span className="block mt-1.5 text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Mejoría</span>
                        </div>
                    </div>
                </div>

                {/* History & Trends Block */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Evaluation History */}
                    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                        <h3 className="text-xl font-bold tracking-tight">
                            Historial de Evaluaciones
                        </h3>
                        
                        {snapshot.history && snapshot.history.length > 0 ? (
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                                {snapshot.history.map((evalItem, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-foreground/10 transition">
                                        <div className="space-y-1">
                                            <span className="px-2 py-0.5 rounded text-[8px] bg-muted border border-border font-bold uppercase text-muted-foreground">{evalItem.type}</span>
                                            <h4 className="font-bold text-sm tracking-tight">{evalItem.title}</h4>
                                            <p className="text-[9px] text-muted-foreground font-light">Completado el {evalItem.completed_at}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4">
                                            <div className="text-right">
                                                <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Puntaje</span>
                                                <span className="block text-base font-black">{evalItem.score}</span>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                                                evalItem.level === 'Bajo' || evalItem.level === 'Estable'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                    : evalItem.level === 'Moderado'
                                                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                    : 'bg-destructive/10 text-destructive border-destructive/20'
                                            }`}>
                                                {evalItem.level}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-border rounded-2xl text-center space-y-4">
                                <p className="text-sm text-muted-foreground font-light">No has completado ningún cuestionario aún</p>
                                <Button asChild className="bg-foreground text-background hover:bg-foreground/90 h-10 font-bold rounded-xl transition cursor-pointer">
                                    <Link href="/assessments">Comenzar ahora</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Charts: Emotion Trends & Distribution */}
                    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                        <h3 className="text-xl font-bold tracking-tight">
                            Evolución Emocional
                        </h3>
                        
                        {/* Dynamic SVG Line Chart */}
                        {snapshot.history && snapshot.history.length > 0 ? (
                            <div className="relative h-44 w-full border-b border-l border-border/80 p-2 bg-muted/10 rounded-xl flex items-end">
                                <div className="absolute right-2 top-2 text-[8px] text-muted-foreground space-y-1 bg-card p-2 rounded-lg border border-border shadow-3xs font-semibold z-10">
                                    <p className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-1.5 bg-rose-500 rounded-sm" /> Ansiedad (GAD-7)</p>
                                    <p className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-1.5 bg-amber-500 rounded-sm" /> Depresión (PHQ-9)</p>
                                    <p className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-1.5 bg-teal-500 rounded-sm" /> Estrés (PSS-10)</p>
                                    <p className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-1.5 bg-purple-500 rounded-sm" /> Autoestima (Rosenberg)</p>
                                </div>

                                <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {(() => {
                                        const chronological = [...snapshot.history].reverse();
                                        const points = chronological.map((item, idx) => {
                                            const x = chronological.length > 1 ? (idx / (chronological.length - 1)) * 100 : 50;
                                            const y = 100 - item.wellness_pct;
                                            return { x, y, ...item };
                                        });
                                        const pathData = points.map(p => `${p.x},${p.y}`).join(' L ');
                                        
                                        return (
                                            <>
                                                {points.length > 1 && (
                                                    <path
                                                        d={`M ${pathData}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        className="text-foreground/70"
                                                    />
                                                )}
                                                {points.map((p, i) => (
                                                    <circle
                                                        key={i}
                                                        cx={p.x}
                                                        cy={p.y}
                                                        r="3.5"
                                                        className={`${
                                                            p.type === 'GAD-7'
                                                                ? 'fill-rose-500'
                                                                : p.type === 'PHQ-9'
                                                                ? 'fill-amber-500'
                                                                : p.type === 'PSS-10'
                                                                ? 'fill-teal-500'
                                                                : p.type === 'Rosenberg'
                                                                ? 'fill-purple-500'
                                                                : 'fill-sky-500'
                                                        } stroke-background stroke-2`}
                                                    />
                                                ))}
                                            </>
                                        );
                                    })()}
                                </svg>
                            </div>
                        ) : (
                            <div className="h-44 w-full border border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/10 p-4 text-center">
                                <p className="text-xs text-muted-foreground font-light">
                                    Completa cuestionarios clínicos para comenzar a graficar tu evolución de bienestar en tiempo real.
                                </p>
                            </div>
                        )}

                        {/* Pie Chart / Stacked bar distribution */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                Distribución de Bienestar
                            </h4>
                            <div className="h-4.5 w-full rounded-full bg-muted border border-border overflow-hidden flex">
                                {snapshot.distribution.positive > 0 && (
                                    <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${snapshot.distribution.positive}%` }} title={`Estable: ${snapshot.distribution.positive}%`} />
                                )}
                                {snapshot.distribution.neutral > 0 && (
                                    <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${snapshot.distribution.neutral}%` }} title={`Moderado: ${snapshot.distribution.neutral}%`} />
                                )}
                                {snapshot.distribution.difficult > 0 && (
                                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${snapshot.distribution.difficult}%` }} title={`Crítico: ${snapshot.distribution.difficult}%`} />
                                )}
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-muted-foreground px-1 uppercase tracking-wide">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> {snapshot.distribution.positive}% Estable</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> {snapshot.distribution.neutral}% Moderado</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> {snapshot.distribution.difficult}% Crítico</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detected Patterns */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">
                        Patrones Detectados
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-3xs">
                            <h4 className="font-bold text-sm tracking-tight">Consistencia</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                {snapshot.evaluations_count >= 2
                                    ? 'Has registrado múltiples evaluaciones, lo que nos permite trazar una tendencia clínica real.'
                                    : 'Completa al menos dos cuestionarios para comenzar a trazar tu línea de consistencia emocional.'}
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-3xs">
                            <h4 className="font-bold text-sm tracking-tight">Diario Emocional</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                {snapshot.recent_journal && snapshot.recent_journal.length > 0
                                    ? 'Utilizas el diario para expresar tus ideas académicas, un excelente hábito para regular la ansiedad.'
                                    : 'Escribir tus pensamientos en el diario de forma regular te ayudará a mitigar el estrés académico.'}
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-3xs">
                            <h4 className="font-bold text-sm tracking-tight">Carga y Rendimiento</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                {snapshot.risk_level === 'Bajo' || snapshot.risk_level === 'Estable'
                                    ? 'Tu nivel actual indica un estado de bienestar saludable y equilibrado. Sigue así.'
                                    : snapshot.risk_level === 'Moderado'
                                    ? 'Se detectan picos de tensión transitorios. Las técnicas de respiración te vendrán de maravilla.'
                                    : 'Nivel de alerta elevado. Te sugerimos conversar con el asistente o con Bienestar Universitario.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logros y Reconocimientos */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold tracking-tight">
                            Logros y Reconocimientos
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-light">Insignias Desbloqueadas:</span>
                            <span className="px-3 py-1 bg-foreground/5 border border-border rounded-full text-foreground text-xs font-black">{activeAchievementsCount} / {snapshot.achievements.length}</span>
                        </div>
                    </div>

                    {/* Dynamic Achievements Icons Grid */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                        {snapshot.achievements.map((badge, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition duration-300 shadow-3xs ${
                                    badge.active
                                        ? 'border-foreground/30 bg-foreground/5 text-foreground'
                                        : 'border-border bg-muted/20 text-muted-foreground opacity-50 select-none'
                                }`}
                            >
                                <span className="text-xs font-bold tracking-tight leading-tight">{badge.title}</span>
                                <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-75">
                                    {badge.active ? 'Desbloqueado' : 'Bloqueado'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights & Recommendations */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">
                        Insights y Recomendaciones Personalizadas
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Rec 1 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-tight">Recomendación Principal</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Practica 10 minutos de meditación guiada o respiración diafragmática para mantener el enfoque académico.
                                </p>
                                <div className="flex gap-2 pt-2 text-[8px] font-bold uppercase tracking-wider">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Eficacia: 92%</span>
                                    <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground border border-border">Fácil</span>
                                </div>
                            </div>
                        </div>
                        {/* Rec 2 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-tight">Recurso Sugerido</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Te sugerimos practicar el ejercicio de "Respiración Cuadrada" para regular picos de tensión.
                                </p>
                                <Link
                                    href="/resources"
                                    className="text-[10px] text-foreground hover:underline font-bold block pt-2 transition"
                                >
                                    Ver Recurso Relajante →
                                </Link>
                            </div>
                        </div>
                        {/* Rec 3 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-tight">Progreso Progresivo</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Tus datos se procesan directamente de forma segura desde la base de datos para generar tu evolución.
                                </p>
                                <span className="inline-block mt-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted border border-border text-foreground/80">
                                    Conexión Activa
                                </span>
                            </div>
                        </div>
                        {/* Rec 4 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-tight">Meta Semanal</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Completa al menos 1 cuestionario y 1 registro de diario esta semana para robustecer tu mapa analítico.
                                </p>
                                <span className="inline-block mt-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted border border-border text-foreground/80">
                                    {snapshot.evaluations_count >= 1 ? '1/1 completado' : '0/1 completado'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Progress */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">
                        Tu Progreso vs Comunidad
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-muted-foreground">Tu Consistencia</span>
                                <span className="text-foreground font-black">{consistenciaUser}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${consistenciaUser}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-light">Comunidad: 72% de consistencia de promedio académico.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-muted-foreground">Tu Mejoría</span>
                                <span className="text-foreground font-black">+{snapshot.improvement}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${snapshot.improvement}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-light">Te encuentras en la ruta progresiva de autocuidado para regular tu rendimiento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Mi Progreso',
            href: '/dashboard',
        },
    ],
};
