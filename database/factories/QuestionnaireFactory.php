<?php

namespace Database\Factories;

use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionnaireFactory extends Factory
{
    protected $model = Questionnaire::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'type' => fake()->randomElement(['PHQ-9', 'GAD-7']),
            'description' => fake()->paragraph(),
            'status' => 'published',
            'estimated_minutes' => 5,
            'sort_order' => 0,
        ];
    }
}
