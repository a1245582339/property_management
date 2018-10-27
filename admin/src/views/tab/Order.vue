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
        page = 0;
        total = 2;
        orderList = [];
        spinShow = true;
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        async fetchData() {
            const res = await getOrder({
                page: this.page
            })
            this.orderList = res.data.data
            this.total = res.data.total
            setTimeout(() => {
                this.spinShow = false
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