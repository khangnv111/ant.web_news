<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="Từ khóa">
                <a-input v-model="queryParam.id" placeholder="Nhập từ khóa"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="Thời gian">
                <a-range-picker v-model="queryParam.dateRange" @change="onChangeDate" format="YYYY/MM/DD"/>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="Trạng thái">
                <a-select style="width: 100%" v-model="queryParam.status" @change="onChange">
                  <a-select-option :value="-1">Tất cả</a-select-option>
                  <a-select-option :value="1">Chờ duyệt</a-select-option>
                  <a-select-option :value="2">Đã duyệt</a-select-option>
                  <a-select-option :value="3">Đã hạ</a-select-option>
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
          :row-key="record => record.stt"
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
            <a-button @click="handleEdit(record)">Sửa</a-button>
            <a-divider type="vertical" />
            <a-button type="danger" @click="handleDelete(record)">Delete</a-button>
            <!--            <router-link-->
            <!--              :to="{ name: 'articleInsert', params: { user: record.articleID } }"-->
            <!--            >Edit </router-link>-->
          </span>
        </a-table>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { getArticleList, articleDel } from '@/api/article'

  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      scopedSlots: { customRender: 'stt' }
    },
    {
      dataIndex: 'image',
      title: 'Avatar',
      scopedSlots: { customRender: 'image' }
    },
    {
      title: 'Title',
      dataIndex: 'title'
    },
    {
      title: 'View',
      dataIndex: 'countView',
      scopedSlots: { customRender: 'countView' }
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
    name: 'ArticleList',
    data () {
      return {
        data: {},
        queryParam: {
          page: 1,
          pageSize: 10000
        },
        loading: false,
        columns: columns,
        dataColumn: []
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      },
      statusColorFilter (type) {
        return statusMap[type].color
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.data.page = 1
        this.queryParam.status = -1
        this.Search()
      },
      onChange () {
        this.$forceUpdate()
        this.Search()
      },
      onChangeDate (date, dateString) {
        console.log(date, dateString)
        // console.log(this.queryParam.dateRange)
        this.queryParam.fromDate = dateString[0]
        this.queryParam.toDate = dateString[1]
      },
      // --------------
      Search () {
        this.loading = true
        // if (this.queryParam.status === 4) {
        //   this.queryParam.isHot = 1
        // }
        getArticleList(this.queryParam).then(ress => {
          this.loading = false
          console.log('list: ', ress)
          this.dataColumn = ress.items
        })
      },
      handleTableChange (pagination) {
        console.log('page: ', pagination)
        this.data.page = pagination.current
        this.$forceUpdate()
      },
      // --------------
      handleEdit (record) {
        this.$router.push({ path: '/article/insert-update', query: { id: record.articleID } })
      },
      handleDelete (record) {
        var _this = this
        this.$confirm({
          title: 'Bạn có chắc thực hiện thao tác này?',
          content: 'Click Ok để tiếp tục, click Cancel để bỏ',
          onOk () {
            _this.confỉmDelete(record.articleID)
          },
          onCancel () {}
        })
      },
      confỉmDelete (id) {
        var dataQuery = {
          status: 4,
          articleID: id
        }

        articleDel(dataQuery).then(ress => {
          this.$message.success(ress)
          this.Search()
        }).catch(err => {
          this.$message.error(err)
        })
      }
    }
  }
</script>
