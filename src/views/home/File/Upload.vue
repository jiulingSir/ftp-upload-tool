<template>
  <div class="upload">
    <!-- 上传文件 -->
    <el-dialog title="上传文件" :visible.sync="dialogVisibleUpload" width="480px" append-to-body>
      <div class="dialog-content">
        <el-upload
          class="upload-file"
          drag
          action="/api/upload"
          :http-request="uploadFile"
          accept="webkitdirectory"
          :file-list="fileList">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传不超过 <b>500M</b> 的文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../axios.js'
export default {
  components: {
  },
  data () {
    return {
      dialogVisibleUpload: false,
      fileList: []
    }
  },
  computed: {
    currentDir: {
      get () {
        return this.$store.state.currentDir
      }
    }
  },
  mounted () {
  },
  methods: {
    upload () {
        this.dialogVisibleUpload = true
    },
    
    uploadFile (file) {
        var form = new FormData();
        form.append("file", file.file);
        form.append("userName", this.$store.state.username);

        api.userUpload(form)
            .then(({ data }) => {
                console.log(data);
            })
    }
  }
}
</script>
<style>
  .el-dialog__title {
      float: left;
      font-weight: normal;
      line-height: 24px;
      font-size: 18px;
      color: #303133;
  }
</style>

