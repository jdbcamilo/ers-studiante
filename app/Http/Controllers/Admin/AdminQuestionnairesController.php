<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Questionnaire;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQuestionnairesController extends Controller
{
    public function index(AdminService $service)
    {
        return Inertia::render('admin/questionnaires', [
            'questionnaires' => $service->questionnaires(),
        ]);
    }

    public function store(Request $request, AdminService $service)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:draft,published'],
            'estimated_minutes' => ['nullable', 'integer', 'min:1'],
        ]);

        $service->createQuestionnaire($validated);

        return redirect()->back()->with('success', 'Cuestionario creado.');
    }

    public function update(Request $request, Questionnaire $questionnaire, AdminService $service)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:draft,published'],
            'estimated_minutes' => ['nullable', 'integer', 'min:1'],
        ]);

        $service->updateQuestionnaire($questionnaire, $validated);

        return redirect()->back()->with('success', 'Cuestionario actualizado.');
    }
}