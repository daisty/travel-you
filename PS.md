# 项目额外说明


## 页面样式

* 如要全局定义公共样式需到styles/index.scss中
* 组件内样式可以定义在组件的style标签内，可以在文件中定义多个style标签
* 注意：<b>若要覆盖element-ui的默认样式，组件内style标签加上scoped，可能会达不到你要的效果，你需要定义新的class名字，并且使你添加的样式的优先级最高</b>

## 国际化

* 国际化引入vue-i18n插件，详细 [vue-i18n](http://kazupon.github.io/vue-i18n/en/)
* 组件的template中使用<b>$t()</b>,若在js中使用则通过this获得即<b>this.$t()</b>或<b>this.$i18n.t()</b>,如果要翻译的内容需要在刚开始定义在data数据源中，则需要把此内容定义在computed计算属性中而不是data中方能随意切换
* 页面侧边栏与顶部面包屑的国际化需要在配置路由的时候meta中添加相应的title,如：meta:{title:'example'},并在zh-CN.js,en.js的route中做相应的翻译
* 中英文翻译的内容在zh-CN.js与en.js中

## Http请求

* 采用Axios请求数据,封装了统一请求的拦截器在request.js
* 建议大家不要一个方法中放多个请求，可另外定义方法以使代码清晰，要在.catch方法中处理请求失败的情况如：无论成功或失败均要取消loading状态
* 请求的返回建议大家要统一有状态status，提示消息msg的返回，如：status: 1，msg: 操作成功

## Element-ui组件使用

* el-form中表单项过多的情况下，可以根据需填写内容的多少及页面空间等实际情况一行放置两个el-form-item，有些描述类的处理的时候可以单独一行处理
* el-select,el-input,el-date-picker等统一使用size="small"的尺寸，el-button按钮type不是text的样式size="mini"
* el-select中options中注意value的类型，这种采用的是严格相等的如：v-model="item",item赋值的类型必须跟options中value的类型一致才能显示相应的label
* el-dialog对话框关闭时注意根据实际情况使用@close或:befor-close清除一次嵌套表单的数据及验证的提示信息以免还会出现上次数据及相应的验证信息
* el-table中展示的数据字段过多而空间不足可采用展开行的表格，将一些不是太主要的信息先折叠起来，操纵的按钮过多可采用el-dropdown减少空间占用

## 侧边栏导航图标

* 只要在.js中定义好icon名字，从[阿里图库](http://www.iconfont.cn/)中下载白色64*64的svg格式相应图标，命名为你所定义好的名字，然后把图标放入src/icons/svg即可