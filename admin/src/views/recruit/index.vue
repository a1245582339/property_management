<template>
  <div class="app-container" v-loading.body="listLoading">
   <Moduletable :list="list" :label="label" :preview="preview" :cannotEdit="true" :delete-row='deleteRow' :check='check'></Moduletable>
   <recruit-dialog :desp="desp" ref="desp" />
  </div>

</template>

<script>
import { getRecruit, checkRecruit ,delRecruit} from "@/api/recruit";
import Moduletable from "@/components/table/table";
import RecruitDialog from "@/components/recruitdialog/index";
export default {
  components: {
    Moduletable,
    RecruitDialog
  },
  data() {
    return {
      list: [],
      listLoading: true,
      desp:'',
      label: {
        moudleId: "招募信息编号",
        moduleName: "招募标题",
        moudleType: "青旅名称",
        canPreview: "详情",
        moudleCheck: "审核",
        moudlePrice:  "薪资"
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
      getRecruit().then(res => {
        data = res.data.map( item => {
          let ischecked;
          if (item.ischecked == 1) {
            ischecked = "已审核";
          } else {
            ischecked = "待审核";
          }
          return {
            id: item.id,
            name: item.recruit_title,
            tel: item.tel,
            type: item.hostel_name,
            ischecked: ischecked,
            avatar: item.avatar,
            password: item.password,
            price: `${item.salary}k`,
            dialogContent: item.desp
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
      delRecruit(data)
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
    
    check(index, list) {
      if (list[index].ischecked == "已审核") {
        this.$message({
          message: "此招募信息为已审核状态",
          type: "info"
        });
      } else {
        this.$confirm("是否确定将此招募信息修改为已审核状态？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          checkRecruit(list[index].id).then(response => {
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
    },
    preview(desp){
      this.desp = desp
      this.$refs.desp.noshow();
    },
  }
};
</script>
