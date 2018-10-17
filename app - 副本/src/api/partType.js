import http from './index';
const domin  = '/partType';

export const getPartType = query => {
    return http.get(`${domin}`, {params: query})
}