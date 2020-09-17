import { authService } from '@src/config';
import React, { useState } from 'react';

interface LoginFormValue {
    email: string;
    password: string;
    persist: boolean;
}

type LoginFormValueKey = keyof LoginFormValue;

interface LoginFormState {
    value: LoginFormValue;
}

export const LoginForm = () => {
    const [loginFormState, setLoginFormState] = useState<LoginFormState>(
        () => ({
            value: {
                email: '',
                password: '',
                persist: false,
            },
        }),
    );
    const [isNewAccount, setIsNewAccount] = useState(false);
    const [message, setMessage] = useState('');

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const {
            target: { name, value, checked, type },
        } = event;

        setLoginFormState((prevState) => ({
            ...prevState,
            value: {
                ...prevState.value,

                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    const handleClickChangeMode = () => {
        setIsNewAccount((prevState) => !prevState);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const {
            value: { email, password, persist },
        } = loginFormState;

        authService.setPersistence(persist ? 'local' : 'none');
        let userCredential: firebase.auth.UserCredential;
        try {
            if (isNewAccount) {
                userCredential = await authService.createUserWithEmailAndPassword(
                    email,
                    password,
                );
            } else {
                userCredential = await authService.signInWithEmailAndPassword(
                    email,
                    password,
                );
            }

            console.info('userCredential', userCredential);
        } catch (error) {
            console.info(error);
            if ('message' in error) {
                setMessage(error.message);
            }
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="d-flex flex-column justify-content-center w-400"
        >
            <div className="form-group mb-10">
                <input
                    type="email"
                    name="email"
                    placeholder="email address"
                    required
                    value={loginFormState.value.email}
                    onChange={handleChangeInput}
                    className="form-control"
                />
            </div>
            <div className="form-group mb-10">
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    required
                    value={loginFormState.value.password}
                    onChange={handleChangeInput}
                    className="form-control"
                />
            </div>
            <div className="custom-checkbox mb-10">
                <input
                    type="checkbox"
                    name="persist"
                    id="persist"
                    checked={loginFormState.value.persist}
                    onChange={handleChangeInput}
                />
                <label htmlFor="persist">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-10">
                {isNewAccount ? 'Create a account' : 'Sign In'}
            </button>
            <span className="text-danger mb-10">{message}</span>
            <button
                onClick={handleClickChangeMode}
                className="btn btn-link mb-10"
            >
                {isNewAccount ? 'Sign In' : 'Create a account'}
            </button>
        </form>
    );
};
