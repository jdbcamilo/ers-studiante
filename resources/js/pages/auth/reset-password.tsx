import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Restablecer contraseña" />

            <Form
                {...store.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        {/* Correo Electrónico */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="bg-background border-border rounded-xl h-11 px-4 text-sm mt-1 block w-full"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* Nueva Contraseña */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Nueva Contraseña
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="bg-background border-border rounded-xl h-11 px-4 text-sm mt-1 block w-full"
                                autoFocus
                                placeholder="Nueva contraseña"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Confirmar contraseña
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="bg-background border-border rounded-xl h-11 px-4 text-sm mt-1 block w-full"
                                placeholder="Confirmar contraseña"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        {/* Botón de Enviar */}
                        <Button
                            type="submit"
                            className="mt-6 w-full h-11 rounded-xl font-bold bg-foreground hover:bg-foreground/90 text-background transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Restablecer contraseña
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Restablecer contraseña',
    description: 'Por favor ingresa tu nueva contraseña a continuación',
};
