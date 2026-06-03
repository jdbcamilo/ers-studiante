<?php

namespace App\Http\Controllers;

use App\Models\SatisfactionSurvey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index()
    {
        return Inertia::render('surveys');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'overall_score' => ['required', 'integer', 'min:1', 'max:5'],
            'emotional_support_score' => ['required', 'integer', 'min:1', 'max:5'],
            'platform_clarity_score' => ['required', 'integer', 'min:1', 'max:5'],
            'academic_balance_score' => ['required', 'integer', 'min:1', 'max:5'],
            'comments' => ['nullable', 'string'],
        ]);

        SatisfactionSurvey::create([
            'user_id' => $request->user()?->id,
            'overall_score' => $validated['overall_score'],
            'emotional_support_score' => $validated['emotional_support_score'],
            'platform_clarity_score' => $validated['platform_clarity_score'],
            'academic_balance_score' => $validated['academic_balance_score'],
            'comments' => $validated['comments'] ?? null,
            'anonymous' => true,
        ]);

        return redirect()->back()->with('success', 'Encuesta registrada. Gracias por tu aporte.');
    }
}