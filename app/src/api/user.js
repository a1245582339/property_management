import http from './index';
const domin  = '/user';

export const login = user => {
    return http.post(`${domin}/login`, user)
}

export const getUserInfo = token => {
    return http.get(`${domin}/userInfo?token=${token}`)
}

export const checkPassword = info => {
    return http.get(`${domin}/checkPassword`, info)
}