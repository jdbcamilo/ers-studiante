import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Questionnaires({ questionnaires }: any) {
    return (
        <>
            <Head title="Gestión de Cuestionarios" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Gestión de Cuestionarios</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Configura las encuestas disponibles para los estudiantes.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/dashboard">Volver</Link>
                        </Button>
                        <Button>Crear Nuevo</Button>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    {questionnaires.data.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">No hay cuestionarios creados aún.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 font-medium text-muted-foreground">Título</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Tipo</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Minutos Estimados</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Estado</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionnaires.data.map((q: any) => (
                                        <tr key={q.id} className="border-b border-border/50 last:border-0">
                                            <td className="py-4 font-medium text-foreground">{q.title}</td>
                                            <td className="py-4 uppercase text-muted-foreground text-xs font-semibold tracking-wider">{q.type}</td>
                                            <td className="py-4">{q.estimated_minutes} min</td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${q.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {q.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Editar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
