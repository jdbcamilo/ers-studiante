import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type FeedbackEntry = {
    id: number;
    category: string;
    message: string;
    status: string;
    created_at?: string;
};

type PageProps = {
    entries: FeedbackEntry[];
    flash?: {
        success?: string;
    };
};

const categories = [
    { value: 'sugerencia', label: 'Sugerencia' },
    { value: 'error', label: 'Error' },
    { value: 'mejora', label: 'Mejora' },
    { value: 'otro', label: 'Otro' },
];

export default function Feedback() {
    const { entries, flash } = usePage<PageProps>().props;
    const [category, setCategory] = useState('sugerencia');
    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState(flash?.success ?? '');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.post(
            '/feedback',
            { category, message },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCategory('sugerencia');
                    setMessage('');
                    setStatusMessage('Tu retroalimentación fue enviada correctamente.');
                },
            },
        );
    };

    return (
        <>
            <Head title="Feedback" />

            <div className="space-y-8">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Feedback</p>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">Comparte cómo mejorar la plataforma</h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        Tu opinión ayuda a ajustar la experiencia para que sea más accesible, empática y útil para el día a día universitario.
                    </p>
                </div>

                {statusMessage ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
                        {statusMessage}
                    </div>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Categoría</label>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {categories.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Mensaje</label>
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                className="mt-2 min-h-36 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Cuéntanos qué mejorarías, qué se te hace difícil o qué quieres que tenga la plataforma"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">Enviar retroalimentación</Button>
                    </form>

                    <div className="space-y-4">
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <div key={entry.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{entry.category}</p>
                                            <p className="mt-2 text-sm leading-6 text-foreground">{entry.message}</p>
                                        </div>
                                        <span className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">{entry.status}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                                Aún no hay mensajes enviados. Comparte el primer comentario para ayudar a mejorar la experiencia.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Feedback.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Feedback',
            href: '/feedback',
        },
    ],
};
