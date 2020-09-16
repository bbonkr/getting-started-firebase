import { authService, firebaseInstance } from '@src/config';
import React, { useEffect, useState } from 'react';

interface LoginFormValue {
    email: string;
    password: string;
    persist: boolean;
}

type LoginFormValueKey = keyof LoginFormValue;

interface LoginFormState {
    value: LoginFormValue;
}

export const Login = () => {
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

    const handleClickSocialLogin = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        event.persist();

        const {
            currentTarget: { name },
        } = event;
        let provider: firebase.auth.AuthProvider | undefined = undefined;
        if (name === 'google') {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }

        if (name === 'github') {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        if (provider) {
            const credentail = authService.signInWithPopup(provider);
        }
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

    useEffect(() => {}, [loginFormState]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="email address"
                    required
                    value={loginFormState.value.email}
                    onChange={handleChangeInput}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    required
                    value={loginFormState.value.password}
                    onChange={handleChangeInput}
                />
                <input
                    type="checkbox"
                    name="persist"
                    id="persist"
                    checked={loginFormState.value.persist}
                    onChange={handleChangeInput}
                />
                <label htmlFor="persist">Remember me</label>
                <button type="submit">
                    {isNewAccount ? 'Create a account' : 'Sign In'}
                </button>
                {message}
            </form>
            <button onClick={handleClickChangeMode}>
                {isNewAccount ? 'Sign In' : 'Create a account'}
            </button>
            <div>
                <button onClick={handleClickSocialLogin} name="google">
                    Continue with Google Acount
                </button>
                <button onClick={handleClickSocialLogin} name="github">
                    Continue with GitHub Account
                </button>
            </div>
        </div>
    );
};
