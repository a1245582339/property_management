<template>
    <div>
        <div class="wrap">
            <Button type="primary" @click="Modal = true" size="large">新增</Button>
            <Table class="table" border :columns="columns" :data="partList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>


        <Modal v-model="Modal" title="编辑" @on-visible-change="visibleChange" :footer-hide="true">
            <Form ref="Form" :model="form" :rules="rules" @keydown.enter.native="submit" :label-width="80"
                label-position="left">
                <FormItem prop="part_name" label="零件名称">
                    <Input type="text" v-model="form.part_name" placeholder="请输入新的零件名称">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-build" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="type_id" label="零件类型">
                    <Select v-model="form.type_id" style="width:200px">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="price" label="单价（元）">
                    <Input type="text" v-model="form.price" placeholder="请输入单价">
                    <span slot="prepend">
                        <Icon :size="14" type="logo-yen" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="count" label="剩余库存">
                    <Input type="text" v-model="form.count" placeholder="请输入剩余库存">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-cube" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="id" label="零件id">
                    <Input type="text" v-model="form.id" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="Modal = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="showSell" title="出库" @on-visible-change="sellvisibleChange" :footer-hide="true">
            <Form ref="SellForm" :model="sellForm" :rules="sellRules" @keydown.enter.native="sellSubmit" :label-width="80"
                label-position="left">
                <FormItem prop="title" label="报修标题">
                    <Select v-model="sellForm.title" filterable remote :remote-method="selectRepairTitle" :loading="searchLoading">
                        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="count" label="出库量">
                    <Input type="text" v-model="sellForm.count" placeholder="请输入剩余库存">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-cube" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="part_id" label="零件id">
                    <Input type="text" v-model="sellForm.part_id" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="Modal = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="sellSubmit">确认</Button>
                </FormItem>
            </Form>
        </Modal>

    </div>

