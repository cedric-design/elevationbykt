<?php

use App\Http\Controllers\Admin\CollaboratorController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

// Page d'accueil SPA — toutes ces routes passent par HomeController
// pour injecter les témoignages et l'état de connexion
Route::get('/', HomeController::class)->name('home');
Route::get('/a-propos', HomeController::class)->name('a-propos');
Route::get('/contenus', HomeController::class)->name('contenus');
Route::get('/galerie', HomeController::class)->name('galerie');
Route::get('/contact', HomeController::class)->name('contact');
Route::get('/connexion', HomeController::class)->name('connexion');
Route::get('/inscription', HomeController::class)->name('inscription');

// Invitation collaborateur
Route::get('/invitation/{token}', [InvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/{token}', [InvitationController::class, 'accept'])->name('invitation.accept');

// Espace utilisateur (client ou admin)
Route::middleware(['auth'])->group(function () {
    Route::get('/espace', [DashboardController::class, 'index'])->name('espace');
});

// Routes admin uniquement
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn() => redirect()->route('espace'));
    
    Route::get('temoignages', [TestimonialController::class, 'index'])->name('testimonials.index');
    Route::post('temoignages', [TestimonialController::class, 'store'])->name('testimonials.store');
    Route::put('temoignages/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
    Route::patch('temoignages/{testimonial}/toggle', [TestimonialController::class, 'togglePublish'])->name('testimonials.toggle');
    Route::delete('temoignages/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');
    
    Route::get('contenus', [ContentController::class, 'index'])->name('contents.index');
    Route::post('contenus', [ContentController::class, 'store'])->name('contents.store');
    Route::patch('contenus/{content}', [ContentController::class, 'update'])->name('contents.update');
    Route::patch('contenus/{content}/toggle', [ContentController::class, 'togglePublish'])->name('contents.toggle');
    Route::delete('contenus/{content}', [ContentController::class, 'destroy'])->name('contents.destroy');
    Route::post('categories', [ContentController::class, 'storeCategory'])->name('categories.store');
    Route::delete('categories/{category}', [ContentController::class, 'destroyCategory'])->name('categories.destroy');
    
    Route::get('collaborateurs', [CollaboratorController::class, 'index'])->name('collaborators.index');
    Route::post('collaborateurs', [CollaboratorController::class, 'store'])->name('collaborators.store');
    Route::post('collaborateurs/{user}/resend', [CollaboratorController::class, 'resend'])->name('collaborators.resend');
    Route::delete('collaborateurs/{user}', [CollaboratorController::class, 'destroy'])->name('collaborators.destroy');
    
    Route::post('upload/video', [UploadController::class, 'video'])->name('upload.video');
    Route::post('upload/image', [UploadController::class, 'image'])->name('upload.image');
});

require __DIR__.'/settings.php';
