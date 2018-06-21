import { authRouterMap, commonRouterMap } from '@/router/index'
import Login from '@/api/login'

/**
 * 遍历权限路由表，返回符合用户角色权限的路由表
 * @param authRouterMap 需要权限的路由集合
 * @param roles
 *
 * perms列表结构：
 * /saas/ticketOrder:GET -- 父菜单
 * /saas/ticketOrder/add:POST -- 子菜单或权限(按钮权限等)
 * /saas/ticketOrder/find:GET -- 子菜单或权限(按钮权限等)
 * /saas/ticketOrder/update:PUT -- 子菜单或权限(按钮权限等)
 * /saas/ticketOrder/updateStatus:PUT -- 子菜单或权限(按钮权限等)
 */
// eslint-disable-next-line
function filterAsyncRouter(authRouterMap, perms) {
  const accessedRouters = []
  let previous = ''
  let isMatche = false
  for (let i = 0; i < authRouterMap.length; i++) {
    const route = authRouterMap[i]

    /**
     * 添加404路由--由于404路由是匹配所有路径，所有必须添加在最后，
     * 因为404在静态路由集合authRouterMap中是排在最后，所以放在此处添加也无妨
     */
    if (route.path === '*') {
      accessedRouters.push(route)
      continue
    }

    let children = []
    for (let j = 0; j < perms.length; j++) {
      const perm = perms[j]
      // const tempStr = perm.replace('/saas/', '')
      const tempStr = perm.permCode.replace('/saas/', '').replace('/client/', '') // 由于有部分接口前缀还未改成saas 所以client、saas都要替换
      const arr = tempStr.substring(0, tempStr.indexOf(':')).split('/')
      arr.splice(0, 1) // 删除第一个[对应后端的包注解]
      // 如果上一个不为空且与下一个不相同，则说明当前路由已经校验完毕，跳出当前循环
      if (previous && arr[0] !== previous) {
        previous = '' // 置空标记
        break
      }
      const routePathWithoutPrefix = route.path.replace('/', '').split('/')[1]
      if (arr.indexOf(routePathWithoutPrefix) > -1) { // 匹配上
        if (!previous) { // 如果匹配上且previous为空，说明这是此路由的第一个匹配
          // 记录当前匹配上的父级菜单 -- 如果下一个跟这个不相同，则说明当前路由匹配完毕，直接匹配下一个，而不用遍历完整个perms列表
          previous = arr[0]
          isMatche = true
          children = route.children
          route.children = [] // 清空所有子菜单或权限，后续将拥有的权限设置到里面
          route.meta.perms = {} // 后续将当前路由的所有权限放到父菜单的元数据中
          // 先遍历子一遍路由，将能不标识为忽略检查的子路由添加到route.children中
          for (let k = 0; k < children.length; k++) {
            const childRoute = children[k]
            // 如果标识为忽略检查的，则不需要匹配，一定存在权限路由中
            if (childRoute.meta.ignore) {
              route.children.push(childRoute) // 将拥有的子菜单(或权限)添加到父菜单的children中
            }
          }
        }
        route.meta.perms[arr[1]] = arr[1] // 子菜单(权限)名称作为key，也作为value -- 不论是否匹配子路由，因为这个url可能只是对应某个按钮而不是页面(路由)

        // 遍历子路由
        for (let k = 0; k < children.length; k++) {
          const childRoute = children[k]
          // 如果数组长度等于1，则说明当前是二级菜单，即后端controller的mapping注解URL(规定为2级，包括client),那么默认匹配path=index的路由
          if (arr.length === 1 && childRoute.path.indexOf('index') > -1 ||
            arr.length === 2 && childRoute.path.replace('/', '') === arr[1]) {
            route.children.push(childRoute) // 将拥有的子菜单(或权限)添加到父菜单的children中
          }
        }

        // if (arr.length === 1) { // 如果数组长度等于1，则说明当前是二级菜单，即后端controller的mapping注解URL(规定为2级，包括client)
        //
        // } else if (arr.length === 2) { // 如果数组长度等于2，则说明当前是菜单权限，即后端controller中method的mapping注解URL
        //   route.meta.perms[arr[1]] = arr[1] // 子菜单(权限)名称作为key，也作为value -- 不论是否匹配子路由，因为这个url可能只是对应某个按钮而不是页面(路由)
        //   for (let k = 0; k < children.length; k++) {
        //     const childRoute = children[k]
        //     if (childRoute.path.replace('/', '') === arr[1]) {
        //       route.children.push(childRoute) // 将拥有的子菜单(或权限)添加到父菜单的children中
        //       break
        //     }
        //   }
        // }
      }
    }
    if (isMatche) {
      accessedRouters.push(route)
      // 清除标记
      isMatche = false
    }
  }
  return accessedRouters
}

