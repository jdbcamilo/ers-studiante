<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'student_code',
        'department',
        'semester',
        'cedula',
        'birth_date',
        'age',
        'gender',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function journalEntries()
    {
        return $this->hasMany(JournalEntry::class)->latest();
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class)->latest();
    }

    public function satisfactionSurveys()
    {
        return $this->hasMany(SatisfactionSurvey::class)->latest();
    }

    public function reports()
    {
        return $this->hasMany(Report::class)->latest();
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_mood_check_in' => 'datetime',
        ];
    }
}
