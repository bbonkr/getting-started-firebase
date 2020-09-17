import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { Auth, Home, Profile } from '@src/routes';
import { Navigation } from '@src/components/Navigation';
import { User } from '@src/interfaces';

interface AppRouterProps {
    isLoggedIn: boolean;
    user?: User;
    onUpdateProfile?: () => void;
}

export const AppRouter = ({
    isLoggedIn,
    user,
    onUpdateProfile,
}: AppRouterProps) => {
    return (
        <div className="content-wrapper">
            <Switch>
                {isLoggedIn ? (
                    <React.Fragment>
                        <Route exact path="/">
                            <Home user={user} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile
                                user={user}
                                onUpdateProfile={onUpdateProfile}
                            />
                        </Route>
                    </React.Fragment>
                ) : (
                    <Route exact path="/">
                        <Auth />
                    </Route>
                )}
                <Redirect from="*" to="/" />
            </Switch>
        </div>
    );
};
