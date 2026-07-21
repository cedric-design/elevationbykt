<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Content extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'video_url',
        'type',
        'price',
        'currency',
        'category_id',
        'skool_link',
        'skool_course_id',
        'stripe_price_id',
        'paymetrust_product_id',
        'is_published',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Content $content) {
            if (empty($content->slug)) {
                $content->slug = Str::slug($content->title);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ContentCategory::class, 'category_id');
    }

    public function isFree(): bool
    {
        return $this->type === 'free';
    }

    public function isPaid(): bool
    {
        return $this->type === 'paid';
    }

    public function formattedPrice(): string
    {
        if ($this->isFree()) {
            return 'Gratuit';
        }

        return number_format($this->price, 0, ',', ' ') . ' ' . $this->currency;
    }
}
