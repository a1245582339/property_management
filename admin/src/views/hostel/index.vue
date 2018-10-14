<template>
  <div class="app-container" v-loading.body="listLoading">
   <Moduletable :cannotEdit="cannotEdit" :list="list" :preview="preview" :label="label" :delete-row='deleteRow'></Moduletable>
   <photo-dialog :photos="photos" ref="photos" />
  </div>

</template>

<script>
import { getHostelList, delHostel } from "@/api/hostel";
import Moduletable from "@/components/table/table";
import photoDialog from "@/components/photosdialog/index"
export default {
  components: {
    Moduletable,
    photoDialog
  },
  data() {
    return {
      list: [],
      listLoading: true,
      cannotEdit:true,
      photos: [],
      label: {
        moudleId: "青旅ID",
        moduleName: "青旅名称",
        moduleDesp: "简介",
        moudleType: "所属老板",
        moudleProvince: "省份",
        moudleAddress: "详细地址",
        canPreview: '照片'
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
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
      
      getHostelList().then(response => {
        response.data.map((item, index) => {
          var photos = JSON.parse(JSON.parse(item.photos))

          data[index] = {
            id: item.id,
            name: item.name,
            type: item.boss_name,
            province: item.province,
            desp: item.desp,
            address: item.address,
            dialogContent: photos
          };
        });
        vm.list=data;
        this.listLoading = false;
      });
    },
    // 删除模块
    deleteRow(index, rows) {
      let data = rows[index].id; //删除管理员
      this.$confirm("是否确定将该订单删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delHost(data).then(response => {
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
    preview(photos){
      this.photos = photos
      this.$refs.photos.noshow();
    },
  }
};
</script>
