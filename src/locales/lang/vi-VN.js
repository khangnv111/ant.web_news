import antdViVN from 'ant-design-vue/es/locale-provider/vi_VN'
import momentVN from 'moment/locale/vi'
import global from './en-US/global'

import menu from './en-US/menu'
import setting from './en-US/setting'
import user from './en-US/user'

import dashboard from './en-US/dashboard'
import form from './en-US/form'
import result from './en-US/result'
import account from './en-US/account'

const components = {
  antLocale: antdViVN,
  momentName: 'vi',
  momentLocale: momentVN
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Are you sure you would like to logout?',
  'layouts.userLayout.title': 'Ant Design is the most influential web design specification in Xihu district',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account
}
