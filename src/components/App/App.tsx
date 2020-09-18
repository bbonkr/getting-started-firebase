import React, { useEffect, useState } from 'react';
import { AppRouter } from '@src/components/Router';
import { authService } from '@src/config';
import { User } from '@src/interfaces';
import halfmoon from 'halfmoon';

import 'halfmoon/css/halfmoon-variables.min.css';
import { HashRouter as Router } from 'react-router-dom';
import { Navigation } from '../Navigation';

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

        halfmoon.onDOMContentLoaded();

        return () => {
            unsubscription();
        };
    }, []);

    if (!isInitialized) {
        return <div>Initializing ...</div>;
    }

    return (
        <Router>
            <div className="page-wrapper with-navbar with-navbar-fixed-bottom">
                {Boolean(user) && <Navigation user={user} />}
                <div className="content-wrapper">
                    {isInitialized && (
                        <AppRouter
                            isLoggedIn={Boolean(user)}
                            user={user ?? undefined}
                            onUpdateProfile={handleUpdateProfile}
                        />
                    )}
                </div>

                <nav className="navbar navbar-fixed-bottom">
                    <footer>&copy; Hello {new Date().getFullYear()}</footer>
                </nav>
            </div>
        </Router>
    );
};
