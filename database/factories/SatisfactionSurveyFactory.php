<?php

namespace Database\Factories;

use App\Models\SatisfactionSurvey;
use Illuminate\Database\Eloquent\Factories\Factory;

class SatisfactionSurveyFactory extends Factory
{
    protected $model = SatisfactionSurvey::class;

    public function definition(): array
    {
        return [
            'overall_score' => fake()->numberBetween(2, 5),
            'emotional_support_score' => fake()->numberBetween(2, 5),
            'platform_clarity_score' => fake()->numberBetween(2, 5),
            'academic_balance_score' => fake()->numberBetween(2, 5),
            'comments' => fake()->sentence(),
            'anonymous' => true,
        ];
    }
}