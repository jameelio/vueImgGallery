<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Gallery"/>
    <div>
    <image-uploader
    :maxWidth="150"
    :quality="1.00"
    :preview=true
    outputFormat="file"
    :className="['fileinput', { 'fileinput--loaded' : hasImage }]"
    capture="environment"
    accept="video/*,image/*"
    doNotResize="['gif', 'svg']"
    @input="setImage"
    @onUpload="startImageResize">
    </image-uploader>
    </div>
    <div class="d-flex justify-content-center">
      <ul class="d-flex justify-content-center" id="imgblock">
        <li v-for="(imageSrc,index) in userImageList" v-bind:key="index" target="_blank" :href=imageSrc class="image">
          <img :src=imageSrc alt="Forest" style="width:150px;height:150px">
          <div class="overlay">
             <div class="d-flex align-items-center justify-content-center">
              <i class="fa fa fa-link fa-2x" :href=imageSrc @click="openLink(imageSrc)"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import FormData from 'form-data'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data(){
    return{
       hasImage: false,
       image: null,
       userImageList:[]
    }
 },
 async mounted(){
   this.userImageList = this.$store.getters.images

   if(this.userImageList.length == 0){
     console.log("checking server")
     const userAccess = this.$store.getters.user;
     console.log(userAccess);
     if(userAccess){
      const fetchImages = await this.$store.dispatch("getImagesByUser",userAccess)
      if(fetchImages){
        this.userImageList = this.$store.getters.images
      }
     }
     else{
       //log out 
     }
   }
 },

  methods:{
    uploadDone(files){
        if(files && Array.isArray(files)&& files.length){
      
        }
    },
    setImage(output){
      this.hasImage = true;
      this.image = output;
      const user = this.$store.getters.user;
    
      let formData = new FormData();

      formData.append("file", output);
      formData.set("user",user);
      
      this.$store.dispatch("upload",formData);
    },
    startImageResize(im){
     
    },
    openLink(link){
      console.log(link);
      let source = window.open(link, '_blank');
      source.focus();
    }
  }
}
</script>

<style>

#imgblock{
    display: flex;
    float: none;
    margin: 0 auto;
    flex-wrap: wrap;
    padding: 20px;
    height: 80vh;
    width: 100%;
    display: flex;
    overflow-y: scroll;
}

ul {
  list-style-type: none;
  list-style-position: inside;
  padding-left: 0;
}

img {
  border: 1px solid #ddd;
  border-radius: 40px;
  padding: 5px;
  width: 150px;
}

img:hover {
  box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}

.image {
    position:relative;
    display:inline-block;
    margin:10px;
}
.overlay {
    display:none;
}

.image:hover .overlay {
    width:100%;
    height:100%;
    background:rgba(0,0,0,.5);
    border: 1px solid lightgrey;
    border-radius: 40px;
    position:absolute;
    top:0;
    left:0;
    display:inline-block;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    text-align:center;
    color:white;
    padding:12px;
    font-size:20px;
}
</style>
