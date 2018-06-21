<template>
  <div class="app-container">
    <el-form size="small" label-width="98px" label-position="left" :model="searchData" class="boldform">
      <div class="search-tag">
        <span>搜索条件：</span>
        <el-tag
          size="small" 
          :key="tag"
          ref="myTag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @change="handleInputConfirm(tag)"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="listProducts">搜索</el-button>
        <div class="btn-right" type="flex" justify="end">
          <!-- <el-form-item label-width="0"> -->
            <el-button size="mini" type="primary" icon="el-icon-sort" @click="importSupplierProduct">接口酒店产品导入</el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="add">新增产品</el-button>
          <!-- </el-form-item> -->
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商">
            <el-select
              size="small"
              v-model="searchData.supplierId"
              filterable
              placeholder="请输入关键词"
              :loading="loading"
              @keyup.enter.native="handleInputConfirm(0)"
                @blur="handleInputConfirm(0)">
              <el-option
                v-for="item in suppliers"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" >
          <el-form-item label="酒店地区">
            <select-area @getAreaId="getAreaId" @keyup.enter.native="handleInputConfirm(1)"
                @blur="handleInputConfirm(1)"></select-area>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8" class="text-right">
          <el-form-item label-width="0">
            <el-button size="small" type="primary" icon="el-icon-sort" @click="importSupplierProduct">接口酒店产品导入</el-button>
            <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="add">新增产品</el-button>
          </el-form-item>
        </el-col> -->
      </el-row>
      <div class="hidden-input" ref="inputRef" v-if="conditionExpand">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('hotelProductTable.hotelName')">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.hotelName"
                @keyup.enter.native="handleInputConfirm(2)"
                @blur="handleInputConfirm(2)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房型名称">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.roomName" 
              @keyup.enter.native="handleInputConfirm(3)"
              @blur="handleInputConfirm(3)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品标签">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.productTag" 
                @keyup.enter.native="handleInputConfirm(4)"
                @blur="handleInputConfirm(4)">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="酒店星级">
              <el-select  size="small" v-model="searchData.hotelStar" placeholder="请选择" @keyup.enter.native="handleInputConfirm(5)"
                @blur="handleInputConfirm(5)">
                <el-option
                  v-for="item in hotelStars"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商产品ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.supplierProductId"
                @keyup.enter.native="handleInputConfirm(6)"
                @blur="handleInputConfirm(6)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.productId"
                @keyup.enter.native="handleInputConfirm(7)"
                @blur="handleInputConfirm(7)">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="酒店ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.hotelId"
                @keyup.enter.native="handleInputConfirm(8)"
                @blur="handleInputConfirm(8)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商酒店ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierHotelId"
                @keyup.enter.native="handleInputConfirm(9)"
                @blur="handleInputConfirm(9)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房型ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.roomId"
                @keyup.enter.native="handleInputConfirm(10)"
                @blur="handleInputConfirm(10)">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商房型ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierRoomId"
                @keyup.enter.native="handleInputConfirm(11)"
                @blur="handleInputConfirm(11)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认类型" placeholder="请选择">
              <el-select v-model="searchData.confirmType" @keyup.enter.native="handleInputConfirm(12)"
                @blur="handleInputConfirm(12)">
                <el-option
                  v-for="item in confirmTypes"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商状态">
              <el-select v-model="searchData.supplierState" @keyup.enter.native="handleInputConfirm(13)"
                @blur="handleInputConfirm(13)">
                <el-option :value=-1 label="全部"></el-option>
                <el-option :value=0 label="下架"></el-option>
                <el-option :value=1 label="上架"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="宾客类型">
              <el-select v-model="searchData.guestType" @keyup.enter.native="handleInputConfirm(14)"
                @blur="handleInputConfirm(14)">
                <el-option
                  v-for="item in guestTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付类型">
              <el-select v-model="searchData.payType" @keyup.enter.native="handleInputConfirm(15)"
                @blur="handleInputConfirm(15)">
                <el-option :value=-1 label="全部"></el-option>
                <el-option :value=0 label="线上支付"></el-option>
                <el-option :value=1 label="线下支付"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品状态">
              <el-select v-model="searchData.state" @keyup.enter.native="handleInputConfirm(16)"
                @blur="handleInputConfirm(16)">
                <el-option :value=0 label="全部"></el-option>
                <el-option :value=1 label="在售"></el-option>
                <el-option :value=2 label="下架"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item :label="$t('hotelProductTable.hotelName')">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.hotelName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="房型名称">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.roomName" >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品标签">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.productTag" >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="酒店星级">
              <el-select  size="small" v-model="searchData.hotelStar" placeholder="请选择">
                <el-option
                  v-for="item in hotelStars"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" size="small" :icon="conditionExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="conditionExpand = !conditionExpand">更多>></el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row :gutter="20" v-if="conditionExpand">
          <el-col :span="4">
            <el-form-item label="供应商产品ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.supplierProductId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.productId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="酒店ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.hotelId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商酒店ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierHotelId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="房型ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.roomId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商房型ID">
              <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierRoomId">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="conditionExpand">
          <el-col :span="4">
            <el-form-item label="确认类型" placeholder="请选择">
              <el-select v-model="searchData.confirmType">
                <el-option
                  v-for="item in confirmTypes"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商状态">
              <el-select v-model="searchData.supplierState">
                <el-option :value=-1 label="全部"></el-option>
                <el-option :value=0 label="下架"></el-option>
                <el-option :value=1 label="上架"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="宾客类型">
            <el-select v-model="searchData.guestType">
              <el-option
                v-for="item in guestTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="支付类型">
              <el-select v-model="searchData.payType">
                <el-option :value=-1 label="全部"></el-option>
                <el-option :value=0 label="线上支付"></el-option>
                <el-option :value=1 label="线下支付"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品状态">
              <el-select v-model="searchData.state">
                <el-option :value=0 label="全部"></el-option>
                <el-option :value=1 label="在售"></el-option>
                <el-option :value=2 label="下架"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品价格" >
              <el-slider
                v-model="productPrice"
                range
                :step="50"
                show-stops
                :max="3000">
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销量">
              <el-slider
                v-model="saleNum"
                range
                :step="50"
                show-stops
                :max="3000">
              </el-slider>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label-width="0">
              <el-button type="primary" size="small" icon="el-icon-search" @click="listProducts">{{$t('common.search')}}</el-button>
              <el-button type="primary" size="small" icon="el-icon-download" :loading="exportLoading" @click="exportToExcel">{{$t('common.exportToExcel')}}</el-button>
            </el-form-item>
          </el-col> -->
        </el-row> 
      </div>
      <div class="show-line">
        <el-button type="text" size="small" class="term-text" @click="showSearch">{{termName}}<i class="el-icon-d-arrow-left down-up" ref="iconR"></i></el-button>
      </div>
      <!-- <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item :label="$t('hotelProductTable.hotelName')">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.hotelName">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="房型名称">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.roomName" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="产品标签">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.productTag" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="酒店星级">
            <el-select  size="small" v-model="searchData.hotelStar" placeholder="请选择">
              <el-option
                v-for="item in hotelStars"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-button type="primary" size="small" :icon="conditionExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="conditionExpand = !conditionExpand">更多>></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="conditionExpand">
        <el-col :span="4">
          <el-form-item label="供应商产品ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.supplierProductId">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="产品ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'产品ID'})" v-model="searchData.productId">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="酒店ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.hotelId">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="供应商酒店ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierHotelId">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="房型ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.roomId">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="供应商房型ID">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:'酒店ID'})" v-model="searchData.supplierRoomId">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="conditionExpand">
        <el-col :span="4">
          <el-form-item label="确认类型" placeholder="请选择">
            <el-select v-model="searchData.confirmType">
              <el-option
                v-for="item in confirmTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="供应商状态">
            <el-select v-model="searchData.supplierState">
              <el-option :value=-1 label="全部"></el-option>
              <el-option :value=0 label="下架"></el-option>
              <el-option :value=1 label="上架"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="宾客类型">
          <el-select v-model="searchData.guestType">
            <el-option
              v-for="item in guestTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="支付类型">
            <el-select v-model="searchData.payType">
              <el-option :value=-1 label="全部"></el-option>
              <el-option :value=0 label="线上支付"></el-option>
              <el-option :value=1 label="线下支付"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="产品状态">
            <el-select v-model="searchData.state">
              <el-option :value=0 label="全部"></el-option>
              <el-option :value=1 label="在售"></el-option>
              <el-option :value=2 label="下架"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品价格" >
            <el-slider
              v-model="productPrice"
              range
              :step="50"
              show-stops
              :max="3000">
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销量">
            <el-slider
              v-model="saleNum"
              range
              :step="50"
              show-stops
              :max="3000">
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0">
            <el-button type="primary" size="small" icon="el-icon-search" @click="listProducts">{{$t('common.search')}}</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" :loading="exportLoading" @click="exportToExcel">{{$t('common.exportToExcel')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <!-- 数据展示表格 -->
    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border
                highlight-current-row>
      <el-table-column :label="'ID'" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column :label="'所属酒店'" align="center" min-width="150">
        <template slot-scope="scope">
          {{scope.row.hotelName}}<br>
          {{computeHotelStar(scope.row.hotelStar)}}
        </template>
      </el-table-column>
      <el-table-column :label="'产品名称'" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.hotelName">{{scope.row.hotelName + ' '}}</span>
          <span v-if="scope.row.roomName">{{scope.row.roomName + ' '}}</span>
          <span v-if="scope.row.productTag">{{scope.row.productTag}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'供应商'" align="center" min-width="130">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column :label="'预订政策'" align="left" min-width="400">
        <template slot-scope="scope">
          <reserve-strategy :hotelProduct="scope.row"></reserve-strategy>
        </template>

      </el-table-column>
      <el-table-column :label="'销售'" align="center" min-width="160">
        <template slot-scope="scope">
          销量 {{scope.row.saleNum}}<br>
          {{scope.row.productPrice | moneyFormat('￥', scope.row.currencySymbol)}} /间夜<br>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.state === 1 ? '在售' : $t('hotelProductTable.soldOut')}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" width="250">
        <template slot-scope="scope">
          <el-button-group>
            <!--修改产品-->
            <el-tooltip  effect="dark" :content="$t('hotelProductTable.updateProduct')" placement="top-start">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdateView(scope.row)"></el-button>
            </el-tooltip>
            <!--产品上下架-->
            <span v-if="scope.row.state === 2">
              <el-tooltip  effect="dark" :content="$t('hotelProductTable.putAway')" placement="top-start">
                <el-button size="mini" type="primary" icon="el-icon-sort" @click="productShelveChoice(scope.row)"></el-button>
              </el-tooltip>
            </span>
            <span v-else>
              <el-tooltip  effect="dark" :content="$t('hotelProductTable.soldOut')" placement="top-start">
                <el-button size="mini" type="primary" icon="el-icon-sort" @click="productShelveChoice(scope.row)"></el-button>
              </el-tooltip>
            </span>
            <!--价格及其库存-->
            <router-link :to="{path:'/product/hotelProducts/priceStore', query: {productId:scope.row.id}}">
              <el-tooltip  effect="dark" :content="$t('hotelProductTable.priceAndStore')" placement="top-start">
                <el-button size="mini" type="primary" icon="el-icon-goods">
                </el-button>
              </el-tooltip>
            </router-link>
            <!--删除-->
            <el-tooltip  effect="dark" :content="$t('common.delete')" placement="top-start">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="productDelete(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import SelectArea from "@/views/product/common/SelectArea"
