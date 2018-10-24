<template>
    <div>

        <div class="wrap">
            <Input v-model="searchWord" style="margin-bottom: 20px;width: 50%" search enter-button placeholder="请输入关键词"
                @on-search="search" />
            <Table class="table" border :columns="columns" :data="userList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>

        <Modal v-model="showCarouselModel" title="报修照片" :footer-hide="true">
            <Carousel style="width: 488px" :height="450">
                <CarouselItem class="carousel" v-for="(item, index) in photos" :key="index">
                    <img :src="item" alt="">
                </CarouselItem>
            </Carousel>

        </Modal>

        <Modal v-model="showPartModel" title="报价" :footer-hide="true" @on-visible-change="visibleChange">
            <Form ref="Form" :model="form" :rules="rules" @keydown.enter.native="submit" :label-width="100">
                <FormItem prop="price" label="报价">
                    <Input type="text" v-model="form.price" placeholder="请输入报价">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="id" label="id">
                    <Input type="text" v-model="form.id" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="status" label="状态">
                    <Input type="text" v-model="form.status" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="showPartModel = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>


    </div>
</template>
<script>
    import moment from 'moment'
    import {
        getRepair,
        changeRepair
    } from '@/api/repair'
    import {
        getPart,
    } from '@/api/part'
    import {
        getPartType,
    } from '@/api/partType'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Repair extends Vue {
        statusMap = [{
            value: 0,
            label: '已撤消',
            color: '#c5c8ce',
            icon: "md-remove-circle"
        }, {
            value: 1,
            label: '已报修',
            color: '#5cadff',
            icon: "md-alert"
        }, {
            value: 2,
            label: '已联系',
            color: '#2d8cf0',
            icon: "ios-clipboard-outline"
        }, {
            value: 3,
            label: '已派修',
            color: '#2db7f5',
            icon: "ios-navigate"
        }, {
            value: 4,
            label: '已维修',
            color: '#ed4014',
            icon: "ios-hammer"
        }, {
            value: 5,
            label: '已缴费',
            color: '#19be6b',
            icon: "ios-checkmark-circle"
        }];
        columns = [{
                title: '报修编号',
                key: 'id',
                width: 100,
                fixed: 'left'
            },{
                title: '标题',
                key: 'title',
                width: 150,
                fixed: 'left'
            },
            {
                title: '状态',
                key: 'status',
                width: 100,
                render: (h, params) => {
                    return h('div', [h('Icon', {
                        props: {
                            type: this.statusMap.find(item => params.row.status == item.value).icon,
                            color: this.statusMap.find(item => params.row.status == item.value)
                                .color
                        },
                    }), h('span', {},
                        `  ${this.statusMap.find(item => params.row.status == item.value)
                        .label}`
                    )])
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
                width: 120,
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
                width: 150,
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
                width: 150,
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
                width: 150,
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
                title: '价格',
                key: 'price',
                width: 100,
                render: (h, params) => {
                    return params.row.price ? h('div', params.row.price) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                },
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
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
                                    this.showCarousel(params.row)
                                }
                            }
                        }, '图片'),
                        params.row.status >= 4 || params.row.status == 0 ? h('Button', {
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
        form = {
            id: '',
            price: '',
            status: ''
        }
        rules = {
            price: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入报价'));
                    } else if (!(value >= 0)) {
                        callback(new Error('价格须为非负数!'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }],
        }
        page = 0;
        total = 2;
        searchWord = ''
        userList = [];
        spinShow = true;
        showCarouselModel = false;
        showPartModel = false;
        photos = [];
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        showCarousel(row) {
            if (row.photos) {
                this.photos = JSON.parse(row.photos)
                this.showCarouselModel = true
            } else {
                this.photos = []
                this.$Message.warning('此报修未上传照片！');
            }

        }

        submit() {
            var vm = this
            console.log(JSON.stringify(this.form))
            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    await vm.updataRepair(vm.form)
                    this.showPartModel = false
                    this.fetchData()
                }
            })
        }

        visibleChange(status) {
            if (!status) {
                this.$refs['Form'].resetFields()
            }
        }

        async changeStatus(row) {
            if (row.status < 3) {
                let data = {
                    id: row.id,
                    status: row.status + 1,
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要将此条报修进行至下一步？',
                    onOk: async () => {
                        await this.updataRepair(data)
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
            } else {
                this.showPartModel = true
                this.form.id = row.id
                this.form.status = row.status + 1
                console.log(JSON.stringify(this.form))
            }
        }

        async updataRepair(data) {
            let res = await changeRepair(data)
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
            this.fetchData()
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
        margin: 30px auto;


    }

    .carousel {
        width: 488px;
        text-align: center;

        img {
            max-width: 100%;
        }
    }
</style>