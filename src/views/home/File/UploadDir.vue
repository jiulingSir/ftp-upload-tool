<template>
  <div class="create-dir">
    <!-- 上传文件夹 -->
    <el-dialog title="上传文件夹" :visible.sync="dialogVisibleUploadDir" width="480px" append-to-body>
      <div class="dialog-content">
        <div class="el-upload-dragger el-upload-dir"
             @click="uploadDir()">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">上传文件夹</div>
        </div>
        <input class="el-upload__input"
               ref="file"
               type="file"
               @change.stop="handleChange"
               webkitdirectory />
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
      dialogVisibleUploadDir: false
    }
  },
  mounted () {
  },
  methods: {
    upload () {
      this.dialogVisibleUploadDir = true;
    },
    uploadDir () {
      this.$refs.file.click();
    },
    
    handleChange(ev) {
      const files = ev.target.files;

      if (!files) return;
      this.uploadFiles(files);
    },
    
    uploadFiles (file) {
        var form = new FormData();
        form.append("file", file[0]);
        form.append("userName", this.$store.state.username);

        api.uploadDir(form)
            .then(({ data }) => {
                console.log(data);
            })
    },
    uploadDirSubmit () {
    }
  }
}
</script>
<style>
  .el-upload-dir {
    margin: 0 auto;
  }
</style>