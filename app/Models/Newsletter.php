<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Newsletter extends Model
{
    protected $fillable = ['subject', 'content', 'template', 'sent_count', 'sent_at', 'sent_by'];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'sent_count' => 'integer',
        ];
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }

    public function isSent(): bool
    {
        return $this->sent_at !== null;
    }
}
