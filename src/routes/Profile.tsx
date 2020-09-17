import { MyProfile } from '@src/components/MyProfile';
import { User } from '@src/interfaces';
import React from 'react';

interface ProfileProps {
    user?: User;
    onUpdateProfile?: () => void;
}

export const Profile = ({ user, onUpdateProfile }: ProfileProps) => {
    if (!user) {
        return <React.Fragment></React.Fragment>;
    }
    return (
        <div>
            <MyProfile user={user} onUpdateProfile={onUpdateProfile} />
        </div>
    );
};
