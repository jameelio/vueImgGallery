import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import APIURI from './common/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status:'',
    token:localStorage.getItem('token') || '',
    user: localStorage.getItem('user')  ||'',
    uploadstate:'',
    imageList:[]

  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state,authObj){
      console.log(authObj, "AUTH SUCCESS");
      state.status = 'success'
      state.token = authObj.token;
      state.user = authObj.user;
    },
    auth_error(state){
      state.status = 'error'
    },
    upload_in_progress(state){
      state.uploadstate = 'progress';
    },
    update_user_images(state,images){
      state.imageList = images;
    },
    logout(state){
      state.status = ''
      state.token = ''
    }

  },
  actions: {
    login({commit},user){
      return new Promise((resolve,reject)=>{
        console.log("login data",user)
        commit('auth_request')
        axios({
          url: `${APIURI}/signIn`,
          method: "POST",
          data: user
        })
          .then(res => {
            const token = res.data.data.token;
            const user = res.data.data.user;
            const uploadedImages = res.data.data.images;

            localStorage.setItem("user",user);
            localStorage.setItem("token", token);
            axios.defaults.headers.common["x-access-token"] = token;
            const authObj = {user,token}
            commit("auth_success", authObj);
            commit("update_user_images",uploadedImages);
            resolve(true);
          })
          .catch(error => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(error);
          });
      })
    },
    register({commit},newUser){
      return new Promise((resolve,reject)=>{
        commit('auth_request');
        axios({
          url: `${APIURI}/signUp/`,
          method: "POST",
          data: newUser
        })
          .then(res => {
            console.log(res);
            resolve(true);
          })
          .catch(err => {
            commit("auth_error", err);
            reject(err);
          });

      });
    },
    logout({commit},userOut){ //commit destructure, context.commit
      return new Promise((resolve,reject)=>{
        commit('logout')
        localStorage.removeItem('token')
        resolve()
      })
    },
    upload({commit},formData){
      return new Promise((resolve)=>{
        axios
          .post(`${APIURI}/upload/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(uploadReturn => {
             const uploadedImage = uploadReturn.data.data.imageUrl
             console.log(uploadedImage);
          })
          .catch()
      })
    },
    getImagesByUser({commit},user){
      return new Promise((resolve) => {
        console.log("getting images by user")
        axios({
          url: `${APIURI}/gallery/`,
          method: "POST",
          data: {user:user}
        }).then(userDbObject => {
          const imageGallery = userDbObject.data.data.images;
          commit("update_user_images",imageGallery);
          resolve(true)
        })
        .catch(err => {
          console.log("ERROR",err)
          resolve(false);
        })
      });
    }
  },
    
getters:{
    isLoggedIn:state => !!state.token,
    authStatus:state => state.status,
    user:state => state.user,
    images : state => state.imageList
}

})