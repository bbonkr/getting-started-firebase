import { authService, firebaseInstance } from '@src/config';
import React, { useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export const Login = () => {
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

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <LoginForm />

            <div className="d-flex flex-row flex-row justify-content-center align-items-center">
                <button
                    onClick={handleClickSocialLogin}
                    name="google"
                    className="btn btn-default d-flex flex-row justify-content-center align-items-center"
                >
                    <FaGoogle />
                    <span className="ml-10">Continue with Google Acount</span>
                </button>
                <button
                    onClick={handleClickSocialLogin}
                    name="github"
                    className="btn btn-default d-flex flex-row justify-content-center align-items-center"
                >
                    <FaGithub />
                    <span className="ml-10">Continue with GitHub Account</span>
                </button>
            </div>
        </div>
    );
};
