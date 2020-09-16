import React from 'react';
import { Main } from '@src/components/Main';

interface HomeProps {
    user?: firebase.User;
}

export const Home = ({ user }: HomeProps) => {
    return <Main user={user} />;
};
