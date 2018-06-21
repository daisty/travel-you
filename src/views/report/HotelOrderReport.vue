<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="订单情况汇报" :name="orderSituation.name">
        <div class="tab-container">
          <div class="search-box">
            <div class="">
              <span>
                下单日期
                <el-date-picker
                  size="small"
                  :picker-options="common.pickerOptions"
                  v-model="orderSituation.searchDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </span>
              <span>
                <el-button type="primary" size="small" @click="orderSituation.methods.list()">{{$t('common.search')}}</el-button>
              </span>
            </div>
          </div>
          <!--分割线-->
          <div style="border-top: #00686b 1px dashed; overflow: hidden; height: 1px; margin-top: 5px"></div>
          <div class="tab-content">
            <div>
              <div class="tishi">
                1、打包产品母订单只有销售金额，不统计成本。子订单只有成本，不统计销售金额；<br>
                2、销售金额为针对分销商的金额，如果是直销请将对应的分销商设置为分销价=零售价；<br>
                3、统计的数据包括开始日期和结束日期对应的数据。
              </div>
              <el-table :data="orderSituation.prepayableData" style="width: 100%" highlight-current-row fit border >
                <el-table-column label="预付产品销售类别汇总" >
                  <el-table-column
                    header-align="center"
                    align="center"
                    label="序号"
                    type="index"
                    width="60">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="type"
                    label="类别"
                    width="380">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="orderNum"
                    label="销售订单"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="personNum"
                    label="订单人数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="payPrice"
                    label="销售金额"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="costing"
                    label="销售成本"
                    width="120">
                  </el-table-column>
                  <el-table-column prop="city" label="销售利润" width="120" header-align="center" align="center">
                    <template slot-scope="scope">
                      {{scope.row.payPrice - scope.row.costing}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="detail"
                    label="详细"
                    width="600">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <!--分割线-->
            <div style="border-top: #00686b 1px dashed; overflow: hidden; height: 1px; margin: 15px 0px"></div>
            <div style="margin-bottom: 40px">
              <div class="tishi">
                1、按照支付日期，出票日期无法统计现付产品数据；<br>
                2、应收返佣是指供应商的全部返佣；<br>
                3、应付返佣是指运营商给分销商支付的佣金。
              </div>
              <el-table :data="orderSituation.nowpayTableData" style="width: 100%" highlight-current-row fit border >
                <el-table-column label="现付产品销售类别汇总">
                  <el-table-column
                    header-align="center"
                    align="center"
                    label="序号"
                    type="index"
                    width="60">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="name"
                    label="类别"
                    width="260">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="province"
                    label="销售订单"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="city"
                    label="订单人数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="address"
                    label="订单金额"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="zip"
                    label="预计应收返佣"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="city"
                    label="预计应付返佣"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="city"
                    label="预计利润"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="address"
                    label="详细"
                    width="600">
                  </el-table-column>
                </el-table-column>
              </el-table>
              <!--分割线-->
              <div style="border-top: #00686b 1px dashed; overflow: hidden; height: 1px; margin: 15px 0px"></div>
              <el-table :data="orderSituation.hotProductTableData" style="width: 100%" highlight-current-row fit border>
                <el-table-column :label="orderSituation.hottestProductTitle">
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="zip"
                    label="产品名称"
                    width="910">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="name"
                    label="订单数"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="province"
                    label="销售数量(人/套)"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="city"
                    label="销售额"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="address"
                    label="估算利润"
                    width="310">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="利润明细表" :name="profitDetail.name">
        <div class="tab-container">
          <!--搜索框-->
          <div class="search-box">
            <div >
              <span >
                内部编码
                <el-select v-model="profitDetail.internalNoType" size="small" @change="profitDetail.methods.onNoTypeChange">
                  <el-option v-for="item in profitDetail.internalNoTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.internalNo" size="small" >
                  <el-option v-for="item in profitDetail.internalNos" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
              <span>
                产品类型
                <el-select v-model="profitDetail.productType" size="small">
                  <el-option v-for="item in profitDetail.productTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
              <span>
                <el-select v-model="profitDetail.dateType" size="small" >
                  <el-option v-for="item in profitDetail.dateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
              <span>
                <el-date-picker
                  size="small"
                  :picker-options="common.pickerOptions"
                  v-model="profitDetail.searchDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </span>
              <span>
                <el-button type="primary" size="small" @click="profitDetail.methods.list()">{{$t('common.search')}}</el-button>
              </span>
            </div>
            <div class="search-box-row">
              <span>
                分销商筛选
                <el-select v-model="profitDetail.isContainsChannel" size="small">
                  <el-option v-for="item in profitDetail.contains" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.province" size="small" @change="profitDetail.methods.onProvinceChange(0)">
                  <el-option v-for="item in profitDetail.provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.city" size="small" @change="profitDetail.methods.onCityChange(0)">
                  <el-option v-for="item in profitDetail.citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.channel" size="small" >
                  <el-option v-for="item in profitDetail.channels" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
            </div>
            <div class="search-box-row">
              <span>
                供应商筛选
                <el-select v-model="profitDetail.isContainsSupplier" size="small">
                  <el-option v-for="item in profitDetail.contains" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.province2" size="small" @change="profitDetail.methods.onProvinceChange(1)">
                  <el-option v-for="item in profitDetail.provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.city2" size="small" @change="profitDetail.methods.onCityChange(1)">
                  <el-option v-for="item in profitDetail.citys2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="profitDetail.supplier" size="small" >
                  <el-option v-for="item in profitDetail.suppliers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
            </div>
            <div class="search-box-row">
              <span>
                报表类型
                <el-select v-model="profitDetail.reportType" size="small">
                  <el-option v-for="item in profitDetail.reportTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
              <span>
                关键字(产品名称)<el-input size="small"
                                    placeholder="请输入内容"
                                    v-model="profitDetail.keyword" class="search-item"/>
              </span>
              <span>
                <el-button type="primary" size="small" @click="profitDetail.methods.exportData()">导出订单利润明细</el-button>
              </span>
          </div>
          </div>
          <div class="tab-content" style="margin-top: 10px">
            <el-table :data="profitDetail.tableData" style="width: 100%" highlight-current-row fit border>
              <el-table-column
                header-align="center"
                align="center"
                label="序号"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="订单号"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="预订时间"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="province"
                label="开始日期"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="结束日期"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="分销商"
                width="300">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="zip"
                label="数量"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="订单收入(元)"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="订单成本(元)"
                width="150">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="订单利润(元)"
                width="150">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="订单内容"
                width="300">
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <div class="pagination-box text-right" style="margin-top:10px; margin-right:20px;">
              <el-pagination
                background
                @size-change="profitDetail.methods.onSizeChange"
                @current-change="profitDetail.methods.onCurrentChange"
                :current-page="profitDetail.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="profitDetail.resultNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="profitDetail.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产品汇总表" :name="productSummary.name">
        <div class="tab-container">
          <!--搜索框-->
          <div class="search-box">
            <div class="">
              <div >
                <span>
                  <el-select v-model="productSummary.dateType" size="small" >
                    <el-option v-for="item in productSummary.dateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </span>
                <span>
                  <el-date-picker
                    size="small"
                    :picker-options="common.pickerOptions"
                    v-model="productSummary.searchDate"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="productSummary.methods.list()">{{$t('common.search')}}</el-button>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                  分销商筛选
                  <el-select v-model="productSummary.isContainsChannel" size="small">
                    <el-option v-for="item in productSummary.contains" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="productSummary.province" size="small" @change="productSummary.methods.onProvinceChange(0)">
                    <el-option v-for="item in productSummary.provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>`
                  </el-select>
                  <el-select v-model="productSummary.city" size="small" @change="productSummary.methods.onCityChange(0)">
                    <el-option v-for="item in productSummary.citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="productSummary.channel" size="small" >
                    <el-option v-for="item in productSummary.channels" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                  供应商筛选
                  <el-select v-model="productSummary.isContainsSupplier" size="small">
                    <el-option v-for="item in productSummary.contains" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="productSummary.province2" size="small" @change="productSummary.methods.onProvinceChange(1)">
                    <el-option v-for="item in productSummary.provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="productSummary.city2" size="small" @change="productSummary.methods.onCityChange(1)">
                    <el-option v-for="item in productSummary.citys2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="productSummary.supplier" size="small" >
                    <el-option v-for="item in productSummary.suppliers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                  关键字(产品名称)<el-input size="small"
                                      placeholder="请输入内容"
                                      v-model="productSummary.keyword" class="search-item"/>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="productSummary.methods.exportData()">导出订单利润明细</el-button>
                </span>
              </div>
            </div>
          </div>
          <div class="tab-content" style="margin-top: 10px">
            <el-table :data="productSummary.tableData" style="width: 100%" highlight-current-row fit border>
              <el-table-column
                header-align="center"
                align="center"
                label="序号"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="产品名称"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="province"
                label="订单数"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="销售数量"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="销售额"
                width="300">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="zip"
                label="估算利润"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="平均利润"
                width="120">
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <!--<div class="pagination-box text-right" style="margin-top:10px; margin-right:20px;">
              <el-pagination
                @size-change="productSummary.methods.onSizeChange"
                @current-change="productSummary.methods.onCurrentChange"
                :current-page="productSummary.currentPage"
                :page-sizes="[10, 20]"
                :page-size="productSummary.resultNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="productSummary.total">
              </el-pagination>
            </div>-->
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="订单日汇总" :name="orderDailySummary.name">
        <div class="tab-container">
          <!--搜索框-->
          <div class="search-box">
            <div class="">
              <div >
                <span>
                  关键字(产品名称)<el-input size="small"
                                      placeholder="请输入内容"
                                      v-model="orderDailySummary.keyword" class="search-item"/>
                </span>
                <span>
                  分销商筛选<el-input size="small"
                                  placeholder="请输入内容"
                                  v-model="orderDailySummary.channel" class="search-item"/>
                </span>
                <span>
                  供应商筛选<el-input size="small"
                                  placeholder="请输入内容"
                                  v-model="orderDailySummary.supplier" class="search-item"/>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="orderDailySummary.methods.list()">{{$t('common.search')}}</el-button>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="orderDailySummary.methods.exportData()">导出订单利润明细</el-button>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                下单日期
                <el-date-picker
                  size="small"
                  :picker-options="common.pickerOptions"
                  v-model="orderDailySummary.searchDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </span>
              </div>
            </div>
          </div>
          <div class="tab-content" style="margin-top: 10px">
            <el-table :data="orderDailySummary.tableData" style="width: 100%" highlight-current-row fit show-summary sum-text="合计" border>
              <el-table-column
                header-align="center"
                align="center"
                label="序号"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="日期"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="province"
                label="总订单情况"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="取消订单量"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="成功订单"
                width="300">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="zip"
                label="支付订单量"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="支付金额"
                width="120">
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <!--<div class="pagination-box text-right" style="margin-top:10px; margin-right:20px;">
              <el-pagination
                @size-change="orderDailySummary.methods.onSizeChange"
                @current-change="orderDailySummary.methods.onCurrentChange"
                :current-page="orderDailySummary.currentPage"
                :page-sizes="[10, 20]"
                :page-size="orderDailySummary.resultNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderDailySummary.total">
              </el-pagination>
            </div>-->
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="订单对账明细" :name="orderCheckingDetail.name">
        <div class="tab-container">
          <!--搜索框-->
          <div class="search-box">
            <div class="">
              <div >
                <span>
                  分销商筛选<el-input size="small"
                                  placeholder="请输入内容"
                                  v-model="orderCheckingDetail.channel" class="search-item"/>
                </span>
                <span>
                  供应商筛选
                  <el-select v-model="orderCheckingDetail.province2" size="small" @change="orderCheckingDetail.methods.onProvinceChange(1)">
                    <el-option v-for="item in orderCheckingDetail.provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="orderCheckingDetail.city2" size="small" @change="orderCheckingDetail.methods.onCityChange(1)">
                    <el-option v-for="item in orderCheckingDetail.citys2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="orderCheckingDetail.supplier" size="small" >
                    <el-option v-for="item in orderCheckingDetail.suppliers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="orderCheckingDetail.methods.list()">{{$t('common.search')}}</el-button>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="orderCheckingDetail.methods.exportData()">导出订单利润明细</el-button>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                验证日期
                <el-date-picker
                  size="small"
                  :picker-options="common.pickerOptions"
                  v-model="orderCheckingDetail.searchDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </span>
              </div>
            </div>
          </div>
          <div class="tab-content" style="margin-top: 10px">
            <el-table :data="orderCheckingDetail.tableData" style="width: 100%" highlight-current-row fit show-summary sum-text="合计" border>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="订单编号"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="province"
                label="下单时间"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="city"
                label="验证时间"
                width="120">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="产品内容"
                width="300">
              </el-table-column>
              <el-table-column label="收款信息" header-align="center" align="center">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="zip"
                  label="应收金额"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="city"
                  label="实收金额"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="address"
                  label="收款方式"
                  width="150">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="address"
                  label="收款时间"
                  width="150">
                </el-table-column>
              </el-table-column>
              <el-table-column label="付款信息" header-align="center" align="center">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="zip"
                  label="应付金额"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="city"
                  label="付款方式"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="address"
                  label="付款时间"
                  width="150">
                </el-table-column>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="address"
                label="利润"
                width="100">
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <!--<div class="pagination-box text-right" style="margin-top:10px; margin-right:20px;">
              <el-pagination
                @size-change="orderCheckingDetail.methods.onSizeChange"
                @current-change="orderCheckingDetail.methods.onCurrentChange"
                :current-page="orderCheckingDetail.currentPage"
                :page-sizes="[10, 20]"
                :page-size="orderCheckingDetail.resultNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderCheckingDetail.total">
              </el-pagination>
            </div>-->
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="景区汇总" :name="scenicAreaSummary.name">
        <div class="tab-container">
          <!--搜索框-->
          <div class="search-box">
            <div class="">
              <div >
                <span>
                  分销商筛选<el-input size="small"
                                  placeholder="请输入内容"
                                  v-model="scenicAreaSummary.channel" class="search-item"/>
                </span>
                <span>
                  供应商筛选<el-input size="small"
                                  placeholder="请输入内容"
                                  v-model="scenicAreaSummary.scenicArea" class="search-item"/>
                </span>
                <span>
                  代理筛选
                  <el-select v-model="scenicAreaSummary.agent" size="small">
                    <el-option v-for="item in scenicAreaSummary.agents" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="scenicAreaSummary.methods.list()">{{$t('common.search')}}</el-button>
                </span>
                <span>
                  <el-button type="primary" size="small" @click="scenicAreaSummary.methods.exportData()">导出报表明细</el-button>
                </span>
              </div>
              <div class="search-box-row">
                <span>
                游玩日期
                <el-date-picker
                  size="small"
                  :picker-options="common.pickerOptions"
                  v-model="scenicAreaSummary.searchDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </span>
              </div>
            </div>
          </div>
          <div class="tab-content" style="margin-top: 10px">
            <el-table :data="orderCheckingDetail.tableData" style="width: 100%" highlight-current-row fit show-summary sum-text="合计" border>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="景区"
                width="600">
              </el-table-column>
              <el-table-column label="在线支付" header-align="center" align="center">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="name"
                  label="游玩人数"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="province"
                  label="支付金额"
                  width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column label="窗口现付" header-align="center" align="center">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="name"
                  label="游玩人数"
                  width="120">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="province"
                  label="佣金金额"
                  width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="name"
                label="人数小计"
                width="120">
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <!--<div class="pagination-box text-right" style="margin-top:10px; margin-right:20px;">
              <el-pagination
                @size-change="orderCheckingDetail.methods.onSizeChange"
                @current-change="orderCheckingDetail.methods.onCurrentChange"
                :current-page="orderCheckingDetail.currentPage"
                :page-sizes="[10, 20]"
                :page-size="orderCheckingDetail.resultNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderCheckingDetail.total">
              </el-pagination>
            </div>-->
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { parseTime } from '@/utils/index'
  import HotelOrderReport from '@/api/report/hotelOrderReport'
  export default {
    data() {
      const that = this // 将this对象缓存起来，方便后面内部方法取用
      return {
        activeName: 'profitDetail', // this.profitDetail.name
        common: {
          pickerOptions: {
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                const end = new Date()
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 当天零点的时间
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const end = new Date(new Date().setHours(0, 0, 0, 0) - 1000) // 当天零点的时间 - 1s
                const start = new Date(end.getTime() - 3600 * 24 * 1000 + 1000) // 一天前零点的时间
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '本周',
              onClick(picker) {
                const end = new Date()
                const dayOfweek = end.getDay() // 本周第几天
                const temp = new Date(new Date().setHours(0, 0, 0, 0)) // 当天零点的时间
                const start = new Date(temp.getTime() - 3600 * 24 * 1000 * (dayOfweek - 1)) // dayOfweek天前零点的时间
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '本月',
              onClick(picker) {
                const end = new Date()
                const dayOfMonth = end.getDate() // 本月第几天
                const temp = new Date(new Date().setHours(0, 0, 0, 0)) // 当天零点的时间
                const start = new Date(temp.getTime() - 3600 * 24 * 1000 * (dayOfMonth - 1)) // dayOfMonth天前零点的时间
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }]
          }
        },
        orderSituation: {
          name: 'orderSituation',
          hottestProductTitle: '热销产品TOP10',
          prepayableData: [{
            type: '酒店',
            orderNum: '88',
            personNum: '90',
            costing: '34',
            profits: 61
          }],
          nowpayTableData: [{
            name: '酒店',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }],
          hotProductTableData: [{
            name: '33',
            province: '88',
            city: '90',
            address: '34',
            zip: '香港太平山摩天台门票(成人)'
          }],
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          methods: {
            list() {
              // 查询参数
              const params = {
                searchStartDate: '',
                searchEndDate: ''
              }
              if (that.orderSituation.searchDate) {
                const searchStartDate = that.orderSituation.searchDate[0]
                const searchEndDate = that.orderSituation.searchDate[1]

                // 有时候日期控件取到的不是Date对象，而是时间戳字符串
                const searchStartDateStr = typeof searchStartDate === 'object' ? searchStartDate.getTime() : searchStartDate
                const searchEndDateStr = typeof searchEndDate === 'object' ? searchEndDate.getTime() : searchEndDate

                that.orderSituation.hottestProductTitle = '热销产品TOP10 (' + parseTime(searchStartDate, '{y}-{m}-{d}') + '~' + parseTime(searchEndDate, '{y}-{m}-{d}') + ')'
                params.searchStartDate = searchStartDateStr
                params.searchEndDate = searchEndDateStr
              } else {
                that.orderSituation.hottestProductTitle = '热销产品TOP10 (全部)'
              }
              HotelOrderReport.listOrderSituation(params).then((res) => {
                that.orderSituation.prepayableData = res.prepayList.results
                that.orderSituation.nowpayTableData = null
                that.orderSituation.hotProductTableData = null
              }).catch((e) => {
              })
            }
          }
        },
        profitDetail: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 2, // 总条数
          name: 'profitDetail',
          tableData: [{
            name: '门票',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }, {
            name: '抢购',
            province: '53',
            city: '39',
            address: '30',
            zip: 29
          }],
          dateType: null, // 选中的日期类型
          dateTypes: [
            { label: '全部', value: null },
            { label: '下单日期', value: 0 },
            { label: '游玩开始日期(统计已支付和已验证订单)', value: 1 },
            { label: '游玩结束日期(统计已支付和已验证订单)', value: 2 },
            { label: '验证日期(统计已验证订单)', value: 3 },
            { label: '订单支付日期(统计在线支付订单)', value: 4 },
            { label: '出票日期(只统计需出票的订单)', value: 5 }
          ], // 日期类型选项
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          internalNoType: null, // 选中的内部编码类型
          internalNoTypes: [
            { label: '全部', value: null },
            { label: '自然风光', value: 0 },
            { label: '国内游', value: 1 }
          ], // 内部编码类型选项
          internalNo: null, // 选中的内部编码
          internalNos: [], // 内部类型选项
          productType: null, // 选中的产品类型
          productTypes: [
            { label: '全部', value: null },
            { label: '门票', value: 0 },
            { label: '住宿', value: 1 },
            { label: '套餐', value: 2 },
            { label: '线路', value: 3 }
          ], // 产品类型选项
          reportType: null, // 选中的报表类型
          reportTypes: [
            { label: '全部', value: null },
            { label: '分销商订单(含打包订单，不含分拆订单)', value: 0 },
            { label: '供应商订单(不含打包产品，含分拆订单)', value: 1 }
          ], // 报表类型选项
          keyword: '', // 产品名称关键字
          contains: [
            { label: '全部', value: null },
            { label: '包含', value: 0 },
            { label: '不包含', value: 1 }
          ], // 包含 || 不包含 -- 分销&&供应共用
          provinces: [
            { label: '全部', value: null },
            { label: '广东', value: 0 },
            { label: '广西', value: 1 }
          ], // 省选项 -- 分销&&供应共用
          isContainsChannel: null, // 是否包含分销商
          province: null, // 选中的省 -- 分销商所在
          city: null, // 选中的市 -- 分销商所在
          citys: [], // 省选项 -- 分销商所在
          channel: null, // 选中的分销商
          channels: [], // 分销商选项
          isContainsSupplier: null, // 是否包含供应商
          province2: null, // 选中的省 -- 供应商所在
          city2: null, // 选中的市 -- 供应商所在
          citys2: [], // 省选项 -- 供应商所在
          supplier: null, // 选中的供应商
          suppliers: [], // 供应商选项
          methods: {
            list() {
              // 查询参数
              const params = {
                searchStartDate: '',
                searchEndDate: ''
              }
              // 开始/结束时间 -- 只有日期类型不为空时日期才有效
              if (that.profitDetail.dateType !== null && that.profitDetail.searchDate) {
                const searchStartDate = that.profitDetail.searchDate[0]
                const searchEndDate = that.profitDetail.searchDate[1]

                // 有时候日期控件取到的不是Date对象，而是时间戳字符串
                const searchStartDateStr = typeof searchStartDate === 'object' ? searchStartDate.getTime() : searchStartDate
                const searchEndDateStr = typeof searchEndDate === 'object' ? searchEndDate.getTime() : searchEndDate
                params.searchStartDate = searchStartDateStr
                params.searchEndDate = searchEndDateStr
                params.dateType = that.profitDetail.dateType
              }
              // 内部编码
              if (that.profitDetail.internalNo) {
                params.internalNo = that.profitDetail.internalNo
              }
              // 报表类型
              if (that.profitDetail.reportType !== null) {
                params.reportType = that.profitDetail.reportType
              }
              // 产品名称关键字
              if (that.profitDetail.keyword) {
                params.keyword = that.profitDetail.keyword
              }
              HotelOrderReport.listProfitDetail(params).then((res) => {
                that.profitDetail.tableData = res.results
              }).catch((e) => {
              })
            },
            onNoTypeChange() {
              const value = that.profitDetail.internalNoType
              if (value === null) {
                // 清空级联选项
                that.profitDetail.internalNos = []
                that.profitDetail.internalNo = null
              } else if (value === 0) {
                that.profitDetail.internalNos = [
                  { label: '编码①', value: 0 },
                  { label: '编码②', value: 1 }
                ]
              } else {
                that.profitDetail.internalNos = [
                  { label: '编码③', value: 0 }
                ]
              }
              // 如果internalNos有值则选中第一个
              const internalNos = that.profitDetail.internalNos
              if (internalNos !== null && internalNos.length > 0) {
                that.profitDetail.internalNo = internalNos[0].value
              }
            },
            onProvinceChange(num) {
              // num == 0 ：分销商
              if (num === 0) {
                const province = that.profitDetail.province
                if (province === null) {
                  // 清空级联选项
                  that.profitDetail.citys = []
                  that.profitDetail.city = null
                  that.profitDetail.channels = []
                  that.profitDetail.channel = null
                } else if (province === 0) {
                  that.profitDetail.citys = [
                    { label: '广州', value: 0 },
                    { label: '河源', value: 1 }
                  ]
                } else {
                  that.profitDetail.citys = [
                    { label: '南宁', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const citys = that.profitDetail.citys
                if (citys !== null && citys.length > 0) {
                  that.profitDetail.city = citys[0].value
                }
                // num == 1 ：供应商
              } else {
                const province2 = that.profitDetail.province2
                if (province2 === null) {
                  // 清空级联选项
                  that.profitDetail.citys2 = []
                  that.profitDetail.city2 = null
                  that.profitDetail.suppliers = []
                  that.profitDetail.supplier = null
                } else if (province2 === 0) {
                  that.profitDetail.citys2 = [
                    { label: '广州', value: 0 },
                    { label: '河源', value: 1 }
                  ]
                } else {
                  that.profitDetail.citys2 = [
                    { label: '南宁', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const citys2 = that.profitDetail.citys2
                if (citys2 !== null && citys2.length > 0) {
                  that.profitDetail.city2 = citys2[0].value
                }
              }
            },
            onCityChange(num) {
              // num == 1 ：分销商
              if (num === 0) {
                const city = that.profitDetail.city
                if (city === null) {
                  // 清空级联选项
                  that.profitDetail.channels = []
                  that.profitDetail.channel = null
                } else if (city === 0) {
                  that.profitDetail.channels = [
                    { label: '分销商①', value: 0 },
                    { label: '分销商②', value: 1 }
                  ]
                } else {
                  that.profitDetail.channels = [
                    { label: '分销商③', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const channels = that.profitDetail.channels
                if (channels !== null && channels.length > 0) {
                  that.profitDetail.channel = channels[0].value
                }
                // num == 1 ：分销商
              } else {
                const city2 = that.profitDetail.city2
                if (city2 === null) {
                  // 清空级联选项
                  that.profitDetail.suppliers = []
                  that.profitDetail.supplier = null
                } else if (city2 === 0) {
                  that.profitDetail.suppliers = [
                    { label: '供应商①', value: 0 },
                    { label: '供应商②', value: 1 }
                  ]
                } else {
                  that.profitDetail.suppliers = [
                    { label: '供应商③', value: 0 }
                  ]
                }
                // 如果suppliers有值则选中第一个
                const suppliers = that.profitDetail.suppliers
                if (suppliers !== null && suppliers.length > 0) {
                  that.profitDetail.supplier = suppliers[0].value
                }
              }
            },
            exportData() {
              that.$message({
                message: '导出订单利润明细！',
                type: 'success',
                duration: 1000
              })
            },
            // 切换每页显示条数
            onSizeChange(val) {
              that.profitDetail.resultNum = val
              that.profitDetail.methods.list()
            },
            // 切换当前页
            onCurrentChange(val) {
              that.profitDetail.currentPage = val
              that.profitDetail.methods.list()
            }
          }
        },
        productSummary: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 2, // 总条数
          name: 'productSummary',
          tableData: [{
            name: '门票',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }, {
            name: '抢购',
            province: '53',
            city: '39',
            address: '30',
            zip: 29
          }],
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          keyword: '', // 产品名称关键字
          contains: [
            { label: '全部', value: null },
            { label: '包含', value: 0 },
            { label: '不包含', value: 1 }
          ], // 包含 || 不包含 -- 分销&&供应共用
          provinces: [
            { label: '全部', value: null },
            { label: '广东', value: 0 },
            { label: '广西', value: 1 }
          ], // 省选项 -- 分销&&供应共用
          isContainsChannel: null, // 是否包含分销商
          province: null, // 选中的省 -- 分销商所在
          city: null, // 选中的市 -- 分销商所在
          citys: [], // 省选项 -- 分销商所在
          channel: null, // 选中的分销商
          channels: [], // 分销商选项
          isContainsSupplier: null, // 是否包含供应商
          province2: null, // 选中的省 -- 供应商所在
          city2: null, // 选中的市 -- 供应商所在
          citys2: [], // 省选项 -- 供应商所在
          supplier: null, // 选中的供应商
          suppliers: [], // 供应商选项
          methods: {
            list() {
              console.log('profitDetail.list()')
            },
            onNoTypeChange() {
              const value = that.profitDetail.internalNoType
              if (value == null) {
                // 清空级联选项
                that.profitDetail.internalNos = []
                that.profitDetail.internalNo = null
              } else if (value === 0) {
                that.profitDetail.internalNos = [
                  { label: '编码①', value: 0 },
                  { label: '编码②', value: 1 }
                ]
              } else {
                that.profitDetail.internalNos = [
                  { label: '编码③', value: 0 }
                ]
              }
              // 如果internalNos有值则选中第一个
              const internalNos = that.profitDetail.internalNos
              if (internalNos != null && internalNos.length > 0) {
                that.profitDetail.internalNo = internalNos[0].value
              }
            },
            onProvinceChange(num) {
              // num == 0 ：分销商
              if (num === 0) {
                const province = that.productSummary.province
                if (province == null) {
                  // 清空级联选项
                  that.productSummary.citys = []
                  that.productSummary.city = null
                  that.productSummary.channels = []
                  that.productSummary.channel = null
                } else if (province === 0) {
                  that.productSummary.citys = [
                    { label: '广州', value: 0 },
                    { label: '河源', value: 1 }
                  ]
                } else {
                  that.productSummary.citys = [
                    { label: '南宁', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const citys = that.productSummary.citys
                if (citys != null && citys.length > 0) {
                  that.productSummary.city = citys[0].value
                }
                // num == 1 ：供应商
              } else {
                const province2 = that.productSummary.province2
                if (province2 == null) {
                  // 清空级联选项
                  that.productSummary.citys2 = []
                  that.productSummary.city2 = null
                  that.productSummary.suppliers = []
                  that.productSummary.supplier = null
                } else if (province2 === 0) {
                  that.productSummary.citys2 = [
                    { label: '广州', value: 0 },
                    { label: '河源', value: 1 }
                  ]
                } else {
                  that.productSummary.citys2 = [
                    { label: '南宁', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const citys2 = that.productSummary.citys2
                if (citys2 != null && citys2.length > 0) {
                  that.productSummary.city2 = citys2[0].value
                }
              }
            },
            onCityChange(num) {
              // num == 1 ：分销商
              if (num === 0) {
                const city = that.productSummary.city
                if (city == null) {
                  // 清空级联选项
                  that.productSummary.channels = []
                  that.productSummary.channel = null
                } else if (city === 0) {
                  that.productSummary.channels = [
                    { label: '分销商①', value: 0 },
                    { label: '分销商②', value: 1 }
                  ]
                } else {
                  that.productSummary.channels = [
                    { label: '分销商③', value: 0 }
                  ]
                }
                // 如果internalNos有值则选中第一个
                const channels = that.productSummary.channels
                if (channels != null && channels.length > 0) {
                  that.productSummary.channel = channels[0].value
                }
                // num == 1 ：分销商
              } else {
                const city2 = that.productSummary.city2
                if (city2 == null) {
                  // 清空级联选项
                  that.productSummary.suppliers = []
                  that.productSummary.supplier = null
                } else if (city2 === 0) {
                  that.productSummary.suppliers = [
                    { label: '供应商①', value: 0 },
                    { label: '供应商②', value: 1 }
                  ]
                } else {
                  that.productSummary.suppliers = [
                    { label: '供应商③', value: 0 }
                  ]
                }
                // 如果suppliers有值则选中第一个
                const suppliers = that.productSummary.suppliers
                if (suppliers != null && suppliers.length > 0) {
                  that.productSummary.supplier = suppliers[0].value
                }
              }
            },
            exportData() {
              that.$message({
                message: '导出订单利润明细！',
                type: 'success',
                duration: 1000
              })
            },
            // 切换每页显示条数
            onSizeChange(val) {
              that.productSummary.resultNum = val
              that.productSummary.methods.list()
            },
            // 切换当前页
            onCurrentChange(val) {
              that.productSummary.currentPage = val
              that.productSummary.methods.list()
            }
          }
        },
        orderDailySummary: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 2, // 总条数
          name: 'orderDailySummary',
          tableData: [{
            name: '门票',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }, {
            name: '抢购',
            province: '53',
            city: '39',
            address: '30',
            zip: 29
          }],
          dateType: null, // 选中的日期类型
          dateTypes: [
            { label: '全部', value: null },
            { label: '下单日期', value: 0 },
            { label: '游玩日期', value: 1 }
          ], // 日期类型选项
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          keyword: '', // 产品名称关键字
          channel: null, // 输入的分销商
          supplier: null, // 输入的供应商
          methods: {
            list() {
              console.log('profitDetail.list()')
            },
            exportData() {
              that.$message({
                message: '导出订单利润明细！',
                type: 'success',
                duration: 1000
              })
            },
            // 切换每页显示条数
            onSizeChange(val) {
              that.orderDailySummary.resultNum = val
              that.orderDailySummary.methods.list()
            },
            // 切换当前页
            onCurrentChange(val) {
              that.orderDailySummary.currentPage = val
              that.orderDailySummary.methods.list()
            }
          }
        },
        orderCheckingDetail: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 2, // 总条数
          name: 'orderCheckingDetail',
          tableData: [{
            name: '门票',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }, {
            name: '抢购',
            province: '53',
            city: '39',
            address: '30',
            zip: 29
          }],
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          provinces: [
            { label: '全部', value: null },
            { label: '广东', value: 0 },
            { label: '广西', value: 1 }
          ], // 省选项 -- 分销&&供应共用
          channel: null, // 输入的分销商
          isContainsSupplier: null, // 是否包含供应商
          province2: null, // 选中的省 -- 供应商所在
          city2: null, // 选中的市 -- 供应商所在
          citys2: [], // 省选项 -- 供应商所在
          supplier: null, // 选中的供应商
          suppliers: [], // 供应商选项
          methods: {
            list() {
              console.log('profitDetail.list()')
            },
            onProvinceChange(num) {
              // num == 1 ：供应商
              const province2 = that.orderCheckingDetail.province2
              if (province2 == null) {
                // 清空级联选项
                that.orderCheckingDetail.citys2 = []
                that.orderCheckingDetail.city2 = null
                that.orderCheckingDetail.suppliers = []
                that.orderCheckingDetail.supplier = null
              } else if (province2 === 0) {
                that.orderCheckingDetail.citys2 = [
                  { label: '广州', value: 0 },
                  { label: '河源', value: 1 }
                ]
              } else {
                that.orderCheckingDetail.citys2 = [
                  { label: '南宁', value: 0 }
                ]
              }
              // 如果internalNos有值则选中第一个
              const citys2 = that.orderCheckingDetail.citys2
              if (citys2 != null && citys2.length > 0) {
                that.orderCheckingDetail.city2 = citys2[0].value
              }
            },
            onCityChange(num) {
              // num == 1 ：供应商
              const city2 = that.orderCheckingDetail.city2
              if (city2 == null) {
                // 清空级联选项
                that.orderCheckingDetail.suppliers = []
                that.orderCheckingDetail.supplier = null
              } else if (city2 === 0) {
                that.orderCheckingDetail.suppliers = [
                  { label: '供应商①', value: 0 },
                  { label: '供应商②', value: 1 }
                ]
              } else {
                that.orderCheckingDetail.suppliers = [
                  { label: '供应商③', value: 0 }
                ]
              }
              // 如果suppliers有值则选中第一个
              const suppliers = that.orderCheckingDetail.suppliers
              if (suppliers != null && suppliers.length > 0) {
                that.orderCheckingDetail.supplier = suppliers[0].value
              }
            },
            exportData() {
              that.$message({
                message: '导出订单利润明细！',
                type: 'success',
                duration: 1000
              })
            },
            // 切换每页显示条数
            onSizeChange(val) {
              that.orderCheckingDetail.resultNum = val
              that.orderCheckingDetail.methods.list()
            },
            // 切换当前页
            onCurrentChange(val) {
              that.orderCheckingDetail.currentPage = val
              that.orderCheckingDetail.methods.list()
            }
          }
        },
        scenicAreaSummary: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 2, // 总条数
          name: 'scenicAreaSummary',
          tableData: [{
            name: '门票',
            province: '88',
            city: '90',
            address: '34',
            zip: 61
          }, {
            name: '抢购',
            province: '53',
            city: '39',
            address: '30',
            zip: 29
          }],
          // 默认最近一周
          searchDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
          channel: null, // 输入的分销商
          scenicArea: null, // 输入的景区
          agent: null,
          agents: [
            { label: '全部', value: null },
            { label: '广州华南植物园', value: 0 },
            { label: '广州旅行社', value: 1 },
            { label: '同程', value: 2 },
            { label: 'JTR测试供应商', value: 3 }
          ],
          methods: {
            list() {
              console.log('profitDetail.list()')
            },
            exportData() {
              that.$message({
                message: '导出报表明细！',
                type: 'success',
                duration: 1000
              })
            },
            // 切换每页显示条数
            onSizeChange(val) {
              that.scenicAreaSummary.resultNum = val
              that.scenicAreaSummary.methods.list()
            },
            // 切换当前页
            onCurrentChange(val) {
              that.scenicAreaSummary.currentPage = val
              that.scenicAreaSummary.methods.list()
            }
          }
        }
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
        switch (tab.name) {
          case this.orderSituation.name:
            console.log(this.orderSituation.name)
            this.orderSituation.methods.list()
            break
          case this.profitDetail.name:
            console.log(this.profitDetail.name)
            this.profitDetail.methods.list()
            break
          default :
            console.log('click other')
            break
        }
      }
    },
    // 计算属性
    computed: {
      // 最热排行产品
      computeHottestProductTitle: function() {
        if (this.orderSituation.searchDate) {
          const startDate = this.orderSituation.searchDate[0]
          const endDate = this.orderSituation.searchDate[1]
          return '热销产品TOP10 (' + parseTime(startDate, '{y}-{m}-{d}') + '~' + parseTime(endDate, '{y}-{m}-{d}') + ')'
        }
      }
    },
    // 组件生命周期函数
    created() {
      // this.orderSituation.methods.list()
    }
  }
</script>

<style scoped>
  .tab-container {
    margin-left: 20px;
  }
  .tishi {
    /*background: bisque;*/
    color: #915a15;
    font-weight: bold;
    font-size: small;
    background-color: #FFE9B2;
    padding: 10px;
    border: 1px solid #D9B04C;
    margin: 15px;
    margin-left: 0px;
    padding-left: 28px;
    background-position: 5px 5px;
  }
  .search-item {
    width: 200px;
    margin: 0 10px;
  }
  .search-box-row {
    margin-top: 5px;
  }

</style>
