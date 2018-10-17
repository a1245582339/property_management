<template>
    <div>

        <div class="wrap">
            <Input v-model="searchWord" style="margin-bottom: 20px;width: 50%" search enter-button placeholder="请输入关键词"
                :on-search="search" />
            <Table class="table" border :columns="columns" :data="userList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>

        <Carousel v-model="showCarousel" loop>
        <CarouselItem>
            <div class="demo-carousel">1</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">2</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">3</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">4</div>
        </CarouselItem>
    </Carousel>

    </div>
</template>
<script>
    import moment from 'moment'
    import {
        getRepair,
        changeRepair
    } from '@/api/repair'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Repair extends Vue {
        statusMap = [{
            value: 0,
            label: '已撤消'
        }, {
            value: 1,
            label: '已报修'
        }, {
            value: 2,
            label: '已联系'
        }, {
            value: 3,
            label: '已派修'
        }, {
            value: 4,
            label: '已维修'
        }, {
            value: 5,
            label: '已缴费'
        }];
        columns = [{
                title: '标题',
                key: 'title'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [h('span', {}, this.statusMap.find(item => params.row.status == item.value)
                        .label)])
                },
                filters: this.statusMap,
                filterMethod(value, row) {
                    return row.status == value
                },
                width: 100
            },
            {
                title: '房间',
                key: 'room',
                width: 100
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
                title: '创建时间',
                key: 'create_time',
                render: (h, params) => {
                    return params.row.create_time ? h('div', moment(params.row.create_time - 0).format(
                        'YYYY-MM-DD HH:mm:ss')) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                },
                sortable: true
            },
            {
                title: '派修时间',
                key: 'appointment_time',
                render: (h, params) => {
                    return params.row.appointment_time ? h('div', moment(params.row.appointment_time - 0).format(
                        'YYYY-MM-DD HH:mm:ss')) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                },
                sortable: true
            },
            {
                title: '支付时间',
                key: 'pay_time',
                render: (h, params) => {
                    return params.row.pay_time ? h('div', moment(params.row.pay_time - 0).format(
                        'YYYY-MM-DD HH:mm:ss')) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                },
                sortable: true
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
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.changeStatus(params.row)
                                }
                            }
                        }, 'View'),
                        params.row.status >= 4 ? h('Button', {
                            props: {
                                type: 'text',
                                size: 'small',
                                disabled: true
                            }
                        }, this.statusMap.find(item => item.value == params.row.status).label) :
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.changeStatus(params.row)
                                }
                            }
                        }, this.statusMap.find(item => item.value == params.row.status + 1).label)
                    ]);
                }
            }
        ];
        page = 0;
        total = 2;
        searchWord = ''
        userList = [];
        spinShow = true;
        showCarousel = false;
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        async changeStatus(row) {
            let res = await changeRepair({id: row.id, status: row.status + 1})
            this.$Message.success(res.data.msg);
            this.page = 0
            this.fetchData()
        }
        async fetchData() {
            const res = await getRepair({
                title: this.searchWord,
                page: this.page
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
        search() {

        }
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