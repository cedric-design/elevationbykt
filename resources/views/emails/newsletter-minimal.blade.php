<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter->subject }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                <table role="presentation" style="width: 100%; max-width: 520px; border-collapse: collapse;">
                    <tr>
                        <td style="padding-bottom: 30px; border-bottom: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 11px; letter-spacing: 3px; color: #999; text-transform: uppercase;">ÉLÉVATION by Kadhy</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 0;">
                            <div style="font-size: 18px; line-height: 1.8; color: #333;">
                                {!! nl2br(e($content)) !!}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                <a href="{{ $unsubscribeUrl }}" style="color: #999; text-decoration: underline;">Se désabonner</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