function filterAsyncRouterV2(authRouterMap, perms) {
  const accessedRouters = []
  let isMatche = false
  for (let i = 0; i < authRouterMap.length; i++) {
    const route = authRouterMap[i]

    /**
     * 添加前置路由
     */
    if (route.path === '/') {
      accessedRouters.push(route)
      continue
    }

    // 添加404路由
    if (route.path === '*') {
      accessedRouters.push(route)
      continue
    }
    let children = []
    // eslint-disable-next-line
    outloop:
    for (let j = 0; j < perms.length; j++) {
      const perm = perms[j]
      const tempStr = perm.permCode.replace('/saas/', '') // 去掉默认的一级url
      const arr = tempStr.substring(0, tempStr.indexOf(':')).split('/')
      if (!arr || arr.length !== 3) continue // 如果菜单不为3级则此url为包注解或类注解（忽略）
      if (arr[0] === route.path.replace('/', '')) { // 匹配上
        if (!isMatche) { // 如果匹配上且previous为空，说明这是此路由的第一个匹配
          isMatche = true
          children = route.children
          route.children = [] // 清空所有子菜单或权限，后续将拥有的权限设置到里面
          route.meta.perms = {} // 后续将当前路由的所有权限放到父菜单的元数据中
        }
        route.meta.perms[arr[0] + arr[1] + arr[2]] = arr[0] + arr[1] + arr[2] // 子菜单(权限)名称作为key，也作为value -- 不论是否匹配子路由，因为这个url可能只是对应某个按钮而不是页面(路由)

        // 遍历子路由
        for (let k = 0; k < children.length; k++) {
          const childRoute = children[k]
          // 如果标识为忽略检查的，则不需要匹配，一定存在权限路由中
          if (childRoute.meta.ignore) {
            route.children.push(childRoute) // 将拥有的子菜单(或权限)添加到父菜单的children中
            children.splice(k, 1) // 将已经添加的路由从候选项处移除
            continue
          }
          if (childRoute.path === arr[1] + '/' + arr[2]) {
            route.children.push(childRoute) // 将拥有的子菜单(或权限)添加到父菜单的children中
            children.splice(k, 1) // 将已经添加的路由从候选项处移除
            // eslint-disable-next-line
            continue outloop
          }
        }
      }
    }
    if (isMatche) {
      accessedRouters.push(route)
      // 清空标记
      isMatche = false
    }
  }
  return sortMenu(accessedRouters)
}

/**
 * 对菜单按照router.meta.order属性进行排序
 * @param router
 * @returns {*}
 */
function sortMenu(router) {
  router.forEach(route => {
    if (route.meta && route.meta.needSort) {
      route.children.sort(compare)
    }
  })
  return router
}

/**
 * 数值比较器
 */
function compare(routeA, routeB) {
  const x = routeA.meta.order || 999 // 未指定，即不需要排序，放最后
  const y = routeB.meta.order || 999 // 未指定，即不需要排序，放最后
  if (x < y) {
    return -1
  } else if (x > y) {
    return 1
  } else {
    return 0
  }
}

const permission = {
  state: {
    isLoadPerms: false,
    routers: commonRouterMap,
    addRouters: [],
    userPerms: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = commonRouterMap.concat(routers)
    },
    SET_ISLOADPERMS: (state, isLoadPerms) => {
      state.isLoadPerms = isLoadPerms
    },
    SET_USERPERMS: (state, userPerms) => {
      state.userPerms = userPerms
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        // 获取用户应用菜单
        Login.getPermission().then(response => {
          const userPerms = response
          commit('SET_USERPERMS', userPerms)
          // const accessedRouters = filterAsyncRouter(authRouterMap, userPerms)
          const accessedRouters = filterAsyncRouterV2(authRouterMap, userPerms)
          // const accessedRouters = authRouterMap
          commit('SET_ROUTERS', accessedRouters)
          resolve(accessedRouters)
        })
      })
    }
    /*,
    markIsLoadPerms({ commit }, isLoadPerms) {
      commit('SET_ISLOADPERMS', isLoadPerms)
    }*/
  }
}

export default permission
