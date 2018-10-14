<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
     <!-- ID列表 -->
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <!-- 模块名称 -->
      <el-table-column label="模块名称" width="110">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <!-- 模块描述 -->
      <el-table-column label="模块描述"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data}}</span>
        </template>
      </el-table-column>
      <!-- 价格 -->
      <el-table-column label="价格" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <!-- 模块系数 -->
     <el-table-column label="模块系数" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.num}}
        </template>
      </el-table-column>
      <!-- 修改 -->
      <el-table-column class-name="status-col" label="操作" width="110" align="center">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="updateRow(scope.$index, list)"
          type="text"
          size="small">
          打印
        </el-button>
         <el-button
          @click.native.prevent="deleteRow(scope.$index, list)"
          type="text"
          size="small">
          删除
        </el-button>
      </template>
      </el-table-column>
      <!-- 删除 -->
      <!-- <el-table-column align="center" prop="created_at" label="类型">
        <template slot-scope="scope"> -->
          <!-- <i class="el-icon-time"></i> -->
          <!-- <span>{{type}}</span>
        </template>
      </el-table-column> -->
    </el-table>
<!-- 弹出框***************************************************** -->
    <el-dialog title="编辑模块" :visible.sync="dialogFormVisible" center>
       <el-form :model="form" label-width="90px">
         <el-form-item label="修改模块" :label-width="formLabelWidth">
           <el-input v-model="form.oldname" auto-complete="off" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="模块名称" :label-width="formLabelWidth">
           <el-input v-model="form.name" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块介绍" :label-width="formLabelWidth">
           <el-input v-model="form.describe" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块价格" :label-width="formLabelWidth">
           <el-input v-model="form.price" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块系数" :label-width="formLabelWidth">
           <el-input v-model="form.num" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块类型" :label-width="formLabelWidth">
           <el-input v-model="form.type" auto-complete="off"></el-input>
         </el-form-item>
         
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitF()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll } from '@/api/table'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      type: '手机',
      dialogFormVisible: false,
      form: {
        oldname: '',
        name: '',
        describe: '',
        price: '',
        num: '',
        type: ''
      },
      formLabelWidth: '120px'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data
        this.listLoading = false
      })
    },
    deleteRow(index, rows) {
        rows.splice(index, 1);
        console.log(rows[index])
    },
    updateRow(index,rows) {
         this.form.oldname = rows[index].id;
         this.form.name = rows[index].title;
         this.form.price = rows[index].author;
         this.form.num = rows[index].status;
         this.dialogFormVisible = true;
         console.log(this.form.oldname)
    },
    commitF(){
        console.log(this.form);
        this.dialogFormVisible = false;
    }
  }
}
</script>
