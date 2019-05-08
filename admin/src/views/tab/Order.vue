<template>
    <div>
        <div class="wrap">
            <Table class="table" border :columns="columns" :data="orderList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>

    </div>

</template>
<script>
    import {
        getOrder,
    } from '@/api/order'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Part extends Vue {
        columns = [{
                title: '零件名称',
                key: 'part_name'
            }, {
                title: '报修标题',
                key: 'title',
            }, {
                title: '出库量',
                key: 'count',
            },
        ];
        page = 0;   // 页码
        total = 2;  // 总数
        orderList = []; // 数据列表
        spinShow = true;    // loading状态
        changePage(page) {  // 改变页码
            this.page = page - 1    // 页码从0起，所以要-1
            this.spinShow = true    // 开始loading
            this.fetchData()    // 获取数据
        }
        async fetchData() {
            const res = await getOrder({    // 获取订单
                page: this.page // 传入当前页码
            })
            this.orderList = res.data.data  // 将获取到的数据放到页面数据里
            this.total = res.data.total // 将获取到的数据总量赋值给页面的数据总量
            setTimeout(() => {
                this.spinShow = false   // 100毫秒后停止loading
            }, 100)

        };

        async created() {
            this.fetchData()
        }
    }
</script>
<style lang="scss" scoped>
    .wrap {
        position: relative;
        width: 95%;
        margin: 30px auto;
        .table {
            margin-top: 20px;
        }
    }
</style>