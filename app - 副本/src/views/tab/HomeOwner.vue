<template>
    <div class="wrap">
        <Table class="table" border :columns="columns" :data="userList"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
    import {
        getRoom
    } from '@/api/room'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class HomeOwner extends Vue {
        columns = [{
                title: '楼号',
                key: 'building',
                filters: [],
                filterMultiple: false,
                filterMethod(value, row) {
                    return row.building == value
                }
            },
            {
                title: '房间号',
                key: 'room_num'
            },
            {
                title: '业主',
                key: 'name',
                render: (h, params) => {
                    return params.row.name ? h('div', params.row.name) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                }
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
            }
        ];
        userList = [];
        spinShow = true;
        show(index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
            })
        };
        remove(index) {
            this.data6.splice(index, 1);
        }
        async fetchData() {
            const res = await getRoom()
            this.roomList = res.data.data
            this.columns[0].filters = res.data.data.reduce((total, curr) => {
                return total.find(item => curr.building == item.label) ? total : [...total, {label: curr.building, value: curr.building}]
            }, [])
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
    margin: 50px auto
}
</style>