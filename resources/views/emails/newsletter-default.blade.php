<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter->subject }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f6f2;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e8dcc6;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #3d2c1e; letter-spacing: 2px;">ÉLÉVATION</h1>
                            <p style="margin: 8px 0 0; font-size: 12px; color: #3d2c1e; opacity: 0.6; letter-spacing: 1px;">BY KADHY</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <div style="font-size: 16px; line-height: 1.7; color: #3d2c1e;">
                                {!! nl2br(e($content)) !!}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/') }}" style="display: inline-block; padding: 14px 32px; background-color: #1f6b52; color: white; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 12px;">
                                            Visiter le site
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8f6f2; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0; font-size: 12px; text-align: center; color: #3d2c1e; opacity: 0.5;">
                                © {{ date('Y') }} ÉLÉVATION by Kadhy. Tous droits réservés.<br>
                                <a href="{{ $unsubscribeUrl }}" style="color: #3d2c1e; opacity: 0.5;">Se désabonner</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
