<template>
  <page-header-wrapper>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin :spinning="loading">
        <a-form>
          <a-form-item
            label="Tiêu đề"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
            <a-input
              v-model="data.title"
              name="name"
              placeholder="Nhập tiêu đề" />
          </a-form-item>
          <a-form-item
            label="Chuyên mục"
            placeholder="Chọn chuyên mục"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
            <a-select
              v-model="data.menuID"
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
              :before-upload="beforeUploadImage"
            >
              <a-button> <a-icon type="upload" /> Click to Upload </a-button>
            </a-upload>
            <div v-if="data.image">
              <img :src="data.image" style="max-height: 100px; max-width: 100px"/>
            </div>
          </a-form-item>
          <a-form-item
            label="Mô tả"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
            <a-textarea
              rows="4"
              placeholder="Nhập mô tả"
              v-model="data.description"
            />
          </a-form-item>
          <a-form-item
            label="Nội dung"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 15}, sm: {span: 17} }">
            <ckeditor
              :config="editorDetailConfig"
              v-model="data.detail"
            ></ckeditor>
          </a-form-item>
          <a-form-item
            label="Ghi chú"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 15}, sm: {span: 17} }">
            <ckeditor
              :config="editorBottomConfig"
              v-model="data.bottomDesc"
            ></ckeditor>
          </a-form-item>
          <a-form-item
            label="Ngày đăng"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
            <a-date-picker
              show-time
              placeholder="Select Time"
              v-model="data.date"
              @change="onChangeDate"
              style="width: 100%"/>
          </a-form-item>

          <a-form-item
            label="Tác giả"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
            <a-input
              v-model="data.author"
              placeholder="Nhập tác giả"
            ></a-input>
          </a-form-item>

          <a-form-item
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
            style="text-align: center"
          >
            <a-button htmlType="submit" type="primary" @click="handleSubmit">Lưu thông tin</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { getBase64, getValueParamUrl } from '@/utils/util'
  import { getMenuList, articleInsert, getArticleList } from '@/api/article'

  export default {
    name: 'ArticleInsert',
    data () {
      return {
        // form: this.$form.createForm(this),
        loading: false,
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
        var id = getValueParamUrl('id')
        if (id) {
          this.loadDetail(id)
        }
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
      loadDetail (id) {
        const queryDetail = {
          articleID: id,
          page: 1,
          pageSize: 10
        }
        this.loading = true
        getArticleList(queryDetail).then(ress => {
          this.loading = false
          console.log('getArticleList: ', ress)
          this.data = ress.items[0]

          var date = new Date(this.data.publishDate)
          var publishDate = moment(date)
          this.data.date = publishDate
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
          this.data.image = reader.result
          this.$forceUpdate()
        }

        return false
      },
      // --------------
      onChangeDate (value, dateString) {
        console.log('Selected Time: ', value)
        console.log('Formatted Selected Time: ', dateString)
      },
      handleSubmit (e) {
        e.preventDefault()
        console.log('submit.......')
        console.log('fileUpload: ', this.fileUpload)

        this.data.publishDate = this.data.date.format('YYYY-MM-DD HH:mm:ss')
        const formData = new FormData()
        for (var key in this.data) {
          formData.append(key, this.data[key])
        }
        if (this.fileUpload) {
          formData.append('fileUpload', this.fileUpload, this.fileUpload.name)
          this.data.fileName = this.fileUpload.name
        }
        this.loading = true
        articleInsert(formData).then(ress => {
          this.loading = false
          console.log('ress: ', ress)
          this.$message.success(ress)
          this.data = {}
          this.fileUpload = null
          // this.$router.push({ name: 'articleList' })
        }).catch(err => {
          this.loading = false
          console.log('err...', err.message, ' ', err.response)
        })
      }
    }
  }
</script>
