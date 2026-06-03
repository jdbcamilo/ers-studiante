<?php

namespace App\Services;

use App\Models\Feedback;
use App\Models\SatisfactionSurvey;
use App\Models\User;

class WellnessAnalyticsService
{
    public function studentSnapshot(User $user): array
    {
        $evaluations = $user->evaluations()->latest()->get();
        $latest = $evaluations->first();
        $trend = $evaluations->take(6)->pluck('score')->reverse()->values()->all();
        $average = $evaluations->avg('score') ?? 0;

        // Calculate unique active days based on evaluations and journal entries
        $evalDays = $user->evaluations()->get()->pluck('completed_at')->map(function($d) {
            return $d ? substr($d->format('Y-m-d'), 0, 10) : null;
        })->filter();

        $journalDays = $user->journalEntries()->get()->pluck('created_at')->map(function($d) {
            return $d ? substr($d->format('Y-m-d'), 0, 10) : null;
        })->filter();

        $uniqueDays = $evalDays->concat($journalDays)->unique()->count();
        $activeDaysCount = $uniqueDays > 0 ? $uniqueDays : 0;

        $evalCount = $evaluations->count();

        // Calculate improvement progressively: compare first evaluation score with the latest evaluation score
        $improvement = 0;
        if ($evalCount > 1) {
            $firstScore = $evaluations->last()->score;
            $latestScore = $evaluations->first()->score;
            if ($firstScore > $latestScore && $firstScore > 0) {
                // Better score (lower score represents improvement in negative clinical severity)
                $improvement = max(0, (int) round((($firstScore - $latestScore) / $firstScore) * 100));
            }
        }

        // Set progressive baseline default if no improvements yet but has tests completed
        if ($improvement === 0 && $evalCount > 0) {
            $improvement = min(40, $evalCount * 15); // Progressive 15% per completed test up to 40%
        }

        // Dynamic achievements based on student activity
        $journalCount = $user->journalEntries()->count();
        $achievements = [
            ['title' => 'Primer Paso', 'active' => $evalCount >= 1],
            ['title' => 'Constancia', 'active' => $evalCount >= 2],
            ['title' => 'Dedicación', 'active' => $journalCount >= 1],
            ['title' => 'Experto', 'active' => $evalCount >= 4],
            ['title' => 'Maestro', 'active' => $journalCount >= 2],
            ['title' => 'Evolución Positiva', 'active' => $improvement >= 25]
        ];

        // Dynamic distribution of risk levels
        $bajoCount = $evaluations->whereIn('level', ['Bajo', 'Estable'])->count();
        $modCount = $evaluations->where('level', 'Moderado')->count();
        $altoCount = $evaluations->whereIn('level', ['Alto', 'Crítico'])->count();
        $totalEvals = $bajoCount + $modCount + $altoCount;

        $distPositive = $totalEvals > 0 ? (int) round(($bajoCount / $totalEvals) * 100) : 0;
        $distNeutral = $totalEvals > 0 ? (int) round(($modCount / $totalEvals) * 100) : 0;
        $distDifficult = $totalEvals > 0 ? (100 - $distPositive - $distNeutral) : 0;

        if ($totalEvals === 0) {
            $distPositive = 100;
            $distNeutral = 0;
            $distDifficult = 0;
        }

        return [
            'wellness_score' => max(0, min(100, (int) round(100 - ($average * 2.5)))),
            'risk_level' => $latest?->level ?? 'Estable',
            'trend' => $trend,
            'latest_assessment' => $latest ? [
                'id' => $latest->id,
                'score' => $latest->score,
                'level' => $latest->level,
                'summary' => $latest->summary,
                'completed_at' => $latest->completed_at->format('d/m/Y'),
                'title' => $latest->questionnaire->title ?? 'Evaluación'
            ] : null,
            'recent_journal' => $user->journalEntries()->latest()->take(3)->get()->map(fn($j) => [
                'title' => $j->title,
                'mood' => $j->mood,
                'mood_score' => $j->mood_score,
                'created_at' => $j->created_at->format('d/m/Y')
            ]),
            'evaluations_count' => $evalCount,
            'active_days' => $activeDaysCount,
            'improvement' => $improvement,
            'achievements' => $achievements,
            'distribution' => [
                'positive' => $distPositive,
                'neutral' => $distNeutral,
                'difficult' => $distDifficult,
                'has_data' => $totalEvals > 0
            ],
            'history' => $evaluations->map(function ($e) {
                $type = $e->questionnaire->type ?? 'TEST';
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
                $max = $maxScores[$type] ?? 30;
                $isPositive = in_array($type, ['Rosenberg', 'RYFF', 'SWLS']);
                
                $pct = ($e->score / $max) * 100;
                $wellness_pct = $isPositive ? $pct : (100 - $pct);
                $wellness_pct = max(0, min(100, (int) round($wellness_pct)));

                return [
                    'title' => $e->questionnaire->title ?? 'Evaluación',
                    'type' => $type,
                    'score' => $e->score,
                    'level' => $e->level,
                    'completed_at' => $e->completed_at->format('d/m/Y H:i'),
                    'wellness_pct' => $wellness_pct,
                ];
            })
        ];
    }

    public function adminOverview(): array
    {
        $students = User::where('role', 'student')->count();
        $evaluations = \App\Models\Evaluation::count();
        $pendingFeedback = Feedback::where('status', 'pending')->count();
        $surveys = SatisfactionSurvey::count();

        return [
            'students' => $students,
            'evaluations' => $evaluations,
            'pending_feedback' => $pendingFeedback,
            'surveys' => $surveys,
        ];
    }
}
