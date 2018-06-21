<template>
  <!-- 此组件的唯一根节点 -->
  <div class="app-container">
    <el-form ref="orderInfoForm" :rules="rules" :model="orderInfoForm" label-width="120px">
      <div class="title" >订单信息</div>
      <el-row >
        <el-col :span="12">
          <el-form-item label="订单编号" label-suffix=":">
            {{orderInfoForm.id}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态" label-suffix=":">
            {{computeState(orderInfoForm.state)}}
          </el-form-item>
        </el-col>
      </el-row>

      <div class="title" >
        备注信息 <font color="red">（不要修改备注中的代码信息，否则导致其他地方无法识别）</font>
      </div>
      <el-row :gutter="0">
        <el-col :span="8">
          <el-form-item label="客户备注" label-suffix=":" prop="guestMemo" >
            {{orderInfoForm.guestMemo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公共备注" class="">
            <div v-for="(oc, index) in orderMemos" :key="index" class="text item">
              {{oc.date}} - <font style="font-size: 16px;color: red;">{{oc.content}}</font>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isSaas">
          <el-form-item label="内部备注" class="">
            <div v-for="(ic, index) in innerMemos" :key="index" class="text item">
              {{ic.date}} - <font style="font-size: 16px;color: red;">{{ic.content}}</font>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-form-item label="添加公共备注" class="">
            <el-input
              placeholder="请输入公共备注"
              v-model="orderMemo"
              clearable>
              <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo('PUBLIC')"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isSaas">
          <el-form-item label="添加内部备注" class="">
            <el-input
              placeholder="请输入内部备注"
              v-model="innerMemo"
              clearable>
              <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo('PRIVATE')"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="text-center">
        <router-link :to="{ path: '/order/hotelOrders/list'}" >
          <el-button size="small" type="primary" >关闭</el-button>
        </router-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/index'
  import hotelOrderApi from '@/api/order/hotelOrder'

  /**
   *  需要响应式的数据均需在data中提前写入
   */
  export default {
    name: 'updateOrderRemark',
    // 页面数据源
    data() {
      return {
        isSaas: false, // 是否运营商
        orderMemos: [], // 公共备注
        innerMemos: [], // 内部备注 -- 只有运营商能看到
        orderMemo: '',
        innerMemo: '',
        orderInfoForm: {},
        // 表单验证
        rules: {
          notNull: [
            { required: true, message: this.$t('common.isNull'), trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    // Vue生命周期函数
    created() {
      this.isSaas = this.$store.getters.userInfo.mchId === 0
      this.loadOrder(this.$route.query.orderId)
      // this.orderInfoForm.orderMemo = order.orderMemo
      // this.orderInfoForm.innerMemo = order.innerMemo
      // this.orderInfoForm.guestMemo = order.guestMemo
    },
    // Vue生命周期函数
    mounted() {
    },
    // 自定义方法
    methods: {
      computeState(value) {
        let label
        this.$t('hotelOrder.orderStates').forEach(row => {
          if (row.value === value) {
            label = row.label
          }
        })
        return label
      },

      // 格式化订单备注
      memoFormat(content) {
        if (content) {
          var obj = JSON.parse(content)
          const formatBeiZhu = []
          for (let i = 0; i < obj.length; i++) {
            const ele = {
              content: obj[i].content,
              date: obj[i].date
            }
            formatBeiZhu.push(ele)
          }
          return formatBeiZhu
        }
        return []
      },

      updateOrderMemo(contentType) {
        var contents = []
        var nowContent = {}
        const data = {
          id: this.orderInfoForm.id
        }
        if (contentType === 'PUBLIC') {
          if (!this.orderMemo) {
            this.$message({
              message: '请填写内容',
              type: 'info'
            })
            return false
          }
          nowContent.content = this.orderMemo
          contents = contents.concat(this.orderMemos)
        } else {
          if (!this.innerMemo) {
            this.$message({
              message: '请填写内容',
              type: 'info'
            })
            return false
          }
          nowContent.content = this.innerMemo
          contents = contents.concat(this.innerMemos)
        }
        nowContent.date = parseTime(new Date())
        contents.push(nowContent)
        const allContent = JSON.stringify(contents)
        if (contentType === 'PUBLIC') {
          data.orderMemo = allContent
        } else {
          data.innerMemo = allContent
        }
        hotelOrderApi.updateOrderRemark(data).then((res) => {
          if (res && res.state === 'success') {
            this.$message({
              message: '添加备注成功',
              type: 'success'
            })
            if (contentType === 'PUBLIC') {
              this.orderMemo = ''
              this.orderMemos.push(nowContent)
            } else {
              this.innerMemo = ''
              this.innerMemos.push(nowContent)
            }
          }
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '添加备注失败'
          })
        })
      },

      // 获取信息
      loadOrder(orderId) {
        hotelOrderApi.load('', orderId).then(res => {
          this.orderInfoForm = res || {}
          // 公共备注
          this.orderMemos = this.memoFormat(this.orderInfoForm.orderMemo)
          // 内部备注 -- 只有运营商能看到
          this.innerMemos = this.memoFormat(this.orderInfoForm.innerMemo)
        }).catch(e => {
          console.log('e : ', e)
          this.$message({
            type: 'error',
            message: '获取订单信息失败'
          })
        })
      }

      // 保存预订信息
      // save(formName) {
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       const params = {
      //         id: this.orderInfoForm.id,
      //         orderMemo: this.orderInfoForm.orderMemo,
      //         innerMemo: this.orderInfoForm.innerMemo,
      //         guestMemo: this.orderInfoForm.guestMemo
      //       }
      //       hotelOrderApi.updateOrderRemark(params).then(res => {
      //         if (res > 0) {
      //           this.$message({
      //             type: 'success',
      //             message: '修改成功'
      //           })
      //           this.$router.push({
      //             path: '/order/hotelOrders/list'
      //           })
      //         } else {
      //           this.$message({
      //             type: 'warning',
      //             message: res.msg
      //           })
      //           return false
      //         }
      //       }).catch(e => {
      //         console.log('e : ', e)
      //         this.$message({
      //           type: 'error',
      //           message: '保存失败'
      //         })
      //       })
      //     }
      //   })
      // }

    }
  }
</script>
