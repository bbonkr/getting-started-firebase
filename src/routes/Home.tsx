import React from 'react';
import { Main } from '@src/components/Main';
import { User } from '@src/interfaces';

interface HomeProps {
    user?: User;
}

export const Home = ({ user }: HomeProps) => {
    return <Main user={user} />;
};