</template>
<script>
    import {
        getPart,    // 获取零件
        updatePart  // 更新零件
    } from '@/api/part'
    import {
        getPartType,    // 获取零件类型
    } from '@/api/partType'
    import {
        getRepair,  // 获取报修信息
    } from '@/api/repair'
    import {
        getOrder,   // 获取订单
        updateOrder // 更新订单
    } from '@/api/order'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Part extends Vue {
        columns = [{
                title: '零件名称',
                key: 'part_name'
            }, {
                title: '单价（元）',
                key: 'price',
                sortable: true
            }, {
                title: '零件类型',
                key: 'type_name',
                filters: [],
                filterMethod(value, row) {
                    return row.type_id == value // 把零件类型的码值变成字
                }
            }, {
                title: '剩余数量',
                key: 'count',
                sortable: true  // 可根据数量排序
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            on: {
                                click: () => {
                                    if (params.row.count) { // 点击出库时，如果剩余量大于0
                                        this.sell(params.row)      // 调用出库的方法
                                    } else {    // 若不大于零
                                        this.$Message.warning('库存为0，不可出库！')    // 提示
                                    }
                                }
                            }
                        }, '出库'),
                        h('span', ' '),
                        h('Button', {
                            props: {
                                type: 'primary',
                            },
                            on: {
                                click: () => {
                                    this.edit(params.row)   // 点击编辑，调用编辑这一行的方法
                                }
                            }
                        }, '编辑'),
                        h('span', ' '),
                        h('Button', {
                            props: {
                                type: 'error',
                            },
                            on: {
                                click: () => {
                                    this.del(params.row) // 点击删除，调用删除这一行的方法
                                }
                            }
                        }, '删除'),
                    ]);
                }
            }
        ];
        page = 0;
        total = 2;
        partList = [];  // 零件列表
        typeList = [];  // 零件类型列表
        spinShow = true;    // loading状态
        Modal = false;  // 编辑框状态
        showSell = false;   // 出库框状态
        form = {};  // 编辑的表单内容
        sellRules = {   // 出库表单的校验
            title: [{   // 报修标题
                validator: (rule, value, callback) => {
                    console.log(value)
                    if (value) {    // 如何报修标题存在
                        callback(); // 正常返回
                    } else {    // 如果标题为空
                        callback(new Error('请选择报修标题！'));    // 提示错误
                    }
                },
                trigger: 'blur'     // 输入框数去焦点时检验
            }],
            count: [{   // 出库数量
                validator: (rule, value, callback) => {
                    if (value === '') {     // 如果数量是空的
                        callback(new Error('请输入出库量'));
                    } else if (!Number.isInteger(value - 0)) {  // 如果数量不是正整数
                        callback(new Error('库存须为正整数！'));
                    } else {    // 如果通过验证
                        callback();
                    }
                },
                trigger: 'blur'
            }]
        };
        sellForm = {       // 出库的表单内容

        };
        searchLoading = false;  // 搜索订单时的
        options = []    // 搜索时结果的数组放到这里，作为下拉框的选项
        rules = {   // 新增或修改零件时的表单验证
            part_name: [{   //零件名称校验
                required: true,
                message: '请输入零件名称！',
                trigger: 'blur'
            }],
            type_id: [{     // 选择类型校验
                message: '请选择零件类型！',
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('请选择类型'));
                    } else {
                        callback();
                    }
                },
                trigger: 'change'
            }],
            price: [{   // 单价校验
                validator: (rule, value, callback) => {
                    if (value == '') {
                        callback(new Error('请输入单价'));
                    } else if (!(value > 0)) {  // 必须为正数
                        callback(new Error('单价须为正数!'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }],
            count: [{   //库存数量校验
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入库存'));
                    } else if (!Number.isInteger(value - 0) || value < 0) {
                        callback(new Error('库存须为非负整数！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }]
        }

        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }

        edit(row) { // 点击编辑按钮时调用的方法，参数为当前这一行的数据，这个方法的目的是把这一行的数据在模态框中能显示出来
            if (row.id) {      // 如果有id（这句其实是废话，肯定有id）
                this.form.id = row.id   // id赋值
            }
            this.form.part_name = row.part_name // 名称赋值
            this.form.price = row.price //单价
            this.form.count = row.count // 库存
            this.form.type_id = row.type_id // 类型
            this.Modal = true   // 这时把模态框打开
        }
        del(row) {  // 点击删除时调用的方法
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定删除“${row.part_name}”？`)
                },
                onOk: () => {   // 点击删除按钮时
                    updatePart({    // 调用更新part方法
                        id: row.id,     // 要删的id
                        isDel: 1    // 删除状态设置为1
                    }).then(res => {
                        this.$Message.success('删除成功');
                        this.page = 0
                        this.fetchData()
                    })

                }
            })
        }
        sell(row) { // 点击出库时调用的方法
            this.sellForm.part_id = row.id; // 要出库的id设置为这一行的id
            this.sellForm.count = '';   // 出库数量为空
            this.showSell = true    // 显示出库模态框
        }
        submit() {  // 提交新建/更新零件的表单
            var vm = this
            this.$refs['Form'].validate(async (valid) => {  // 验证表单是否通过
                if (valid) {    // 如果通过验证通过
                    this.$Message.success((await updatePart(vm.form)).data.msg) // 弹出成功提示
                    this.Modal = false  // 关闭弹框
                    this.fetchData()    // 重新获取数据
                }
            })
        }
        sellSubmit() {  // 出库的提交方法
            var vm = this
            this.$refs['SellForm'].validate(async (valid) => {  // 出库表单的验证
                if (valid) {    // 如果通过验证
                    var data = {
                        repair_id: vm.sellForm.title,
                        part_id: vm.sellForm.part_id,
                        count: vm.sellForm.count
                    }
                    var res = await updateOrder(data)   // 发送请求，创建一个订单
                    if (res.data.code == 20000) {   // 如果返回值是20000
                        this.$Message.success(res.data.msg) // 提示成功
                        this.showSell = false   // 关闭弹框
                        this.fetchData()    // 重新获取数据
                    } else {
                        
                    }
                }
            })
        }
        visibleChange(status) {
            if (!status) {
                this.$refs['Form'].resetFields() // 编辑表单关闭时清空这个表单
            }

        }
        sellvisibleChange(status) {
            if (!status) {
                this.$refs['SellForm'].resetFields()    // 出库表单关闭时清空
            }

        }
        async fetchData() { // 获取数据
            const res = await getPart({ // 获取零件
                page: this.page // 当前页码
            })
            this.partList = res.data.data   // 获取到的数据赋值给零件数据
            this.total = res.data.total     // 数据总量
            setTimeout(() => {
                this.spinShow = false   // 关闭loading
            }, 100)

        };
        async selectRepairTitle(query) {    // 输入关键字查询保修的方法
            this.options = (await getRepair({title: query})).data.data.map(item => {
                return {
                    value: item.id,
                    label: `${item.title}（${item.id}）`
                }   // 获取到报修信息后，返回value与label的格式的数据供下拉选择器使用
            })
        }

        async created() {   // 一进入页面就执行的方法
            this.typeList = (await getPartType()).data.data.map(item => {   // 获取零件类型
                return {      
                    value: item.id,
                    label: item.type_name
                }
            })
            this.columns.find(item => item.key == 'type_name').filters = [...this.typeList] // 把零件数据中的码值对应成类型的文字
            this.fetchData()    // 获取零件数据
        }
    }
</script>
<style lang="scss" scoped>
    .wrap {
        position: relative;
        width: 95%;
        margin: 30px auto;
        .table {
            margin-top: 20px;
        }
    }
</style>