<template>
  <page-header-wrapper>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="Tiêu đề"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'title',
              {rules: [{ required: true, message: 'Tiêu đề bài viết không được trống' }]}
            ]"
            name="name"
            placeholder="Nhập tiêu đề" />
        </a-form-item>
        <a-form-item
          label="Chuyên mục"
          placeholder="Chọn chuyên mục"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'menuID',
              {rules: [{ required: true, message: 'Chưa lựa chọn chuyên mục' }]}
            ]"
          >
            <a-select-option
              v-for="item in menuList"
              :key="item.menuID"
              :value="item.menuID"
              v-if="(item.fatherID != 0 || item.menuID == 13) && item.menuID != 16 && item.menuID != 17 && item.menuID != 2"
            >
              {{ item.menuName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Ảnh avatar (360x220)"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
          <a-upload
            name="file"
            :multiple="false"
            :showUploadList="false"
            accept="image/png, image/jpeg"
            v-decorator="[
              'fileImage',
              {rules: [{ required: true, message: 'Chưa chọn ảnh avatar' }]}
            ]"
            :before-upload="beforeUploadImage"
          >
            <a-button> <a-icon type="upload" /> Click to Upload </a-button>
          </a-upload>
          <div v-if="data.imageUrl">
            <img :src="data.imageUrl" style="max-height: 100px; max-width: 100px"/>
          </div>
        </a-form-item>
        <a-form-item
          label="Mô tả"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="Nhập mô tả"
            v-decorator="[
              'description',
              {rules: [{ required: true, message: 'Mô tả không được trống' }]}
            ]" />
        </a-form-item>
        <a-form-item
          label="Nội dung"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 17} }">
          <ckeditor
            :config="editorDetailConfig"
            v-decorator="[
              'detail',
              {rules: [{ required: true, message: 'Nội dung không được trống' }]}
            ]"
          ></ckeditor>
        </a-form-item>
        <a-form-item
          label="Ghi chú"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 17} }">
          <ckeditor
            :config="editorBottomConfig"
            v-decorator="[
              'bottomDesc'
            ]"
          ></ckeditor>
        </a-form-item>
        <a-form-item
          label="Ngày đăng"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
          <a-date-picker
            show-time
            placeholder="Select Time"
            v-decorator="[
              'publishDate',
              {rules: [{ required: true, message: 'Thời gian đăng không được trống' }]}
            ]"
            @change="onChange"
            style="width: 100%"/>
        </a-form-item>

        <a-form-item
          label="Tác giả"
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'author',
              {rules: [{ required: true, message: 'Tác giả không được trống' }]}
            ]"
            placeholder="Nhập tác giả"
          ></a-input>
        </a-form-item>

        <a-form-item
          :labelCol="{lg: {span: 4}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">Lưu thông tin</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { getBase64 } from '@/utils/util'
  import { getMenuList } from '@/api/article'

  export default {
    name: 'ArticleInsert',
    data () {
      return {
        form: this.$form.createForm(this),
        menuList: [],
        data: {},
        fileUpload: null,
        editorDetailConfig: {
          height: 600
        },
        editorBottomConfig: {}
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.loadListMenu()
      },
      loadListMenu () {
        var query = {
          getChild: 1,
          status: -1
        }
        getMenuList(query).then(ress => {
          console.log('menu: ', ress)
          this.menuList = ress.items
        })
      },
      // --------------
      handleChangeImage (info) {
        // console.log('handleChangeImage: ', info)
        debugger
        if (info.file.status === 'uploading') {
          this.loading = true
          return
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => {
            console.log('imageUrl: ', imageUrl)
            this.data.imageUrl = imageUrl
            this.loading = false
          })
        }
      },
      beforeUploadImage (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!')
          return false
        }
        this.fileUpload = file

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.data.imageUrl = reader.result
          this.$forceUpdate()
        }

        return false
      },
      // --------------
      onChange (value, dateString) {
        console.log('Selected Time: ', value)
        console.log('Formatted Selected Time: ', dateString)
      },
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
      }
    }
  }
</script>
