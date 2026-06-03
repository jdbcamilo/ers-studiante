<?php

namespace App\Services;

use App\Models\Feedback;
use App\Models\Questionnaire;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AdminService
{
    public function users(): Collection
    {
        return User::query()
            ->orderByDesc('created_at')
            ->get();
    }

    public function updateUserStatus(User $user, string $status): User
    {
        $user->update(['status' => $status]);

        return $user->fresh();
    }

    public function updateUserRole(User $user, string $role): User
    {
        $user->update(['role' => $role]);

        return $user->fresh();
    }

    public function questionnaires(): Collection
    {
        return Questionnaire::query()->orderBy('sort_order')->get();
    }

    public function createQuestionnaire(array $payload): Questionnaire
    {
        return Questionnaire::create([
            'title' => $payload['title'],
            'type' => $payload['type'],
            'description' => $payload['description'] ?? null,
            'status' => $payload['status'] ?? 'published',
            'estimated_minutes' => (int) ($payload['estimated_minutes'] ?? 5),
            'sort_order' => (int) ($payload['sort_order'] ?? 0),
        ]);
    }

    public function updateQuestionnaire(Questionnaire $questionnaire, array $payload): Questionnaire
    {
        $questionnaire->update([
            'title' => $payload['title'] ?? $questionnaire->title,
            'type' => $payload['type'] ?? $questionnaire->type,
            'description' => $payload['description'] ?? $questionnaire->description,
            'status' => $payload['status'] ?? $questionnaire->status,
            'estimated_minutes' => (int) ($payload['estimated_minutes'] ?? $questionnaire->estimated_minutes),
            'sort_order' => (int) ($payload['sort_order'] ?? $questionnaire->sort_order),
        ]);

        return $questionnaire->fresh();
    }

    public function feedbacks(): Collection
    {
        return Feedback::query()->with('user')->orderByDesc('created_at')->get();
    }

    public function markFeedbackReviewed(Feedback $feedback): Feedback
    {
        $feedback->update([
            'status' => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return $feedback->fresh();
    }
}
