<?php

use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\CollaboratorController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CourseAccessController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\SubscriberController;
use Illuminate\Support\Facades\Route;

// Page d'accueil SPA — toutes ces routes passent par HomeController
// pour injecter les témoignages et l'état de connexion
Route::get('/', HomeController::class)->name('home');
Route::get('/a-propos', HomeController::class)->name('a-propos');
Route::get('/contenus', HomeController::class)->name('contenus');
Route::get('/contenus/cours/{slug}', HomeController::class)->name('cours.show');
Route::get('/contenus/{slug}', HomeController::class)->name('contenu.show');
Route::get('/galerie', HomeController::class)->name('galerie');
Route::get('/contact', HomeController::class)->name('contact');
Route::get('/connexion', HomeController::class)->name('connexion');
Route::get('/inscription', HomeController::class)->name('inscription');

// Newsletter subscription
Route::post('/newsletter/subscribe', [SubscriberController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/unsubscribe/{token}', [SubscriberController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Invitation collaborateur
Route::get('/invitation/{token}', [InvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/{token}', [InvitationController::class, 'accept'])->name('invitation.accept');

// Espace utilisateur (client ou admin)
Route::middleware(['auth'])->group(function () {
    Route::get('/espace', [DashboardController::class, 'index'])->name('espace');
    Route::post('/cours/{course}/acceder', [CourseAccessController::class, 'request'])->name('courses.access');
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

    Route::get('cours', [CourseController::class, 'index'])->name('courses.index');
    Route::post('cours', [CourseController::class, 'store'])->name('courses.store');
    Route::patch('cours/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::patch('cours/{course}/toggle', [CourseController::class, 'togglePublish'])->name('courses.toggle');
    Route::delete('cours/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
    
    Route::get('collaborateurs', [CollaboratorController::class, 'index'])->name('collaborators.index');
    Route::post('collaborateurs', [CollaboratorController::class, 'store'])->name('collaborators.store');
    Route::post('collaborateurs/{user}/resend', [CollaboratorController::class, 'resend'])->name('collaborators.resend');
    Route::patch('collaborateurs/{user}/toggle', [CollaboratorController::class, 'toggleActive'])->name('collaborators.toggle');
    Route::delete('collaborateurs/{user}', [CollaboratorController::class, 'destroy'])->name('collaborators.destroy');
    
    Route::get('utilisateurs', [UserController::class, 'index'])->name('users.index');
    Route::patch('utilisateurs/{user}/toggle', [UserController::class, 'toggleActive'])->name('users.toggle');
    Route::delete('utilisateurs/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    
    Route::post('upload/video', [UploadController::class, 'video'])->name('upload.video');
    Route::post('upload/image', [UploadController::class, 'image'])->name('upload.image');
    
    Route::get('newsletter', [NewsletterController::class, 'index'])->name('newsletter.index');
    Route::post('newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
    Route::patch('newsletter/{newsletter}', [NewsletterController::class, 'update'])->name('newsletter.update');
    Route::post('newsletter/{newsletter}/send', [NewsletterController::class, 'send'])->name('newsletter.send');
    Route::delete('newsletter/{newsletter}', [NewsletterController::class, 'destroy'])->name('newsletter.destroy');
    Route::delete('subscribers/{subscriber}', [NewsletterController::class, 'destroySubscriber'])->name('subscribers.destroy');
    
    Route::get('publicites', [AdvertisementController::class, 'index'])->name('advertisements.index');
    Route::post('publicites', [AdvertisementController::class, 'store'])->name('advertisements.store');
    Route::patch('publicites/{advertisement}', [AdvertisementController::class, 'update'])->name('advertisements.update');
    Route::patch('publicites/{advertisement}/toggle', [AdvertisementController::class, 'toggleActive'])->name('advertisements.toggle');
    Route::delete('publicites/{advertisement}', [AdvertisementController::class, 'destroy'])->name('advertisements.destroy');
});

