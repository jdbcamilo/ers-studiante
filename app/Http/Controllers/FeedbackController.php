<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('feedback', [
            'entries' => $request->user()->feedbacks()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'in:sugerencia,error,mejora,otro'],
            'message' => ['required', 'string', 'min:10'],
        ]);

        Feedback::create([
            'user_id' => $request->user()->id,
            'category' => $validated['category'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Retroalimentación enviada con éxito.');
    }
}
