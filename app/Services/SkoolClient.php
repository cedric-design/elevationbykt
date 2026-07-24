<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin client for Skool's native "Automate via Webhook" feature
 * (Group → Settings → Invite → Automate via Webhook).
 *
 * Skool has no public REST API. Each group instead exposes a single
 * developer webhook URL whose documented purpose is "sending a unique email
 * invite link if people check out through an external processor" — exactly
 * our flow: a member pays on Élévation, then we invite them on Skool.
 *
 * There is NO separate API key or secret: the random token baked into the
 * webhook URL is the only credential. You invite a member with a POST,
 * passing their email as a query param (GET/PUT return 405):
 *
 *     POST {webhook_url}?email=bob@gmail.com
 *
 * A 200 (empty body) means accepted. Skool then emails that address a unique
 * invite link that joins the group instantly, bypassing membership approval.
 * Every call is logged.
 */
class SkoolClient
{
    public function __construct(
        private readonly ?string $webhookUrl = null,
    ) {}

    public function isConfigured(): bool
    {
        return filled($this->webhookUrl);
    }

    /**
     * Invite a member on Skool by email.
     *
     * Returns true when Skool accepts the request. Never throws — a Skool
     * outage must not break the purchase flow; the access record on our side
     * remains the source of truth and the invite can be retried.
     */
    public function invite(string $email): bool
    {
        if (! $this->isConfigured()) {
            Log::warning('Skool webhook not configured; skipping invite.', ['email' => $email]);

            return false;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(15)
                ->withQueryParameters(['email' => $email])
                ->post($this->webhookUrl);
        } catch (\Throwable $e) {
            Log::error('Skool invite webhook failed to send', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }

        Log::info('Skool invite webhook called', [
            'email' => $email,
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return $response->successful();
    }
}
