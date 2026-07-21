<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticateUser
{
    public function __invoke(Request $request): ?User
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return null;
        }

        if (!Hash::check($request->password, $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return null;
        }

        return $user;
    }
}
