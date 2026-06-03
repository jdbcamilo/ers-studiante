import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type PageProps = {
    flash?: {
        success?: string;
    };
};

const ratingLabels = [1, 2, 3, 4, 5];

export default function Surveys() {
    const { flash } = usePage<PageProps>().props;
    const [overall_score, setOverallScore] = useState('4');
    const [emotional_support_score, setEmotionalSupportScore] = useState('4');
    const [platform_clarity_score, setPlatformClarityScore] = useState('4');
    const [academic_balance_score, setAcademicBalanceScore] = useState('4');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState(flash?.success ?? '');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.post(
            '/surveys',
            {
                overall_score: Number(overall_score),
                emotional_support_score: Number(emotional_support_score),
                platform_clarity_score: Number(platform_clarity_score),
                academic_balance_score: Number(academic_balance_score),
                comments,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setComments('');
                    setMessage('Encuesta registrada. Gracias por tu aporte.');
                },
            },
        );
    };

    const RatingPicker = ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
    }) => (
        <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {ratingLabels.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(String(rating))}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            value === String(rating)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                    >
                        {rating}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Encuestas de satisfacción" />

            <div className="space-y-8">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Encuestas</p>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">Evalúa tu experiencia en la plataforma</h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        Desde la percepción global hasta el apoyo emocional y la claridad de la plataforma, tus respuestas nos ayudan a afinar la experiencia.
                    </p>
                </div>

                {message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
                        {message}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <RatingPicker
                            label="Satisfacción general"
                            value={overall_score}
                            onChange={setOverallScore}
                        />
                        <RatingPicker
                            label="Apoyo emocional"
                            value={emotional_support_score}
                            onChange={setEmotionalSupportScore}
                        />
                        <RatingPicker
                            label="Claridad de la plataforma"
                            value={platform_clarity_score}
                            onChange={setPlatformClarityScore}
                        />
                        <RatingPicker
                            label="Equilibrio académico"
                            value={academic_balance_score}
                            onChange={setAcademicBalanceScore}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Comentarios</label>
                        <textarea
                            value={comments}
                            onChange={(event) => setComments(event.target.value)}
                            className="mt-2 min-h-32 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Cuéntanos qué te está funcionando y qué podríamos mejorar"
                        />
                    </div>

                    <Button type="submit" className="w-full">Enviar encuesta</Button>
                </form>
            </div>
        </>
    );
}

Surveys.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Encuestas',
            href: '/surveys',
        },
    ],
};
