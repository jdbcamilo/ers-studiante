<?php

namespace Database\Seeders;

use App\Models\Evaluation;
use App\Models\Feedback;
use App\Models\JournalEntry;
use App\Models\Option;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Models\SatisfactionSurvey;
use App\Models\User;
use Illuminate\Database\Seeder;

class WellnessPlatformSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure administrator exists
        User::firstOrCreate(
            ['email' => 'admin@cordoba.edu.co'],
            User::factory()->admin()->raw()
        );

        // Ensure a specific test student exists
        $student = User::firstOrCreate(
            ['email' => 'estudiante@cordoba.edu.co'],
            array_merge(User::factory()->raw(), ['role' => 'student', 'name' => 'Estudiante de Prueba'])
        );

        $studentCount = User::where('role', 'student')->count();

        if ($studentCount < 4) {
            User::factory()->count(4 - $studentCount)->create([
                'role' => 'student',
            ]);
        }

        // 2. Define the 8 Real Clinical Questionnaires Catalog
        $questionnaires = [
            [
                'title' => 'PHQ-9: Cuestionario de Depresión',
                'type' => 'PHQ-9',
                'description' => 'Identifica síntomas depresivos, estado de ánimo y pérdida de interés o energía durante las últimas dos semanas.',
                'estimated_minutes' => 3,
                'sort_order' => 1,
                'scale_type' => 'frequency_0_3',
                'questions' => [
                    'Poco interés o placer en hacer las cosas.',
                    'Sentirse desanimado/a, deprimido/a o sin esperanzas.',
                    'Dificultad para conciliar el sueño, permanecer dormido/a o dormir demasiado.',
                    'Sentirse cansado/a o tener poca energía.',
                    'Tener poco apetito o comer en exceso.',
                    'Sentirse mal consigo mismo/a, sentir que es un fracaso o que ha decepcionado a su familia.',
                    'Dificultad para concentrarse en cosas tales como leer o realizar actividades académicas.',
                    'Moverse o hablar tan lentamente que otras personas lo hayan notado, o lo contrario: estar tan inquieto/a que se mueve mucho más de lo normal.',
                    'Pensamientos de que estaría mejor muerto/a o de lastimarse de alguna manera.'
                ]
            ],
            [
                'title' => 'GAD-7: Cuestionario de Ansiedad',
                'type' => 'GAD-7',
                'description' => 'Mide tus niveles de ansiedad, nerviosismo y tensión acumulada durante las últimas dos semanas.',
                'estimated_minutes' => 3,
                'sort_order' => 2,
                'scale_type' => 'frequency_0_3',
                'questions' => [
                    'Sentirse nervioso/a, ansioso/a o con los nervios de punta.',
                    'No poder dejar de preocuparse o no poder controlar la preocupación.',
                    'Preocuparse demasiado por diferentes cosas.',
                    'Dificultad para relajarse.',
                    'Estar tan inquieto/a que es difícil permanecer sentado/a.',
                    'Molestarse o irritarse fácilmente.',
                    'Sentir temor como si algo terrible pudiera suceder.'
                ]
            ],
            [
                'title' => 'PSS-10: Cuestionario de Estrés Percibido',
                'type' => 'PSS-10',
                'description' => 'Mide el grado en que consideras que las situaciones de tu vida académica son impredecibles, incontrolables o sobrecargadas.',
                'estimated_minutes' => 4,
                'sort_order' => 3,
                'scale_type' => 'frequency_0_4',
                'questions' => [
                    'Con qué frecuencia se ha sentido afectado/a por algo que ocurrió inesperadamente.',
                    'Con qué frecuencia ha sentido que no podía controlar las cosas importantes en su vida académica.',
                    'Con qué frecuencia se ha sentido nervioso/a o estresado/a.',
                    'Con qué frecuencia ha manejado con éxito los pequeños problemas académicos cotidianos.',
                    'Con qué frecuencia ha sentido que estaba afrontando con eficacia los cambios importantes en sus estudios.',
                    'Con qué frecuencia se ha sentido seguro/a sobre su capacidad para manejar sus problemas personales.',
                    'Con qué frecuencia ha sentido que las cosas le iban bien.',
                    'Con qué frecuencia ha sentido que no podía hacer frente a todas las cosas que tenía que hacer.',
                    'Con qué frecuencia ha podido controlar las dificultades de sus estudios.',
                    'Con qué frecuencia ha sentido que tenía todo bajo control.'
                ]
            ],
            [
                'title' => 'Rosenberg: Escala de Autoestima',
                'type' => 'Rosenberg',
                'description' => 'Evalúa la autovaloración global, el aprecio y nivel de satisfacción que posees de ti mismo/a.',
                'estimated_minutes' => 3,
                'sort_order' => 4,
                'scale_type' => 'agreement_1_4',
                'questions' => [
                    'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás.',
                    'Siento que tengo un número de cualidades buenas.',
                    'En general, me inclino a pensar que soy un/a fracasado/a.',
                    'Soy capaz de hacer las cosas tan bien como la mayoría de la gente.',
                    'Siento que no tengo mucho de lo que estar orgulloso/a.',
                    'Tengo una actitud positiva hacia mí mismo/a.',
                    'En general, estoy satisfecho/a conmigo mismo/a.',
                    'Me gustaría tener más respeto por mí mismo/a.',
                    'A veces me siento verdaderamente inútil.',
                    'A veces pienso que no sirvo para nada.'
                ]
            ],
            [
                'title' => 'RYFF: Bienestar Psicológico de Ryff',
                'type' => 'RYFF',
                'description' => 'Evalúa dimensiones clave de tu salud mental positiva, autonomía, crecimiento personal y relaciones cálidas.',
                'estimated_minutes' => 5,
                'sort_order' => 5,
                'scale_type' => 'agreement_1_4',
                'questions' => [
                    'Me gusta la mayor parte de mi personalidad.',
                    'Tengo confianza en mis propias opiniones, incluso si van en contra del consenso general.',
                    'Las exigencias de la vida cotidiana a menudo me agobian.',
                    'Mantengo relaciones cercanas y cálidas con otros.',
                    'Tengo un sentido de dirección y propósito en la vida.',
                    'Siento que continúo creciendo como persona.'
                ]
            ],
            [
                'title' => 'PSQI: Calidad del Sueño de Pittsburgh',
                'type' => 'PSQI',
                'description' => 'Mide la calidad de tus hábitos de sueño, eficiencia, latencia y disturbios nocturnos en el último mes.',
                'estimated_minutes' => 4,
                'sort_order' => 6,
                'scale_type' => 'severity_3_0',
                'questions' => [
                    'Durante el último mes, ¿cómo calificarías en general la calidad de tu sueño?',
                    '¿Cuántas veces has tenido dificultad para dormir porque no podías conciliar el sueño en 30 minutos?',
                    '¿Cuántas veces has tenido dificultad para dormir porque te despertabas en mitad de la noche?',
                    '¿Cuántas veces has tenido que tomar medicamentos para ayudar a dormir?',
                    '¿Cuántas veces has tenido dificultad para mantener el entusiasmo para realizar tus entregas académicas?'
                ]
            ],
            [
                'title' => 'SWLS: Satisfacción con la Vida',
                'type' => 'SWLS',
                'description' => 'Evalúa el juicio cognitivo global que realizas sobre tu propia calidad de vida académica y personal.',
                'estimated_minutes' => 2,
                'sort_order' => 7,
                'scale_type' => 'agreement_1_4',
                'questions' => [
                    'En la mayoría de los aspectos, mi vida es como quiero que sea.',
                    'Las condiciones de mi vida académica y personal son excelentes.',
                    'Estoy totalmente satisfecho/a con mi vida.',
                    'Hasta ahora, he obtenido las cosas importantes que quiero en la vida académica.',
                    'Si pudiera vivir mi vida de nuevo, no cambiaría casi nada.'
                ]
            ],
            [
                'title' => 'MBI-SS: Burnout Académico de Maslach',
                'type' => 'MBI-SS',
                'description' => 'Mide el agotamiento emocional, la despersonalización y la autoeficacia asociados a tus estudios universitarios.',
                'estimated_minutes' => 5,
                'sort_order' => 8,
                'scale_type' => 'frequency_0_3',
                'questions' => [
                    'Me siento emocionalmente agotado/a por mis estudios universitarios.',
                    'Me siento acabado/a al final de un día de clases.',
                    'Me siento cansado/a cuando me levanto por la mañana y tengo que ir a la universidad.',
                    'He perdido el interés por mis materias desde que ingresé a la carrera.',
                    'Dudo del valor y utilidad de la carrera que estoy estudiando.',
                    'Me siento menos eficaz o capaz de resolver mis tareas de estudio.'
                ]
            ]
        ];

        // 3. Seed questionnaires into the database
        foreach ($questionnaires as $item) {
            $questionnaire = Questionnaire::updateOrCreate(
                ['type' => $item['type']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'status' => 'published',
                    'estimated_minutes' => $item['estimated_minutes'],
                    'sort_order' => $item['sort_order'],
                ]
            );

            // Re-create questions and options clean to ensure real prompts
            $questionnaire->questions()->delete();

            // Set standard option scales
            $labelSet = [];
            $scoreSet = [];

            if ($item['scale_type'] === 'frequency_0_3') {
                $labelSet = ['Nunca', 'Varios días', 'Más de la mitad de los días', 'Casi todos los días'];
                $scoreSet = [0, 1, 2, 3];
            } elseif ($item['scale_type'] === 'frequency_0_4') {
                $labelSet = ['Nunca', 'Casi nunca', 'De vez en cuando', 'A menudo', 'Muy a menudo'];
                $scoreSet = [0, 1, 2, 3, 4];
            } elseif ($item['scale_type'] === 'agreement_1_4') {
                $labelSet = ['Muy en desacuerdo', 'En desacuerdo', 'De acuerdo', 'Muy de acuerdo'];
                $scoreSet = [1, 2, 3, 4];
            } elseif ($item['scale_type'] === 'severity_3_0') {
                $labelSet = ['Muy mala / Tres o más veces', 'Mala / Una o dos veces', 'Buena / Menos de una vez', 'Muy buena / Ninguna vez'];
                $scoreSet = [3, 2, 1, 0];
            }

            foreach ($item['questions'] as $index => $prompt) {
                $question = Question::create([
                    'questionnaire_id' => $questionnaire->id,
                    'prompt' => $prompt,
                    'scale_label' => 'Estándar',
                    'sort_order' => $index + 1,
                ]);

                foreach ($labelSet as $position => $label) {
                    Option::create([
                        'question_id' => $question->id,
                        'label' => $label,
                        'score' => $scoreSet[$position],
                        'sort_order' => $position + 1,
                    ]);
                }
            }
        }

        // 4. Leave evaluations and journals empty for students to start from scratch ("desde cero")
        if ($student) {
            $student->evaluations()->delete();
            $student->journalEntries()->delete();

            Feedback::firstOrCreate(
                [
                    'user_id' => $student->id,
                    'category' => 'mejora',
                ],
                [
                    'message' => 'Me gustaría que el dashboard mostrara una visualización más clara de la evolución semanal.',
                    'status' => 'pending',
                ]
            );

            SatisfactionSurvey::firstOrCreate(
                [
                    'user_id' => $student->id,
                    'overall_score' => 4,
                    'emotional_support_score' => 4,
                    'platform_clarity_score' => 5,
                    'academic_balance_score' => 3,
                ],
                [
                    'comments' => 'La plataforma está ayudando a tener una rutina de autocuidado más estable.',
                    'anonymous' => true,
                ]
            );
        }
    }
}