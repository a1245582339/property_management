<template>
    <div>
        <van-nav-bar title="房屋信息">
        </van-nav-bar>
        <no-permission v-if="$store.state.user.role == 0" />
        <van-cell-group v-else>
            <van-cell title="楼号" :value="userInfo.building + '号楼'" />
            <van-cell title="房间号" :value="userInfo.room_num + '室'" />
            <van-cell title="面积" :value="userInfo.area + '平米'" />
        </van-cell-group>
    </div>
</template>
<script>
    import noPermission from '@/components/noPermission'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component({
        components: {
            noPermission
        }
    })
    export default class Main extends Vue {
        userInfo = this.$store.state.user;
    }
</script>
<style lang="scss" scoped>

</style>