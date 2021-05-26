<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="Vị trí">
                <a-select style="width: 100%" v-model="queryParam.position" @change="onChange">
                  <a-select-option :value="0">Tất cả</a-select-option>
                  <a-select-option v-for="item in posAdv" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="Loại quảng cáo">
                <a-select style="width: 100%" v-model="queryParam.type" @change="onChange">
                  <a-select-option :value="0">Tất cả</a-select-option>
                  <a-select-option :value="1">Ảnh</a-select-option>
                  <a-select-option :value="2">Script</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="Trạng thái">
                <a-select style="width: 100%" v-model="queryParam.status" @change="onChange">
                  <a-select-option :value="-1">Tất cả</a-select-option>
                  <a-select-option :value="0">Tạm dừng</a-select-option>
                  <a-select-option :value="1">Hoạt động</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-button type="primary" @click="Search">Tìm kiếm</a-button>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          :columns="columns"
          :data-source="dataColumn"
          :loading="loading"
          :row-key="record => record.id"
          :bordered="true"
          @change="handleTableChange"
        >
          <template slot="stt" slot-scope="text, record, index">{{ (data.page - 1) * 10 + index + 1 }}</template>
          <template slot="image" slot-scope="text, record">
            <img :src="record.image" style="max-width: 100px; max-height: 100px">
          </template>
          <template slot="countView" slot-scope="text">{{ text | NumberFormat }}</template>
          <span slot="status" slot-scope="text">
            <a-tag :color="text | statusColorFilter">{{ text | statusFilter }}</a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button v-show="record.status != 2 && record.status != 4" type="primary" @click="handleChangeStatus(record, 2)">Duyệt</a-button>
            <a-button v-show="record.status != 1 && record.status != 3 && record.status != 4" type="danger" ghost @click="handleChangeStatus(record, 3)">Hạ</a-button>
            <a-divider type="vertical" />
            <a-button @click="handleEdit(record)">Sửa</a-button>
            <a-divider type="vertical" />
            <a-button type="danger" @click="handleChangeStatus(record, 4)">Delete</a-button>
          </span>
        </a-table>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { getAdvertPostList, getAdvertList } from '@/api/advert'
  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      scopedSlots: { customRender: 'stt' }
    },
    {
      dataIndex: 'name',
      title: 'Tên',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: 'Loại',
      dataIndex: 'type'
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      scopedSlots: { customRender: 'position' }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' }
    },
    {
      title: 'Action',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const statusMap = {
    1: {
      text: 'Chờ duyệt',
      status: 'processing',
      color: 'blue'
    },
    2: {
      status: 'success',
      text: 'Đã duyệt',
      color: '#87d068'
    },
    3: {
      status: 'error',
      text: 'Đã hạ',
      color: 'red'
    }
  }
  export default {
    name: 'AdvertList',
    data () {
      return {
        statusMap,
        data: {},
        queryParam: {
          page: 1,
          pageSize: 10000
        },
        loading: false,
        columns: columns,
        dataColumn: [],
        posAdv: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.queryParam.position = 0
        this.queryParam.type = 0
        this.queryParam.status = -1
        this.loadAdPosition()
        this.Search()
      },
      loadAdPosition () {
        getAdvertPostList().then(ress => {
          console.log(ress)
          this.posAdv = ress.items
        })
      },
      onChange () {
        this.$forceUpdate()
      },
      handleTableChange (pagination) {
        console.log('page: ', pagination)
        this.data.page = pagination.current
        this.$forceUpdate()
      },
      Search () {
        this.loading = true
        getAdvertList(this.queryParam).then(ress => {
          this.loading = false
          console.log('list: ', ress)
          this.dataColumn = ress.items
        })
      }
    }
  }
</script>
