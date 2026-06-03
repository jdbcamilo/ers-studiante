<?php

namespace Database\Factories;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition(): array
    {
        return [
            'category' => fake()->randomElement(['sugerencia', 'error', 'mejora', 'otro']),
            'message' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'reviewed']),
        ];
    }
}