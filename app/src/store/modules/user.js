import { setToken } from '@/utils/auth';
import { login, getUserInfo } from '@/api/user';
                            
const user = {
    state: {
        user: {}, 
        token: '',
    },

    mutations: {
        SET_USER: (state, user) => {
            Object.assign(state.user, user);
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        }
    },

    actions: {
        async LOGIN({ commit }, loginInfo) {
            try {
                const res = await login(loginInfo);
                if (res.data.code == '20000') {
                    commit('SET_TOKEN', res.data.data.token);
                    setToken(res.data.data.token);
                }
                return res
            } catch (err) {
                console.log(err);
            }
        },
        async GET_INFO({ commit, state }) {
            try {
                const res = await getUserInfo(state.token)
                if (res.data.code == '20000') {
                    commit('SET_USER', res.data.user)
                } else {
                    throw res.data.msg
                }
            } catch (err) {
                throw err
            }
        }
    }

}

export default user