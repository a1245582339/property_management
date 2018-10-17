<template>
<div>
    <div class="wrap">
        <Table class="table" border :columns="columns" :data="userList"></Table>
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
        getHomeUsers
    } from '@/api/homeUsers'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class HomeOwner extends Vue {
        columns = [{
                title: '用户名',
                key: 'name'
            },
            {
                title: '昵称',
                key: 'nick_name',
                render: (h, params) => {
                    return params.row.nick_name ? h('div', params.row.nick_name) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                }
            },
            {
                title: '性别',
                key: 'sex'
            },
            {
                title: '房间',
                key: 'room'
            },
            {
                title: '业主电话',
                key: 'tel',
                render: (h, params) => {
                    return params.row.tel ? h('div', params.row.tel) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                }
            },
        ];
        page = 0;
        total = 2;
        userList = [];
        spinShow = true;
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        async fetchData() {
            const res = await getHomeUsers({role: 1, page: this.page})
            this.userList = res.data.data.map(item => {
                return {
                    ...item,
                    sex: item.sex == 0 ? '男' : '女',
                    room: `${item.building}号楼${item.room_num}室`
                }
            })
            this.total = res.data.total
            setTimeout(() => {
                this.spinShow = false
            }, 100)
            
        };
        created() {
            this.fetchData()
        }
    }
</script>
<style lang="scss" scoped>
.wrap {
    position: relative;
    width: 95%;
    margin: 30px auto
}
</style>