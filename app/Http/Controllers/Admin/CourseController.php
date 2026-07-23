<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseAvailabilityType;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::with('modules')
            ->withCount('accesses')
            ->latest()
            ->get()
            ->map(function (Course $course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'description' => $course->description,
                    'cover_image' => $course->cover_image,
                    'skool_course_id' => $course->skool_course_id,
                    'skool_invite_link' => $course->skool_invite_link,
                    'availability_type' => $course->availability_type->value,
                    'starts_at' => $course->starts_at?->toDateString(),
                    'ends_at' => $course->ends_at?->toDateString(),
                    'is_published' => $course->is_published,
                    'sort_order' => $course->sort_order,
                    'is_currently_available' => $course->isCurrentlyAvailable(),
                    'accesses_count' => $course->accesses_count,
                    'modules' => $course->modules->map(fn ($m) => [
                        'id' => $m->id,
                        'title' => $m->title,
                        'description' => $m->description,
                        'sort_order' => $m->sort_order,
                    ])->values(),
                    'created_at' => $course->created_at?->toISOString(),
                ];
            });

        return Inertia::render('admin/courses', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCourse($request);
        $modules = $validated['modules'] ?? [];
        unset($validated['modules']);

        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['created_by'] = $request->user()->id;
        $this->normalizeAvailability($validated);

        DB::transaction(function () use ($validated, $modules) {
            $course = Course::create($validated);
            $this->syncModules($course, $modules);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Cours créé avec succès.']);

        return back();
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $this->validateCourse($request);
        $modules = $validated['modules'] ?? [];
        unset($validated['modules']);

        if (isset($validated['title']) && $validated['title'] !== $course->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $course->id);
        }

        $this->normalizeAvailability($validated);

        DB::transaction(function () use ($course, $validated, $modules) {
            $course->update($validated);
            $this->syncModules($course, $modules);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Cours mis à jour.']);

        return back();
    }

    public function togglePublish(Course $course): RedirectResponse
    {
        $course->update(['is_published' => ! $course->is_published]);

        return back();
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Cours supprimé.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCourse(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'skool_course_id' => ['nullable', 'string', 'max:100'],
            'skool_invite_link' => ['nullable', 'string', 'max:500'],
            'availability_type' => ['required', Rule::in(['indefinite', 'period'])],
            'starts_at' => ['nullable', 'date', 'required_if:availability_type,period'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'modules' => ['nullable', 'array'],
            'modules.*.title' => ['required', 'string', 'max:255'],
            'modules.*.description' => ['nullable', 'string'],
            'modules.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function normalizeAvailability(array &$validated): void
    {
        if (($validated['availability_type'] ?? null) === CourseAvailabilityType::Indefinite->value) {
            $validated['starts_at'] = null;
            $validated['ends_at'] = null;
        }

        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
    }

    /**
     * @param  array<int, array{title: string, description?: string|null, sort_order?: int|null}>  $modules
     */
    private function syncModules(Course $course, array $modules): void
    {
        $course->modules()->delete();

        foreach (array_values($modules) as $index => $module) {
            $course->modules()->create([
                'title' => $module['title'],
                'description' => $module['description'] ?? null,
                'sort_order' => $module['sort_order'] ?? $index,
            ]);
        }
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'cours';
        $slug = $base;
        $i = 1;

        while (
            Course::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
