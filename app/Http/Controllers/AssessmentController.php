<?php

namespace App\Http\Controllers;

use App\Models\Questionnaire;
use App\Services\AssessmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function index()
    {
        $questionnaires = Questionnaire::published()->orderBy('sort_order')->get();

        return Inertia::render('assessments', [
            'questionnaires' => $questionnaires->map(function ($questionnaire) {
                return [
                    'id' => $questionnaire->id,
                    'title' => $questionnaire->title,
                    'type' => $questionnaire->type,
                    'description' => $questionnaire->description,
                    'estimated_minutes' => $questionnaire->estimated_minutes,
                    'questions' => $questionnaire->questions()->with('options')->get()->map(fn ($question) => [
                        'id' => $question->id,
                        'prompt' => $question->prompt,
                        'scale_label' => $question->scale_label,
                        'options' => $question->options->map(fn ($option) => [
                            'id' => $option->id,
                            'label' => $option->label,
                            'score' => $option->score,
                        ]),
                    ]),
                ];
            }),
        ]);
    }

    public function store(Request $request, AssessmentService $service)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:PHQ-9,GAD-7,PSS-10,Rosenberg,RYFF,PSQI,SWLS,MBI-SS'],
            'responses' => ['required', 'array'],
        ]);

        $evaluation = $service->createEvaluation($request->user(), $validated['type'], $validated);

        return redirect()->back()->with('success', 'Evaluación guardada correctamente.');
    }
}
