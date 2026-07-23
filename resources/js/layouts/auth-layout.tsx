import AuthIvoireLayout from '@/layouts/auth/auth-ivoire-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthIvoireLayout title={title} description={description}>
            {children}
        </AuthIvoireLayout>
    );
}
