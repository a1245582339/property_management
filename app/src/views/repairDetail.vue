<template>
    <div>
        <van-nav-bar title="报修记录详情" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
            <span v-if="repairInfo.status == 1" style="color: #ff4444" slot="right">撤销报修</span>
            <span v-else-if="repairInfo.status == 4" style="color: #ff4444" slot="right">缴费</span>
        </van-nav-bar>
        <van-cell-group>
            <van-cell title="标题" :value="repairInfo.name" />
            <van-cell title="创建时间" :value="timestampToTime(repairInfo.create_time)" />
            <van-cell v-if="repairInfo.status > 2" title="派修时间" :value="timestampToTime(repairInfo.appointment_time)" />
            <van-cell v-if="repairInfo.status == 5" title="支付时间" :value="timestampToTime(repairInfo.pay_time)" />
            <van-cell v-if="repairInfo.status == 0" title="报修进度" value="已撤消" />
            <van-cell class="vant-cell" title="照片">
                <span v-if="photos.length == 0">未上传图片</span>
                <div class="photo" v-for="(item, index) in photos" :key="index">
                    <img :src="item" alt="" @click="preview(index)">
                </div>
            </van-cell>
        </van-cell-group>
        <van-steps v-if="repairInfo.status != 0" :active="repairInfo.status - 1" title="报修进度">
            <van-step>已报修</van-step>
            <van-step>已联系</van-step>
            <van-step>已派修</van-step>
            <van-step>已维修</van-step>
            <van-step>已缴费</van-step>
        </van-steps>
    </div>
</template>
<script>
    import moment from 'moment'
    import {
        Toast,
        Dialog,
        ImagePreview
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component
    export default class RepairDetail extends Vue {
        statusMap = [{
            status: 0,
            text: '已撤销'
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
        repairInfo = {};
        photos = [];
        onClickLeft() {
            this.$router.push({
                name: 'repair'
            })
        };
        onClickRight() {
            if (this.repairInfo.status == 1) {
                this.cancelRepair()
            } else if (this.repairInfo.status == 4) {
                this.pay()
            }
        };
        cancelRepair() {
            Dialog.confirm({
                title: '提示',
                message: '确定撤销此次报修？'
            }).then(async () => {
                await this.$store.dispatch('DEL_REPAIR', this.repairInfo.id)
                Toast.success('撤销成功');
                this.repairInfo.status = 0
            }).catch(() => {
                Toast('已取消');
            });
        };
        pay() {
            Dialog.confirm({
                title: '提示',
                message: `确定缴费${this.repairInfo.price}元？`
            }).then(async () => {
                await this.$store.dispatch('PAY_REPAIR', this.repairInfo.id)
                Toast.success('缴费成功');
                this.repairInfo.status = 5
            }).catch(() => {
                Toast('已取消');
            });
        }
        timestampToTime(timestamp) {
            return moment(timestamp - 0).format('YYYY-MM-DD HH:mm:ss');
        };
        preview(index) {
            ImagePreview({
                images: this.photos,
                startPosition: index,
                showIndex: true,
                onClose() {
                    // do something
                }
            });
        };
        created() {
            this.repairInfo = this.$route.params
            if (this.repairInfo.photos) {
                this.photos = JSON.parse(this.repairInfo.photos)
            }
        };
    }
</script>
<style lang="scss" scoped>
    .photo {
        position: relative;
        display: inline-block;
        margin-right: 3px;

        img {
            width: 40px;
            height: 40px;
        }

    }
</style>