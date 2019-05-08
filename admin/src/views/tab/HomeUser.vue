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
        columns = [{    // 表格的表头
                title: '用户名',
                key: 'name'
            },
            {
                title: '姓名',
                key: 'nick_name',
                render: (h, params) => {
                    return params.row.nick_name ? h('div', params.row.nick_name) : h('div', [h('span', {    // 有昵称的时候显示昵称，没昵称显示暂无
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
                    return params.row.tel ? h('div', params.row.tel) : h('div', [h('span', {    // 同昵称
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
                                click: () => {  // 点击设为业主时执行的方法
                                    this.toOwner(params.row)    // 设为业主
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
        toOwner(row) {  // 点击设为业主
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定要将${row.nick_name ? row.nick_name : row.name}设${row.room}为业主？`)   // 提示是否确定
                },
                onOk: () => {
                    userToOwner(row).then(res => {  //点击确定时发送设为业主的请求
                        this.$Message.success(res.data.msg);    // 提示设置成功
                        this.page = 0   // 页码设置为0
                        this.fetchData()    // 刷新数据
                    })
                    
                }
            })
        }
        changePage(page) {  // 更改页面
            this.page = page - 1    // page从0开始，所以-1
            this.spinShow = true    // 开始loading
            this.fetchData()    // 获取数据
        }
        async fetchData() { // 获取数据的方法
            const res = await getHomeUsers({    // 获取房间内的用户
                role: 1,    // 权限是1的，也就是业主的
                page: this.page,    // 页码
            })
            this.userList = res.data.data.map(item => { // 把获取的返回结果赋值到页面数据上
                return {
                    ...item,
                    sex: item.sex == 0 ? '男' : '女',
                    room: `${item.building}号楼${item.room_num}室`
                }
            })
            this.total = res.data.total     // 数据总量，用于做分页
            setTimeout(() => {
                this.spinShow = false   // 100毫秒后停止loading
            }, 100)

        };
        created() {
            this.fetchData()    // 进入页面时获取数据
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