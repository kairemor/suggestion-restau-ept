import * as actionType from "./actions_types";


export const authStart = () => {
  return {
    type: actionType.AUTH_START
  };
};
export const authSuccess = (user) => {
  return {
    type: actionType.AUTH_SUCCESS,
    user
  };
};

export const authFail = (error) => {
  return {
    type: actionType.AUTH_FAIL,
    error: error
  };
};

export const authLogout = () => {
  localStorage.removeItem("user");
  return {
    type: actionType.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime * 1000);
  };
};



export const authCheckState = (dispatch) => {
  const storage = localStorage.getItem("user");
  const user = JSON.parse(storage);
  if (user) {
    if (user.token === undefined) {
      dispatch(authLogout());
    } else {
      const expirationDate = user.expirationDate;
      if (expirationDate <= new Date()) {
        dispatch(authLogout());
      } else {
        dispatch(authSuccess(user));
        // dispatch(
        //   checkAuthTimeout(
        //     (new Date(expirationDate).getTime() - new Date().getTime()) / 1000
        //   )
        // );
      }
    }
  }
};