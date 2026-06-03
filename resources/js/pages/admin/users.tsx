import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Users({ users }: any) {
    return (
        <>
            <Head title="Gestión de Usuarios" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Gestión de Usuarios</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Administra los estudiantes y sus permisos.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-3 font-medium text-muted-foreground">Nombre</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Email</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Rol</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Estado</th>
                                    <th className="pb-3 font-medium text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className="border-b border-border/50 last:border-0">
                                        <td className="py-4">{user.name}</td>
                                        <td className="py-4">{user.email}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500">
                                                Activo
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
                </div>
            </div>
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Usuarios', href: '/admin/users' },
    ],
};
