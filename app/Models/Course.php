<?php

namespace App\Models;

use App\Enums\CourseAvailabilityType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'skool_course_id',
        'skool_invite_link',
        'availability_type',
        'starts_at',
        'ends_at',
        'is_published',
        'sort_order',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'availability_type' => CourseAvailabilityType::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Course $course) {
            if (empty($course->slug)) {
                $course->slug = Str::slug($course->title);
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order');
    }

    public function accesses(): HasMany
    {
        return $this->hasMany(CourseAccess::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_accesses')
            ->withPivot(['private_link', 'status', 'granted_by', 'link_sent_at', 'accessed_at'])
            ->withTimestamps();
    }

    public function isCurrentlyAvailable(): bool
    {
        if ($this->availability_type === CourseAvailabilityType::Indefinite) {
            return true;
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->ends_at && $now->gt($this->ends_at)) {
            return false;
        }

        return true;
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->where('availability_type', CourseAvailabilityType::Indefinite->value)
                ->orWhere(function (Builder $period) {
                    $period->where('availability_type', CourseAvailabilityType::Period->value)
                        ->where(function (Builder $starts) {
                            $starts->whereNull('starts_at')->orWhere('starts_at', '<=', now());
                        })
                        ->where(function (Builder $ends) {
                            $ends->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                        });
                });
        });
    }
}
