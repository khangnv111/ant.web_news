<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
              <a-form-item label="Tên chiến dịch">
                <a-input v-model="queryParam.eventName" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
              <a-form-item
                label="Khoảng thời gian">
                <a-range-picker
                  v-model="queryParam.dateRange"
                  style="width: 100%"
                  v-decorator="[
              'Từ ngày đến ngày',
              {rules: [{ required: true, message: 'Vui lòng chọn ngày'}]}
            ]" />
              </a-form-item>
            </a-col>

            <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">Search</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">Reset</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

<!--      <div class="table-operator">-->
<!--        <a-button type="primary" icon="plus" @click="handleAdd">Thêm mới</a-button>-->
<!--        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">-->
<!--          <a-menu slot="overlay">-->
<!--            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>-->
<!--            &lt;!&ndash; lock | unlock &ndash;&gt;-->
<!--            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>-->
<!--          </a-menu>-->
<!--          <a-button style="margin-left: 8px">-->
<!--            批量操作 <a-icon type="down" />-->
<!--          </a-button>-->
<!--        </a-dropdown>-->
<!--      </div>-->

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
<!--        <span slot="status" slot-scope="text">-->
<!--          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
<!--        </span>-->
<!--        <span slot="description" slot-scope="text">-->
<!--          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>-->
<!--        </span>-->

<!--        <span slot="action" slot-scope="text, record">-->
<!--          <template>-->
<!--            <a @click="handleEdit(record)">配置</a>-->
<!--            <a-divider type="vertical" />-->
<!--            <a @click="handleSub(record)">订阅报警</a>-->
<!--          </template>-->
<!--        </span>-->
      </s-table>

<!--      <create-form-->
<!--        ref="createModal"-->
<!--        :visible="visible"-->
<!--        :loading="confirmLoading"-->
<!--        :model="mdl"-->
<!--        @cancel="handleCancel"-->
<!--        @ok="handleOk"-->
<!--      />-->
<!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getCampainList } from '@/api/van_hanh/van_hanh'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CreateForm'
import moment from 'moment'
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: 'Tên chiến dịch',
    dataIndex: 'eventName'
  },
  {
    title: 'Tên tài khoản chiến dịch',
    dataIndex: 'accountName',
    scopedSlots: { customRender: 'accountName' }
  },
  {
    title: 'Thời gian tạo ',
    dataIndex: 'createTime'
    // sorter: true,
    // needTotal: true,
    // customRender: (text) => text + ' 次'
  },
  {
    title: 'Chi phí chiến dịch',
    dataIndex: 'eventValue'
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: 'Tiền thu hồi',
    dataIndex: 'amountRestore'
    // sorter: true
  },
  {
    title: 'Số tiền',
    dataIndex: 'Money'
    // width: '150px',
    // scopedSlots: { customRender: 'action' }
  },
  {
    title: 'Số tiền đã dùng',
    dataIndex: 'moneyUsed'
    // sorter: true
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
    // sorter: true
    width: '150px'
  }
]
  export default {
    name: 'CampainList',
    components: {
      STable,
      Ellipsis
      // CreateForm,
      // StepByStepModal
    },
    data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {
          page: 1,
          pageSize: 100
        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          // return getCampainList(requestParameters)
          //   .then(res => {
          //     console.log('campain list: ', res)
          //     // return res.result
          //   })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      // statusFilter (type) {
      //   return statusMap[type].text
      // },
      // statusTypeFilter (type) {
      //   return statusMap[type].status
      // }
    },
    created () {
      // getRoleList({ t: new Date() })
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      handleAdd () {
        this.mdl = null
        this.visible = true
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            if (values.id > 0) {
              // 修改 e.g.
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('修改成功')
              })
            } else {
              // 新增
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('新增成功')
              })
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
