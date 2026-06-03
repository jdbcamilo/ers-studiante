import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ArrowRight, Heart, Brain, MessageSquare, Compass, Shield, ArrowUpRight, Activity } from 'lucide-react';

type PageProps = {
    auth: {
        user?: {
            name?: string;
            role?: string;
        };
    };
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Portal de Bienestar Emocional - Universidad de Córdoba" />
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-foreground selection:text-background relative overflow-hidden">
                
                {/* Subtle top decoration grid lines */}
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-muted/20 to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-border/40 pointer-events-none" />
                <div className="absolute top-0 left-[10%] w-px h-screen bg-border/[0.03] dark:bg-border/[0.02] pointer-events-none" />
                <div className="absolute top-0 right-[10%] w-px h-screen bg-border/[0.03] dark:bg-border/[0.02] pointer-events-none" />

                <div className="relative mx-auto max-w-6xl px-6 py-6 flex flex-col min-h-screen justify-between z-10">
                    
                    {/* Navigation Header */}
                    <header className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-sm tracking-tighter">
                                UC
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground leading-none">
                                    Universidad de Córdoba
                                </p>
                                <h1 className="text-sm font-bold tracking-tight text-foreground mt-0.5">
                                    ERS Bienestar
                               </h1>
                            </div>
                        </div>
                        
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link 
                                    href={dashboard()} 
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-bold transition hover:bg-foreground/90 shadow-xs cursor-pointer"
                                >
                                    Ir al Panel <ArrowRight size={12} />
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={login()} 
                                        className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link 
                                        href={register()} 
                                        className="rounded-lg bg-foreground text-background px-4 py-2 text-xs font-bold transition hover:bg-foreground/90 shadow-xs"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <main className="mt-12 md:mt-20 flex-1 flex flex-col gap-12 justify-center">
                        
                        <div className="text-center space-y-6 max-w-3xl mx-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-muted border border-border text-muted-foreground">
                                <Shield size={10} className="text-foreground" /> Espacio Seguro y Confidencial
                            </span>
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                                Tu equilibrio mental,<br/>
                                <span className="font-light italic text-muted-foreground">nuestro compromiso.</span>
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
                                Un portal institucional moderno de la Universidad de Córdoba para el autoconocimiento, monitoreo clínico y soporte emocional activo del estudiante.
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                                {auth.user ? (
                                    <Link 
                                        href={dashboard()} 
                                        className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-xs font-bold transition hover:bg-foreground/90 shadow-sm cursor-pointer"
                                    >
                                        Ver mi progreso <Activity size={14} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href={register()} 
                                            className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-xs font-bold transition hover:bg-foreground/90 shadow-sm"
                                        >
                                            Comenzar Ahora <ArrowRight size={14} />
                                        </Link>
                                        <Link 
                                            href={login()} 
                                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-muted/40 px-6 py-3 text-xs font-bold text-foreground transition shadow-3xs"
                                        >
                                            Conocer más
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* High-End Geometric Dashboard Preview (No hardcoded colors, respecting Light/Dark themes) */}
                        <div className="w-full max-w-4xl mx-auto border border-border bg-card rounded-3xl p-6 shadow-xs relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/[0.01] rounded-full blur-3xl pointer-events-none" />
                            
                            {/* Window Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    Vista previa del Portal
                                </span>
                                <span className="text-[10px] text-muted-foreground/0">...</span>
                            </div>

                            {/* Pseudo Dashboard Layout */}
                            <div className="grid gap-6 md:grid-cols-3 pt-6">
                                <div className="space-y-4 md:col-span-2">
                                    <div className="p-5 border border-border bg-muted/20 rounded-2xl space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Evolución Emocional</p>
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-foreground/10 text-foreground rounded border border-border">
                                                Últimos 30 días
                                            </span>
                                        </div>
                                        {/* Pure SVG Minimalist B&W Chart */}
                                        <div className="h-28 w-full flex items-end">
                                            <svg className="w-full h-full text-foreground/20" viewBox="0 0 100 30" preserveAspectRatio="none">
                                                <path
                                                    d="M0,25 Q15,10 30,18 T60,5 T90,15 T100,8 L100,30 L0,30 Z"
                                                    fill="currentColor"
                                                    className="text-muted/30"
                                                />
                                                <path
                                                    d="M0,25 Q15,10 30,18 T60,5 T90,15 T100,8"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                    className="text-foreground/60"
                                                />
                                                {/* Dots */}
                                                <circle cx="30" cy="18" r="1.5" className="fill-foreground" />
                                                <circle cx="60" cy="5" r="1.5" className="fill-foreground" />
                                                <circle cx="90" cy="15" r="1.5" className="fill-foreground" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border border-border bg-card rounded-2xl space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Estado Actual</p>
                                            <p className="text-base font-extrabold">Estable y Focado</p>
                                        </div>
                                        <div className="p-4 border border-border bg-card rounded-2xl space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Logros Activos</p>
                                            <p className="text-base font-extrabold">4 Insignias</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-5 border border-border bg-card rounded-2xl h-full flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                                                <Brain size={16} className="text-foreground" />
                                            </div>
                                            <p className="text-xs font-bold leading-tight">Cuestionarios Diagnósticos</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-light">
                                                Completa evaluaciones y recibe reportes clínicos respaldados.
                                            </p>
                                        </div>
                                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                            <div className="bg-foreground h-full w-[65%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* El Proyecto ERS Bienestar Section */}
                        <div className="border border-border bg-muted/10 rounded-3xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4 pr-0 md:pr-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-card border border-border text-foreground">
                                        El Proyecto
                                    </span>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                        ERS Bienestar Universitario
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Es un proyecto de investigación y soporte psicoemocional desarrollado en la <strong>Universidad de Córdoba</strong>. Nace con el propósito de ofrecer un canal autónomo y seguro para mitigar los efectos del estrés de exámenes, la sobrecarga en entregas y los picos de ansiedad académica en la comunidad estudiantil de Córdoba.
                                    </p>
                                </div>
                                <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-card border border-border text-foreground">
                                        Objetivos Principales
                                    </span>
                                    <div className="space-y-3.5">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground">1. Prevención y Autogestión Clínica</h4>
                                            <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
                                                Facilitar el acceso confidencial a 8 cuestionarios médicos estandarizados para que los estudiantes monitoreen su salud mental científicamente.
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground">2. Regulación Emocional Autónoma</h4>
                                            <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
                                                Dotar al portal de herramientas prácticas (Jacobson, arraigo, respiración diafragmática) para intervenciones inmediatas ante crisis de tensión.
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground">3. Soporte Inteligente Anónimo</h4>
                                            <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
                                                Mantener un asistente con IA disponible 24/7 que brinde respuestas terapéuticas y acompañe al alumno de manera segura y sin juicios de valor.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Showcase Grid */}
                        <div className="space-y-6 pt-12">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight">Módulos de Cuidado Activo</h3>
                                <p className="text-xs text-muted-foreground font-light">Herramientas organizadas de manera geométrica, minimalista y libre de distractores.</p>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                
                                {/* Feature 1 */}
                                <div className="group p-6 border border-border bg-card rounded-2xl flex flex-col justify-between space-y-6 hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300">
                                    <div className="space-y-4">
                                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                                            <Activity size={16} className="text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">Mi Progreso</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                                                Seguimiento analítico de tendencias, patrones semanales y distribución de estados de ánimo.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-bold inline-flex items-center gap-1 transition">
                                        Explorar <ArrowUpRight size={10} />
                                    </span>
                                </div>

                                {/* Feature 2 */}
                                <div className="group p-6 border border-border bg-card rounded-2xl flex flex-col justify-between space-y-6 hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300">
                                    <div className="space-y-4">
                                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                                            <Brain size={16} className="text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">Cuestionarios</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                                                8 escalas clínicas validadas para evaluar ansiedad, estrés, sueño, autoestima y burnout académico.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-bold inline-flex items-center gap-1 transition">
                                        Explorar <ArrowUpRight size={10} />
                                    </span>
                                </div>

                                {/* Feature 3 */}
                                <div className="group p-6 border border-border bg-card rounded-2xl flex flex-col justify-between space-y-6 hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300">
                                    <div className="space-y-4">
                                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                                            <MessageSquare size={16} className="text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">Chat de Apoyo</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                                                Acompañamiento empático y conversacional activo potenciado por inteligencia artificial, gratis 24/7.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-bold inline-flex items-center gap-1 transition">
                                        Explorar <ArrowUpRight size={10} />
                                    </span>
                                </div>

                                {/* Feature 4 */}
                                <div className="group p-6 border border-border bg-card rounded-2xl flex flex-col justify-between space-y-6 hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300">
                                    <div className="space-y-4">
                                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                                            <Compass size={16} className="text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">Recursos</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                                                Herramientas de respiración interactiva guiada, técnicas de arraigo sensorial y lectura sugerida.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-bold inline-flex items-center gap-1 transition">
                                        Explorar <ArrowUpRight size={10} />
                                    </span>
                                </div>

                            </div>
                        </div>

                    </main>

                    {/* Footer Section */}
                    <footer className="mt-20 py-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Servicios activos y seguros</span>
                        </div>
                        <p>© 2026 Universidad de Córdoba. Portal ERS. Todos los derechos reservados.</p>
                    </footer>

                </div>
            </div>
        </>
    );
}
