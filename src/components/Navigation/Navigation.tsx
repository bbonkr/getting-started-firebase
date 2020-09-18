import { User } from '@src/interfaces';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
    user?: User;
}

interface Menu {
    to: string;
    title: string;
}

export const Navigation = ({ user }: NavigationProps) => {
    const location = useLocation();
    const menus: Menu[] = [
        {
            to: '/',
            title: 'Home',
        },
        {
            to: '/profile',
            title: `${user?.displayName} Profile`,
        },
    ];
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Post
            </Link>
            <ul className="navbar-nav d-flex">
                {menus.map((menu) => {
                    return (
                        <li
                            key={menu.to}
                            className={`nav-item ${
                                location.pathname === menu.to
                            }`}
                        >
                            <Link to={menu.to} className="nav-link">
                                {menu.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
