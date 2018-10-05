<template>
    <div>
        <div>
            <van-card v-for="(item, index) in repairList" :key="index" tag="标签" :price="item.price || '暂无报价'" :desc="statusMap.find(i => i.status == item.status ).text"
                :title="item.title" thumb="">
                <div slot="footer">
                    <van-button size="mini">查看详情</van-button>
                    <van-button v-if="item.status == 4" size="mini" type="danger">缴费</van-button>
                </div>
            </van-card>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    import {
        getRepair,
        createRepair
    } from '@/api/repair'
    @Component
    export default class Main extends Vue {
        loading = true;
        repairList = this.$store.state.repair;
        statusMap = [{
            status: 1,
            text: '已报修'
        }, {
            status: 2,
            text: '已联系'
        }, {
            status: 3,
            text: '已派修'
        }, {
            status: 4,
            text: '已维修'
        }, {
            status: 5,
            text: '已缴费'
        }];
        async fetchData() {
            const vm = this
            Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });
            await this.$store.dispatch('GET_REPAIR', {
                user_id: vm.$store.state.user.id
            })
            this.repairList = this.$store.state.repair;
            this.$forceUpdate()
            Toast.clear()
        };
        mounted() {
            this.$nextTick(() => {
                this.fetchData()
            })
        }

    }
</script>
<style lang="scss" scoped>

</style>