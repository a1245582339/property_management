import http from './index';
const domin  = '/room';
export const getRoomInfo = roomId => {
    return http.get(`${domin}`, roomId)
}
