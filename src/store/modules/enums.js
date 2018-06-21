import enumApi from '@/api/openapi/enumApi'

const enums = {
  state: {
    enums: {}
  },

  mutations: {
    // 保存酒店星级
    SET_HOTELSTARS: (state, hotelStars) => {
      state.enums.hotelStars = hotelStars
    },
    // 保存取消类型
    SET_CANCELTYPES: (state, cancelTypes) => {
      state.enums.cancelTypes = cancelTypes
    }
  },

  actions: {
    // 获取酒店星级枚举（缓存在本地）
    getHotelStars({ commit, state }) {
      const hotelStars = state.enums.hotelStars
      return new Promise((resolve, reject) => {
        if (hotelStars) {
          resolve(hotelStars.slice(0)) // 返回副本，避免被修改
        } else {
          enumApi.getHotelStarList().then(res => {
            if (res) {
              // 将结果缓存在本地
              state.enums.hotelStars = res
              resolve(res.slice(0)) // 返回副本，避免被修改
            } else {
              resolve([])
            }
          }).catch(() => {
            resolve([])
          })
        }
      })
    },
    // 获取取消类型枚举（缓存在本地）
    getCancelTypeList({ commit, state }) {
      const cancelTypes = state.enums.cancelTypes
      return new Promise((resolve, reject) => {
        if (cancelTypes) {
          resolve(cancelTypes.slice(0)) // 返回副本，避免被修改
        } else {
          enumApi.getCancelTypeList().then(res => {
            if (res) {
              // 将结果缓存在本地
              state.enums.cancelTypes = res
              resolve(res.slice(0)) // 返回副本，避免被修改
            } else {
              resolve([])
            }
          }).catch(() => {
            resolve([])
          })
        }
      })
    },
    // 获取确认类型枚举（缓存在本地）
    getConfirmTypeList({ commit, state }) {
      const confirmTypes = state.enums.confirmTypes
      return new Promise((resolve, reject) => {
        if (confirmTypes) {
          resolve(confirmTypes.slice(0)) // 返回副本，避免被修改
        } else {
          enumApi.getConfirmTypeList().then(res => {
            if (res) {
              // 将结果缓存在本地
              state.enums.confirmTypes = res
              resolve(res.slice(0)) // 返回副本，避免被修改
            } else {
              resolve([])
            }
          }).catch(() => {
            resolve([])
          })
        }
      })
    },
    // 获取宾客类型枚举（缓存在本地）
    guestTypeList({ commit, state }) {
      const guestTypes = state.enums.guestTypes
      return new Promise((resolve, reject) => {
        if (guestTypes) {
          resolve(guestTypes.slice(0)) // 返回副本，避免被修改
        } else {
          enumApi.guestTypeList().then(res => {
            if (res) {
              // 将结果缓存在本地
              state.enums.guestTypes = res
              resolve(res.slice(0)) // 返回副本，避免被修改
            } else {
              resolve([])
            }
          }).catch(() => {
            resolve([])
          })
        }
      })
    },
    // 获取早餐枚举（缓存在本地）
    breakfastList({ commit, state }) {
      const breakfasts = state.enums.breakfasts
      return new Promise((resolve, reject) => {
        if (breakfasts) {
          resolve(breakfasts.slice(0)) // 返回副本，避免被修改
        } else {
          enumApi.breakfastList().then(res => {
            if (res) {
              // 将结果缓存在本地
              state.enums.breakfasts = res
              resolve(res.slice(0)) // 返回副本，避免被修改
            } else {
              resolve([])
            }
          }).catch(() => {
            resolve([])
          })
        }
      })
    }
  }
}

export default enums
