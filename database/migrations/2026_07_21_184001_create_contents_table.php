<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('video_url')->nullable();
            
            $table->enum('type', ['free', 'paid'])->default('free');
            $table->unsignedInteger('price')->default(0);
            $table->string('currency')->default('XOF');
            
            $table->foreignId('category_id')->nullable()->constrained('content_categories')->nullOnDelete();
            
            $table->string('skool_link')->nullable();
            $table->string('skool_course_id')->nullable();
            $table->string('stripe_price_id')->nullable();
            
            $table->string('paymetrust_product_id')->nullable();
            
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
