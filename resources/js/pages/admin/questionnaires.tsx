import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Questionnaires() {
    return (
        <>
            <Head title="Gestión de Cuestionarios" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Gestión de Cuestionarios</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Configura las encuestas disponibles para los estudiantes.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>

                <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-foreground">Módulo en Construcción</h2>
                    <p className="mt-3 mx-auto max-w-md text-muted-foreground">
                        La edición dinámica de cuestionarios clínicos estará disponible en la Fase 2 del proyecto para garantizar la validación médica de las preguntas.
                    </p>
                    <div className="mt-8">
                        <Button variant="default" asChild>
                            <Link href="/admin/dashboard">Regresar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

Questionnaires.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Cuestionarios', href: '/admin/questionnaires' },
    ],
};
