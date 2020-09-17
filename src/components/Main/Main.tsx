import React, { useEffect, useState } from 'react';

import { dbService, storageService } from '@src/config';
import { Post, User } from '@src/interfaces';
import { PostPanel } from '../PostPanel';
import { WritePostForm } from '../WritePostForm';

interface MainProps {
    user?: User;
}

export const Main = ({ user }: MainProps) => {
    const [posts, setPosts] = useState<Post[]>([]);

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

    const handleDeletePost = async (record: Post) => {
        const result = window.confirm('Are you sure delete this post?');
        if (result) {
            await dbService.collection('posts').doc(record.id).delete();
            if (record.attachments && record.attachments.length > 0) {
                await Promise.all(
                    await record.attachments.map(async (attachment) => {
                        await storageService.refFromURL(attachment).delete();
                        return true;
                    }),
                );
            }

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
            <WritePostForm user={user} />
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
