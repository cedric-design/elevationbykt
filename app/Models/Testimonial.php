<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $role
 * @property string $quote
 * @property bool $is_published
 */
class Testimonial extends Model
{
    protected $fillable = ['name', 'role', 'quote', 'is_published'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }
}
