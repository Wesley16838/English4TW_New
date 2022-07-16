import { all, call, fork, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import authSeviceStorage from "services/authDeviceStorage";
import { setUserLoginSuccess, setUserLoginFail, setFaceBookLoginSuccess, setFaceBookLoginFail } from "actions/user";
import {
  SET_FACEBOOK_LOGIN,
  SET_FACEBOOK_LOGOUT,
  SET_USER_LOGIN, SET_USER_LOGOUT, SET_USER_RELAUNCH
} from "actions/actionTypes"
import api from "services/api"

const loginAPI = async (email: string, password: string) => {
  const res = await api.post("api/auth",{ email, password })
  if (res.data.message === "Login Failed") {
    throw new Error("Login Failed");
  } else {
    const token = res.data.data.jwt
    const loginDate = Date.now()
    await authSeviceStorage.saveItem("JWT_TOKEN", JSON.stringify({token, date: loginDate}))
    return fetchUserData(token)
  }
};

const loginFacebookAPI = async (users: any) => {
  const res = await api.post("api/auth_social",{ provider: "facebook", credential: users.id })
  console.log('loginFacebookAPI,', res)
  if (res.data.message === "Login Failed") {
    throw new Error("Login Failed");
  } else {
    const token = res.data.data.jwt
    const loginDate = Date.now()
    await authSeviceStorage.saveItem("JWT_TOKEN", JSON.stringify({token, date: loginDate}))
  }
};

const fetchUserData = async(token: string) => {
  const userData = await api.get("api/loginFetch", { headers: {"Authorization" : `Bearer ${token}`} })
  return userData
}

const logoutAPI = async () => {
  await api.get(`logout`)
};

const clearJWT = async () => {
  await authSeviceStorage.deleteItem('JWT_TOKEN')
}

function* facebookLogin({payload: {user}}: any):any {
  try {
    console.log('facebookLogin,', user)
    yield call(loginFacebookAPI, user);
    yield put(setFaceBookLoginSuccess(user));
  } catch (err) {
    yield put(setFaceBookLoginFail(err));
  }
}

function* userLogin({ payload: { email, password } }: any): any{
  try {
    const users = yield call(loginAPI, email, password);
    yield put(setUserLoginSuccess());
  } catch (err) {
    yield put(setUserLoginFail(err));
  }
}

function* userRelanuch({payload: { token }}:any): any {
  const users = yield call(fetchUserData, token);
  yield put(setUserLoginSuccess());
  return fetchUserData(token)
}

function* userLogout(): any {
  try {
    yield call(logoutAPI);
    yield call(clearJWT);
  } catch (err) {
    yield put(setUserLoginFail(err));
  }
}

function* facebookLogout(): any {
  try {
    yield call(clearJWT);
  } catch (err) {
    yield put(setUserLoginFail(err));
  }
}

function* onFacebookLogin() {
  yield takeLatest(SET_FACEBOOK_LOGIN, facebookLogin)
}
function* onUserLogin(){
  yield takeLatest(SET_USER_LOGIN, userLogin);
}
function* onUserLogout(){
  yield takeLatest(SET_USER_LOGOUT, userLogout);
}
function* onFaceBookLogOut() {
  yield takeLatest(SET_FACEBOOK_LOGOUT,facebookLogout);
}
function* onUserReLaunch(){
  yield takeLatest(SET_USER_RELAUNCH, userRelanuch);
}
function* userSaga() {
  yield all([
    call(onUserLogin),
    call(onUserLogout),
    call(onFaceBookLogOut),
    call(onFacebookLogin),
    call(onUserReLaunch)
  ])
}

export default userSaga;
