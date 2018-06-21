<template>
  <div class="tree-table">
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      border>
      <el-table-column label="名称" min-width="100">
        <template slot-scope="scope">
          <div :style="{paddingLeft: (scope.row.level-1)*25+'px'}">
            <div class="icon-box" :style="{opacity: scope.row.hasChild ? 1 : 0 }" @click="handleCurrentRow(scope.row, scope.$index)">
              <i class="el-icon-caret-bottom" v-if="scope.row.expanded"></i>
              <i class="el-icon-caret-right" v-else></i>
            </div>
            <!--如果为产品，则点击名字跳转到详情页面-->
            <span v-if="scope.row.level === 2">
              <el-checkbox v-model="scope.row.checked" @change="handleChecked(scope.row.checked, scope.row, scope.$index)">
              </el-checkbox>
              <i class="el-icon-loading" v-if="scope.row.loading"></i>
              <!--<router-link class='url' :to="{ path: '/booking/hotelBookings/listHotelProduct',
                   query: { productId: scope.row.id }}">
                <span>{{scope.row.name}}</span>
              </router-link>-->
              <span style="cursor:pointer;" @click="toHotelInfo(scope.row)">
                 <span>{{scope.row.name}}</span>
              </span>
            </span>
            <span v-else>
              <el-checkbox v-model="scope.row.checked" @change="handleChecked(scope.row.checked, scope.row, scope.$index)">
                <i class="el-icon-loading" v-if="scope.row.loading"></i>
                <span>{{scope.row.name}}</span>
              </el-checkbox>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="supplierMchName"
        label="供应商" width="160px">
      </el-table-column>
      <el-table-column
        align="center"
        label="飞猪房型">
        <template slot-scope="scope">
          <span>{{scope.row.channelRoomName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="飞猪政策名称" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.channelRpName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态" width="120px">
        <template slot-scope="scope">
          <slot name="state" :row="scope.row"></slot>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <slot name="operation" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/**
 * 供父组件监听的方法：expandRow
 * 1、请求的时候判断是否选中以此来处理所请求数据的checked值
 * 2、默认hasChild: 1 即有子集，若请求之后无子集则重新赋值
 * 3、前两级数据中添加loading，表示展开时的请求
 * 4、传入的数据需要添加相应的字段
 * {
 *  level, // number
 *  hasChild: 1, // 默认1， 没有就设为null
 *  expanded: false, // boolean
 *  checked: false, // boolean
 *  loading: false // boolean
 * }
 */
export default {
  name: 'TreeTable',
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      tableLoading: true
    }
  },
  methods: {
    // 点击产品名称跳转到产品基本信息界面
    toHotelInfo(product) {
      this.$router.push({ path: '/booking/hotelBookings/listHotelProduct', query: { productId: product.id }})
    },
    // 操作当前行
    handleCurrentRow(row, index) {
      if (row.level === 2) return
      if (!row.hasChild) return
      row.expanded ? this.foldCurrent(row, index) : this.expandCurrent(row, index)
    },
    // 显示loading
    loading() {
      this.tableLoading = true
    },
    // 取消loading
    unLoading() {
      this.tableLoading = false
    },
    // 展开当前行
    expandCurrent(row, index) {
      // 展开时触发请求给父组件监听
      this.$emit('expandRow', { row, index })
    },
    // 折叠当前行
    foldCurrent(row, index) {
      row.expanded = !row.expanded
      let delCount = 0
      for (let i = index + 1; i < this.tableData.length; i++) {
        if (this.tableData[i].level > row.level) {
          delCount++
        } else {
          break
        }
      }
      const beforeRow = this.tableData.slice(0, index + 1)
      const afterRow = this.tableData.slice(index + delCount + 1)
      const data = beforeRow.concat(afterRow)
      this.$emit('update:tableData', data)
    },
    // 操作选中
    handleChecked(val, row, index) {
      // 选中当前之后子集全部选中, 若val为true,则之前是未选中状态
      row.checked = val
      if (row.hasChild && row.expanded) { // 未展开操作自己，展开之后操作子集
        for (let i = index + 1; i < this.tableData.length; i++) {
          if (this.tableData[i].level > row.level) {
            this.tableData[i].checked = val
          } else {
            break
          }
        }
      }
      // 判断是否达到父级的全选标准
      this.checkedFn(row, index, this.tableData)
    },
    // 判断符合条件函数
    checkedFn(row, index, data) {
      if (row.level === 1) return
      let ancestorIndex = null
      let nextAncestorSibling = null
      for (let i = index; i >= 0; i--) { // 先向前遍历，找到父级
        if (data[i].level === row.level - 1) {
          ancestorIndex = i
          break
        }
      }
      for (let j = index; j < data.length; j++) { // 向后遍历，找到父级
        if (data[j].level === row.level - 1) {
          nextAncestorSibling = j
          break
        }
      }
      // 获取区间数据
      const intervalArr = data.slice(ancestorIndex + 1, nextAncestorSibling).filter(ele => ele.level === row.level)
      data[ancestorIndex].checked = intervalArr.every(ele => ele.checked === true) || false
      if (data[ancestorIndex].level !== 1) {
        this.checkedFn(data[ancestorIndex], ancestorIndex, data)
      }
    }
  }
}
</script>
<style>
  .pointer {
    cursor: pointer;
  }
  .icon-box {
    display: inline-block;
    vertical-align: middle;
  }
  .icon-box i{
    font-size: 20px;
  }
  .icon-box:hover i {
    cursor: pointer;
    color: #409EFF;
  }
</style>
