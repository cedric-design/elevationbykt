<?php

namespace App\Models;

use App\Enums\EventAccessMode;
use App\Enums\EventType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property EventType $type
 * @property string|null $description
 * @property Carbon $starts_at
 * @property Carbon|null $ends_at
 * @property string $place
 * @property EventAccessMode $access_mode
 * @property int|null $capacity
 * @property bool $is_published
 * @property int $sort_order
 * @property int|null $created_by
 */
class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'type',
        'description',
        'starts_at',
        'ends_at',
        'place',
        'access_mode',
        'capacity',
        'is_published',
        'sort_order',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'type' => EventType::class,
            'access_mode' => EventAccessMode::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_published' => 'boolean',
            'capacity' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('starts_at', '>=', now()->subDay());
    }

    public function isOpen(): bool
    {
        return $this->access_mode === EventAccessMode::Open;
    }

    public function isFull(): bool
    {
        if ($this->capacity === null) {
            return false;
        }

        return $this->registrations()->count() >= $this->capacity;
    }

    public function acceptsPublicRegistration(): bool
    {
        return $this->is_published
            && $this->isOpen()
            && ! $this->isFull();
    }
}
