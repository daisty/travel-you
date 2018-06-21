import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    ignore: true                 true 不需要后台url对应，也存在路由,
    needSort: true               true 需要对子路由进行排序
    order: 1                      用来排序菜单
  }
 **/

/**
 * 公共路由 -- 不需要权限
 * @type {*[]}
 */
export const commonRouterMap = [
  // 前置路由
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Index',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'index', icon: 'example' }
    }]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  // 首页
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'Home',
    hidden: true,
    meta: { title: 'index', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'HomePage',
        component: () => import('@/views/home/Index'),
        meta: { title: 'index', icon: 'table' }
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
]
/**
 * 权限路由 -- 需要有权限，根据用户不同权限动态添加
 * @type {*[]}
 */
export const authRouterMap = [
  // 酒店管理
  // {
  //   path: '/hotel',
  //   component: Layout,
  //   redirect: '/hotel/hotelRoomInfos/list',
  //   name: 'hotelManage',
  //   meta: { title: 'hotelManage', icon: 'room' },
  //   children: [
  //     {
  //       path: 'hotelRoomInfos/list',
  //       name: 'RoomList',
  //       hidden: true,
  //       component: () => import('@/views/product/room/HotelRoomInfo'),
  //       meta: { title: 'roomList', icon: 'list' }
  //     }, {
  //       path: 'hotelRoomInfos/save',
  //       name: 'AddRoom',
  //       hidden: true,
  //       component: () => import('@/views/product/room/AddOrUpdateRoomInfo'),
  //       meta: { title: 'addRoom', icon: 'table' }
  //     }, {
  //       path: 'hotelRoomInfos/update',
  //       name: 'UpdateRoom',
  //       hidden: true,
  //       component: () => import('@/views/product/room/AddOrUpdateRoomInfo'),
  //       meta: { title: 'updateRoom', icon: 'table' }
  //     },
  //     {
  //       path: 'hotelInfos/list',
  //       name: 'ListHotel',
  //       component: () => import('@/views/product/hotel/ListHotel'),
  //       meta: { title: 'listHotel', icon: 'table' }
  //     },
  //     {
  //       path: 'hotelInfos/save',
  //       name: 'AddHotel',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/AddHotel'),
  //       meta: { title: 'addHotel', icon: 'form' }
  //     },
  //     {
  //       path: 'hotelInfos/update',
  //       name: 'UpdateHotel',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/UpdateHotel'),
  //       meta: { title: 'updateHotel', icon: 'form' }
  //     },
  //     {// TODO
  //       path: 'hotelInfos/mergeRoomInfo',
  //       name: 'MergeRoomInfo',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/MergeRoomInfo'),
  //       meta: { title: 'mergeRoomInfo', icon: 'form' }
  //     },
  //     {
  //       path: 'hotelInfos/syncHotel',
  //       name: 'SyncHotel',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/SyncHotel'),
  //       meta: { title: 'syncHotel', icon: 'table' }
  //     },
  //     {
  //       path: 'hotelInfos/syncRoom',
  //       name: 'SyncRoom',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/SyncRoom'),
  //       meta: { title: 'syncRoom', icon: 'table' }
  //     },
  //     {
  //       path: 'hotelInfos/bindHotel',
  //       name: 'BindHotel',
  //       hidden: true,
  //       component: () => import('@/views/product/hotel/BindHotel'),
  //       meta: { title: 'bindHotel', icon: 'table' }
  //     },
  //     {
  //       path: 'hotelInfos/syncHotelList',
  //       name: 'SyncHotelList',
  //       component: () => import('@/views/product/hotel/SyncHotelList'),
  //       meta: { title: 'syncHotelList', icon: 'table' }
  //     }
  //   ]
  // },

  // 产品管理
  {
    path: '/product',
    component: Layout,
    redirect: '/product/hotelProducts/list',
    name: 'ProductManage',
    meta: { title: 'productManage', icon: 'ProductManage' },
    children: [
      {
        path: 'hotelProducts/list',
        name: 'HotelProductList',
        component: () => import('@/views/product/HotelProductList'),
        meta: { title: 'productList', icon: 'HotelProductList' }
      },
      {
        path: 'hotelProducts/supplierHotelList',
        name: 'HotelProductList',
        hidden: true,
        component: () => import('@/views/product/SupplierHotelList'),
        meta: { title: '添加/导入产品', icon: 'table', ignore: true }
      },
      {
        path: 'hotelProducts/hotelInfoList',
        name: 'HotelInfoList',
        hidden: true,
        component: () => import('@/views/product/HotelInfoList'),
        meta: { title: '酒店列表', icon: 'table', ignore: true }
      },
      {
        path: 'hotelProducts/save',
        name: 'AddProduct',
        hidden: true,
        component: () => import('@/views/product/HotelProductAdd'),
        meta: { title: 'addProduct', icon: 'table' }
      },
      {
        path: 'hotelProducts/updateHotelProduct',
        name: 'UpdateHotelProduct',
        hidden: true,
        component: () => import('@/views/product/HotelProductUpdate'),
        meta: { title: 'updateHotelProduct', icon: 'table', ignore: true }
      },
      {
        path: 'hotelProducts/priceStore',
        name: 'PriceStore',
        hidden: true,
        component: () => import('@/views/product/price/PriceStore'),
        meta: { title: 'priceStore', icon: 'table', ignore: true }
      }
    ]
  },

  // // 产品预订
  {
    path: '/booking',
    component: Layout,
    redirect: '/booking/hotelBookings/list',
    name: 'Booking',
    meta: { title: 'booking', icon: 'HotelBooking' },
    children: [
      {
        path: 'hotelBookings/list',
        name: 'HotelBooking',
        component: () => import('@/views/booking/hotelBooking/HotelBookingList'),
        meta: { title: 'hotelBooking', icon: 'HotelBooking' }
      },
      {
        hidden: true,
        path: 'hotelBookings/hotelDetail',
        name: 'HotelDetail',
        component: () => import('@/views/booking/hotelBooking/HotelDetail'),
        meta: { title: 'hotelDetail', icon: 'table', ignore: true }
      },
      {
        hidden: true,
        path: 'hotelBookings/listHotelProduct',
        name: 'RoomDetail',
        component: () => import('@/views/booking/hotelBooking/RoomDetail'),
        meta: { title: 'roomDetail', icon: 'table', ignore: true }
      },
      {
        hidden: true,
        path: 'hotelBookings/orderBooking',
        name: 'OrderBooking',
        component: () => import('@/views//booking/hotelBooking/OrderBooking'),
        meta: { title: 'orderPrePay', icon: 'table', ignore: true }
      }
    ]
  },

  // 订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/order/hotelOrders/list',
    name: 'Order',
    meta: { title: 'orderManager', icon: 'Order', needSort: true },
    children: [
      {
        path: 'hotelOrders/list',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList'),
        meta: { title: 'orderList', icon: 'OrderList', order: 1 }
      },
      {
        path: 'hotelOrders/load',
        name: 'OrderDetail',
        hidden: true,
        component: () => import('@/views/order/DetailHotelOrder'),
        meta: { title: 'orderDetail', icon: 'form' }
      },
      {
        path: 'hotelOrders/loadNotification',
        name: 'createOrderNotification',
        hidden: true,
        component: () => import('@/views/order/OrderNotificationAdd'),
        meta: { title: 'createOrderNotification', icon: 'form' }
      },
      {
        path: 'hotelOrders/listOrderNotification',
        name: 'orderNotificationList',
        component: () => import('@/views/order/OrderNotificationList'),
        meta: { title: 'orderNotificationList', icon: 'orderNotificationList' }
      },
      {
        path: 'hotelOrders/addOrder',
        name: 'addOrder',
        hidden: true,
        component: () => import('@/views/order/OrderAdd'),
        meta: { title: 'addOrder', icon: 'table' }
      },
      // 历史订单补录
      // {
      //   path: 'hotelOrders/repairOrder',
      //   name: 'repairOrder',
      //   component: () => import('@/views/order/OrderRepair'),
      //   meta: { title: 'repairOrder', icon: 'repairOrder' }
      // },
      // 订单报表,
      {
        path: 'hotelOrderReport/listOrderSituation',
        name: 'HotelOrderReport',
        hidden: true,
        component: () => import('@/views/report/HotelOrderReport'),
        meta: { title: 'orderReport', icon: 'table' }
      },
      {
        path: 'hotelOrders/editOrder',
        name: 'editOrder',
        hidden: true,
        component: () => import('@/views/order/OrderEdit'),
        meta: { title: 'editOrder', icon: 'table' }
      },
      {
        path: 'hotelOrders/updateOrderRemark',
        name: 'updateOrderRemark',
        hidden: true,
        component: () => import('@/views/order/OrderRemarkUpdate'),
        meta: { title: 'updateOrderRemark', icon: 'table', ignore: true }
      }
    ]
  },
  // 我的信息
  {
    path: '/myInfo',
    component: Layout,
    redirect: '/myInfo/saasInfo/load',
    name: 'MyInfo',
    hidden: true,
    meta: { title: 'myInfo', icon: 'user-set' },
    children: [
      {
        path: 'saasInfo/load',
        name: 'SaasInfo',
        component: () => import('@/views/myInfo/SaasInfo'),
        meta: { title: 'saasInfo', icon: 'channel' }
      },
      {
        path: 'saasMchInfo/load',
        name: 'SaasMerchantInfo',
        component: () => import('@/views/myInfo/SaasMerchantInfo'),
        meta: { title: 'saasMerchantInfo', icon: 'channel' }
      }
    ]
  },
  // 飞猪酒店管理
  {
    path: '/channel',
    component: Layout,
    redirect: '/channel/alitrip/list',
    name: 'Channel',
    meta: { title: 'channelManage', icon: 'Channel' },
    children: [
      {
        path: 'alitrip/list',
        name: 'Alitrip',
        component: () => import('@/views/channel/alitrip/AlitripHome'),
        meta: { title: 'alitripHome', icon: 'Alitrip' }
      },
      {
        path: 'alitrip/hotelList',
        name: 'Alitrip',
        hidden: true,
        component: () => import('@/views/channel/alitrip/HotelProductTable'),
        meta: { title: 'alitripHotel', icon: 'list' }
      },
      // 发布产品到飞猪
      {
        path: 'alitrip/product',
        name: 'AddProduct',
        hidden: true,
        component: () => import('@/views/channel/alitrip/HotelProductPublish'),
        meta: { title: 'addProduct', icon: 'table', ignore: true }
      },
      // 发布酒店到飞猪
      {
        path: 'alitrip/hotel',
        name: 'AddHotel',
        hidden: true,
        component: () => import('@/views/channel/alitrip/HotelPublish'),
        meta: { title: 'addHotel', icon: 'table', ignore: true }
      },
      // 发布房型到飞猪
      {
        path: 'alitrip/room',
        name: 'AddRoom',
        hidden: true,
        component: () => import('@/views/channel/alitrip/RoomPublish'),
        meta: { title: 'addRoom', icon: 'table', ignore: true }
      }
    ]
  },
  // 404
  { path: '*', redirect: '/404', hidden: true }

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: commonRouterMap
})
