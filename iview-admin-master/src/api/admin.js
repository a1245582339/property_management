import axios from '@/libs/api.request'
const domin  = '/admin';

export const login = user => {
    return http.post(`${domin}/login`, user)
}

export const getUserInfo = token => {
    return http.get(`${domin}/userInfo?token=${token}`)
}

export const createUser = data => {
    return http.post(`${domin}/userInfo`, data)
}

export const updateUserInfo = data => {
    return http.post(`${domin}/userInfo`, {id: data.id, nick_name: data.nick_name, tel: data.tel, password: data.password})
}


export const checkPassword = info => {
    return http.get(`${domin}/checkPassword`, {params: info})
}