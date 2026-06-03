<?php

namespace App\Http\Controllers;

use App\Services\WellnessAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request, WellnessAnalyticsService $analytics)
    {
        $snapshot = $analytics->studentSnapshot($request->user());

        return Inertia::render('reports', [
            'snapshot' => $snapshot,
            'evaluations' => $request->user()->evaluations()->with('questionnaire')->latest()->get(),
        ]);
    }
}