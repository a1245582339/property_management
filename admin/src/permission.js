import router from './router'
import {
    getToken,   // 获取token的方法
    removeToken // 删除token的方法
} from './utils/auth'
import { Toast } from 'vant';
import store from './store' 
import Vue from 'vue'

Vue.use(Toast)

const whiteList = ['/login', '/register'] // 不重定向白名单

router.beforeEach((to, from, next) => {     // 在每次路由跳转的时候执行下面的东西
    if (getToken() && getToken() != 'undefined') {  // 如果有token并且不是undefined
        if (to.path === '/login') {     // 如果要去login页面
            next({      
                path: '/main'   // 那么直接进入首页
            })
        } else {    // 如果不是去login页面
            store.commit('SET_TOKEN', getToken())   // 那就把cookie中的token存到一个全局变量里
            store.dispatch('GET_INFO').then(() => { // 获取用户个人信息
                next()      // 获取成功后跳转，继续去想要去的路由
            }).catch(err => {   // 如果获取用户信息失败了，说明后台没有认出这个token
                Toast.fail('token失效');    //  弹出token的报错信息
                removeToken()   // 删除cookie中的token
                next({
                    path: '/login'  // 跳转到登录页
                });
            })
        }
    } else {    // 如果没token或者token是undefined
        if (whiteList.indexOf(to.path) !== -1) {    // 如果想去的路由在白名单内，也就是那个路由是登录页或注册页
            next();     // 那就不做任何拦截，继续
        } else {    // 如果想去的路由不在白名单内
            next({path: '/login'});     // 那就强制返回登录页
        }
    }
})