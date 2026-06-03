<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student');
            $table->string('status')->default('active');
            $table->string('student_code')->nullable()->unique();
            $table->string('department')->nullable();
            $table->string('semester')->nullable();
            $table->timestamp('last_mood_check_in')->nullable();
        });

        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->text('description')->nullable();
            $table->string('status')->default('draft');
            $table->integer('estimated_minutes')->default(5);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('questionnaire_id')->constrained()->cascadeOnDelete();
            $table->text('prompt');
            $table->string('scale_label')->default('Likert');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->integer('score');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('questionnaire_id')->constrained()->cascadeOnDelete();
            $table->integer('score');
            $table->string('level');
            $table->text('summary')->nullable();
            $table->json('risk_flags')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('option_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('value')->nullable();
            $table->timestamps();
        });

        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('mood')->default('sereno');
            $table->integer('mood_score')->default(5);
            $table->boolean('is_private')->default(true);
            $table->timestamps();
        });

        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category');
            $table->text('message');
            $table->string('status')->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('satisfaction_surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('overall_score');
            $table->integer('emotional_support_score');
            $table->integer('platform_clarity_score');
            $table->integer('academic_balance_score');
            $table->text('comments')->nullable();
            $table->boolean('anonymous')->default(true);
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('period');
            $table->integer('average_score');
            $table->string('risk_level');
            $table->json('trend_data')->nullable();
            $table->text('summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('satisfaction_surveys');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('journal_entries');
        Schema::dropIfExists('responses');
        Schema::dropIfExists('evaluations');
        Schema::dropIfExists('options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('questionnaires');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'status',
                'student_code',
                'department',
                'semester',
                'last_mood_check_in',
            ]);
        });
    }
};
