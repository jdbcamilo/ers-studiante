import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Evaluation = {
    id: number;
    score: number;
    level: string;
    summary: string;
    completed_at?: string;
    questionnaire?: {
        title: string;
        type: string;
    };
};

type Snapshot = {
    wellness_score: number;
    risk_level: string;
    trend: number[];
    latest_assessment?: Evaluation | null;
    recent_journal: Array<{
        title: string;
        mood: string;
        mood_score: number;
        created_at?: string;
    }>;
};

type PageProps = {
    snapshot: Snapshot;
    evaluations: Evaluation[];
    auth: {
        user: {
            name: string;
        };
    };
};

const formatDate = (value?: string) => {
    if (!value) {
        return 'Sin fecha';
    }

    return new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function Reports() {
    const { snapshot, evaluations, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Mi Progreso" />

            <div className="space-y-8 text-foreground animate-in fade-in duration-300">
                {/* Header back button */}
                <div className="flex items-center">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>

                {/* Welcome summary header panel */}
                <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Mi Progreso</p>
                            <h1 className="text-3xl font-extrabold mt-1">👋 ¡Hola, {auth.user?.name || 'Usuario'}!</h1>
                            <p className="text-sm text-muted-foreground mt-2">Aquí está tu resumen de progreso emocional</p>
                        </div>
                        <div className="flex items-center gap-4 bg-muted border border-border p-4 rounded-2xl">
                            <span className="text-sm font-bold text-muted-foreground">Estado actual:</span>
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-sm font-extrabold flex items-center gap-1">
                                Estable 😊
                            </span>
                        </div>
                    </div>

                    {/* Key Mini Stats Grid */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-black text-primary">{evaluations.length}</span>
                            <span className="block mt-1 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Cuestionarios</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-black text-primary">156</span>
                            <span className="block mt-1 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Días Activo</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-black text-primary">24</span>
                            <span className="block mt-1 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Logros</span>
                        </div>
                        <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-black text-primary">30%</span>
                            <span className="block mt-1 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Mejoría</span>
                        </div>
                    </div>
                </div>

                {/* Evaluation History */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            📊 Historial de Evaluaciones
                        </h3>
                        
                        {evaluations.length === 0 ? (
                            <div className="p-8 border border-dashed border-border rounded-2xl text-center space-y-4">
                                <span className="text-4xl block select-none">📋</span>
                                <p className="text-sm text-muted-foreground">No has completado ningún cuestionario aún</p>
                                <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground h-10 font-bold rounded-xl transition">
                                    <Link href="/assessments">Comenzar ahora</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {evaluations.map((item, idx) => (
                                    <div key={item.id || idx} className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold">{item.questionnaire?.title ?? 'Evaluación'}</h4>
                                            <span className="text-[10px] text-muted-foreground">{formatDate(item.completed_at)}</span>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                                Puntaje: {item.score}
                                            </span>
                                            <span className="block text-xs font-semibold text-primary mt-1">{item.level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {evaluations.length > 0 && (
                            <div className="text-right pt-2">
                                <Link
                                    href="/assessments"
                                    className="text-primary hover:text-primary/80 font-bold text-sm inline-flex items-center gap-1.5 transition"
                                >
                                    Realizar nueva evaluación →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Charts: Emotion Trends & Distribution */}
                    <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            📈 Evolución Emocional
                        </h3>
                        
                        {/* Mock SVG Line Chart */}
                        <div className="relative h-44 w-full border-b border-l border-border/85 p-2 bg-muted/10 rounded-xl">
                            <div className="absolute right-2 top-2 text-[9px] text-muted-foreground space-y-1 bg-card p-2 rounded-lg border border-border shadow-sm">
                                <p className="flex items-center gap-1"><span className="inline-block w-2.5 h-1.5 bg-rose-500 rounded-sm" /> Ansiedad</p>
                                <p className="flex items-center gap-1"><span className="inline-block w-2.5 h-1.5 bg-amber-500 rounded-sm" /> Depresión</p>
                                <p className="flex items-center gap-1"><span className="inline-block w-2.5 h-1.5 bg-teal-500 rounded-sm" /> Estrés</p>
                                <p className="flex items-center gap-1"><span className="inline-block w-2.5 h-1.5 bg-purple-500 rounded-sm" /> Autoestima</p>
                            </div>

                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Ansiedad Line */}
                                <path d="M 0 65 L 20 55 L 40 40 L 60 48 L 80 30 L 100 25" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                                {/* Depresión Line */}
                                <path d="M 0 75 L 20 60 L 40 50 L 60 55 L 80 40 L 100 35" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" />
                                {/* Estrés Line */}
                                <path d="M 0 55 L 20 45 L 40 30 L 60 35 L 80 20 L 100 15" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
                                {/* Autoestima Line */}
                                <path d="M 0 45 L 20 50 L 40 65 L 60 58 L 80 75 L 100 80" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                            </svg>
                        </div>

                        {/* Pie Chart / Stacked bar distribution */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                🥧 Distribución Emocional
                            </h4>
                            <div className="h-4 w-full rounded-full bg-muted border border-border overflow-hidden flex">
                                <div className="h-full bg-teal-500" style={{ width: '65%' }} title="Días Positivos: 65%" />
                                <div className="h-full bg-sky-500" style={{ width: '25%' }} title="Días Neutrales: 25%" />
                                <div className="h-full bg-rose-500" style={{ width: '10%' }} title="Días Difíciles: 10%" />
                            </div>
                            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-1">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> 65% Días Positivos</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> 25% Días Neutrales</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> 10% Días Difíciles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detected Patterns */}
                <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        🔍 Patrones Detectados
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-sm">
                            <span className="text-2xl block select-none">📈</span>
                            <h4 className="font-bold text-sm">Mejoría Consistente</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                Tu nivel de estrés ha disminuido un <span className="text-primary font-bold">30%</span> en las últimas 2 semanas.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3 shadow-sm">
                            <span className="text-2xl block select-none">⚠️</span>
                            <h4 className="font-bold text-sm">Patrón Semanal</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                Los lunes muestran mayor ansiedad. Recomendamos aplicar técnicas de inicio de semana.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-sm">
                            <span className="text-2xl block select-none">💪</span>
                            <h4 className="font-bold text-sm">Fortaleza Identificada</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                Excelente manejo de situaciones sociales según tus reportes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logros y Reconocimientos */}
                <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            🏆 Logros y Reconocimientos
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Progreso Total:</span>
                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black">45%</span>
                        </div>
                    </div>

                    {/* Custom Achievements Icons Grid */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                        {[
                            { icon: '🎯', title: 'Primer Paso', active: true },
                            { icon: '🔥', title: 'Constancia', active: true },
                            { icon: '⭐', title: 'Dedicación', active: true },
                            { icon: '🏆', title: 'Experto', active: false },
                            { icon: '👑', title: 'Maestro', active: false },
                            { icon: '📈', title: 'Evolución Positiva', active: true }
                        ].map((badge, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition duration-300 ${
                                    badge.active
                                        ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                                        : 'border-border bg-muted/20 text-muted-foreground opacity-50 select-none'
                                }`}
                            >
                                <span className="text-3xl">{badge.icon}</span>
                                <span className="text-[10px] font-bold tracking-tight">{badge.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights & Recommendations */}
                <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        💡 Insights y Recomendaciones Personalizadas
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Rec 1 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <span className="text-3xl shrink-0">🎯</span>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm">Recomendación Principal</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                    Practica 10 minutos de meditación matutina para mejorar tu manejo del estrés durante el día.
                                </p>
                                <div className="flex gap-2 pt-2 text-[8px] font-extrabold uppercase">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Eficacia: 92%</span>
                                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20">Fácil</span>
                                </div>
                            </div>
                        </div>
                        {/* Rec 2 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <span className="text-3xl shrink-0">📚</span>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm">Recurso Sugerido</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                    Te recomendamos el ejercicio de "Respiración Cuadrada" para momentos de alta ansiedad.
                                </p>
                                <Link
                                    href="/resources"
                                    className="text-[10px] text-primary hover:text-primary/80 font-bold block pt-2 transition underline"
                                >
                                    Ver Recurso
                                </Link>
                            </div>
                        </div>
                        {/* Rec 3 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <span className="text-3xl shrink-0">🔄</span>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm">Próxima Evaluación</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                    Tu próximo cuestionario de seguimiento está programado para dentro de 3 días.
                                </p>
                                <span className="inline-block mt-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted border border-border text-foreground/80">
                                    72h restantes
                                </span>
                            </div>
                        </div>
                        {/* Rec 4 */}
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                            <span className="text-3xl shrink-0">🌟</span>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm">Meta Semanal</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                                    Completa al menos 4 sesiones de mindfulness esta semana para mantener tu progreso de autocuidado.
                                </p>
                                <span className="inline-block mt-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted border border-border text-foreground/80">
                                    2/4 completadas
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Progress */}
                <div className="rounded-[2.5rem] border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        👥 Tu Progreso vs Comunidad
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-muted-foreground">Tu Consistencia</span>
                                <span className="text-primary font-extrabold">85%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '85%' }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Comunidad: 72% de consistencia de promedio académico.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-muted-foreground">Tu Mejoría</span>
                                <span className="text-primary font-extrabold">+30%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '30%' }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Te encuentras un 15% por encima de la media de mejoría del departamento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Reports.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Mi Progreso',
            href: '/reports',
        },
    ],
};
