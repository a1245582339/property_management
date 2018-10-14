<template>
  <div class="app-container">
    <el-table :data="list"  border fit highlight-current-row >
     <!-- 序列号 -->
      <el-table-column v-if="!isMe" align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <!-- 模块ID -->
      <el-table-column v-if="label.moudleId" :label="label.moudleId" width="110">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
       <!-- 模块ID -->
      <el-table-column v-if="label.avatar" :label="label.avatar" width="110">
        <template slot-scope="scope">
          <img style="height:80px;width:80px" :src="scope.row.avatar" alt="">
        </template>
      </el-table-column>
      <!-- 模块名称 -->
      <el-table-column v-if="label.moduleName" :label="label.moduleName" width="110">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <!-- 模块描述 -->
      <el-table-column v-if="label.moduleDesp" :label="label.moduleDesp"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.desp}}</span>
        </template>
      </el-table-column>
      <!-- 省份 -->
      <el-table-column v-if="label.moudleProvince" :label="label.moudleProvince"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <!-- 地址 -->
      <el-table-column v-if="label.moudleAddress" :label="label.moudleAddress"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <!-- 模块数量 -->
      <el-table-column v-if="label.moduleCount" :label="label.moduleCount" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.count}}
        </template>
      </el-table-column>
      <!-- 价格 -->
      <el-table-column v-if="label.moudlePrice" :label="label.moudlePrice" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <!-- 类型 -->
      <el-table-column v-if="label.moudleType" align="center" width="110"  :label="label.moudleType">
        <template slot-scope="scope">
          <span  :value="scope.row.typeVal">{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <!-- 模块系数 -->
     <el-table-column v-if="label.moudleCoefficient" :label="label.moudleCoefficient" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.coefficient}}
        </template>
      </el-table-column>
      <!-- 访问量 -->
     <el-table-column v-if="label.PageView" :label="label.PageView" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageView}}
        </template>
      </el-table-column>
      <!-- 模块手机号 -->
     <el-table-column v-if="label.moudleTel" :label="label.moudleTel" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.tel}}
        </template>
      </el-table-column>
      <!-- 模块密码 -->
     <el-table-column v-if="label.moudlePassword" :label="label.moudlePassword" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.password}}
        </template>
      </el-table-column>
      <!-- 预览 -->
      <el-table-column  v-if="label.canPreview" :label="label.canPreview" width="110" align="center">
        <template slot-scope="scope">
          <el-button
          @click="preview(scope.row.dialogContent)"
          type="text"
          size="small">
          查看
        </el-button>
        </template>
      </el-table-column>
      <!-- 修改 -->
      <el-table-column v-if="!cannotEdit||!cannotDel" class-name="status-col" label="操作" width="110" align="center">
      <template slot-scope="scope">
        <el-button v-if="!cannotEdit"
          @click="updateRow(scope.$index, list)"
          type="text"
          size="small">
          编辑
        </el-button>
         <el-button v-if="currentId!=scope.row.id&&!cannotDel"
        @click.prevent="deleteRow(scope.$index, list)"
          type="text"
          size="small">
          删除
        </el-button>
      </template>
      </el-table-column>
      

      <el-table-column v-if="label.moudleCreatTime" align="center" :label="label.moudleCreatTime">
        <template slot-scope="scope">
          <span>{{scope.row.create_time}}</span>
        </template>
      </el-table-column>

       <el-table-column v-if="label.moudleCheck" align="center"  :label="label.moudleCheck">
        <template slot-scope="scope">
          <el-button
          @click="check(scope.$index, list)"
          type="text"
          size="small">
          {{scope.row.ischecked}}
        </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  props: {
    list: Array,
    form: Object,
    label: Object,
    updateRow: Function,
    deleteRow: Function,
    preview:Function,
    check:Function,
    dialogFormVisible: Boolean,
    currentId:Number,
    isMe:Boolean,
    cannotEdit:Boolean,
    cannotDel:Boolean
  },
  data() {
    return {
      formLabelWidth: "120px",
    };
  },
  methods:{
    
  }
};
</script>

<style scoped>

</style>