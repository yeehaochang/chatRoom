<template>
    <div>
      <div class="chatroom">
        <a href="#" class="prev" @click.prevent="prev">回上一頁</a>
        <!-- 左方清單 -->
        <span class="chatroom-list-title">公開聊天室( {{roomlist.length}} )</span>
        <a href="#" class="chatroom-list-add" @click.prevent="addroom">新增聊天室</a>
        <ul class="chatroom-list" data-simplebar-auto-hide="false">
          <li v-for="(item, index) in roomlist" :key="index"
          :class="{active:item.roomName === recentRoomInfo.roomName}">
          <a href="#" @click.prevent="changeRoom(item.name)">{{item.roomName}}</a>
          </li>
        </ul>
        <span class="chatroom-img-name">{{imageName}}</span>
        <img class="chatroom-img" :src="imageUrl" width="300" height="200" alt="" srcset="">
        <!-- 右方主體 -->
        <div class="chatroom-body">
          <h1 class="chatroom-body-name">
          {{recentRoomInfo.roomName}}
          </h1>
          <div class="chatroom-body-content">
            <div class="chatroom-message"
            v-for="(item, index) in messages" :key="index">
              <span class="chatroom-message-time">{{item.creat_at}}</span>
              <span class="chatroom-message-name">{{item.name}}</span>：
              <span class="chatroom-message-content" v-if="item.content">{{item.content}}
              </span>
              <span v-if="item.imageUrl">
                <br>
                <img class="chatroom-message-content-img" :src="item.imageUrl">
              </span>
            </div>
          </div>
          <div class="chatroom-body-submit">
            <span class="chatroom-body-submit-name">{{recentRoomInfo.name}}</span>：
            <textarea name="" id="" cols="100" rows="10"
            v-model="submitContent" @keyup.enter="submitMessage"></textarea>
          </div>
          <div class="chatroom-body-footer">
            <a href="#">
              <input type="file" @change="updateFile">
              <img class="chatroom-body-footer-img"
              src="../assets/icon/paperclip-solid.svg" width="20" alt="" srcset="">
            </a>
            <a href="#" class="chatroom-body-footer-submit" @click.prevent="submitMessage">送出</a>
          </div>
        </div>
      </div>
      <div id="addModal">
        <span @click.prevent="addroom">x</span>
        <addRoom/>
      </div>
    </div>
</template>

<script>
import addRoom from './addRoom.vue';

export default {
  data() {
    return {
      submitContent: '',
      imageName: '',
      imageUrl: '',
      imageFile: {},
    };
  },
  components: {
    addRoom,
  },
  methods: {
    getAllRooms() {
      this.$store.dispatch('getAllRooms');
    },
    submitMessage() {
      const vm = this;
      if (vm.submitContent !== '' || vm.file !== '') {
        const messageObject = {
          creat_at: new Date(),
          name: vm.recentRoomInfo.name,
          content: vm.submitContent || '',
        };
        console.log(messageObject);
        vm.$store.dispatch('submitMessage', messageObject);
        vm.submitContent = '';
        vm.imageName = '';
        vm.imageUrl = '';
        vm.imageFile = {};
      }
      this.$store.dispatch('refresh');
    },
    getMessages() {
      this.$store.dispatch('getMessages', this.recentRoomInfo.id);
    },
    deleteRoom(id) {
      this.$store.dispatch('deleteRoom', id);
    },
    prev() {
      this.$router.push({
        path: './login',
      });
    },
    Storage() {
      if (localStorage.getItem('user') !== '') {
        const lastUser = Object.assign({}, JSON.parse(localStorage.getItem('user')));
        this.$store.dispatch('enterRoom', lastUser.name);
      }
    },
    // 上傳圖片
    updateFile(event) {
      const targetFile = event.target.files;
      // this.submitFile = Object.assign({}, event.target.files[0]);
      const fr = new FileReader();
      fr.readAsDataURL(targetFile[0]);
      fr.addEventListener('load', () => {
        this.imageUrl = fr.result;
        this.imageName = targetFile[0].name;
        console.log(targetFile[0]);
        // Vue 的資料更新利用的是 Object.defineProperty 的 getter setter 函式來實現的，
        // 而 Vue 預設沒有對 File 物件設定 getter setter, 因此用 File 物件不會自動更新。
        this.$set(this.imageFile, 'lastModified', targetFile[0].lastModified);
        this.$set(this.imageFile, 'lastModifiedDate', targetFile[0].lastModifiedDate);
        this.$set(this.imageFile, 'name', targetFile[0].name);
        this.$set(this.imageFile, 'size', targetFile[0].size);
        this.$set(this.imageFile, 'type', targetFile[0].type);
        this.$set(this.imageFile, 'webkitRelativePath', targetFile[0].webkitRelativePath);
        this.$set(this.imageFile, 'imageUrl', fr.result);
      });
      this.$store.dispatch('setFile', targetFile[0]);
    },
    addroom() {
      const addModal = document.getElementById('addModal');
      if (addModal.style.display === 'block') {
        addModal.style.display = 'none';
      } else {
        addModal.style.display = 'block';
      }
    },
    changeRoom(name) {
      this.$store.dispatch('enterRoom', name);
      this.$store.dispatch('refresh');
    },
  },
  watch: {
    recentRoomInfo() {
      const addModal = document.getElementById('addModal');
      addModal.style.display = 'none';
    },
  },
  computed: {
    roomlist() {
      return this.$store.state.roomlist || [];
    },
    recentRoomInfo() {
      return this.$store.state.recentRoomInfo || {};
    },
    messages() {
      return this.$store.state.messages || [];
    },
    file() {
      return this.$store.state.file || {};
    },
  },
  created() {
    // this.messages = [];
    // this.recentRoomInfo = {};
  },
  mounted() {
    this.getAllRooms();
    this.Storage();
  },
};
</script>

