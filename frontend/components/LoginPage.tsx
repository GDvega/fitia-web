import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                // Registration flow: Just create basic account first
                await register(email, password, country, region);
                // User store logic should redirect to onboarding next
            } else {
                await login(email, password);
            }
        } catch (err: any) {
            console.error(err);
            setError(isRegistering ? t('auth.regFailed') : t('auth.loginFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fitia-green to-teal-400 mb-2">
                        fitia
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isRegistering ? t('auth.welcome') : t('auth.welcomeBack')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-fitia-green outline-none transition-all"
                            placeholder={t('auth.placeEmail')}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.country')}</label>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-fitia-green outline-none transition-all"
                                        placeholder={t('auth.placeCountry')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.region')}</label>
                                    <input
                                        type="text"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-fitia-green outline-none transition-all"
                                        placeholder={t('auth.placeRegion')}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-fitia-green outline-none transition-all"
                            placeholder={t('auth.placePass')}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-fitia-green hover:bg-fitia-green/90 text-white font-bold rounded-xl shadow-lg shadow-fitia-green/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isRegistering ? <UserPlus size={20} className="mr-2" /> : <LogIn size={20} className="mr-2" />}
                                {isRegistering ? t('auth.createAccount') : t('auth.signIn')}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-gray-500 hover:text-fitia-green transition-colors"
                    >
                        {isRegistering ? t('auth.alreadyAccount') : t('auth.noAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
