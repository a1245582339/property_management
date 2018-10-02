<template>
    <div>
        <router-view style="padding-bottom: 100px;" />
        <div id="nav">
            <!-- <cube-tab-bar :showSlider="true" :useTransition="true" v-model="selectedLabelDefault" :data="tabs"
                @change="changeHandler">
                <cube-tab v-for="(item, index) in tabs" :label="item.label" :key="index">
                    <i slot="icon" :class="`${item.icon} tab-icon`"></i>
                    <p class="tab-name">{{item.label}}</p>
                </cube-tab>
            </cube-tab-bar> -->
        </div>
    </div>
</template>

<script>
    const tabMap = [{
        label: '房屋',
        name: 'room'
    },{
        label: '维修列表',
        name: 'repair'
    },{
        label: '家庭成员',
        name: 'homeUser'
    },{
        label: '个人信息',
        name: 'me'
    }]
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component
    export default class Main extends Vue {
        selectedLabelDefault = '房屋';
        tabs = [{
            label: '房屋',
            icon: 'cubeic-home',
        }, {
            label: '维修列表',
            icon: 'cubeic-like',
        }, {
            label: '家庭成员',
            icon: 'cubeic-vip',
        }, {
            label: '个人信息',
            icon: 'cubeic-person',
        }];
        changeHandler(label) {
            let routeName = tabMap.find(item => item.label == label).name
            this.$router.push({name: routeName})
        };
        created() {
            var vm = this
            vm.selectedLabelDefault = tabMap.find(item => item.name == vm.$route.name).label
        };
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