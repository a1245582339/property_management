import http from './index';
const domin  = '/repair';

export const getRepair = query => {
    return http.get(`${domin}`, {params: query})
}

export const createRepair = data => {
    return http.post(`${domin}`, data)
}

export const delRepair = id => {
    return http.put(`${domin}`, {id: id, status: 0})
}

export const payRepair = id => {
    return http.put(`${domin}`, {id: id, status: 5})
}

export const uploadImage = file => {
    return http.post('/repairPhoto', file)
}