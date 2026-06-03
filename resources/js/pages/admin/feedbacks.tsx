import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Feedbacks({ feedbacks }: any) {
    return (
        <>
            <Head title="Gestión de Feedback" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Gestión de Feedback</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Revisa los mensajes y sugerencias de la comunidad estudiantil.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    {feedbacks.data.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">No hay mensajes de feedback recientes.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 font-medium text-muted-foreground">Fecha</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Estudiante</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Categoría</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Mensaje</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Estado</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.data.map((f: any) => (
                                        <tr key={f.id} className="border-b border-border/50 last:border-0">
                                            <td className="py-4 whitespace-nowrap text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</td>
                                            <td className="py-4">{f.user?.name || 'Anónimo'}</td>
                                            <td className="py-4">
                                                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                                                    {f.category}
                                                </span>
                                            </td>
                                            <td className="py-4 max-w-xs truncate" title={f.message}>{f.message}</td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.status === 'reviewed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                                    {f.status === 'reviewed' ? 'Revisado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                {f.status !== 'reviewed' && (
                                                    <Link href={`/admin/feedbacks/${f.id}/review`} method="post" as="button" className="text-sm font-medium text-primary hover:underline">
                                                        Marcar Revisado
                                                    </Link>
                                                )}
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

Feedbacks.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Feedback', href: '/admin/feedbacks' },
    ],
};
