<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\Option;
use App\Models\Questionnaire;
use App\Models\Response;
use App\Models\User;
use Illuminate\Support\Arr;

class AssessmentService
{
    public function resolveQuestionnaire(string $type): Questionnaire
    {
        return Questionnaire::published()
            ->where('type', $type)
            ->orderBy('sort_order')
            ->firstOrFail();
    }

    public function createEvaluation(User $user, string $type, array $payload): Evaluation
    {
        $questionnaire = $this->resolveQuestionnaire($type);

        $responses = Arr::get($payload, 'responses', []);
        $score = 0;
        $details = [];

        foreach ($questionnaire->questions()->with('options')->get() as $question) {
            $answer = $responses[$question->id] ?? null;
            $option = $question->options->firstWhere('id', (int) $answer);

            if ($option) {
                $score += (int) $option->score;
                $details[$question->id] = $option->id;
            }
        }

        $classification = $this->classify($type, $score);

        $evaluation = Evaluation::create([
            'user_id' => $user->id,
            'questionnaire_id' => $questionnaire->id,
            'score' => $score,
            'level' => $classification['level'],
            'summary' => $classification['summary'],
            'risk_flags' => $classification['risk_flags'],
            'completed_at' => now(),
        ]);

        foreach ($details as $questionId => $optionId) {
            Response::create([
                'evaluation_id' => $evaluation->id,
                'question_id' => $questionId,
                'option_id' => $optionId,
                'value' => Option::findOrFail($optionId)->score,
            ]);
        }

        $user->update(['last_mood_check_in' => now()]);

        return $evaluation;
    }

    public function classify(string $type, int $score): array
    {
        // Define maximum possible score for each questionnaire to do percentage calculation
        $maxScores = [
            'PHQ-9' => 27,
            'GAD-7' => 21,
            'PSS-10' => 40,
            'Rosenberg' => 40,
            'RYFF' => 24,
            'PSQI' => 15,
            'SWLS' => 20,
            'MBI-SS' => 18,
        ];

        $maxScore = $maxScores[$type] ?? 30;
        $pct = ($score / $maxScore) * 100;

        // Custom logic for scales where high score means positive (like Rosenberg, Ryff, SWLS)
        $isPositiveScale = in_array($type, ['Rosenberg', 'RYFF', 'SWLS']);
        
        if ($isPositiveScale) {
            // For Rosenberg, Ryff, SWLS, a higher score is BETTER (less risk / more stable)
            return match (true) {
                $pct >= 75 => ['level' => 'Bajo', 'summary' => 'Nivel excelente y muy saludable. Sigue cultivando tu bienestar.', 'risk_flags' => ['stable']],
                $pct >= 50 => ['level' => 'Moderado', 'summary' => 'Nivel aceptable. Existen áreas de mejora que puedes fortalecer.', 'risk_flags' => ['watch']],
                $pct >= 30 => ['level' => 'Alto', 'summary' => 'Nivel descendido. Considera hablar con el consejero sobre tu autoestima o satisfacción.', 'risk_flags' => ['support']],
                default => ['level' => 'Crítico', 'summary' => 'Nivel crítico. Te recomendamos buscar orientación y apoyo psicopedagógico.', 'risk_flags' => ['urgent']],
            };
        }

        // For negative scales (PHQ-9, GAD-7, PSS-10, PSQI, MBI-SS), a higher score is WORSE (more risk / severity)
        return match (true) {
            $pct <= 25 => ['level' => 'Bajo', 'summary' => 'Tu estado emocional está en equilibrio. Sigue practicando autocuidado.', 'risk_flags' => ['stable']],
            $pct <= 50 => ['level' => 'Moderado', 'summary' => 'Se observan niveles moderados de carga. Realizar pausas conscientes puede ayudarte.', 'risk_flags' => ['watch']],
            $pct <= 75 => ['level' => 'Alto', 'summary' => 'Nivel de carga elevado. Considera agendar una cita o hablar con nuestro asistente de IA.', 'risk_flags' => ['support']],
            default => ['level' => 'Crítico', 'summary' => 'Nivel de carga crítico. Te recomendamos contactar directamente con Bienestar Universitario.', 'risk_flags' => ['urgent']],
        };
    }
}
