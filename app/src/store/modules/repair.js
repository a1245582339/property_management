import {
    getRepair,
    createRepair
} from '@/api/repair';
const repair = {
    state: {
        
    },

    mutations: {
        SET_REPAIR_LIST: (state, list) => {
            Object.assign(state, list)
        }
    },

    actions: {
        async GET_REPAIR({
            commit
        }, query) {
            try {
                const res = await getRepair(query)
                if (res.data.code == '20000') {
                    commit('SET_REPAIR_LIST', res.data.data)
                } else {
                    throw res.data.msg
                }
            } catch (err) {
                throw err
            }
        }
    }
}

export default repair