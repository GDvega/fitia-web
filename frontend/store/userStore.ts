import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, Goal, ActivityLevel } from '../types'; // Import enums from types

interface UserState {
    userProfile: UserProfile | null;
    userId: string | null;
    token: string | null;
    setUserProfile: (profile: UserProfile) => void;
    registerUser: (profile: UserProfile) => Promise<void>;
    fetchUser: (userId: string) => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    clearUserProfile: () => void;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, country: string, region: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            userProfile: null,
            userId: null,
            token: localStorage.getItem('token'),

            setUserProfile: (profile) => set({ userProfile: profile }),

            registerUser: async (profile) => {
                try {
                    const { registerUser } = await import('../services/api');
                    const id = await registerUser(profile);
                    set({ userProfile: profile, userId: id });
                } catch (error) {
                    console.error("Failed to register user to backend:", error);
                }
            },

            login: async (email, password) => {
                try {
                    const { default: api } = await import('../services/api');
                    // We need to use FormData for OAuth2 password flow if backend expects it (FastAPI OAuth2PasswordRequestForm)
                    const formData = new FormData();
                    formData.append('username', email);
                    formData.append('password', password);

                    const res = await api.post('/auth/login', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    const token = res.data.access_token;

                    localStorage.setItem('token', token);

                    // Decode token to get userId (sub)
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const userId = payload.sub;

                    set({ token, userId });

                    set({ token, userId });

                    // Fetch profile
                    const { fetchUser } = get();
                    await fetchUser(userId);
                } catch (e) {
                    console.error("Login failed:", e);
                    throw e;
                }
            },

            register: async (email, password, country, region) => {
                try {
                    const { default: api } = await import('../services/api');
                    // Register with minimal defaults
                    await api.post('/auth/register', {
                        email,
                        password,
                        age: 25,
                        weight: 70,
                        height: 170,
                        gender: 'Female' as const, // Explicitly cast to literal type matching Gender
                        goal: Goal.LoseWeight,
                        activity_level: ActivityLevel.Moderate,
                        country: country,
                        region: region,
                    });

                    // Auto-login
                    const { login } = get();
                    await login(email, password);
                } catch (e) {
                    console.error("Registration failed:", e);
                    throw e;
                }
            },

            fetchUser: async (userId) => {
                try {
                    const { getUserProfile } = await import('../services/api');
                    const profile = await getUserProfile(userId);
                    if (profile && profile.name) {
                        set({ userProfile: profile as UserProfile });
                    } else {
                        // Incomplete profile or not found
                        set({ userProfile: null });
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    set({ userProfile: null });
                }
            },

            updateUserProfile: async (updates) => {
                const state = get();
                // Optimistic update
                set({ userProfile: { ...(state.userProfile || {} as UserProfile), ...updates } });

                if (state.userId) {
                    try {
                        const { updateUser } = await import('../services/api');
                        await updateUser(state.userId, updates);
                    } catch (error) {
                        console.error("Failed to update user in backend:", error);
                    }
                }
            },

            clearUserProfile: () => {
                localStorage.removeItem('token');
                set({ userProfile: null, userId: null, token: null });
            },
        }),
        {
            name: 'fitia_user_store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
