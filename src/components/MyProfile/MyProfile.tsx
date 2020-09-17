import { authService, dbService } from '@src/config';
import { Post, User } from '@src/interfaces';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PostPanel } from '../PostPanel';

interface MyProfileProps {
    user: User;
    onUpdateProfile?: () => void;
}
interface EditProfileFormValue {
    displayName: string;
}
interface EditProfileFormState {
    values: EditProfileFormValue;
}

export const MyProfile = ({ user, onUpdateProfile }: MyProfileProps) => {
    const history = useHistory();

    const [posts, setPosts] = useState<Post[]>([]);
    const [editFormState, setEditFormState] = useState<EditProfileFormState>({
        values: {
            displayName: user.displayName ?? '',
        },
    });
    const handleClickSignOut = async () => {
        await authService.signOut();
        history.push('/');
    };

    const getMyPosts = async () => {
        const myPosts = await dbService
            .collection('posts')
            .where('createdBy', '==', user.uid)
            .get();

        setPosts((prevState) => myPosts.docs.map((doc) => doc.data() as Post));
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const {
            currentTarget: { name, value },
        } = event;

        setEditFormState((prevState) => ({
            ...prevState,
            values: {
                ...prevState.values,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            editFormState.values.displayName &&
            user.displayName !== editFormState.values.displayName
        ) {
            await user.updateProfile({ ...editFormState.values });

            if (onUpdateProfile) {
                onUpdateProfile();
            }
        }
    };

    useEffect(() => {
        getMyPosts();
    }, []);

    return (
        <div>
            <div>
                <button onClick={handleClickSignOut}>Sign out</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="displayName"
                    required
                    value={editFormState.values.displayName}
                    onChange={handleChangeInput}
                />
                <button type="submit">Update profile</button>
            </form>
            <div>
                {posts.map((post) => (
                    <PostPanel key={post.id} record={post} />
                ))}
            </div>
        </div>
    );
};
