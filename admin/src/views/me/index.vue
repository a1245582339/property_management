<template>
  <div class="app-container" v-loading.body="listLoading">
   <Moduletable :isMe="isMe" :list="list" :label="label" :update-row='updateRow' :currentId="currentId"></Moduletable>
   <Dialogtable :isMe="isMe" :list="list" :type="type" :form="form" :label="label" ref="dial" @commitform='commitForm'></Dialogtable>
  
  </div>

</template>

<script>
import {
  getPersonalAdmin,
  updateAdmin,
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
      currentId:'',
      isMe:true,
      label: {
        moudleId: "ID",
        moduleName: "用户名",
        moudleTel: "手机号",
        moudleCreatTime: "创建时间",
        moudleType: "管理员身份",
        moudlePassword: "登陆密码"
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
    // 获取数据
    fetchData() {
      var vm = this;
      this.listLoading = true;
      var data = [];
      getPersonalAdmin(this.currentId).then(response => {
        response.data.map((item, index) => {
          var create_time = vm.timestampToTime(item.create_time);
          data[index] = {
            id: item.id,
            name: item.name,
            tel: item.tel,
            create_time: create_time,
            type: item.roles_name,
            typeVal: item.roles_id,
            password: item.password
          };
        });
        vm.list = data;
        this.listLoading = false;
      });
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
