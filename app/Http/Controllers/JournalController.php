<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request, JournalService $service)
    {
        return Inertia::render('journal', [
            'entries' => $service->forUser($request->user()),
        ]);
    }

    public function store(Request $request, JournalService $service)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string', 'min:10'],
            'mood' => ['nullable', 'string'],
            'mood_score' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $service->create($request->user(), $validated);

        return redirect()->back()->with('success', 'Comentario guardado en tu diario emocional.');
    }

    public function update(Request $request, JournalEntry $entry, JournalService $service)
    {
        $this->authorize('update', $entry);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string', 'min:10'],
            'mood' => ['nullable', 'string'],
            'mood_score' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $service->update($entry, $validated);

        return redirect()->back()->with('success', 'Entrada actualizada.');
    }

    public function destroy(JournalEntry $entry, JournalService $service)
    {
        $this->authorize('delete', $entry);
        $service->delete($entry);

        return redirect()->back()->with('success', 'Entrada eliminada.');
    }
}