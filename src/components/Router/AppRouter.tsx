import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { Auth, Home, Profile } from '@src/routes';
import { Navigation } from '@src/components/Navigation';

interface AppRouterProps {
    isLoggedIn: boolean;
    user?: firebase.User;
}

export const AppRouter = ({ isLoggedIn, user }: AppRouterProps) => {
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Switch>
                {isLoggedIn ? (
                    <React.Fragment>
                        <Route exact path="/">
                            <Home user={user} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                    </React.Fragment>
                ) : (
                    <Route exact path="/">
                        <Auth />
                    </Route>
                )}
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    );
};
