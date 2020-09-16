import { authService } from '@src/config';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const MyProfile = () => {
    const history = useHistory();

    const handleClickSignOut = async () => {
        await authService.signOut();
        history.push('/');
    };
    return (
        <div>
            <button onClick={handleClickSignOut}>Sign out</button>
        </div>
    );
};
