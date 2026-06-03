import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AssessmentQuestion = {
    id: number;
    prompt: string;
    scale_label: string;
    options: Array<{
        id: number;
        label: string;
        score: number;
    }>;
};

type Questionnaire = {
    id: number;
    title: string;
    type: string;
    description: string;
    estimated_minutes: number;
    questions: AssessmentQuestion[];
};

type PageProps = {
    questionnaires: Questionnaire[];
    flash?: {
        success?: string;
    };
};

const LOCAL_CATALOG = {
    'PHQ-9': {
        title: 'Cuestionario de Depresión',
        type: 'PHQ-9',
        duration: '3 min',
        questionsCount: 9,
        description: 'Identifica síntomas depresivos, estado de ánimo y pérdida de interés o energía durante las últimas dos semanas.'
    },
    'GAD-7': {
        title: 'Cuestionario de Ansiedad',
        type: 'GAD-7',
        duration: '3 min',
        questionsCount: 7,
        description: 'Mide tus niveles de ansiedad, nerviosismo y tensión acumulada durante las últimas dos semanas.'
    },
    'PSS-10': {
        title: 'Estrés Percibido',
        type: 'PSS-10',
        duration: '4 min',
        questionsCount: 10,
        description: 'Mide el grado en que consideras que las situaciones de tu vida académica son impredecibles o sobrecargadas.'
    },
    'Rosenberg': {
        title: 'Escala de Autoestima',
        type: 'Rosenberg',
        duration: '3 min',
        questionsCount: 10,
        description: 'Evalúa la autovaloración global y el nivel de satisfacción y aprecio que posees de ti mismo/a.'
    },
    'RYFF': {
        title: 'Bienestar de Ryff',
        type: 'RYFF',
        duration: '5 min',
        questionsCount: 6,
        description: 'Evalúa dimensiones clave de tu salud mental positiva, autonomía y crecimiento personal.'
    },
    'PSQI': {
        title: 'Calidad del Sueño',
        type: 'PSQI',
        duration: '4 min',
        questionsCount: 5,
        description: 'Mide la calidad de tus hábitos de sueño, latencia y disturbios nocturnos en el último mes.'
    },
    'SWLS': {
        title: 'Satisfacción con la Vida',
        type: 'SWLS',
        duration: '2 min',
        questionsCount: 5,
        description: 'Evalúa el juicio cognitivo global que realizas sobre tu propia calidad de vida académica y personal.'
    },
    'MBI-SS': {
        title: 'Burnout Académico',
        type: 'MBI-SS',
        duration: '5 min',
        questionsCount: 6,
        description: 'Mide el agotamiento emocional y la despersonalización asociados a tus estudios universitarios.'
    }
};

