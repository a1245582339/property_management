<template>
  <div>
    <!-- 弹出框***************************************************** -->
    <el-dialog :before-close="handleClose" title="预览" :visible.sync="dialogFormVisible" center>
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, i) in photos" :key="i">
          <img style="width: 100% ;height: 100%" :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      photos: Array
    },
    computed: {

    },
    data() {
      var vm = this;
      console.log("vm.vedioUrl", vm.photos);
      return {
        dialogFormVisible: false
      };
    },
    methods: {
      noshow() {
        this.dialogFormVisible = !this.dialogFormVisible;
      },
      handleClose(done) {
        this.noshow()
        console.log('关闭了')
      }
    },
    mounted() {}
  };

</script>

<style scoped>
  .dialog-form {
    /* border: 1px solid #000; */
    text-align: center;
  }

</style>
