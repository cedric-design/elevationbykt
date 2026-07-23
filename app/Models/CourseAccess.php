<?php

namespace App\Models;

use App\Enums\CourseAccessStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAccess extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'private_link',
        'status',
        'granted_by',
        'link_sent_at',
        'accessed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CourseAccessStatus::class,
            'link_sent_at' => 'datetime',
            'accessed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function granter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }
}
