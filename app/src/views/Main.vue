<template>
    <div>
        <router-view style="padding-bottom: 100px;" />
        <div id="nav">
            <van-tabbar v-model="active">
                <van-tabbar-item v-for="(item, index) in tabs" :key="index" :icon="item.icon" :to="{name: item.name}">{{item.label}}</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
    import {
        Component,
        Prop,
        Vue,
        Watch
    } from 'vue-property-decorator';
    @Component
    export default class Main extends Vue {
        active = 0;
        tabs = [{
            label: '房屋',
            icon: 'home',
            name: 'room'
        }, {
            label: '报修列表',
            icon: 'setting',
            name: 'repair'
        }, {
            label: '家庭成员',
            icon: 'pending-orders',
            name: 'homeUser'
        }, {
            label: '个人信息',
            icon: 'contact',
            name: 'me'
        }];
        created() {
            
        };
        @Watch('$route', { immediate: true, deep: true })
        watchRoute(newVal, oldVal) {
            this.active = this.tabs.indexOf(this.tabs.find(item => {
                return item.name == this.$route.name
            }))
        }
    }
</script>


<style lang="scss">
    #nav {
        width: 100%;
        position: fixed;
        bottom: 0;
        background-color: #fff;

        .tab-name {
            padding-top: 3px;
            font-size: 1em;
        }

        .tab-icon {
            font-size: 1.3em;
        }
    }
</style>