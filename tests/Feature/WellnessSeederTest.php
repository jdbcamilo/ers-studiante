<?php

namespace Tests\Feature;

use App\Models\Feedback;
use App\Models\Questionnaire;
use App\Models\User;
use Database\Seeders\WellnessPlatformSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WellnessSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_wellness_platform_seeder_populates_demo_data(): void
    {
        $this->seed(WellnessPlatformSeeder::class);

        $this->assertGreaterThan(0, User::where('role', 'admin')->count());
        $this->assertGreaterThan(0, Questionnaire::count());
        $this->assertGreaterThan(0, Feedback::count());
    }
}
