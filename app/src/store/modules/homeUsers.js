import {
    getHomeUsers,
    delUser,
    checkUser
} from '@/api/homeUsers';
const homeUsers = {
    state: {
        homeUsers:[]
    },

    mutations: {
        SET_HOME_USERS: (state, list) => {
            state.homeUsers = list
        }
    },

    actions: {
        async GET_HOME_USERS({
            commit
        }, query) {
            try {
                const res = await getHomeUsers(query)
                if (res.data.code == '20000') {
                    commit('SET_HOME_USERS', res.data.data)
                } else {
                    throw res.data.msg
                }
            } catch (err) {
                throw err
            }
        },
        async DEL_USER({}, id) {
            try {
                const res = await delUser(id)
                if (res.data.code == '20000') {
                    return res.data.msg
                } else {
                    throw res.data.msg
                }
            } catch (err) {
                throw err
            }
        },
        async CHECK_USER({}, id) {
            try {
                const res = await checkUser(id)
                if (res.data.code == '20000') {
                    return res.data.msg
                } else {
                    throw res.data.msg
                }
            } catch (err) {
                throw err
            }
        }
    }
}

export default homeUsers