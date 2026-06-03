import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, ArrowLeft, BookOpen, Heart, Wind, Compass, Eye, Headphones, Copy, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Resources() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Mantén' | 'Exhala' | 'Retén'>('Inhala');
    const [breathingProgress, setBreathingProgress] = useState(0);
    const [breathingTimer, setBreathingTimer] = useState(4);
    const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
    const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Gratitude states
    const [activeGratitudePromptIndex, setActiveGratitudePromptIndex] = useState(0);
    const [gratitudeText, setGratitudeText] = useState('');
    const [copiedSuccess, setCopiedSuccess] = useState(false);

    // Jacobson relaxation states
    const [jacobsonActive, setJacobsonActive] = useState(false);
    const [jacobsonStepIdx, setJacobsonStepIdx] = useState(0);
    const [jacobsonTimer, setJacobsonTimer] = useState(5);

    // Meditación Guiada states
    const [meditationActive, setMeditationActive] = useState(false);
    const [meditationTimer, setMeditationTimer] = useState(600); // 10 minutes
    const [meditationTrack, setMeditationTrack] = useState('Atención al Aliento');

    // Técnica de Arraigo states
    const [arraigoActive, setArraigoActive] = useState(false);
    const [arraigoStep, setArraigoStep] = useState(5);

    // Paisajes Sonoros states
    const [soundsActive, setSoundsActive] = useState(false);
    const [soundsTrack, setSoundsTrack] = useState('Lluvia en el Sinú');
    const [soundVolume, setSoundVolume] = useState(80);
    const [soundSeconds, setSoundSeconds] = useState(0);

    const TOLLE_QUOTES = [
        "El pasado no tiene poder sobre el momento presente.",
        "Cualquiera que sea el momento presente, acéptalo como si lo hubieras elegido.",
        "La causa principal de la infelicidad nunca es la situación, sino tus pensamientos sobre ella.",
        "Date cuenta profundamente de que el momento presente es todo lo que tienes.",
        "No te preocupes por el fruto de tus acciones; mantente atento a la acción en sí."
    ];

    const GRATITUDE_PROMPTS = [
        "¿Qué pequeña victoria académica lograste hoy por mínima que fuera?",
        "Menciona a un compañero o profesor que te apoyó o te sacó una sonrisa hoy.",
        "¿Qué espacio de la Universidad de Córdoba disfrutas más y por qué?",
        "Identifica un momento de calma, un café o un almuerzo que disfrutaste hoy.",
        "¿Qué habilidad personal te ayudó a superar un obstáculo académico esta semana?"
    ];

    const JACOBSON_STEPS = [
        { title: "Tensa los Hombros", desc: "Eleva los hombros firmemente hacia las orejas.", action: "Tensa", duration: 5 },
        { title: "Suelta los Hombros", desc: "Suelta toda la tensión de golpe y respira profundo.", action: "Relaja", duration: 10 },
        { title: "Tensa los Puños", desc: "Cierra los puños con fuerza sintiendo la tensión en los antebrazos.", action: "Tensa", duration: 5 },
        { title: "Suelta los Puños", desc: "Abre los dedos y deja caer los brazos relajados.", action: "Relaja", duration: 10 },
        { title: "Tensa el Rostro", desc: "Arruga la frente y aprieta los ojos fuertemente.", action: "Tensa", duration: 5 },
        { title: "Relaja el Rostro", desc: "Suelta todos los músculos faciales, esboza una leve sonrisa.", action: "Relaja", duration: 10 },
    ];

    const handleNextQuote = () => {
        setActiveQuoteIndex((prev) => (prev + 1) % TOLLE_QUOTES.length);
    };

    const handleNextGratitudePrompt = () => {
        setActiveGratitudePromptIndex((prev) => (prev + 1) % GRATITUDE_PROMPTS.length);
        setCopiedSuccess(false);
    };

    const handleCopyGratitude = () => {
        if (!gratitudeText.trim()) return;
        navigator.clipboard.writeText(gratitudeText);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2000);
    };

    // Effect for Jacobson Progressive Relaxation
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (jacobsonActive) {
            interval = setInterval(() => {
                setJacobsonTimer((prev) => {
                    if (prev <= 1) {
                        const nextIdx = (jacobsonStepIdx + 1) % JACOBSON_STEPS.length;
                        setJacobsonStepIdx(nextIdx);
                        return JACOBSON_STEPS[nextIdx].duration;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setJacobsonStepIdx(0);
            setJacobsonTimer(JACOBSON_STEPS[0].duration);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [jacobsonActive, jacobsonStepIdx]);

    // Effect for Meditation
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (meditationActive) {
            interval = setInterval(() => {
                setMeditationTimer((prev) => {
                    if (prev <= 1) {
                        setMeditationActive(false);
                        return 600;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setMeditationTimer(600);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [meditationActive]);

    // Effect for Sounds
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (soundsActive) {
            interval = setInterval(() => {
                setSoundSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            setSoundSeconds(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [soundsActive]);

    useEffect(() => {
        if (breathingActive) {
            let elapsed = 0;
            let currentTimer = 4;
            breathingIntervalRef.current = setInterval(() => {
                elapsed = (elapsed + 1) % 16;
                currentTimer--;
                if (currentTimer <= 0) {
                    currentTimer = 4;
                }
                setBreathingTimer(currentTimer);

                const percent = ((elapsed % 4) / 3) * 100;
                setBreathingProgress(percent);

                if (elapsed < 4) {
                    setBreathingPhase('Inhala');
                } else if (elapsed < 8) {
                    setBreathingPhase('Mantén');
                } else if (elapsed < 12) {
                    setBreathingPhase('Exhala');
                } else {
                    setBreathingPhase('Retén');
                }
            }, 1000);
        } else {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current);
            }
            setBreathingPhase('Inhala');
            setBreathingProgress(0);
            setBreathingTimer(4);
        }

        return () => {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current);
            }
        };
    }, [breathingActive]);

    const toggleBreathing = () => {
        setBreathingActive(!breathingActive);
    };

    return (
        <>
            <Head title="Recursos de Bienestar" />
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 text-foreground max-w-6xl mx-auto px-4 md:px-0">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs font-semibold tracking-wider uppercase transition"
                    >
                        <ArrowLeft size={14} /> Volver a Mi Progreso
                    </Link>
                </div>

                {/* Hero section */}
                <div className="p-8 md:p-12 border border-border bg-card rounded-3xl text-center space-y-4 relative overflow-hidden shadow-xs">
                    <div className="absolute inset-0 bg-radial from-foreground/[0.02] to-transparent pointer-events-none" />
                    <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center mx-auto shadow-2xs">
                        <Heart className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Recursos para el Bienestar</h1>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
                            Ejercicios prácticos, técnicas de regulación emocional y lecturas diseñadas para acompañar tu salud mental en el ámbito académico.
                        </p>
                    </div>
                </div>

                {/* Filters Tab Menu */}
                <div className="flex flex-wrap gap-2 justify-center py-4 border-y border-border">
                    {[
                        'Todos',
                        'Ejercicios Prácticos',
                        'Meditación',
                        'Manejo de Ansiedad',
                        'Videos Relajantes',
                        'Lectura Recomendada'
                    ].map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                selectedCategory === cat
                                    ? 'bg-foreground text-background shadow-xs'
                                    : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border hover:text-foreground'
                            }`}
                        >
                            {cat === 'Todos' ? 'Todos los Recursos' : cat}
                        </button>
                    ))}
                </div>

                {/* Resource Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                    {/* CARD 1: RESPIRACION CUADRADA */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Ejercicios Prácticos' || selectedCategory === 'Manejo de Ansiedad') && (
                        <div className="rounded-3xl border border-foreground/20 bg-muted/20 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[400px] hover:border-foreground/30 transition-all duration-300">
                            <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-foreground/10 text-foreground border border-foreground/10">
                                Recomendado
                            </span>
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-2xs">
                                    <Wind className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">Respiración Cuadrada</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Técnica estructurada para calmar el sistema nervioso rápidamente durante picos de alta ansiedad o estrés académico.
                                    </p>
                                </div>

                                {/* Circular Breathing Visual Animation */}
                                {breathingActive ? (
                                    <div className="py-2 flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-300">
                                        <div className="relative w-24 h-24 rounded-full border-2 border-border flex items-center justify-center overflow-hidden bg-card shadow-2xs">
                                            <div
                                                className="absolute inset-0 bg-foreground/5 rounded-full transition-all duration-1000 ease-in-out"
                                                style={{
                                                    transform: breathingPhase === 'Inhala' ? 'scale(1)' : breathingPhase === 'Exhala' ? 'scale(0.3)' : 'scale(0.7)'
                                                }}
                                            />
                                            <div className="z-10 text-center">
                                                <span className="block text-[9px] uppercase tracking-widest text-foreground font-bold animate-pulse">
                                                    {breathingPhase}
                                                </span>
                                                <span className="text-lg font-extrabold">{breathingTimer}s</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-card border border-border">
                                        <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">Instrucciones</p>
                                        <ol className="text-[10px] text-muted-foreground space-y-1.5 font-light">
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">1.</span> Inhala profundamente durante 4 segundos.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">2.</span> Mantén el aire durante 4 segundos.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">3.</span> Exhala despacio durante 4 segundos.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">4.</span> Retén en vacío durante 4 segundos.
                                            </li>
                                        </ol>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={toggleBreathing}
                                className={`w-full mt-6 h-10 font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                                    breathingActive
                                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        : 'bg-foreground text-background hover:bg-foreground/90'
                                }`}
                            >
                                {breathingActive ? <Pause size={14} /> : <Play size={14} />}
                                {breathingActive ? 'Detener Práctica' : 'Practicar Ahora'}
                            </Button>
                        </div>
                    )}

                    {/* CARD 2: MEDITACION PARA PRINCIPIANTES */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Meditación') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            {meditationActive ? (
                                <div className="space-y-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded text-[8px] bg-foreground/10 text-foreground font-black uppercase tracking-wider border border-border">
                                                En Sesión
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {Math.floor(meditationTimer / 60)}:{String(meditationTimer % 60).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">{meditationTrack}</h4>
                                            <p className="text-[10px] text-muted-foreground font-light">Cierra los ojos y sigue tu aliento...</p>
                                        </div>

                                        {/* Animated Breathing Circle */}
                                        <div className="flex items-center justify-center py-4">
                                            <div className="relative w-20 h-20 rounded-full border border-border flex items-center justify-center bg-muted/20">
                                                <div className="absolute inset-0 rounded-full bg-foreground/5 animate-ping duration-[3000ms]" />
                                                <div className="absolute w-12 h-12 rounded-full bg-foreground/10 animate-pulse duration-[2000ms]" />
                                                <Wind className="h-5 w-5 text-foreground z-10 animate-spin duration-[8000ms]" />
                                            </div>
                                        </div>

                                        {/* Track selector buttons */}
                                        <div className="grid grid-cols-3 gap-1 pt-2">
                                            {[
                                                { label: 'Aliento', track: 'Atención al Aliento', min: 600 },
                                                { label: 'Cuerpo', track: 'Escaneo Corporal', min: 900 },
                                                { label: 'Examen', track: 'Calma Pre-parcial', min: 300 }
                                            ].map((t) => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => {
                                                        setMeditationTrack(t.track);
                                                        setMeditationTimer(t.min);
                                                    }}
                                                    className={`px-1 py-1 rounded text-[8px] font-bold border transition ${
                                                        meditationTrack === t.track
                                                            ? 'bg-foreground text-background border-foreground'
                                                            : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={() => setMeditationActive(false)}
                                            className="flex-1 bg-muted hover:bg-muted/80 text-foreground border border-border h-9 text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            Detener
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-5">
                                        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                            <Compass className="h-5 w-5 text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold tracking-tight">Meditación Guiada</h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                                Sesión interactiva de meditación guiada con guías de aliento y audio-relajación mental.
                                            </p>
                                        </div>

                                        {/* Video Thumbnail click triggers active state */}
                                        <div 
                                            onClick={() => setMeditationActive(true)}
                                            className="relative rounded-2xl overflow-hidden border border-border aspect-video group cursor-pointer bg-black/40 flex items-center justify-center shadow-3xs"
                                        >
                                            <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-all duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=80')" }} />
                                            <div className="absolute bottom-2 left-2 flex gap-1">
                                                <span className="px-2 py-0.5 rounded text-[8px] bg-background/90 text-foreground font-bold tracking-wider uppercase border border-border">10 min</span>
                                            </div>
                                            <div className="z-10 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                                                <Play size={14} className="fill-current ml-0.5" />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 rounded text-[8px] bg-muted text-muted-foreground border border-border font-bold uppercase tracking-wide">Foco</span>
                                            <span className="px-2 py-0.5 rounded text-[8px] bg-muted text-muted-foreground border border-border font-bold uppercase tracking-wide">Calma</span>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setMeditationActive(true)}
                                        className="w-full mt-6 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition cursor-pointer shadow-3xs"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CARD 3: TECNICA 5-4-3-2-1 */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Ejercicios Prácticos' || selectedCategory === 'Manejo de Ansiedad') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            {arraigoActive ? (
                                <div className="space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground text-[8px] font-black uppercase tracking-wider border border-border">
                                                Arraigo Activo
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                Paso {6 - arraigoStep} de 5
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-2xl border border-border bg-muted/10 space-y-4 text-center">
                                            {/* Sense icon */}
                                            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto shadow-3xs animate-bounce">
                                                {arraigoStep === 5 && <Eye className="h-5 w-5 text-foreground" />}
                                                {arraigoStep === 4 && <Heart className="h-5 w-5 text-foreground" />}
                                                {arraigoStep === 3 && <Volume2 className="h-5 w-5 text-foreground" />}
                                                {arraigoStep === 2 && <Wind className="h-5 w-5 text-foreground" />}
                                                {arraigoStep === 1 && <Sparkles className="h-5 w-5 text-foreground" />}
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold tracking-tight">
                                                    {arraigoStep === 5 && "Observa 5 cosas"}
                                                    {arraigoStep === 4 && "Siente 4 texturas"}
                                                    {arraigoStep === 3 && "Escucha 3 sonidos"}
                                                    {arraigoStep === 2 && "Huele 2 aromas"}
                                                    {arraigoStep === 1 && "Prueba 1 sabor"}
                                                </h4>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed font-light px-2">
                                                    {arraigoStep === 5 && "Mira a tu alrededor y detén tu mirada en 5 objetos diferentes de la habitación."}
                                                    {arraigoStep === 4 && "Concéntrate en 4 sensaciones físicas de tacto (el roce de la ropa, tu asiento, etc.)."}
                                                    {arraigoStep === 3 && "Presta atención a 3 sonidos sutiles del ambiente o del exterior."}
                                                    {arraigoStep === 2 && "Respira hondo e identifica 2 olores en el aire que te rodea."}
                                                    {arraigoStep === 1 && "Nota 1 sabor en tu boca en este momento exacto."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={() => {
                                                if (arraigoStep > 1) {
                                                    setArraigoStep(arraigoStep - 1);
                                                } else {
                                                    setArraigoActive(false);
                                                    setArraigoStep(5);
                                                }
                                            }}
                                            className="flex-1 bg-foreground hover:bg-foreground/90 text-background h-10 font-bold rounded-xl transition cursor-pointer shadow-3xs"
                                        >
                                            {arraigoStep === 1 ? 'Finalizar Guía' : 'Siguiente Paso'}
                                        </Button>
                                        <button 
                                            onClick={() => {
                                                setArraigoActive(false);
                                                setArraigoStep(5);
                                            }}
                                            className="px-3 rounded-xl border border-border hover:bg-muted/40 text-xs font-bold text-muted-foreground transition hover:text-foreground cursor-pointer"
                                        >
                                            Salir
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-5">
                                        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                            <Eye className="h-5 w-5 text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold tracking-tight">Técnica de Arraigo 5-4-3-2-1</h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                                Método sensorial guiado paso a paso para reconectarte con tus sentidos y disipar la ansiedad de exámenes.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-muted/40 border border-border">
                                            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">Procedimiento Sensorial</p>
                                            <div className="grid grid-cols-5 gap-1 text-center font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                                                <div className="p-1 rounded bg-card border border-border text-foreground">5 Ver</div>
                                                <div className="p-1 rounded bg-card border border-border text-foreground">4 Tocar</div>
                                                <div className="p-1 rounded bg-card border border-border text-foreground">3 Oír</div>
                                                <div className="p-1 rounded bg-card border border-border text-foreground">2 Oler</div>
                                                <div className="p-1 rounded bg-card border border-border text-foreground">1 Probar</div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            setArraigoActive(true);
                                            setArraigoStep(5);
                                        }}
                                        className="w-full mt-6 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition cursor-pointer shadow-3xs"
                                    >
                                        Iniciar Guía
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CARD 4: SONIDOS RELAJANTES DE NATURALEZA */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Videos Relajantes') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            {soundsActive ? (
                                <div className="space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded text-[8px] bg-foreground/10 text-foreground font-black uppercase tracking-wider border border-border">
                                                Sonido Activo
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {Math.floor(soundSeconds / 60)}:{String(soundSeconds % 60).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <div className="text-center space-y-1">
                                            <h4 className="text-sm font-bold tracking-tight">{soundsTrack}</h4>
                                            <p className="text-[10px] text-muted-foreground font-light">Sonidos binaurales para regular picos de tensión.</p>
                                        </div>

                                        {/* Dynamic Reactive Audio Waves Animation */}
                                        <div className="flex items-end justify-center gap-1.5 h-16 py-3 bg-muted/10 border border-border rounded-xl">
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_1.2s_infinite_100ms] h-8" />
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_0.8s_infinite_300ms] h-4" />
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_1.5s_infinite_200ms] h-10" />
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_1s_infinite_400ms] h-6" />
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_0.9s_infinite_150ms] h-8" />
                                            <span className="w-1 bg-foreground rounded-full animate-[pulse_1.3s_infinite_250ms] h-5" />
                                        </div>

                                        {/* Sound selector buttons */}
                                        <div className="grid grid-cols-3 gap-1 pt-2">
                                            {[
                                                { label: 'Lluvia Sinú', name: 'Lluvia en el Sinú' },
                                                { label: 'Campus U', name: 'Noche en el Campus' },
                                                { label: 'Viento', name: 'Viento de las Sabanas' }
                                            ].map((t) => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => setSoundsTrack(t.name)}
                                                    className={`px-1 py-1 rounded text-[8px] font-bold border transition ${
                                                        soundsTrack === t.name
                                                            ? 'bg-foreground text-background border-foreground'
                                                            : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setSoundsActive(false)}
                                        className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground border border-border h-10 font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Detener Reproducción
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-5">
                                        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                            <Headphones className="h-5 w-5 text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold tracking-tight">Paisajes Sonoros</h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                                Ambientes acústicos binaurales de la naturaleza para bloquear ruido y facilitar tu concentración en el Sinú.
                                            </p>
                                        </div>

                                        {/* Image Box click triggers soundsActive */}
                                        <div 
                                            onClick={() => setSoundsActive(true)}
                                            className="relative rounded-2xl overflow-hidden border border-border aspect-video group cursor-pointer bg-black/40 flex items-center justify-center shadow-3xs"
                                        >
                                            <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-all duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486016006115-74a41448aea2?auto=format&fit=crop&w=300&q=80')" }} />
                                            <div className="absolute bottom-2 left-2 flex gap-1">
                                                <span className="px-2 py-0.5 rounded text-[8px] bg-background/90 text-foreground font-bold tracking-wider uppercase border border-border flex items-center gap-1">
                                                    <Volume2 size={10} /> 8 Horas
                                                </span>
                                            </div>
                                            <div className="z-10 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                                                <Play size={14} className="fill-current ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setSoundsActive(true)}
                                        className="w-full mt-6 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition cursor-pointer shadow-3xs"
                                    >
                                        Escuchar Sonidos
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CARD 5: RESPIRACION DIAFRAGMATICA */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Ejercicios Prácticos') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                    <Wind className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">Respiración Diafragmática</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Activación voluntaria del diafragma para regular el flujo de oxígeno y disipar la fatiga mental de manera orgánica.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-[10px] text-muted-foreground font-light">
                                    <p className="flex gap-2">
                                        <span className="font-semibold text-foreground">1.</span> Adopta una posición cómoda apoyando la espalda.
                                    </p>
                                    <p className="flex gap-2">
                                        <span className="font-semibold text-foreground">2.</span> Sitúa una mano sobre el pecho y otra sobre el vientre.
                                    </p>
                                    <p className="flex gap-2">
                                        <span className="font-semibold text-foreground">3.</span> Inhala inflando el abdomen, no el tórax superior.
                                    </p>
                                    <p className="flex gap-2">
                                        <span className="font-semibold text-foreground">4.</span> Exhala pausadamente, sintiendo el descenso abdominal.
                                    </p>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition cursor-pointer shadow-3xs">
                                Ejercicio Guiado
                            </Button>
                        </div>
                    )}

                    {/* CARD 6: EL PODER DEL AHORA */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Lectura Recomendada') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                    <BookOpen className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">El Poder del Ahora</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Enseñanzas clave y reflexiones prácticas de Eckhart Tolle para contrarrestar la sobrepensación académica.
                                    </p>
                                </div>

                                <div className="p-5 rounded-xl border border-border bg-muted/30 relative min-h-[110px] flex items-center justify-center text-center shadow-3xs">
                                    <p className="text-[10px] italic text-foreground leading-relaxed px-2 font-medium">
                                        "{TOLLE_QUOTES[activeQuoteIndex]}"
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleNextQuote}
                                className="w-full mt-6 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                            >
                                <RefreshCw size={12} /> Cita Siguiente
                            </Button>
                        </div>
                    )}

                    {/* CARD 7: RELAJACION MUSCULAR PROGRESIVA DE JACOBSON */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Ejercicios Prácticos' || selectedCategory === 'Manejo de Ansiedad') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                    <Heart className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">Relajación de Jacobson</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Método físico para liberar la tensión muscular acumulada en el cuerpo mediante contracción y distensión muscular sistemática.
                                    </p>
                                </div>

                                {jacobsonActive ? (
                                    <div className="py-2 flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-300">
                                        <div className="relative w-28 h-28 rounded-full border-2 border-border flex items-center justify-center overflow-hidden bg-card shadow-2xs text-center p-3">
                                            <div
                                                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                                    JACOBSON_STEPS[jacobsonStepIdx].action === 'Tensa'
                                                        ? 'bg-rose-500/10 scale-100'
                                                        : 'bg-emerald-500/10 scale-75'
                                                }`}
                                            />
                                            <div className="z-10 space-y-1">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                                    JACOBSON_STEPS[jacobsonStepIdx].action === 'Tensa'
                                                        ? 'bg-rose-500/20 text-rose-600 border border-rose-500/30'
                                                        : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                                }`}>
                                                    {JACOBSON_STEPS[jacobsonStepIdx].action}
                                                </span>
                                                <h4 className="text-xs font-bold tracking-tight mt-1 truncate max-w-[100px]">{JACOBSON_STEPS[jacobsonStepIdx].title}</h4>
                                                <span className="block text-xl font-black">{jacobsonTimer}s</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-center px-4 leading-normal font-light">
                                            {JACOBSON_STEPS[jacobsonStepIdx].desc}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                                        <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">Pasos Corporales</p>
                                        <ol className="text-[10px] text-muted-foreground space-y-1.5 font-light">
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">1.</span> Tensa hombros 5s y suelta de golpe 10s.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">2.</span> Aprieta puños 5s y relaja 10s.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">3.</span> Frunce el rostro 5s y relaja 10s.
                                            </li>
                                        </ol>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => setJacobsonActive(!jacobsonActive)}
                                className={`w-full mt-6 h-10 font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                                    jacobsonActive
                                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        : 'bg-foreground text-background hover:bg-foreground/90'
                                }`}
                            >
                                {jacobsonActive ? <Pause size={14} /> : <Play size={14} />}
                                {jacobsonActive ? 'Detener Guía' : 'Iniciar Guía'}
                            </Button>
                        </div>
                    )}

                    {/* CARD 8: DIARIO DE GRATITUD GUIADO (INTERACTIVO) */}
                    {(selectedCategory === 'Todos' || selectedCategory === 'Ejercicios Prácticos' || selectedCategory === 'Lectura Recomendada') && (
                        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[400px] shadow-2xs hover:border-foreground/20 transition-all duration-300">
                            <div className="space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-2xs">
                                    <Sparkles className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-bold tracking-tight">Diario de Gratitud</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        Escribe breves reflexiones enfocando tu mente en los aspectos positivos de tu vida estudiantil y personal.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2 min-h-[90px] relative">
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Pregunta Guía</span>
                                    <p className="text-[10px] font-semibold text-foreground leading-normal">
                                        {GRATITUDE_PROMPTS[activeGratitudePromptIndex]}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <textarea
                                        value={gratitudeText}
                                        onChange={(e) => setGratitudeText(e.target.value)}
                                        placeholder="Escribe tu reflexión aquí..."
                                        className="w-full min-h-[70px] p-3 rounded-xl border border-border bg-card text-[11px] placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground/50 resize-none font-light leading-normal"
                                    />
                                    {gratitudeText.trim() && (
                                        <button
                                            onClick={handleCopyGratitude}
                                            className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
                                        >
                                            {copiedSuccess ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                            {copiedSuccess ? '¡Copiado!' : 'Copiar para guardar en mi Diario'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handleNextGratitudePrompt}
                                className="w-full mt-4 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                            >
                                <RefreshCw size={12} /> Siguiente Pregunta
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Resources.layout = {
    breadcrumbs: [
        {
            title: 'Mi Progreso',
            href: '/dashboard',
        },
        {
            title: 'Recursos',
            href: '/resources',
        },
    ],
};
