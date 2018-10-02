import http from './index';
const domin  = '/repair';

export const getRepair = query => {
    return http.get(`${domin}`, {...query})
}

export const createRepair = data => {
    return http.post(`${domin}`, {...data})
}