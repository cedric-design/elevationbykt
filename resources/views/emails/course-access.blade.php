<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès cours ÉLÉVATION</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f6f2;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 520px; border-collapse: collapse; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e8dcc6;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #3d2c1e; letter-spacing: 2px;">ÉLÉVATION</h1>
                            <p style="margin: 8px 0 0; font-size: 12px; color: #3d2c1e; opacity: 0.6; letter-spacing: 1px;">BY KADHY</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #3d2c1e;">
                                Bonjour {{ $user->name }} !
                            </h2>
                            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #3d2c1e; opacity: 0.8;">
                                Merci pour ton intérêt pour le cours <strong>{{ $course->title }}</strong>.
                                Voici ton lien d'invitation privé pour rejoindre le cours sur Skool.
                            </p>
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $privateLink }}" style="display: inline-block; padding: 14px 32px; background-color: #1f6b52; color: white; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 12px; letter-spacing: 0.5px;">
                                            Accéder au cours
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 32px 0 0; font-size: 13px; line-height: 1.6; color: #3d2c1e; opacity: 0.5;">
                                Tu peux aussi retrouver ce lien à tout moment dans ton espace ÉLÉVATION.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8f6f2; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0; font-size: 12px; text-align: center; color: #3d2c1e; opacity: 0.5;">
                                © {{ date('Y') }} ÉLÉVATION by Kadhy. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
