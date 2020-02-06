import React, { useReducer, createContext, useEffect } from 'react';

import './App.css';
import Login from './components/Authentication/Login';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import FormSuggestion from './components/Forms/Form';
import PrivateRoute from "./components/PrivateRoute";
import * as actions from './store/actions/actions';
import reducer, { initialState } from './store/reducers/auth';
import Dashboard from './components/Layout/Dashboard';

export const AppContext = createContext('');

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  useEffect(() => {
    authCheckState();
  }, []);

  const authCheckState = () => {
    const storage = localStorage.getItem("user");
    const user = JSON.parse(storage);
    if (user) {
      if (user.token === undefined) {
        dispatch(actions.authLogout());
      } else {
        const expirationDate = user.expirationDate;
        if (expirationDate <= new Date()) {
          dispatch(actions.authLogout());
        } else {
          dispatch(actions.authSuccess(user));
        }
      }
    }
  };



  return (
    <AppContext.Provider value={value}>
      <BrowserRouter>
        {
          state.token ?
            <Redirect to="/dashboard/suggestions" />
            : ''
        }
        <Switch>

          <Route path="/" exact={true} component={FormSuggestion} />
          <Route path="/admin-restau" exact={true} component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>

      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
