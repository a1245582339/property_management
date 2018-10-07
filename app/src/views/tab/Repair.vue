<template>
    <div>
        <van-nav-bar title="报修列表" right-text="添加" @click-right="onClickRight">
        </van-nav-bar>
        <no-permission v-if="$store.state.user.role == 0" />
        <div v-else>
            <van-search v-model="searchWord" placeholder="请输入搜索关键词" show-action @search="onSearch">
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
            <div>
                <no-data v-if="repairList.length == 0" />
                <van-list v-else v-model="Listloading" :finished="finished" @load="onLoad">
                    <van-card v-for="(item, index) in repairList" :key="index" tag="标签" :price="item.price || '暂无报价'"
                        :desc="statusMap.find(i => i.status == item.status ).text" :title="item.title" :thumb="item.photos && item.photos.length != 0 ? JSON.parse(item.photos)[0] : defaultImg">
                        <div slot="footer">
                            <van-button size="mini" @click="$router.push({name: 'repairDetail', params: item})">查看详情</van-button>
                            <van-button v-if="item.status == 4" size="mini" type="danger" @click="pay(item.id, item.price)">缴费</van-button>
                        </div>
                    </van-card>
                </van-list>
            </div>
        </div>

    </div>
</template>
<script>
    import noData from '@/components/noData'
    import noPermission from '@/components/noPermission'
    import {
        Toast,
        Dialog
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    import {
        getRepair,
        createRepair
    } from '@/api/repair'
    @Component({
        components: {
            noData,
            noPermission
        }
    })
    export default class Main extends Vue {
        statusMap = [{
            status: 0,
            text: '已撤消'
        }, {
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
        Listloading = false;
        finished = false;
        searchWord = '';
        repairList = this.$store.state.repair.list;
        page = 0;
        defaultImg = require('@/assets/noPhoto.png');
        async fetchData() {
            const vm = this
            var res = await this.$store.dispatch('GET_REPAIR', {
                room_id: vm.$store.state.user.room_id,
                title: vm.searchWord,
                page: vm.page
            })
            this.page++
            if (res.data.data.length < 10) {
                vm.finished = true
                vm.Listloading = false
            }
            this.repairList = this.$store.state.repair.list;
            this.$forceUpdate()
            Toast.clear()
        };
        onClickRight() {
            this.$router.push({
                path: '/createRepair'
            })
        };
        onSearch() {
            Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });
            this.page = 0;
            this.fetchData()
        };
        pay(id, price) {
            Dialog.confirm({
                title: '提示',
                message: `确定缴费${price}元？`
            }).then(async () => {
                await this.$store.dispatch('PAY_REPAIR', id)
                Toast.success('缴费成功');
                this.fetchData()
            }).catch(() => {
                Toast('已取消');
            });
        };
        onLoad() {
            this.fetchData()
        };
        mounted() {
            if (this.$store.state.user.role != 0) {
                Toast.loading({
                    mask: true,
                    duration: 0,
                    message: '加载中...'
                });
                this.$nextTick(() => {
                    this.fetchData()
                })
            }

        }

    }
</script>
<style lang="scss" scoped>

</style>