import React, { useEffect, useState } from 'react';
import { AppRouter } from '@src/components/Router';
import { authService } from '@src/config';
import { Navigation } from '@src/components/Navigation';

export const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            setIsLoggedIn((prevState) => user !== null);
            setIsInitialized((prevState) => true);
        });
    }, []);

    return (
        <div>
            {isInitialized && <AppRouter isLoggedIn={isLoggedIn} />}
            <footer>&copy; Hello {new Date().getFullYear()}</footer>
        </div>
    );
};
