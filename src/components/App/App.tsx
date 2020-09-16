import React, { useEffect, useState } from 'react';
import { AppRouter } from '@src/components/Router';
import { authService } from '@src/config';
import { Navigation } from '@src/components/Navigation';

export const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState<firebase.User>();

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            setUser(user ?? undefined);
            setIsInitialized((prevState) => true);
        });
    }, []);

    if (!isInitialized) {
        return <div>Initializing ...</div>;
    }

    return (
        <div>
            {isInitialized && (
                <AppRouter isLoggedIn={Boolean(user)} user={user} />
            )}
            <footer>&copy; Hello {new Date().getFullYear()}</footer>
        </div>
    );
};
