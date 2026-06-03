<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\WellnessAnalyticsService;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke(WellnessAnalyticsService $analytics)
    {
        return Inertia::render('admin/dashboard', [
            'overview' => $analytics->adminOverview(),
        ]);
    }
}