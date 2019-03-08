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
        getHomeUsers,
        userToOwner
    } from '@/api/homeUsers'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class HomeUser extends Vue {
        columns = [{
                title: '用户名',
                key: 'name'
            },
            {
                title: '姓名',
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
                title: '联系电话',
                key: 'tel',
                render: (h, params) => {
                    return params.row.tel ? h('div', params.row.tel) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                }
            },
            {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                            },
                            on: {
                                click: () => {
                                    this.toOwner(params.row)
                                }
                            }
                        }, '设为业主')
                    ]);
                }
            }
        ];
        page = 0;
        total = 2;
        userList = [];
        spinShow = true;
        toOwner(row) {
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定要将${row.nick_name ? row.nick_name : row.name}设${row.room}为业主？`)
                },
                onOk: () => {
                    userToOwner(row).then(res => {
                        this.$Message.success(res.data.msg);
                        this.page = 0
                        this.fetchData()
                    })
                    
                }
            })
        }
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        async fetchData() {
            const res = await getHomeUsers({
                role: 1,
                page: this.page,
            })
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
        margin: 30px auto;
        .table {
            margin-top: 20px;;
        }
    }
</style>