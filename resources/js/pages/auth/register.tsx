import { Form, Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

const UNIVERSIDAD_CORDOBA_CAREERS = [
    'Ingeniería de Sistemas',
    'Ingeniería Industrial',
    'Ingeniería Agronómica',
    'Ingeniería de Alimentos',
    'Ingeniería Ambiental',
    'Medicina Veterinaria y Zootecnia',
    'Acuicultura',
    'Enfermería',
    'Bacteriología',
    'Administración en Salud',
    'Geografía',
    'Licenciatura en Ciencias Naturales y Educación Ambiental',
    'Licenciatura en Ciencias Sociales',
    'Licenciatura en Literatura y Lengua Castellana',
    'Licenciatura en Educación Infantil',
    'Licenciatura en Educación Física, Recreación y Deportes',
    'Licenciatura en Lenguas Extranjeras con Énfasis en Inglés',
    'Química',
    'Física',
    'Matemáticas',
    'Biología',
];

export default function Register({ passwordRules }: Props) {
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');

    // Dynamic age calculator
    const age = useMemo(() => {
        if (!birthDate) return '';
        const birth = new Date(birthDate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            calculatedAge--;
        }
        return calculatedAge >= 0 ? calculatedAge : '';
    }, [birthDate]);

    return (
        <>
            <Head title="Registro de Usuario" />
            <div className="w-full text-foreground animate-in fade-in duration-300">
                
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Hidden inputs to support auto-synchronized password confirmation and role */}
                            <input type="hidden" name="role" value={role} />
                            <input type="hidden" name="password_confirmation" value={password} />

                            <div className="grid gap-5">
                                {/* Cédula */}
                                <div className="grid gap-2">
                                    <Label htmlFor="cedula" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Cédula <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="cedula"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        name="cedula"
                                        placeholder="Número de cédula"
                                        className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                    />
                                    <InputError message={errors.cedula} className="mt-1" />
                                </div>

                                {/* Nombre Completo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Nombre Completo <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        name="name"
                                        placeholder="Nombres y apellidos"
                                        className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={3}
                                        name="email"
                                        placeholder="correo@ejemplo.com"
                                        className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                {/* Contraseña */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Contraseña <span className="text-destructive">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={4}
                                        name="password"
                                        placeholder="Ingresa tu contraseña"
                                        passwordrules={passwordRules}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-background border-border rounded-xl h-11 px-4 text-sm"
                                    />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                {/* Fecha de Nacimiento y Edad */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="birth_date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Fecha de nacimiento <span className="text-destructive">*</span>
                                        </Label>
                                        <input
                                            id="birth_date"
                                            type="date"
                                            required
                                            name="birth_date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="w-full px-4 bg-background border border-border text-foreground rounded-xl h-11 text-sm outline-none focus:ring-2 focus:ring-primary transition"
                                        />
                                        <InputError message={errors.birth_date} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Edad
                                        </Label>
                                        <div className="flex items-center bg-muted/30 border border-border rounded-xl h-11 px-4 text-sm font-semibold text-foreground/80">
                                            {age ? `${age} años` : 'Ingresa tu fecha'}
                                        </div>
                                    </div>
                                </div>

                                {/* Sexo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Sexo <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="gender"
                                        required
                                        name="gender"
                                        className="w-full px-4 bg-background border border-border text-foreground rounded-xl h-11 text-sm outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
                                    >
                                        <option value="" disabled selected className="text-muted-foreground">
                                            Seleccionar sexo
                                        </option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                    </select>
                                    <InputError message={errors.gender} className="mt-1" />
                                </div>

                                {/* Tipo de Usuario */}
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo de Usuario</Label>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/35 p-1 rounded-xl border border-border">
                                        <button
                                            type="button"
                                            onClick={() => setRole('student')}
                                            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                role === 'student'
                                                    ? 'bg-foreground text-background shadow-xs'
                                                    : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            Estudiante
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('teacher')}
                                            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                role === 'teacher'
                                                    ? 'bg-foreground text-background shadow-xs'
                                                    : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            Profesor
                                        </button>
                                    </div>
                                    <InputError message={errors.role} className="mt-1" />
                                </div>

                                {/* Carrera */}
                                <div className="grid gap-2">
                                    <Label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Carrera <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="department"
                                        required
                                        name="department"
                                        className="w-full px-4 bg-background border border-border text-foreground rounded-xl h-11 text-sm outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
                                    >
                                        <option value="" disabled selected className="text-muted-foreground">
                                            Seleccionar carrera
                                        </option>
                                        {UNIVERSIDAD_CORDOBA_CAREERS.map((career) => (
                                            <option key={career} value={career}>
                                                {career}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.department} className="mt-1" />
                                </div>

                                {/* Semestre (solo estudiantes) */}
                                {role === 'student' && (
                                    <div className="grid gap-2 transition-all duration-300 ease-in-out">
                                        <Label htmlFor="semester" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Semestre <span className="text-destructive">*</span>
                                        </Label>
                                        <select
                                            id="semester"
                                            required
                                            name="semester"
                                            className="w-full px-4 bg-background border border-border text-foreground rounded-xl h-11 text-sm outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
                                        >
                                            <option value="" disabled selected className="text-muted-foreground">
                                                Seleccionar semestre
                                            </option>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                                                <option key={s} value={s}>
                                                    Semestre {s}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.semester} className="mt-1" />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 w-full h-11 rounded-xl font-bold bg-foreground hover:bg-foreground/90 text-background transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </>
                    )}
                </Form>

                <div className="mt-6 text-center text-xs text-muted-foreground tracking-wide uppercase">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={login()} tabIndex={6} className="text-foreground hover:underline font-bold transition">
                        Inicia sesión
                    </TextLink>
                </div>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Crear una cuenta',
    description: 'Ingresa tus datos a continuación para registrarte en el portal de bienestar.',
};
