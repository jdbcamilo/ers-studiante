<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SatisfactionSurvey extends Model
{
    protected $fillable = [
        'user_id',
        'overall_score',
        'emotional_support_score',
        'platform_clarity_score',
        'academic_balance_score',
        'comments',
        'anonymous',
    ];

    protected $casts = [
        'anonymous' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
