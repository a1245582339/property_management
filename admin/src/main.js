import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import moment from 'moment'
import VideoPlayer from 'vue-video-player'


require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');

Vue.use(ElementUI, { locale })
Vue.use(VideoPlayer)

// 注册全局的过滤器显示时间
Vue.filter('date-string', function(value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
})
Vue.config.productionTip = false

import echarts from 'echarts'

Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
