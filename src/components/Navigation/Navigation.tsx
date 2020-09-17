import { User } from '@src/interfaces';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
    user?: User;
}

export const Navigation = ({ user }: NavigationProps) => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/profile">{user?.displayName} Profile</Link>
                </li>
            </ul>
        </nav>
    );
};
