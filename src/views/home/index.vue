<template>
  <div>
    <header class="tools">
      <el-button type="primary" @click="logout()">登出</el-button>
    </header>
    <main class="home">
      <file></file>
    </main>
  </div>
</template>

<script>
import api from '../../axios.js';
import File from './File/index.vue';
export default {
  components: {
      File
  },
  data(){
      return {
        users: ''
      }
  },

  computed: {
      username () {
        return this.$store.getters.getUserName;
      }
  },

  methods: {
      logout() {
          //清除token
          this.$store.dispatch('UserLogout');
          if (!this.$store.state.token) {
              this.$router.push('/login')
              this.$message({
                  type: 'success',
                  message: '登出成功'
              })
          } else {
              this.$message({
                  type: 'info',
                  message: '登出失败'
              })
          }
      },
  }
}
</script>
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.home {
  width: 100%;
  height: 600px;
}
</style>
