<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-button type="primary" plain @click="addAdmin">添加管理员</el-button>
   <Moduletable :list="list" :label="label" :update-row='updateRow' :delete-row='deleteRow' :currentId="currentId"></Moduletable>
   <Dialogtable :actionUrl="actionUrl" :list="list" :type="type" :form="form" :label="label" ref="dial" @commitform='commitForm'></Dialogtable>
  
  </div>

</template>

<script>
import {
  getAdminList,
  delAdmin,
  updateAdmin,
  getAdminRoles
} from "@/api/admin";
import Moduletable from "@/components/table/table";
import Dialogtable from "@/components/tabledialog";
export default {
  components: {
    Moduletable,
    Dialogtable
  },
  data() {
    return {
      list: [],
      type: [],
      listLoading: true,
      currentId:"",
      actionUrl:"http://127.0.0.1:3000/updateAdminAvatar",
      label: {
        moudleId: "管理员ID",
        moduleName: "管理员用户名",
        moudleTel: "管理员手机号",
        moudleCreatTime: "创建时间",
        moudleType: "管理员身份",
        moudlePassword: "管理员密码",
        avatar:"头像"
      },

      form: {
        name: "",
        price: "",
        coefficient: "",
        desp: "",
        oldname: ""
      }
    };
  },
  created() {

    this.currentId=this.$store.state.user.id
    this.fetchData();
    this.getroles();
  },
  methods: {
    addAdmin(){
      this.$refs.dial.noshow();
    },
    // 转换时间戳
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 获取角色类型
    getroles() {
      var vm = this;
      this.listLoading = true;
      var arr = [];
      getAdminRoles().then(response => {
        response.data.map((item, index) => {
          arr[index] = {
            id: item.id,
            name: item.roles
          };
        });
      });
      this.type = arr;
    },
    // 获取数据
    fetchData() {
      var vm = this;
      this.listLoading = true;
      var data = [];
      getAdminList().then(response => {
        response.data.map((item, index) => {
          var create_time = vm.timestampToTime(item.create_time);

          data[index] = {
            id: item.id,
            name: item.name,
            tel: item.tel,
            create_time: create_time,
            type: item.roles_name,
            typeVal: item.roles_id,
            password: item.password,
            avatar:item.avatar
          };
        });
        vm.list = data;
        this.listLoading = false;
      });
    },
    // 删除模块
    deleteRow(index, rows) {
      let data = rows[index].id; //删除管理员
      this.$confirm("是否确定将该管理员删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delAdmin(data).then(response => {
          if (response.code == 20000) {
            rows.splice(index, 1);
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "删除失败",
              type: "success"
            });
          }
        });
      }).catch(()=>{
        this.$message({
            type: 'info',
            message: '已取消删除'
          });  
      })
    },
    // 修改
    updateRow(index, rows) {
      // 获取当前行的内容  rows[index]
      // console.log(rows[index])
      
      this.form.id = rows[index].id;
      this.form.name = rows[index].name;
      this.form.typeName = rows[index].type;
      this.form.type = rows[index].typeVal;
      this.form.tel = rows[index].tel;
      this.form.password = rows[index].password;
      this.form.avatar = rows[index].avatar;
      console.log(this.form.avatar)
      this.$refs.dial.noshow();
      console.log("执行更改程序");
    },
    commitForm() {
      // 更改模块的表单提交
      var timestamp=(Date.parse( new Date()))/1000;
      this.form.create_time = timestamp
      let data = this.form;
      updateAdmin(data).then(response => {
        console.log("response", response);
        this.$refs.dial.noshow();
        this.fetchData();
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    }
  }
};
</script>
