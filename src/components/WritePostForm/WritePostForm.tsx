import { dbService, storageService } from '@src/config';
import { Attachment, Post, User } from '@src/interfaces';
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { FaTrash } from 'react-icons/fa';

interface PostValue {
    text: string;
}

interface PostFormState {
    value: PostValue;
}

interface WritePostFormProps {
    user?: User;
}

export const WritePostForm = ({ user }: WritePostFormProps) => {
    const [formState, setFormState] = useState<PostFormState>({
        value: {
            text: '',
        },
    });
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const handleChangeInput = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
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

    const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const {
            target: { files },
        } = event;

        if (files && files?.length > 0) {
            const file = files.item(0);

            if (file) {
                const { name, type, size } = file;
                const reader = new FileReader();
                reader.onloadend = (ev: ProgressEvent<FileReader>) => {
                    const result = ev.target?.result;
                    if (result) {
                        // console.info('file: ', result, ev);
                        setAttachments((prevState) => {
                            const index = prevState.findIndex(
                                (x) => x.name === name,
                            );
                            if (index < 0) {
                                prevState.push({
                                    name,
                                    type,
                                    size,
                                    data: result as string,
                                });
                            }
                            return [...prevState];
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleClickRemoveAttachment = (item: Attachment) => () => {
        setAttachments((prevState) => {
            const index = prevState.findIndex((x) => x.name === item.name);
            if (index >= 0) {
                prevState.splice(index, 1);
            }
            return [...prevState];
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user && formState.value.text) {
            let fileUrls: string[] = [];
            if (attachments.length > 0) {
                fileUrls = await Promise.all(
                    attachments.map(async (attachment) => {
                        const storageItemRef = storageService
                            .ref()
                            .child(`${user?.uid}/${uuidV4()}`);
                        const response = await storageItemRef.putString(
                            attachment.data,
                            'data_url',
                        );

                        const url: string = await response.ref.getDownloadURL();
                        console.info('url', url);
                        // fileUrls.push(url);
                        return url;
                    }),
                );
            }

            const newPost: Post = {
                id: '',
                text: formState.value.text,
                attachments: fileUrls,
                createdAt: Date.now(),
                createdBy: user?.uid ?? '',
            };
            await dbService.collection('posts').add(newPost);

            setFormState({
                value: {
                    text: '',
                },
            });
            setAttachments((prevState) => []);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-400">
            <div className="form-group">
                <textarea
                    name="text"
                    placeholder="Say something"
                    required
                    maxLength={120}
                    value={formState.value.text}
                    onChange={handleChangeInput}
                    className="form-control"
                />
            </div>
            <div className="custom-file">
                <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeFile}
                />
                <label htmlFor="file">Choose a file</label>

                {attachments && attachments.length > 0 && (
                    <div className="row mb-10">
                        {attachments.map((attachment) => {
                            return (
                                <div
                                    className="col-4"
                                    key={attachment.name}
                                    style={{
                                        position: 'relative',
                                    }}
                                >
                                    <img
                                        src={attachment.data}
                                        className="img-fluid"
                                    />
                                    <button
                                        className="btn btn-danger"
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                        }}
                                        onClick={handleClickRemoveAttachment(
                                            attachment,
                                        )}
                                    >
                                        <FaTrash />
                                        <span className="sr-only">Remove</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <button className="btn btn-primary btn-block" type="submit">
                Post
            </button>
        </form>
    );
};
