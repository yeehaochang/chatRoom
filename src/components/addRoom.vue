<template>
    <div>
        <div class="login-form">
          <form>
              <label for="user">
                  請輸入暱稱
              </label>
              <input type="text" id="user" v-model="username">
              <label for="roomname">
                  請輸入聊天室名稱
              </label>
              <input type="text" id="roomname" v-model="roomname">
              <a href="#" @click.prevent="enter">送出</a>
              <span class="errortext">欄位不得為空</span>
          </form>
      </div>
    </div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      roomname: '',
    };
  },
  methods: {
    enter() {
      const error = document.querySelector('.errortext');
      if (this.username !== '' && this.roomname !== '') {
        this.$store.dispatch('enterRoom', this.username, this.roomname);
      } else {
        error.style.opacity = 100 / 100;
      }
    },
  },
  watch: {
    username() {
      const error = document.querySelector('.errortext');
      if (this.username !== '' || this.roomname !== '') {
        error.style.opacity = 0 / 100;
      } else {
        error.style.opacity = 100 / 100;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form{
    width: 300px;
    height: 200px;
    background-color: $primary;
    color:$text;
    margin: 0 auto;
    padding:10px;
    form{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    label{
        display: block;
    }
    input{
        display: block;
        margin:10px auto;
        color:$text;
        padding:5px;
    }
    a{
        color:$text;
        border:1px $text solid;
    }
    .errortext{
        opacity: 0;
        color:red;
    }
}
</style>
