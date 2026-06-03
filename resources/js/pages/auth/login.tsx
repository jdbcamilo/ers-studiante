import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            <PasskeyVerify 
                label="Iniciar sesión con llave de acceso"
                loadingLabel="Autenticando..."
                separator="O continuar con correo electrónico"
            />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
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
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                    className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Contraseña */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Contraseña
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-muted-foreground hover:text-foreground font-bold transition-colors"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Ingresa tu contraseña"
                                    className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Recordarme */}
                            <div className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-md border-border"
                                />
                                <Label htmlFor="remember" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                                    Recordarme en este dispositivo
                                </Label>
                            </div>

                            {/* Botón de Submit */}
                            <Button
                                type="submit"
                                className="mt-4 w-full h-11 rounded-xl font-bold bg-foreground hover:bg-foreground/90 text-background transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>

                        {/* Link de Registro */}
                        <div className="text-center text-xs text-muted-foreground tracking-wide uppercase">
                            ¿No tienes una cuenta?{' '}
                            <TextLink href={register()} tabIndex={5} className="text-foreground hover:underline font-bold transition">
                                Regístrate
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Iniciar sesión',
    description: 'Ingresa tus credenciales a continuación para acceder al portal',
};
