<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    protected $fillable = ['email', 'name', 'token', 'verified_at', 'unsubscribed_at'];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Subscriber $subscriber) {
            if (empty($subscriber->token)) {
                $subscriber->token = Str::random(64);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->whereNotNull('verified_at')->whereNull('unsubscribed_at');
    }

    public function isActive(): bool
    {
        return $this->verified_at !== null && $this->unsubscribed_at === null;
    }
}
