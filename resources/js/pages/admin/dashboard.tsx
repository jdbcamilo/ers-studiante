import { Head, Link } from '@inertiajs/react';


type Overview = {
    students: number;
    evaluations: number;
    pending_feedback: number;
    surveys: number;
};

type PageProps = {
    overview: Overview;
};

export default function AdminDashboard({ overview }: PageProps) {
    return (
        <>
            <Head title="Panel administrativo" />

            <div className="space-y-8">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Admin</p>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">Panel administrativo del bienestar universitario</h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        Monitorea la actividad del programa, revisa retroalimentación pendiente y administra las evaluaciones disponibles para la comunidad estudiantil.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Estudiantes activos</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{overview.students}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Evaluaciones completadas</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{overview.evaluations}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Feedback pendiente</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{overview.pending_feedback}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Encuestas recibidas</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{overview.surveys}</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/users" className="rounded-3xl border border-border bg-card p-5 transition hover:border-primary/60">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary">Usuarios</p>
                        <h2 className="mt-2 text-xl font-semibold text-foreground">Gestiona estudiantes y estado</h2>
                    </Link>
                    <Link href="/admin/questionnaires" className="rounded-3xl border border-border bg-card p-5 transition hover:border-primary/60">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary">Cuestionarios</p>
                        <h2 className="mt-2 text-xl font-semibold text-foreground">Crea y ajusta encuestas</h2>
                    </Link>
                    <Link href="/admin/feedbacks" className="rounded-3xl border border-border bg-card p-5 transition hover:border-primary/60">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary">Feedback</p>
                        <h2 className="mt-2 text-xl font-semibold text-foreground">Revisa mensajes y etiquetas</h2>
                    </Link>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
    ],
};
