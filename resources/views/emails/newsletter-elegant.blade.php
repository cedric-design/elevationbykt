<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter->subject }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #3d2c1e;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #d4a574; letter-spacing: 4px;">ÉLÉVATION</h1>
                            <p style="margin: 8px 0 0; font-size: 11px; color: #d4a574; opacity: 0.7; letter-spacing: 2px;">BY KADHY</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background: #f8f6f2; border-radius: 20px;">
                                <tr>
                                    <td style="padding: 50px 40px;">
                                        <div style="font-size: 16px; line-height: 1.8; color: #3d2c1e;">
                                            {!! nl2br(e($content)) !!}
                                        </div>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 40px;">
                                            <tr>
                                                <td align="center">
                                                    <a href="{{ url('/') }}" style="display: inline-block; padding: 16px 40px; background-color: #1f6b52; color: white; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 30px; letter-spacing: 1px;">
                                                        DÉCOUVRIR
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #d4a574; opacity: 0.6;">
                                © {{ date('Y') }} ÉLÉVATION by Kadhy<br>
                                <a href="{{ $unsubscribeUrl }}" style="color: #d4a574; opacity: 0.6;">Se désabonner</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
