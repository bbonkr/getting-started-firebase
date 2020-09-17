import { Post } from '@src/interfaces';
import React, { useState } from 'react';
interface PostPanelProps {
    record: Post;
    isOwner?: boolean;
    onDelete?: (record: Post) => void;
    onEdit?: (record: Post) => void;
}
interface EditFormValue {
    text: string;
}
interface EditFormState {
    value: EditFormValue;
}

export const PostPanel = ({
    record,

    isOwner,
    onDelete,
    onEdit,
}: PostPanelProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editFormState, setEditFormState] = useState<EditFormState>({
        value: {
            text: record.text,
        },
    });

    const handleClickDelete = () => {
        if (onDelete) {
            onDelete(record);
        }
    };

    const handleToggleEditing = () => setIsEditing((prevState) => !prevState);

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const {
            target: { name, value },
        } = event;

        setEditFormState((prevState) => ({
            ...prevState,
            value: {
                ...prevState.value,
                [name]: value,
            },
        }));
    };

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editFormState.value.text && onEdit) {
            onEdit({
                ...record,
                text: editFormState.value.text,
            });

            setIsEditing(false);
        }
    };

    return (
        <div>
            {isEditing && isOwner ? (
                <React.Fragment>
                    <form onSubmit={handleSubmitEdit}>
                        <input
                            type="text"
                            name="text"
                            required
                            value={editFormState.value.text}
                            onChange={handleChangeInput}
                        />
                        <button type="button" onClick={handleToggleEditing}>
                            Cancel
                        </button>
                        <button type="submit">Edit</button>
                    </form>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p>
                        <small>
                            {new Date(record.createdAt).toISOString()}
                        </small>
                    </p>
                    <p>{record.text}</p>
                    <div>
                        {record.attachments &&
                            record.attachments.length > 0 &&
                            record.attachments.map((attachment) => {
                                return (
                                    <div>
                                        <img src={attachment} width={50} />
                                    </div>
                                );
                            })}
                    </div>
                    {isOwner && (
                        <div>
                            <button onClick={handleClickDelete}>Delete</button>
                            <button onClick={handleToggleEditing}>Edit</button>
                        </div>
                    )}
                </React.Fragment>
            )}

            <hr />
        </div>
    );
};
