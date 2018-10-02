import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user'
import repair from './modules/repair'
import getters from './getters'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        repair,
    },
    getters,
});

export default store