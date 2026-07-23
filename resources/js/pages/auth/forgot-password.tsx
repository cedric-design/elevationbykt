import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Mot de passe oublié" />

            {status && (
                <div className="mb-6 rounded-xl border border-emerald/20 bg-emerald/10 px-4 py-3 text-center text-sm font-medium text-emerald">
                    {status}
                </div>
            )}

            <Form {...email.form()} className="space-y-5">
                {({ processing, errors }) => (
                    <>
                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-cocoa/70">E-mail</span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="username"
                                autoFocus
                                required
                                placeholder="vous@exemple.com"
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)] ${
                                    errors.email
                                        ? 'border-terracotta focus:border-terracotta'
                                        : 'border-cocoa/20 focus:border-emerald'
                                }`}
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </label>

                        <motion.button
                            type="submit"
                            whileHover={!processing ? { scale: 1.02 } : undefined}
                            whileTap={!processing ? { scale: 0.98 } : undefined}
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                            className="w-full rounded-xl bg-emerald py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Envoi...' : 'Recevoir le lien de réinitialisation'}
                        </motion.button>
                    </>
                )}
            </Form>

            <p className="mt-8 text-center text-sm text-cocoa/65">
                Tu t’en souviens ?{' '}
                <a href="/connexion" className="font-medium text-emerald transition hover:text-cocoa">
                    Se connecter
                </a>
            </p>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Mot de passe oublié',
    description: 'Entre ton e-mail pour recevoir un lien de réinitialisation.',
};
