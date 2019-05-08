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
    // 此页面大部分与homeuser注释一样
    import {
        getHomeUsers,
        updateUser
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
            {
                title: '操作',
                key: 'action',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                            },
                            on: {
                                click: () => {
                                    this.del(params.row.id)
                                }
                            }
                        }, '删除'),
                    ]);
                }
            }
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
        async del(id) {
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定删除此业主并同时删除其所有家庭成员？`)
                },
                onOk: () => {
                    updateUser({       // 更新用户（删除）
                        id: id,     // 用户的id
                        isDel: 1    // 被删除状态改成1
                    }).then(res => {    // 成功
                        this.$Message.success('删除成功');  // 成功后提示
                        this.page = 0   // 页码设置为0
                        this.fetchData()    // 重新获取数据
                    })

                }
            })
        }
        async fetchData() {
            const res = await getHomeUsers({role: 2, page: this.page})  // 查询
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