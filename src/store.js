// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import db from './db';

Vue.use(Vuex);
// console.log(db);

// const storageRef = firebase.storage().ref('/imgs/');

export default new Vuex.Store({
  state: {
    roomlist: [],
    recentRoomInfo: {},
    messages: [],
    file: '',
  },

  mutations: {
    ROOM_LIST(state, roomlist) {
      state.roomlist = roomlist;
    },
    RECENT_ROOM(state, recentRoomInfo) {
      state.recentRoomInfo = Object.assign({}, recentRoomInfo);
    },
    ADD_MESSAGES(state, messageObject) {
      state.messages.push(messageObject);
    },
    UPDATE_MESSAGES(state, messageData) {
      state.messages = messageData;
    },
    FILE(state, file) {
      state.file = file;
    },
  },

  actions: {
    //  聊天室清單
    getAllRooms(context) {
      db.collection('Room')
        .get()
        .then((querySnapshot) => {
          const roomlist = [];
          querySnapshot.forEach((doc) => {
            roomlist.push({ ...doc.data(), id: doc.id });
          });
          context.commit('ROOM_LIST', roomlist);
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
    },
    //  輸入名稱進入聊天室
    enterRoom({ commit, dispatch }, username, roomname = `${username}的聊天室`) {
      // if (roomname === null) roomname = `${username}的聊天室`;
      const recentRoomInfo = {
        name: username,
        roomName: roomname,
        creat_at: firebase.firestore.Timestamp.fromDate(new Date()),
      };
      db.collection('Room').doc(recentRoomInfo.roomName)
        .set(recentRoomInfo)
        .then(() => {
          dispatch('submitMessage', {
            name: `link rel="open" href="${recentRoomInfo.name}已開啟聊天室"`,
            creat_at: firebase.firestore.Timestamp.fromDate(new Date()),
          });
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
      recentRoomInfo.creat_at = recentRoomInfo.creat_at.toDate();
      commit('RECENT_ROOM', recentRoomInfo);
      localStorage.setItem('user', JSON.stringify(recentRoomInfo));
    },
    //  傳送對話資料
    submitMessage({ commit, state, dispatch }, messageObject) {
      //  包含圖片
      if (state.file !== '') {
        const storageRef = firebase.storage().ref();
        const mountainsRef = storageRef.child(`images/${state.file.name}`);
        mountainsRef.put(state.file).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((imageUrl) => {
            const newMessageObject = {
              ...messageObject,
              imageUrl,
            //   downloadUrl:
            //     `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/images%2F${encodeURIComponent(filePath)}?alt=media`,
              //  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            };
            let messageNum = 'Message';
            if (state.messages.length < 10) messageNum = 'Message0';
            db.collection('Room').doc(state.recentRoomInfo.roomName)
              .collection('Message').doc(`${messageNum}${state.messages.length}`)
              .set(newMessageObject)
              .then((res) => {
                console.log('訊息(含圖片)新增成功：', res);
              })
              .catch((error) => {
                console.error('Error writing document: ', error);
              });
          });
        });
        commit('FILE', {});
      } else {
        //  只有訊息
        let messageNum = 'Message';
        if (state.messages.length < 10) messageNum = 'Message0';
        db.collection('Room').doc(state.recentRoomInfo.roomName)
          .collection('Message').doc(`${messageNum}${state.messages.length}`)
          .set(messageObject)
          .then((res) => {
            console.log('訊息新增成功：', res);
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      }
      dispatch('refresh');
    },
    // 監聽資料並更新
    refresh({ state, commit, dispatch }, roomName = state.recentRoomInfo.roomName) {
      db.collection('Room').doc(roomName)
        .collection('Message')
        .get()
        .then((querySnapshot) => {
          const messageArray = [];
          querySnapshot.forEach((doc) => {
            const now = new Date(doc.data().creat_at.toDate());
            const h = now.getHours();
            const m = now.getMinutes();
            const format = (h >= 12) ? '下午' : '上午';
            messageArray.push({
              name: doc.data().name,
              creat_at: `${format}${h}點${m}分`,
              content: doc.data().content,
              imageUrl: doc.data().imageUrl,
            });
          });
          commit('UPDATE_MESSAGES', messageArray);
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
      dispatch('getAllRooms');
    },
    //  用vuex管理file物件
    setFile(context, file) {
      context.commit('FILE', file);
    },
    // 輸出顯示時轉換時間格式
    getTime(timestamp) {
      const now = new Date(timestamp);
      const h = now.getHours();
      const m = now.getMinutes();
      const format = (h >= 12) ? '下午' : '上午';
      return `${format}${h}點${m}分`;
    },
    // 刪除 未完成
    deleteRoom({ dispatch }, id) {
      db.collection('Room').doc(id).collection('Message')
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
      dispatch('getAllRooms');
    },
  },
});
