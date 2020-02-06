import * as actionType from '../actions/actions_types'
import {
  updateObject
} from '../utility'

export const initialState: any = {
  token: null,
  error: null,
  username: null,
  loading: false,
}

const authStart = (state: any, action: any) => {
  return updateObject(state, {
    error: null,
    loading: true
  })
}

const authSuccess = (state: any, action: any) => {
  return updateObject(state, {
    token: action.user.token,
    id: action.user.id,
    error: null,
    loading: false
  })
}

const authFail = (state: any, action: any) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
}

const authLogout = (state: any, action: any) => {
  return updateObject(state, {
    token: null,
    username: null,
    status: null,
    loading: false
  })
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionType.AUTH_START:
      return authStart(state, action)

    case actionType.AUTH_SUCCESS:
      return authSuccess(state, action)

    case actionType.AUTH_FAIL:
      return authFail(state, action)

    case actionType.AUTH_LOGOUT:
      return authLogout(state, action)

    default:
      return state
  }
}

export default reducer