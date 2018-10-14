<template>
  <div>
    <el-dialog :before-close="handleClose" title="详情" :visible.sync="dialogFormVisible" center>
      <div v-html="desp">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      desp: String
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
