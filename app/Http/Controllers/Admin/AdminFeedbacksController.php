<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Services\AdminService;
use Inertia\Inertia;

class AdminFeedbacksController extends Controller
{
    public function index(AdminService $service)
    {
        return Inertia::render('admin/feedbacks', [
            'feedbacks' => $service->feedbacks(),
        ]);
    }

    public function review(Feedback $feedback, AdminService $service)
    {
        $service->markFeedbackReviewed($feedback);

        return redirect()->back()->with('success', 'Retroalimentación marcada como revisada.');
    }
}