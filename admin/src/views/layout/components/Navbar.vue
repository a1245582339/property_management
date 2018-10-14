<template>
<div>
  <el-menu class="navbar" mode="horizontal">
    <!-- 侧边栏折叠按钮 -->
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>

    <!-- 右侧的退出按钮 -->
    <div class="avatar-container">
      <div class="avatar-wrapper" >
        <!-- <span style="margin-right: 20px" @click="showf">添加模块</span> -->
        <span @click="logout">退出</span>
      </div>
    </div>
  </el-menu>
  <!-- ******************************** -->
  <el-dialog title="添加模块" :visible.sync="dialogFormVisible" center>
       <el-form :model="form" label-width="30px" >
         <el-form-item label="选择类型" :label-width="formLabelWidth">
           <el-select v-model="form.category_id" placeholder="请选择模块类型">
              <el-option label="基础组件" value="0"></el-option>
              <el-option label="可选组件" value="1"></el-option>
              <el-option label="独立组件" value="2"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="模块名称" :label-width="formLabelWidth">
           <el-input v-model="form.name" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块介绍" :label-width="formLabelWidth">
           <el-input type="textarea" autosize v-model="form.desp" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块价格" :label-width="formLabelWidth">
           <el-input v-model="form.price" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="模块系数" :label-width="formLabelWidth">
           <el-input v-model="form.coefficient" auto-complete="off"></el-input>
         </el-form-item>
         
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddata">确 定</el-button>
      </div>
</el-dialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  data() {
            const checkName = (rule,value,callback) => {
                     if(!value) {
                       return callback(new Error('模块名不能为空'))
                     }
            };
            const checkDesp = (rule,value,callback) => {
                     if(!value) {
                       return callback(new Error('模块描述不能为空'))
                     }
            };
            const checkCoefficicent = (rule,value,callback) => {
                     if (!value) {
                              return callback(new Error('系数不能为空'));
                            }
                            setTimeout(() => {
                              if (Number.isNaN(value) ) {
                                callback(new Error('请输入数字值'));
                              } else {
                                if (value < 0) {
                                  callback(new Error('必须为正数'));
                                } else {
                                  callback();
                                }
                              }
                            }, 100);
            };
            const checkPrice = (rule, value, callback) => {
                            if (!value) {
                              return callback(new Error('价格不能为空'));
                            }
                            setTimeout(() => {
                              if (Number.isNaN(value)) {
                                callback(new Error('请输入数字值'));
                              } else {
                                if (value < 0) {
                                  callback(new Error('必须为正数'));
                                } else {
                                  callback();
                                }
                              }
                            }, 100);
            };
    return {
      dialogFormVisible: false,
      form: {
        category_id: '',
        name: '',
        price: '',
        coefficient: '',
        desp: '',
        is_deleted: 0
      },
      formLabelWidth: '80px',
      rules: { 
                name: [
                  {validator: checkName, trigger: 'change'}
                ],
                desp: [
                  { validator: checkDesp, trigger: 'change' }
                ],
                price: [
                  { validator: checkPrice, trigger: 'change' }
                ],
                coefficient: [
                  { validator: checkCoefficicent, trigger: 'change' }
                ],
            }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    showf() {
        this.dialogFormVisible = true
    },
    adddata() {
         let data = this.form;
         console.log(data)
         addlist(data).then(response => {
            this.dialogFormVisible = false
            this.$message({
                  message: '添加成功',
                  type: 'success'
            });
            setTimeout(() => {
                location.reload() 
            },1000)
            
         }).catch(err => {
              this.$message({
                  message: '添加失败',
                  type: 'error'
            });
         })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

