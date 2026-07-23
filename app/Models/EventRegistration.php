<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $event_id
 * @property int|null $user_id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $notes
 */
class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'name',
        'email',
        'phone',
        'notes',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
