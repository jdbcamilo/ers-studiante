<?php

namespace Database\Factories;

use App\Models\JournalEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

class JournalEntryFactory extends Factory
{
    protected $model = JournalEntry::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'content' => fake()->paragraph(),
            'mood' => fake()->randomElement(['sereno', 'motivado', 'cansado', 'ansioso']),
            'mood_score' => fake()->numberBetween(2, 9),
            'is_private' => true,
        ];
    }
}