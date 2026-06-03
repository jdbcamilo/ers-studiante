<?php

namespace App\Services;

use App\Models\JournalEntry;
use App\Models\User;
use Illuminate\Support\Collection;

class JournalService
{
    public function forUser(User $user): Collection
    {
        return $user->journalEntries()->latest()->get();
    }

    public function create(User $user, array $payload): JournalEntry
    {
        return JournalEntry::create([
            'user_id' => $user->id,
            'title' => $payload['title'],
            'content' => $payload['content'],
            'mood' => $payload['mood'] ?? 'sereno',
            'mood_score' => (int) ($payload['mood_score'] ?? 5),
            'is_private' => (bool) ($payload['is_private'] ?? true),
        ]);
    }

    public function update(JournalEntry $entry, array $payload): JournalEntry
    {
        $entry->update([
            'title' => $payload['title'] ?? $entry->title,
            'content' => $payload['content'] ?? $entry->content,
            'mood' => $payload['mood'] ?? $entry->mood,
            'mood_score' => (int) ($payload['mood_score'] ?? $entry->mood_score),
            'is_private' => (bool) ($payload['is_private'] ?? $entry->is_private),
        ]);

        return $entry->fresh();
    }

    public function delete(JournalEntry $entry): void
    {
        $entry->delete();
    }
}
