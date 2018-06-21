<template>
  <div class="app-container">
    <div class="title">
      飞猪酒店对接绑定(新增分销商绑定飞猪店铺需要联络运营部)
    </div>
    <el-table :data="tableData">
      <el-table-column prop="distributorMchId" label="分销商ID" width="100" align="center">
      </el-table-column>

      <el-table-column prop="channelName" label="分销渠道名称" width="260" align="center">
      </el-table-column>

      <el-table-column prop="taobaoNickName" label="飞猪店铺名称" align="center">
      </el-table-column>

      <el-table-column prop="authorizeDate" label="应用最近授权日期" align="center">
      </el-table-column>

      <el-table-column prop="expiresInDate" label="应用有效截止日期" align="center">
      </el-table-column>

      <el-table-column prop="alitripProductNum" label="已授权产品" width="200" align="center">
      </el-table-column>

      <el-table-column prop="alitripOrderNum" label="销售订单" width="200" align="center">
      </el-table-column>

      <el-table-column label="操作" width="360" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button  type="text" size="small">
              <router-link :to="{path:'/channel/alitrip/hotelList', query: {distributorMchId:scope.row.distributorMchId}}">产品同步管理</router-link>
            </el-button>
          </el-row>
          <el-row>
            <el-button type="text" size="small">接口监控日志</el-button>
          </el-row>
          <el-row>
            <el-button type="text" size="small" @click="openAuthLink(scope.row.authorizeUrl)">
              应用SessionKey授权
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-card class="box-card">
      <el-col :span="12">
        数据汇总：
      </el-col>
      <el-col :span="12">
        <el-row><span class="el-icon-question" style="color: #F56C6C"></span><span style="color: #F56C6C">运营商要开通飞猪酒店对接，必须经过以下步骤：</span></el-row>
        <el-row>绑定步骤：</el-row>
        <el-row>1、运营商在分销商管理给飞猪接口开一个分销商账号，跟飞猪的运营人员要秘钥和你登陆飞猪酒店后台的地址；</el-row>
        <el-row>2、将分销商编号（custId）和秘钥和酒店后台的地址发给自我游运营；</el-row>
        <el-row>3、对接成功后进去授权产品分销卖。</el-row>
      </el-col>
    </el-card>
  </div>
</template>
<script>
  import AlitripApi from '@/api/channel/alitrip'
  export default {
    name: 'ProductTable',
    components: {
    },
    data() {
      return {
        tableData: [],
        roomInfo: {
          roomTypeName: '',
          roomTypeNameEn: '',
          bedType: ''
        }
      }
    },
    mounted() {
      this.zwyHotelGet()
    },
    methods: {
      // 酒店列表
      zwyHotelGet() {
        AlitripApi.channelConfigs().then(res => {
          console.log(res)
          this.tableData = res
        })
      },
      openAuthLink(url) {
        window.open(url)
      }
    }
  }
</script>
