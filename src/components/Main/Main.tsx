import { authService, dbService } from '@src/config';
import { Post } from '@src/interfaces';
import React, { useEffect, useState } from 'react';
import { PostPanel } from '../PostPanel';

interface MainProps {
    user?: firebase.User;
}

interface PostValue {
    text: string;
}

interface PostFormState {
    value: PostValue;
}

export const Main = ({ user }: MainProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [formState, setFormState] = useState<PostFormState>({
        value: {
            text: '',
        },
    });

    const getPosts = async () => {
        const results = await dbService.collection('posts').get();
        results.forEach((document) => {
            setPosts((prevState) => {
                const data = document.data() as Post;
                const current: Post = {
                    ...data,
                    id: document.id,
                };
                return [current, ...prevState];
            });
        });
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const {
            target: { name, value },
        } = event;

        setFormState((prevState) => ({
            ...prevState,
            value: {
                ...prevState.value,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formState.value.text) {
            const newPost: Post = {
                id: '',
                text: formState.value.text,
                createdAt: Date.now(),
                createdBy: user?.uid ?? '',
            };
            await dbService.collection('posts').add(newPost);

            setFormState({
                value: {
                    text: '',
                },
            });
        }
    };

    const handleDeletePost = async (record: Post) => {
        const result = window.confirm('Are you sure delete this post?');
        if (result) {
            await dbService.collection('posts').doc(record.id).delete();

            setPosts((prevState) => {
                const index = prevState.findIndex((x) => x.id === record.id);
                if (index >= 0) {
                    prevState.splice(index, 1);
                }
                return [...prevState];
            });
        }
    };

    const handleEditPost = async (record: Post) => {
        await dbService.collection('posts').doc(record.id).update({
            text: record.text,
        });
        //.update(record)

        setPosts((prevState) => {
            const index = prevState.findIndex((x) => x.id === record.id);
            if (index >= 0) {
                prevState.splice(index, 1, record);
            }
            return [...prevState];
        });
    };

    useEffect(() => {
        // getPosts();

        dbService
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .onSnapshot((snapshot) => {
                // console.info('snapshot', snapshot);
                const postArray = snapshot.docs.map((doc) => {
                    const data = doc.data() as Post;
                    const current: Post = {
                        ...data,
                        id: doc.id,
                    };
                    return current;
                });

                setPosts((prevState) => {
                    postArray.forEach((p) => {
                        const index = prevState.findIndex((x) => x.id === p.id);
                        if (index >= 0) {
                            prevState.splice(index, 1, p);
                        } else {
                            prevState.splice(0, 0, p);
                        }
                    });

                    return [...prevState];
                });
            });
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="text"
                    placeholder="Say something"
                    required
                    maxLength={120}
                    value={formState.value.text}
                    onChange={handleChangeInput}
                />
                <button type="submit">Post</button>
            </form>

            <div>
                {posts
                    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                    .map((post) => {
                        return (
                            <PostPanel
                                key={post.id}
                                record={post}
                                isOwner={user && post.createdBy === user.uid}
                                onDelete={handleDeletePost}
                                onEdit={handleEditPost}
                            />
                        );
                    })}
            </div>
        </div>
    );
};