import hotelProduct from "@/api/product/hotelProduct"
import merchantInfo from "@/api/merchant/merchantInfo"
import ReserveStrategy from "../../components/ReservedStrategy/ReservedStrategy"
export default {
  name: "HotelProductList",
  components: {
    ReserveStrategy,
    SelectArea
  },
  data() {
    return {
      termName: "展示所有条件",
      exportLoading: false,
      tableData: [],
      tableLoading: false,
      loading: false,
      hotelId: "0",
      conditionExpand: false,
      searchData: {
        areaId: "0",
        hotelName: "", // 酒店名称
        hotelId: "", // 酒店ID
        supplierHotelId: "", // 供应商酒店ID
        productId: "", // 产品ID
        supplierProductId: "", // 供应商产品ID
        roomId: "", // 房型ID
        supplierRoomId: "", // 供应商房型ID
        roomName: "", // 房型名称
        productTag: "", // 产品标签
        hotelStar: 0, // 酒店星级
        payType: -1, // 支付类型：线上/线下
        supplierId: "", // 供应商id
        supplierState: -1, // 供应商状态
        confirmType: -1, // 确认类型
        paymentType: -1, // 支付类型
        guestType: 0, // 宾客类型
        state: 0 // 产品状态：全部/在售/下架
      },
      productPrice: [0, 3000], // 产品价[范围]
      saleNum: [0, 3000], // 销售量[范围]
      hotelStars: [], // 酒店星级
      confirmTypes: [], // 确认类型
      guestTypes: [], // 宾客类型
      suppliers: [], // 供应商接口列表
      currentPage: 1, // 当前页
      resultNum: 10, // 每页条数
      total: 0, // 总条数
      dynamicTags: [],  //搜索条件标签
    };
  },
  mounted() {
    this.initData()
  },
  methods: {
    handleClose(tag) {
      // this.searchData.hotelName = ""

      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    handleInputConfirm(tag ,index) {
      let inputValue = []
     let inputValue1 = this.searchData.areaId,
        inputValue2 = this.searchData.hotelName, // 酒店名称
        inputValue3 = this.searchData.hotelId, // 酒店ID
        inputValue4 = this.searchData.supplierHotelId, // 供应商酒店ID
        inputValue5 = this.searchData.productId, // 产品ID
        inputValue6 = this.searchData.supplierProductId, // 供应商产品ID
        inputValue7 = this.searchData.roomId, // 房型ID
        inputValue8 = this.searchData.supplierRoomId, // 供应商房型ID
        inputValue9 = this.searchData.roomName, // 房型名称
        inputValue10 = this.searchData.productTag, // 产品标签
        inputValue11 = this.searchData.hotelStar, // 酒店星级
        inputValue12 = this.searchData.payType, // 支付类型：线上/线下
        inputValue13 = this.searchData.supplierId, // 供应商id
        inputValue14 = this.searchData.supplierState, // 供应商状态
        inputValue15 = this.searchData.confirmType, // 确认类型
        inputValue16 = this.searchData.paymentType, // 支付类型
        inputValue17 = this.searchData.guestType, // 宾客类型
        inputValue18 = this.searchData.state // 产品状态：全部/在售/下架
        inputValue18 = ['全部','在售', '下架']
        // inputValue18 = [{value:0,label:'全部'},{value:1, label:'在售'}, {value: 2, label:'下架'}]
        //   {
        //     value: 1, label: '在售'
        //   }
        // ] // 产品状态：全部/在售/下架
      // let value2 = this.searchData.roomName
      // let labelName = ['供应商：', '酒店地区：', '酒店名称：', '房型名称：', '产品标签：', '酒店星级：', '供应商产品ID：', '产品ID：', '酒店ID：',
      //                   '供应商酒店ID：', '房型ID：', '供应商房型ID：', '确认类型：', '供应商状态：', '宾客类型：', '支付类型：', '产品状态：']
    let labelName = [{name:'供应商：', nameKey: 0}, {name:'酒店地区：', nameKey: 1},  {name:'酒店名称：', nameKey: 2}, {name:'房型名称：', nameKey: 3}, {name:'产品标签：', nameKey: 4},
                      {name:'酒店星级：', nameKey: 5}, {name:'供应商产品ID：', nameKey: 6}, {name:'产品ID：', nameKey: 7}, {name:'酒店ID：', nameKey: 8}, {name:'供应商酒店ID：', nameKey: 9},
                      {name:'房型ID：', nameKey: 10}, {name:'供应商房型ID：', nameKey: 11}, {name:'确认类型：', nameKey: 12}, {name:'供应商状态：', nameKey: 13}, {name:'宾客类型：', nameKey: 14},
                      {name:'支付类型：', nameKey: 15}, {name:'产品状态：', nameKey: 16}]
    
      let item = this.dynamicTags.findIndex(item => item.nameKey == tag)  //判断是否存在
      // let itemIndex = inputValue18.findIndex(index => index.value == index)

      // console.log("state",itemIndex)
      // console.log(this.dynamicTags)
      // for (let i = 0; i < inputValue.length; i++) {
        
      // }
      if(item + 1) {
        this.dynamicTags[item].name = labelName[tag - 1]
       
      }else {
        if(tag === 0) {
          if(inputValue13 !== ''){
            this.dynamicTags.push(labelName[tag].name + inputValue13)
          }else {

          }
          
        }else if (tag === 1) {
          if(inputValue1 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue1)
          }
          
        }
        else if(tag === 2){
          console.log("uh",inputValue2);
          // for(let i = 0)
          let index1 = labelName.indexOf(name)
          console.log(this.dynamicTags)
          if(inputValue2 !== ''){
            // console.log(this.$refs.myTag)
            // if(this.dynamicTags.length === 0){
              this.dynamicTags.push(labelName[tag].name + inputValue2)
            // }
            // this.dynamicTags.push(labelName[tag].name + inputValue2)
            // this.dynamicTags.push(labelName[tag - 1].name + inputValue2)
            // if(labelName[tag].name) {
            //   console.log(this.dynamicTags[item].tag);
              
            //   this.dynamicTags.push(labelName[tag].name + inputValue2)
            // }else{
            //   // this.dynamicTags[item].name = labelName[tag - 1]
            //   this.dynamicTags.splice(index1, 1)
            //   this.dynamicTags.substr(index1)
            // }
          }else{
            // if(index1 < 1) {
            //   this.dynamicTags.splice(index1, 2)
            // }
            // this.dynamicTags.substr(this.dynamicTags(tag));
            // this.dynamicTags.splice(index1, 1)
            // console.log(this.dynamicTags);
          }
          // this.dynamicTags[tag].tag = inputValue2
          // console.log(this.dynamicTags)
          
        }
        else if(tag === 3) {
          if(inputValue9 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue9)
          }else {

          }
          
        }
        else if (tag === 4) {
          if(inputValue10 !== ''){
            this.dynamicTags.push(labelName[tag].name + inputValue10)
          }
          
        }
        else if(tag === 5) {
          if(inputValue11 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue11)
          }
          
        }
        else if (tag === 6) {
          if(inputValue6 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue6)
          }
          
        } 
        else if (tag === 7) {
          if(inputValue5 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue5)
          }
          
        }
        else if (tag === 8) {
          if(inputValue3 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue3)
          }
          
        }
        else if(tag === 9) {
          if(inputValue4 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue4)
          }
          
        }
        else if (tag === 10) {
          if(inputValue7 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue7)
          }
          
        }
        else if(tag === 11) {
          if(inputValue8 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue8)
          }
          
        }
        else if (tag === 12) {
          if(inputValue15 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue15)
          }
          
        } 
        else if (tag === 13) {
          if(inputValue14 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue14)
          }
          
        }
        else if (tag === 14) {
          if(inputValue17 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue17)
          }
          
        }
        else if (tag === 15) {
          if(inputValue16 !== '') {
            this.dynamicTags.push(labelName[tag].name + inputValue16)
          }
          
        }
        else if (tag === 16) {
          
          // inputValue18.find((value,index) => {
          //   // console.log(index);
          //   // if(index === 0) {
          //   //   console.log(1232)
          //   //   this.dynamicTags.push(labelName[tag].name + '全部')
          //   // }else if(index === 1) {
          //   //   console.log(456)
          //   //   this.dynamicTags.push(labelName[tag].name + '在售')
          //   // }else if (index === 2) {
          //   //   console.log(88909)
          //   //   this.dynamicTags.push(labelName[tag].name + '下架')
          //   // }
   
          // })
          console.log(this.searchData.state)

          // console.log(label, '343')
          if(inputValue18[0] === '全部') {
            console.log("quanbu")
          }else if(inputValue18[1] === '在售'){
            console.log("zaishou")
          }
          // console.log()
          // if(inputValue18[0]){
            
          //   this.dynamicTags.push(labelName[tag].name + inputValue18[0])
          // }else if(inputValue18[1]){
          //   // this.dynamicTags.push(labelName)
          //   this.dynamicTags.push(labelName[tag].name + inputValue18[1])
          // }
          // if(inputValue18 !== '') {
          //   if(inputValue18 === '在售'){
          //     console.log(inputValue18[2]);
          //     this.dynamicTags.push(labelName[tag].name + inputValue18[1])
          //   }
          // }
          // if(itemIndex + 1) {
          //   console.log(itemIndex, "memememe")
          // }else {
          //   // if(inputValue18 !== '') {
          //   //   this.dynamicTags.push(labelName[tag].name + inputValue18.index)
          //   // }
            
          // }
          // if(inputValue18 !== '') {
          //     this.dynamicTags.push(labelName[tag].name + inputValue18)
          // }
          
        }
      }
      // if (tag) {
      //   console.log(tag);
      //   if(tag === 0) {

      //   }
        // if(tag === 2) {
        //   this.dynamicTags.push(labelName[2] + inputValue2) //酒店名称
        // }else if (tag === 3) {
        //   this.dynamicTags.push(labelName[3] + inputValue9)  //房型名称
        // }else {
        //   // labelName.find((value, index) => {
        //   //   console.log("visited index" + index + "with value" + value);
        //   //   // if(index === 2) {
        //   //   //   console.log('with value ' + value)
        //   //   //   this.dynamicTags.push(value + inputValue2) //酒店名称
        //   //   // }
        //   // })
        // }
        
      //  }
    },

    //展开条件搜索数据
    showSearch(){
      this.conditionExpand = !this.conditionExpand
      if(this.conditionExpand) {
        this.termName = '隐藏所有条件'
        this.$refs.iconR.style.transform="rotate(90deg)"
      }else {
        this.termName = '展示所有条件'
        this.$refs.iconR.style.transform="rotate(270deg)"
      }      
    },
    // 初始化数据
    initData() {
      this.getHotelStars()
      this.getConfirmTypes()
      this.getGuestTypeList()
      this.listProducts()
      this.getSuppliers()
    },
    // 获取酒店星级枚举
    getHotelStars() {
      this.$store.dispatch("getHotelStars").then(res => {
        this.hotelStars = res
        this.hotelStars.unshift({ name: "全部", value: -1 })
      });
    },
    // 获取确认类型枚举
    getConfirmTypes() {
      this.$store.dispatch("getConfirmTypeList").then(res => {
        this.confirmTypes = res
        this.confirmTypes.unshift({ name: "全部", value: -1 })
      });
    },
    // 获取宾客类型枚举
    getGuestTypeList() {
      this.$store.dispatch("guestTypeList").then(res => {
        this.guestTypes = res
      });
    },
    // 获取产品列表
    listProducts() {
      const params = {
        page: this.currentPage,
        resultNum: this.resultNum,
        minProductPrice: this.productPrice[0] * 100, // 转成分
        maxProductPrice: this.productPrice[1] * 100,
        minSaleNum: this.saleNum[0] * 100,
        maxSaleNum: this.saleNum[1] * 100,
        ...this.searchData
      };
      this.tableLoading = true
      hotelProduct
        .productList(params, "hotelProducts")
        .then(res => {
          if (res) {
            this.tableData = res.results
            this.total = res.sizeAll || 0
          }
          this.tableLoading = false
          this.conditionExpand = false
        })
        .catch(() => {
          this.total = 0
          this.currentPage = 1
        })
        .finally(() => {
          this.tableLoading = false
        });
    },
    // 获取供应商列表
    getSuppliers() {
      this.loading = true
      merchantInfo
        .queryMerchantInfo()
        .then(res => {
          const results = res.results || []
          const arr = [{ value: null, label: "全部" }];
          if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].mchName
              };
              arr.push(ele)
            }
            this.suppliers = arr
          }
        })
        .finally(() => {
          this.loading = false
        });
    },
    // 新增产品
    add() {
      this.$router.push({ path: "/product/hotelProducts/hotelInfoList" })
    },
    // 供应商接口产品导入
    importSupplierProduct() {
      this.$router.push("/product/hotelProducts/supplierHotelList")
    },
    // 地区组件值变化的时候进行回调获取
    getAreaId(val) {
      if (val.id) {
        this.searchData.areaId = val.id
      } else {
        this.searchData.areaId = "0"
      }
    },
    // 添加产品
    addProduct() {
      this.$router.push({ path: "/product/hotelProducts/save" })
    },
    // 产品上架或者下架（原上架点击后变为相反，变为下架）
    productShelveChoice(item) {
      const state = item.state === 1 ? 2 : 1
      hotelProduct.updateByState(item.id, state).then(res => {
        if (res && res.state === "success") {
          this.$message.success("操作成功")
          // 手动修改界面显示的数据，不再查询一次（防止页面刷新）
          item.state = state
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 跳转到修改产品界面
    toUpdateView(row) {
      const areaId = row.areaId3 || row.areaId2 || row.areaId1 || row.areaId0
      this.$router.push({
        path: "/product/hotelProducts/updateHotelProduct",
        query: { areaId: areaId, productId: row.id, hotelId: row.hotelId }
      })
    },
    // 删除产品
    productDelete(item) {
      this.$confirm("此操作将删除本条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        hotelProduct.hotelDelete(item.id).then(res => {
          if (res && res.state === "success") {
            this.$message({
              type: "info",
              message: "删除成功"
            });
            this.listProducts()
          }
        });
      });
    },
    // 导出表格
    exportToExcel() {
      const params = {
        hotelId: this.hotelId
      };
      hotelProduct.listForExport(params).then(res => {
        this.exportDataToExcel(res.results)
      });
    },
    // 转换星级
    computeHotelStar(star) {
      let startContent = ""
      for (let i = 0; i < star; i++) {
        startContent += "☆"
        // startContent += '★'
      }
      return startContent;
    },
    // 导出到excel
    exportDataToExcel(list) {
      const _this = this
      this.lang = sessionStorage.getItem("language") || navigator.language
      require.ensure([], () => {
        const { exportJsonToExcel } = require("@/utils/Export2Excel")
        const tHeader =
          _this.lang === "zh-CN"
            ? ["产品编号", "产品名称", "酒店ID", "酒店名称"]
            : ["Product ID", "Product Name", "Hotel ID", "Hotel Name"] // 标题
        const filterVal = ["id", "productName", "hotelId", "hotelName"] // 筛选的数据的键
        const data = _this.formatJson(filterVal, list) // list 要筛选的数据
        // 可以设置5000条一个工作表
        const multipleSheetData = _this.splitArr(data, 5000)
        const now = new Date();
        const month = now.getMonth() + 1
        const date = now.getDate()
        const dateStr =
          now.getFullYear() +
          "-" +
          (month < 10 ? "0" + month : month) +
          "-" +
          (date < 10 ? "0" + date : date);
        const colWidth = [
          { width: 20 },
          { width: 30 },
          { width: 10 },
          { width: 40 }
        ];
        exportJsonToExcel(
          tHeader,
          multipleSheetData,
          "product_" + dateStr,
          "multipleSheet",
          colWidth
        );
        this.$message.success("导出成功")
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 将分钟数转成天、时、分
    minute2DHM(minuteNum) {
      const time = {
        days: 0,
        hours: 0,
        minutes: 0
      }
      if (minuteNum >= 60 * 24) {
        time.days = Math.floor(minuteNum / (60 * 24))
      }
      if (minuteNum >= 60 * 24) {
        time.hours = Math.floor((minuteNum % (60 * 24)) / 60)
      } else {
        time.hours = Math.floor(minuteNum / 60)
      }
      if (minuteNum >= 60) {
        time.minutes = Math.floor(minuteNum % 60)
      } else {
        time.minutes = minuteNum
      }
      return time
    },
    // 将天、时、分带上单位-- 4天7小时30分
    timeWithUnit(obj) {
      const day = obj.days ? obj.days + "天" : ""
      const hours = obj.hours ? obj.hours + "小时" : ""
      const minutes = obj.minutes ? obj.minutes + "分钟" : ""
      return day + hours + minutes || 0
    },
    // 等分数组
    splitArr(arr, size) {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result;
    },
    // 切换每页显示条数
    pageSizeChange(val) {
      this.resultNum = val
      this.listProducts()
    },
    // 切换当前页
    pageCurrentChange(val) {
      this.currentPage = val
      this.listProducts()
    }
  }
};
</script>
<style lang="scss" scoped>
.search-tag {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #f5f7fa;
  margin-bottom: 10px;
  border: 1px solid #eef1f6;
  span {
    color: #000;
    padding: 0 5px;
    margin: 0 5px;
  }
  .btn-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
  }
}
.show-line{
  width: 100%;
  text-align: center;
  border: {
    top: 1px;
    left: 0;
    right: 0;
    bottom: 0;
    style: solid;
    color: #ddd;
  }
  margin-bottom: 10px;
  .term-text{
    border: {
      top: 0;
      left: 1px;
      bottom: 1px;
      right: 1px;
      style: solid;
      color: #ddd;
    }
    padding: 10px;
    margin-top: -1px;
    background-color: #fff;
    border-radius: 1px;
    color: #333;
  }
  .down-up{
    transform:rotate(270deg);
  }
}
.el-form-item__error {
  display: none;
}
.el-select{
  width: 100%;
}
</style>
