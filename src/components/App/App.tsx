import React, { useEffect, useState } from 'react';
import { AppRouter } from '@src/components/Router';
import { authService } from '@src/config';
import { User } from '@src/interfaces';

export const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState<User>();

    const handleUpdateProfile = () => {
        setUser((prevState) => {
            let updatedUser: User | undefined = undefined;

            if (authService.currentUser) {
                const currentUser = authService.currentUser;

                updatedUser = {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName ?? '',
                    updateProfile: (profile) =>
                        currentUser.updateProfile({
                            ...profile,
                        }),
                };
            }
            return updatedUser;
        });
    };

    useEffect(() => {
        const unsubscription = authService.onAuthStateChanged((user) => {
            setUser((prevState) => {
                let updatedUser: User | undefined = undefined;

                if (user) {
                    updatedUser = {
                        uid: user.uid,
                        displayName: user.displayName ?? '',
                        updateProfile: (profile) =>
                            user.updateProfile({
                                ...profile,
                            }),
                    };
                }
                return updatedUser;
            });

            setIsInitialized((prevState) => true);
        });

        return () => {
            unsubscription();
        };
    }, []);

    if (!isInitialized) {
        return <div>Initializing ...</div>;
    }

    return (
        <div>
            {isInitialized && (
                <AppRouter
                    isLoggedIn={Boolean(user)}
                    user={user ?? undefined}
                    onUpdateProfile={handleUpdateProfile}
                />
            )}
            <footer>&copy; Hello {new Date().getFullYear()}</footer>
        </div>
    );
};
