<?php

namespace App\Http\Controllers;

use App\Enums\CourseAccessStatus;
use App\Mail\CourseAccessMail;
use App\Models\Course;
use App\Models\CourseAccess;
use App\Services\SkoolClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CourseAccessController extends Controller
{
    public function __construct(private readonly SkoolClient $skool)
    {
    }

    public function request(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        if (! $course->is_published || ! $course->isCurrentlyAvailable()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Ce cours n’est pas disponible pour le moment.',
            ]);

            return back();
        }

        if (blank($course->skool_invite_link)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Le lien d’accès de ce cours n’est pas encore configuré.',
            ]);

            return back();
        }

        $access = CourseAccess::query()->firstOrNew([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);

        if ($access->status === CourseAccessStatus::Revoked) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Ton accès à ce cours a été révoqué.',
            ]);

            return back();
        }

        $access->private_link = $course->skool_invite_link;
        $access->status = CourseAccessStatus::Sent;
        $access->link_sent_at = now();
        $access->accessed_at = $access->accessed_at ?? now();
        $access->save();

        // Unlock the member directly on Skool via the group's "Automate via
        // Webhook" endpoint (no Zapier). If Skool is unreachable we still send
        // the invite link by email as a fallback — the access record above is
        // the source of truth and the call can be retried.
        $this->skool->invite($user->email);

        Mail::to($user->email)->send(new CourseAccessMail($user, $course, $access->private_link));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Merci ! Ton lien d’invitation Skool a été envoyé par email.',
        ]);

        return back();
    }
}
