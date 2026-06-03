<?php

namespace App\Http\Controllers;

use App\Services\WellnessAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request, WellnessAnalyticsService $analytics): \Inertia\Response
    {
        $snapshot = $analytics->studentSnapshot($request->user());

        return Inertia::render('dashboard', [
            'snapshot' => $snapshot,
            'user' => $request->user()->only(['name', 'email', 'role', 'status']),
        ]);
    }
}