<style lang="scss" scoped>
.chatroom{
  position: relative;
  display: flex;
  width: 60%;
  min-height: 500px;
  padding:0px 10px 10px 10px;
  margin: 0 auto;
  background-color: $primary;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
  &-img-name {
    position: absolute;
    left: 10px;
    bottom: 220px;
    color:$text;
  }
  &-img {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  &-list-title{
    position: absolute;
    top: 5px;
    font-size: 14px;
    color:$text;
  }
  &-list-add{
    position: absolute;
    top: 5px;
    right:5px;
    padding:0 2.5px;
    font-size: 14px;
    color:$text;
    border:1px $text solid;
  }
  &-list{
    overflow-y: auto;
    background-color: $secondary;
    width: 45%;
    min-width: 200px;
    text-align: left;
    margin:40px 10px 0 0;
    height: 250px;
    @media (max-width: 1100px) {
      width: 100%;
    }
    & li{
      display: flex;
      padding: 5px;
      color:$text;
      word-wrap:break-word;
      word-break: break-all;
      &.active {
        background-color:rgba($color: $primary, $alpha: 0.5);
      }
      & a{
        color: $text;
      }
    }
  }
  &-body{
    &-name{
    margin: 0px;
    color:$text;
    }
    &-content{
      overflow-y: auto;
      background-color:$secondary;
      height: 300px;
      padding: 10px;
      text-align: left;
      // display:flex;
      // flex-direction: column;
      .chatroom-message{
        color:$text;
        &-content{
          display: inline-block;
          word-wrap:break-word;
          word-break: break-all;
        }
        &-time{
          display: inline-block;
          font-size: 12px;
          width: 150px;
        }
        &-name{
          color:greenyellow;
          &:after{
            color:$text;
            content:'/>';
          }
          &:before{
            color:$text;
            content:'<';
          }
        }
        &-content-img{
          width: 200px;
          margin-left:100px;
        }
      }
    }
    &-submit{
      display: flex;
      color:$text;
      min-height: 100px;
      background-color:$secondary;
      margin-top:20px;
      padding: 10px;
      &-name{
        min-width: 50px;
        color:greenyellow;
      }
      textarea{
        border:none;
        width: 100%;
        color:$text;
        font-size: 18px;
      }
    }
    &-footer{
      position: relative;
      background-color: $secondary;
      height: 25px;
      input {
        width: 25px;
        position: absolute;
        left:0px;
        bottom:0px;
        opacity: 0;
        z-index: 10;
      }
      &-img {
        background-color: $text;
        position: absolute;
        left:0px;
        bottom:0px;
        color:$text;
        padding: 2.5px;
        z-index: 9;
      }
      &-submit{
        position: absolute;
        right: 0px;
        bottom: 0px;
        @include a();
      }
    }
  }
}
.prev{
  position: absolute;
  top: -50px;
  left: -75px;
  @include a();
}
#addModal{
  position: fixed;
  width: 300px;
  height: 200px;
  left: 50%;
  top: 50%;
  margin-top:-100px;
  margin-left:-100px;
  display: none;
  span {
    color: $text;
    position: absolute;
    right: 0px;
  }
}
</style>
