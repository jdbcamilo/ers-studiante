// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verificación de correo" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-center text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionaste durante el registro.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <div className="flex flex-col gap-4">
                        <Button 
                            disabled={processing} 
                            variant="secondary"
                            className="w-full h-11 rounded-xl font-bold border border-border bg-muted/50 hover:bg-muted text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {processing && <Spinner />}
                            Reenviar correo de verificación
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cerrar sesión
                        </TextLink>
                    </div>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verificación de correo',
    description:
        'Por favor verifica tu correo electrónico haciendo clic en el enlace que te acabamos de enviar por correo.',
};
