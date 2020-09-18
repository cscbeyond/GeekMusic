import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
const renderRoutes = (routes, authed, authPath, switchProps = {}) =>
  routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={'/player' + route.path}
          exact={route.exact}
          render={(props) => {
            if (!route.requiresAuth || authed || route.path === authPath) {
              return <route.component {...props} route={route} />;
            }
            return (
              <Redirect
                to={{ pathname: authPath, state: { from: props.location } }}
              />
            );
          }}
        />
      ))}
    </Switch>
  ) : null;

export default renderRoutes;
