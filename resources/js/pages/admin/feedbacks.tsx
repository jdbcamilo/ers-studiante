import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Feedbacks() {
    return (
        <>
            <Head title="Gestión de Feedback" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Gestión de Feedback</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Revisa los mensajes y sugerencias de la comunidad.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>

                <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-foreground">Buzón de Sugerencias Vacio</h2>
                    <p className="mt-3 mx-auto max-w-md text-muted-foreground">
                        Por ahora no hay nuevos mensajes de retroalimentación de los estudiantes. Las métricas de análisis de sentimiento estarán disponibles próximamente.
                    </p>
                </div>
            </div>
        </>
    );
}

Feedbacks.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Feedback', href: '/admin/feedbacks' },
    ],
};
