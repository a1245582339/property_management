<template>
  <div class="app-container" v-loading.body="listLoading">
   <Moduletable :list="list" :label="label" :cannotEdit="true" :delete-row='deleteRow' :check='check'></Moduletable>
  
  </div>

</template>

<script>
import { getVolun, checkVolun ,delVolun} from "@/api/volun";
import Moduletable from "@/components/table/table";
export default {
  components: {
    Moduletable,
  },
  data() {
    return {
      list: [],
      type: [{ id: "男", name: "男" }, { id: "女", name: "女" }],
      listLoading: true,
      currentType: "",
      label: {
        moudleId: "义工ID",
        moduleName: "用户名",
        moudleType: "性别",
        moudleTel: "手机号",
        moudleCheck: "审核",
        moudlePassword:"密码",
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
    this.fetchData();
  },
  methods: {
    // 转换时间戳
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
         return Y+M+D+h+m+s;
    },
    // 获取数据
    fetchData() {
      var vm = this;
      this.listLoading = true;
      var data = [];
      getVolun().then(res => {
        data = res.data.map( item => {
          let ischecked;
          if (item.ischecked == 1) {
            ischecked = "已审核";
          } else {
            ischecked = "待审核";
          }
          return {
            id: item.id,
            name: item.volun_name,
            tel: item.tel,
            type: item.sex,
            ischecked: ischecked,
            avatar: item.avatar,
            password: item.password
          }
        })
        vm.list = data
        this.listLoading = false;
      });
    },
    // 删除模块
    deleteRow(index, rows) {
      let data = rows[index].id; //根据学生id删除课程
      console.log("要删除的模块name:", data);
      delVolun(data)
        .then(response => {
          console.log(response);
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
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "success"
          });
        });
    },
    // // 修改
    // updateRow(index, rows) {
    //   // 获取当前行的内容  rows[index]
    //   // console.log(rows[index])
    //   this.form.id = rows[index].id;
    //   this.form.name = rows[index].name;
    //   this.form.typeName = rows[index].type;
    //   this.form.type = rows[index].typeVal;
    //   this.form.tel = rows[index].tel;
    //   this.form.password = rows[index].password;
    //   this.form.avatar = rows[index].avatar;
    //   this.$refs.dial.noshow();
    //   console.log("执行更改程序");
    // },
    // commitForm() {
    //   // 更改模块的表单提交
    //   console.log(JSON.stringify(this.form));
    //   let data = this.form;

    //   updateBoss(data).then(response => {
    //     this.$refs.dial.noshow();
    //     this.fetchData();
    //     this.$message({
    //       message: "修改成功",
    //       type: "success"
    //     });
    //   });
    // },
    check(index, list) {
      if (list[index].ischecked == "已审核") {
        this.$message({
          message: "此青旅老板为已审核状态",
          type: "info"
        });
      } else {
        this.$confirm("是否确定将此青旅老板修改为已审核状态？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          checkVolun(list[index].id).then(response => {
            console.log('response.code',response.code)
            if (response.code == 20000) {
              list[index].ischecked='已审核'
              this.$message({
                message: "审核成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "审核失败",
                type: "error"
              });
            }
          });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消更改'
          });  
        });
      }
    }
  }
};
</script>
