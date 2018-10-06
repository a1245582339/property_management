<template>
    <div>
        <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
            <span v-if="title" style="color: #4991ff" slot="right">提交</span>
        </van-nav-bar>
        <van-cell-group>
            <van-field label="标题" v-model="title" placeholder="请输入报修标题" />

            <van-cell class="vant-cell" title="照片（可选）">
                <span v-if="photo.length == 0" style="float: left; margin-right: 20px;">点击右侧拍照或上传图片</span>
                <div class="photo" v-for="(item, index) in photo" :key="index">
                    <van-icon class="del" color="#ff4444" size="15px" name="clear" @click="delPhoto(index)" />
                    <img :src="item" alt="" @click="preview(index)">
                </div>
                <van-uploader :after-read="onRead" multiple>
                    <van-icon name="photograph" />
                </van-uploader>
            </van-cell>
        </van-cell-group>
    </div>
</template>
<script>
    import {
        ImagePreview
    } from 'vant';
    import {
        uploadImage
    } from '@/api/repair'
    import {
        Component,
        Vue,
    } from 'vue-property-decorator';
    @Component
    export default class CreateRepair extends Vue {
        title = '';
        photo = [];
        photoPath = [];
        onClickLeft() {
            this.$router.push({
                path: '/repair'
            })
        };
        async onClickRight() {
            await this.$store.dispatch('CREATE_REPAIR', {
                title: this.title,
                photos: JSON.stringify(this.photoPath),
                user_id: this.$store.state.user.id
            })
            this.$router.push({
                path: '/repair'
            })
        };
        async onRead(file) {
            if (file.content) {
                this.photo.push(file.content)
            } else {
                this.photo = [...this.photo, ...(file.map(item => item.content))]
            }
            this.photoPath = (await uploadImage(this.photo)).data.data.path
        };
        preview(index) {
            ImagePreview({
                images: this.photo,
                startPosition: index,
                showIndex: true,
                onClose() {
                    // do something
                }
            });
        };
        delPhoto(index) {
            this.photo.splice(index, 1)
        }
    }
</script>
<style lang="scss" scoped>
    .vant-cell /deep/ .van-cell__title {
        max-width: 90px;
    }

    .photo {
        float: left;
        position: relative;
        margin-right: 3px;

        img {
            width: 40px;
            height: 40px;
        }

        .del {
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 0;
            right: 0;
        }

    }
</style>