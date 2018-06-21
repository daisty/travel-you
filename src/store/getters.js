const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  theme: state => state.app.theme,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userinfo,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  isLoadPerms: state => state.permission.isLoadPerms,
  enums: state => state.enums
}
export default getters