export default function Assessments() {
    const { questionnaires, flash } = usePage<PageProps>().props;
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [message, setMessage] = useState(flash?.success ?? '');
    const [responses, setResponses] = useState<Record<number, string>>({});

    const selectedQuestionnaire = useMemo(() => {
        if (!selectedType) return null;
        return questionnaires.find((item) => item.type === selectedType) ?? null;
    }, [questionnaires, selectedType]);

    const allAnswered = useMemo(() => {
        if (!selectedQuestionnaire) return false;
        return selectedQuestionnaire.questions.every((question) => responses[question.id]);
    }, [selectedQuestionnaire, responses]);

    const handleStartTest = (type: string) => {
        setSelectedType(type);
        setResponses({});
        setMessage('');
    };

    const handleSubmit = () => {
        if (!selectedQuestionnaire || !allAnswered) {
            return;
        }

        router.post(
            '/assessments',
            {
                type: selectedQuestionnaire.type,
                responses: Object.fromEntries(
                    Object.entries(responses).map(([key, value]) => [Number(key), Number(value)]),
                ),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage('Tu evaluación se guardó correctamente. Revisa tu progreso en tu panel de Mi Progreso.');
                    setResponses({});
                    setSelectedType(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Cuestionarios Clínicos" />

            <div className="space-y-6 text-foreground animate-in fade-in duration-300">
                {/* Back button when inside a test */}
                {selectedType && (
                    <div>
                        <button
                            onClick={() => setSelectedType(null)}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Volver a Cuestionarios
                        </button>
                    </div>
                )}

                {/* Banner Header */}
                {!selectedType ? (
                    <div className="space-y-6">
                        <div className="p-6 md:p-8 rounded-3xl border border-border bg-card relative overflow-hidden shadow-xs">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Evaluaciones Clínicas</p>
                            <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Evaluaciones de Salud Mental</h1>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-2xl font-light">
                                Completa estas escalas clínicas estandarizadas y validadas para monitorear objetivamente tu bienestar psicológico y académico.
                            </p>
                        </div>

                        {message && (
                            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
                                <CheckCircle2 size={16} /> {message}
                            </div>
                        )}

                        {/* Cuestionarios Grid matching 8 tests, clean B&W layout */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(LOCAL_CATALOG).map(([key, value]) => {
                                const existsInDB = questionnaires.some(q => q.type === key);
                                return (
                                    <div 
                                        key={key} 
                                        className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden group hover:border-foreground/20 hover:shadow-xs transition duration-300"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.01] rounded-full blur-2xl -z-10" />
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-[9px] font-bold text-muted-foreground uppercase">{value.type}</span>
                                                <span className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-[9px] font-bold text-muted-foreground uppercase">{value.duration}</span>
                                            </div>
                                            <h3 className="text-base font-bold mt-4 tracking-tight group-hover:text-primary transition">{value.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-2 font-light line-clamp-3 leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => handleStartTest(value.type)}
                                            disabled={!existsInDB}
                                            className="w-full mt-4 bg-muted hover:bg-foreground hover:text-background text-foreground border border-border h-10 font-bold rounded-xl transition duration-300 cursor-pointer disabled:opacity-40"
                                        >
                                            {existsInDB ? 'Comenzar' : 'No disponible'}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Active Questionnaire Questions layout */
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] items-start animate-in zoom-in-95 duration-200">
                        {selectedQuestionnaire ? (
                            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{selectedQuestionnaire.type}</span>
                                    <h2 className="text-2xl font-bold mt-1 tracking-tight">{selectedQuestionnaire.title}</h2>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-light">
                                        {selectedQuestionnaire.description}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {selectedQuestionnaire.questions.map((question, index) => (
                                        <div
                                            key={question.id}
                                            className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-sm font-semibold leading-relaxed">
                                                    {index + 1}. {question.prompt}
                                                </p>
                                                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                                                    {question.scale_label}
                                                </span>
                                            </div>

                                            <div className="grid gap-2.5 sm:grid-cols-2">
                                                {question.options.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition select-none ${
                                                            responses[question.id] === String(option.id)
                                                                ? 'border-foreground bg-foreground/5 text-foreground shadow-xs'
                                                                : 'border-border bg-background/50 hover:border-foreground/20'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option.id}
                                                            className="mt-1 accent-foreground"
                                                            checked={responses[question.id] === String(option.id)}
                                                            onChange={() =>
                                                                setResponses((current) => ({
                                                                    ...current,
                                                                    [question.id]: String(option.id),
                                                                }))
                                                            }
                                                        />
                                                        <span className="text-xs leading-normal">
                                                            <span className="block font-semibold">{option.label}</span>
                                                            <span className="block text-[10px] text-muted-foreground mt-0.5 font-light">Puntaje {option.score}</span>
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-border rounded-3xl text-center text-muted-foreground">
                                Cuestionario no encontrado en el sistema.
                            </div>
                        )}

                        {/* Sidebar Test status card */}
                        {selectedQuestionnaire && (
                            <div className="space-y-6">
                                <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                                    <h3 className="text-lg font-bold tracking-tight">Recomendación</h3>
                                    <ul className="mt-4 space-y-3 text-xs text-muted-foreground leading-relaxed font-light">
                                        <li>• Responde con total honestidad en un ambiente de calma.</li>
                                        <li>• Si el resultado es elevado, puedes agendar una cita con Bienestar Universitario o conversar con nuestro asistente de IA.</li>
                                        <li>• Tus datos son protegidos de forma segura para generar tu historial de progreso.</li>
                                    </ul>
                                </div>

                                <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                                    <h3 className="text-lg font-bold tracking-tight">Estado del Test</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                            <span>Preguntas respondidas</span>
                                            <span>
                                                {Object.keys(responses).length} de {selectedQuestionnaire.questions.length}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted border border-border overflow-hidden">
                                            <div
                                                className="h-full bg-foreground rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${
                                                        (Object.keys(responses).length / selectedQuestionnaire.questions.length) * 100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!allAnswered}
                                        className="w-full bg-foreground hover:bg-foreground/90 text-background h-11 font-bold rounded-xl transition shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                    >
                                        Guardar evaluación
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

Assessments.layout = {
    breadcrumbs: [
        {
            title: 'Mi Progreso',
            href: '/dashboard',
        },
        {
            title: 'Cuestionarios',
            href: '/assessments',
        },
    ],
};
