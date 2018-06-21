import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import { getToken } from '@/utils/auth'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/custom.css' // 将自定义样式作为全局样式
import i18n from './lang' // language switch
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import Load from '@/components/Load.vue'
import global_ from './utils/Global'
import NProgress from 'nprogress'
import { parseTime } from '@/utils/index'
import { currencyFormat } from '@/utils/currencyUtils'

Vue.config.productionTip = false
Vue.component('load', Load)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 全局时间过滤器
Vue.filter('formatTimeFilter', (val, format) => val ? parseTime(val, format) : '--')
Vue.filter('currencyFormat', (val, symbol, decimal, thousand) => !isNaN(val) ? currencyFormat(val, symbol, decimal, thousand) : '--')
Vue.filter('moneyFormat', (val, symbol, decimal, thousand) => !isNaN(val) ? currencyFormat(val / 100, symbol, decimal, thousand) : '--')

// 测试数据的接收
window.addEventListener('message', function(event) {
  if (window.top !== window.self) {
    // 通过origin属性判断消息来源地址
    const data = event.data || event.originalEvent.data
    if (typeof data !== 'string') return
    const tokenObj = JSON.parse(data)
    const isLogouting = !!tokenObj.isLogouting
    const isSetLang = !!tokenObj.isSetLang
    const isSetTheme = !!tokenObj.isSetTheme
    window.sessionStorage.setItem('isFromTop', tokenObj.isFromTop)
    window.sessionStorage.setItem('appId', tokenObj.appId)
    if (isSetTheme) {
      store.dispatch('setTheme', tokenObj.theme)
      return
    }
    if (isSetLang) {
      i18n.locale = tokenObj.language
      store.dispatch('setLanguage', tokenObj.language)
      return
    }
    if (isLogouting) {
      store.dispatch('LogOut').then(() => {
        location.reload()
      })
      return
    }
    if (!isSetLang && !isLogouting) {
      if (tokenObj.token && tokenObj.refreshToken) {
        window.sessionStorage.setItem('token', tokenObj.token)
        window.sessionStorage.setItem('refreshToken', tokenObj.refreshToken)
        router.push('/')
      }
    }
  }
}, false)

const whiteList = ['/login']
/**
 * 路由完成前
 */
let isFirst = true
const innerFn = function(to, from, next) {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!store.getters.isLoadPerms) {
        // 标记为已加载
        store.commit('SET_ISLOADPERMS', true)
        store.dispatch('GetInfo').then(res => {
          // TODO 获取用户有权限的菜单，动态生成路由集合
          store.dispatch('GenerateRoutes', res.data).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
}
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (window.top !== window.self && isFirst) {
    isFirst = false
    setTimeout(function() {
      innerFn(to, from, next)
    }, 50)
  } else {
    innerFn(to, from, next)
  }
})

/**
 * 路由完成后
 */
router.afterEach(() => {
  NProgress.done()
})

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})

Vue.prototype.GLOBAL = global_
