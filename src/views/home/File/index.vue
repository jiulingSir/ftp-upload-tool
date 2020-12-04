<template>
  <div class="file">
    
    <div class="file-area" @contextmenu="rightClick" data-target-type="container">
      <!-- 右键菜单 -->
      <vue-context-menu :context-menu-data="contextMenuData"
                        @upload="upload"
                        @uploadDir="uploadDir"></vue-context-menu>
    </div>

    <!-- 上传文件夹 -->
    <upload-dir ref="uploadDir"></upload-dir>
    <!-- 上传文件 -->
    <upload-file ref="uploadFile"></upload-file>
  </div>
</template>

<script>
import UploadFile from './Upload'
import UploadDir from './UploadDir'
import api from '../../../axios.js'

// 右键菜单
import VueContextMenu from '@/components/Contextmenu'
export default {
  components: {
    VueContextMenu,
    UploadFile,
    UploadDir
  },
  data () {
    return {
      // contextmenu data (菜单数据)
      contextMenuData: {
        // the contextmenu name(@1.4.1 updated)
        menuName: 'demo',
        // The coordinates of the display(菜单显示的位置)
        axis: {
          x: null,
          y: null
        },
        // Menu options (菜单选项)
        menuList: [
          // {
          //   fnHandler: 'copy', // Binding events(绑定事件)
          //   icoName: 'el-icon-delete', // icon (icon图标 )
          //   btnName: '复制' // The name of the menu option (菜单名称)
          // }
        ]
      },
      dialogVisibleRename: false,
      formRename: {
        id: '',
        name: '',
        oldName: '',
        type: ''
      }
    }
  },
  mounted () {
      this.userList();
  },
  computed: {
    selectedList: {
      get () {
        return this.$store.state.selectedList
      },
      set (selectedList) {
        this.$store.dispatch('setSelectedList', selectedList)
      }
    },
    itemList: {
      get () {
        return this.$store.state.fastdfs.itemList
      }
    },
    currentDir: {
      get () {
        return this.$store.state.fastdfs.currentDir
      }
    }
  },
  methods: {
    userList () {
        api.userList()
            .then(({ data }) => {
                console.log(data);
            })
    },

    upload () {
      this.$refs.uploadFile.upload()
    },
    uploadDir () {
      this.$refs.uploadDir.upload()
    },
    
    // 右键事件
    rightClick (event) {
      event.preventDefault()
      // 当前右键点击的item，可能是某文件夹或文件，也可能是空白位置，根据item不同可进行的操作不同
      let targetItem = null
      function getFtpItem (target) {
        if (target.dataset.targetType) {
          targetItem = target
        } else {
          getFtpItem(target.parentElement)
        }
      }
      getFtpItem(event.target)
      if (!targetItem) return
      let targetType = targetItem.dataset.targetType // 目标类型：目标或空白区域
      let itemType = targetItem.dataset.itemType // 文件类型：文件或文件夹
      let itemId = targetItem.dataset.itemId
      let contextListCalc = []
      this.contextMenuData.menuList = []
      switch (targetType) {
        case 'item':
          // 判断item是否已经被选中
          let indexInSelected = this.selectedList.findIndex(item => {
            return item.id === itemId
          })
          if (indexInSelected >= 0) {
            // item已被选中
            if (this.selectedList.length === 1) {
              // 只选中1项时
              contextListCalc.push('del')
              contextListCalc.push('move')
              if (itemType === 'dir') contextListCalc.push('rename')
              if (itemType === 'file') contextListCalc.push('download')
            } else {
              // 选中多项
              contextListCalc.push('del')
              contextListCalc.push('move')
            }
          } else {
            // item未被选中，清除其余被选中项，选中此item
            this.selectedList = []
            let indexData = this.itemList.findIndex(item => {
              return item.id === itemId
            })
            if (indexData >= 0) this.selectedList.push(this.itemList[indexData])
            // 允许删除、重命名、移动文件，下载
            contextListCalc.push('del')
            contextListCalc.push('move')
            if (itemType === 'dir') contextListCalc.push('rename')
            if (itemType === 'file') contextListCalc.push('download')
          }
          break
        case 'container':
          // 右键点击空白位置，清掉其余被选中项，允许上传文件，新建文件夹操作
          this.selectedList = []
          contextListCalc.push('refresh')
          contextListCalc.push('upload')
          contextListCalc.push('uploadDir')
          break
        default:
          break
      }
      if (contextListCalc.includes('del')) { this.contextMenuData.menuList.push({ fnHandler: 'del', icoName: 'el-icon-delete', btnName: '删除' }) }
      if (contextListCalc.includes('rename')) { this.contextMenuData.menuList.push({ fnHandler: 'rename', icoName: 'el-icon-edit-outline', btnName: '重命名' }) }
      if (contextListCalc.includes('move')) { this.contextMenuData.menuList.push({ fnHandler: 'move', icoName: 'el-icon-receiving', btnName: '移动' }) }
      if (contextListCalc.includes('upload')) { this.contextMenuData.menuList.push({ fnHandler: 'upload', icoName: 'el-icon-upload2', btnName: '上传文件' }) }
      if (contextListCalc.includes('uploadDir')) { this.contextMenuData.menuList.push({ fnHandler: 'uploadDir', icoName: 'el-icon-upload', btnName: '上传文件夹' }) }
      // 设置右键菜单位置
      let x = event.clientX
      let y = event.clientY
      this.contextMenuData.axis = {
        x, y
      }
    }
  }
}
</script>
<style scoped>
  .file {
    width: 100%;
    height: 100%;
  }

  .file-area {
      width: 100%;
      height: 100%;
  }
</style>

