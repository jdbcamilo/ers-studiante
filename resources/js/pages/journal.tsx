import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type JournalEntry = {
    id: number;
    title: string;
    content: string;
    mood: string;
    mood_score: number;
    created_at?: string;
};

type PageProps = {
    entries: JournalEntry[];
    flash?: {
        success?: string;
    };
};

const moodOptions = [
    { value: 'sereno', label: 'Sereno' },
    { value: 'motivado', label: 'Motivado' },
    { value: 'cansado', label: 'Cansado' },
    { value: 'ansioso', label: 'Ansioso' },
];

export default function Journal() {
    const { entries, flash } = usePage<PageProps>().props;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('sereno');
    const [moodScore, setMoodScore] = useState('7');
    const [message, setMessage] = useState(flash?.success ?? '');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.post(
            '/journal',
            {
                title,
                content,
                mood,
                mood_score: moodScore ? Number(moodScore) : undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setTitle('');
                    setContent('');
                    setMood('sereno');
                    setMoodScore('7');
                    setMessage('Entrada guardada en tu diario emocional.');
                },
            },
        );
    };

    const handleDelete = (entryId: number) => {
        router.delete(`/journal/${entryId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage('La entrada se eliminó correctamente.');
                router.reload({ only: ['entries'] });
            },
        });
    };

    return (
        <>
            <Head title="Diario emocional" />

            <div className="space-y-8">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Diario emocional</p>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">Registra tu energía, tus pensamientos y tu descanso</h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        Escribir tus emociones ayuda a encontrar patrones y a preparar una rutina de autocuidado más consistente.
                    </p>
                </div>

                {message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
                        {message}
                    </div>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Título</label>
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Hoy me siento…"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Contenido</label>
                            <textarea
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                className="mt-2 min-h-40 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Describe lo que pasó, cómo te sentiste y qué te haría sentir mejor…"
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-foreground">Estado emocional</label>
                                <select
                                    value={mood}
                                    onChange={(event) => setMood(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {moodOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground">Puntaje</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={moodScore}
                                    onChange={(event) => setMoodScore(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">Guardar entrada</Button>
                    </form>

                    <div className="space-y-4">
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <div key={entry.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{entry.created_at ? new Date(entry.created_at).toLocaleDateString('es-ES') : 'Hoy'}</p>
                                            <h2 className="mt-2 text-xl font-semibold text-foreground">{entry.title}</h2>
                                        </div>
                                        <span className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">
                                            {entry.mood} · {entry.mood_score}/10
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{entry.content}</p>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(entry.id)}
                                            className="text-sm font-semibold text-rose-600 hover:text-rose-500"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                                No hay entradas todavía. Escribe la primera para dar seguimiento a tu bienestar emocional.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Journal.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Diario emocional',
            href: '/journal',
        },
    ],
};
