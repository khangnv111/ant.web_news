<template>
  <page-header-wrapper>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin :spinning="loading">
        <a-form>
          <a-form-item
            label="Tên quảng cáo"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
            <a-input
              v-model="data.name"
              name="name"
              placeholder="Nhập tên quảng cáo" />
          </a-form-item>
          <a-form-item
            label="Loại quảng cáo"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
            <a-select style="width: 100%" v-model="data.type" @change="onChangeType">
              <a-select-option :value="1">Ảnh</a-select-option>
              <a-select-option :value="2">Script</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            v-show="data.type == 1"
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
            v-show="data.type == 1"
            label="Link liên kết"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
            <a-input v-model="data.link" placeholder="Nhập link liên kết"></a-input>
          </a-form-item>

          <a-form-item
            v-show="data.type == 2"
            label="Script"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 12}, sm: {span: 17} }">
            <a-textarea
              rows="5"
              placeholder="Nhập mã Script"
              v-model="data.scriptData"
            />
          </a-form-item>

          <a-form-item
            label="Vị trí quảng cáo"
            :labelCol="{lg: {span: 4}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }">
            <a-select style="width: 100%" v-model="data.position" placeholder="Chọn vị trí quảng cáo">
              <a-select-option v-for="item in posAdv" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
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
  import { getAdvertPostList, insertAdvert } from '@/api/advert'
  export default {
    name: 'AdvertInsert',
    data () {
      return {
        loading: false,
        menuList: [],
        data: {},
        fileUpload: null,
        editorDetailConfig: {
          height: 600
        },
        editorBottomConfig: {},
        posAdv: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.data.type = 1
        this.loadAdPosition()
      },
      loadAdPosition () {
        getAdvertPostList().then(ress => {
          console.log(ress)
          this.posAdv = ress.items
        })
      },
      onChangeType () {
        this.fileUpload = null
        this.data.image = null

        this.$forceUpdate()
      },
      beforeUploadImage (file) {
        if (!file) {
          return false
        }
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
      handleSubmit (e) {
        e.preventDefault()
        console.log('submit.......', this.data)
        console.log('fileUpload: ', this.fileUpload)

        if (!this.data.name || !this.data.position || !this.fileUpload) {
          this.$message.error('Cần điền đầy đủ thông tin', 3)
          return false
        }

        const formData = new FormData()
        for (var key in this.data) {
          formData.append(key, this.data[key])
        }
        if (this.fileUpload) {
          formData.append('fileUpload', this.fileUpload, this.fileUpload.name)
          this.data.fileName = this.fileUpload.name
        }

        insertAdvert(formData).then(ress => {
          this.loading = false
          console.log('ress: ', ress)
          this.$message.success(ress)
          this.data = {}
          this.fileUpload = null
          // this.$router.push({ name: 'advertList' })
        }).catch(err => {
          this.loading = false
          console.log('err...', err.message, ' ', err.response)
        })
      }
    }
  }
</script>
