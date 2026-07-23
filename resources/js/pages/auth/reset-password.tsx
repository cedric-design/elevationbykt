import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Nouveau mot de passe" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-cocoa/70">E-mail</span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                                className="w-full rounded-xl border border-cocoa/15 bg-sand/60 px-4 py-2.5 text-cocoa/70 outline-none"
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-cocoa/70">Nouveau mot de passe</span>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                required
                                placeholder="••••••••"
                                passwordrules={passwordRules}
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)] ${
                                    errors.password
                                        ? 'border-terracotta focus:border-terracotta'
                                        : 'border-cocoa/20 focus:border-emerald'
                                }`}
                            />
                            <InputError message={errors.password} className="mt-1.5" />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-cocoa/70">Confirmer le mot de passe</span>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                passwordrules={passwordRules}
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)] ${
                                    errors.password_confirmation
                                        ? 'border-terracotta focus:border-terracotta'
                                        : 'border-cocoa/20 focus:border-emerald'
                                }`}
                            />
                            <InputError message={errors.password_confirmation} className="mt-1.5" />
                        </label>

                        <motion.button
                            type="submit"
                            whileHover={!processing ? { scale: 1.02 } : undefined}
                            whileTap={!processing ? { scale: 0.98 } : undefined}
                            disabled={processing}
                            data-test="reset-password-button"
                            className="w-full rounded-xl bg-emerald py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                        </motion.button>
                    </>
                )}
            </Form>

            <p className="mt-8 text-center text-sm text-cocoa/65">
                <a href="/connexion" className="font-medium text-emerald transition hover:text-cocoa">
                    Retour à la connexion
                </a>
            </p>
        </>
    );
}

ResetPassword.layout = {
    title: 'Nouveau mot de passe',
    description: 'Choisis un nouveau mot de passe pour ton compte.',
};
