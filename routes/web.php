<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFeedbacksController;
use App\Http\Controllers\Admin\AdminQuestionnairesController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/assessments', [AssessmentController::class, 'index'])->name('assessments.index');
    Route::post('/assessments', [AssessmentController::class, 'store'])->name('assessments.store');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/journal', [JournalController::class, 'index'])->name('journal.index');
    Route::post('/journal', [JournalController::class, 'store'])->name('journal.store');
    Route::patch('/journal/{entry}', [JournalController::class, 'update'])->name('journal.update');
    Route::delete('/journal/{entry}', [JournalController::class, 'destroy'])->name('journal.destroy');
    Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
    Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
    Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
    Route::get('/chat', [ChatController::class, 'index'])->name('chat');
    Route::post('/chat/message', [ChatController::class, 'message'])->name('chat.message');
    Route::get('/resources', [ResourceController::class, 'index'])->name('resources.index');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class)->name('admin.dashboard');
    Route::get('/users', [AdminUsersController::class, 'index'])->name('admin.users');
    Route::patch('/users/{userId}/status', [AdminUsersController::class, 'updateStatus'])->name('admin.users.status');
    Route::patch('/users/{userId}/role', [AdminUsersController::class, 'updateRole'])->name('admin.users.role');
    Route::delete('/users/{userId}', [AdminUsersController::class, 'destroy'])->name('admin.users.destroy');
    Route::get('/questionnaires', [AdminQuestionnairesController::class, 'index'])->name('admin.questionnaires');
    Route::post('/questionnaires', [AdminQuestionnairesController::class, 'store'])->name('admin.questionnaires.store');
    Route::patch('/questionnaires/{questionnaire}', [AdminQuestionnairesController::class, 'update'])->name('admin.questionnaires.update');
    Route::get('/feedbacks', [AdminFeedbacksController::class, 'index'])->name('admin.feedbacks');
    Route::post('/feedbacks/{feedback}/review', [AdminFeedbacksController::class, 'review'])->name('admin.feedbacks.review');
});

require __DIR__.'/settings.php';
