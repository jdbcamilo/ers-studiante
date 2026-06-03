import { Form, Head } from '@inertiajs/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmar contraseña" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirmar con llave de acceso"
                loadingLabel="Confirmando..."
                separator="O confirmar con contraseña"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        {/* Contraseña */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Contraseña
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        {/* Botón de Confirmación */}
                        <div className="flex items-center">
                            <Button
                                className="w-full h-11 rounded-xl font-bold bg-foreground hover:bg-foreground/90 text-background transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Confirmar contraseña
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirmar contraseña',
    description:
        'Esta es una zona segura del portal. Por favor confirma tu contraseña antes de continuar.',
};
