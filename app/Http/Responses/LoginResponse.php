<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $home = '/espace';

        if ($request->wantsJson()) {
            return new JsonResponse(['redirect' => $home], 200);
        }

        return redirect()->intended($home);
    }
}
