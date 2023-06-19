<template>
  <!-- <div style="height: 600px; width: 100%">
      <div class="canvas-box solid" ref="canvasBox">
        <img
          src="@/assets/test.jpg"
          style="
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            object-fit: fill;
          "
        /> -->
  <div
    style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
    <div class="pic-box">
      <img src="@/assets/test.jpg" ref="backgroundImg" class="pic-img" @load='imgOnLoad' />
      <PolygonDraw v-if="canvasWidth > 0" id="canvas" 
        :areas="areas"
        ref="polygonDrawRef"
        @create-failed="showError"
        @error="showError" 
        @changed="onAreaChanged" 
        @created="onAreaCreated" 
        @del="onAreaDel" 
        @selected="onAreaSelected"
        :width="canvasWidth"
        :height="canvasHeight" />
      <!-- :style="{width: canvasWidth, height: canvasHeight}" -->
    </div>

    <div class="dialog-footer" style="margin-top: 10px; position: absolute; left: 0; bottom: 0;">
      <el-button plain @click="drawArea()">绘制区域</el-button>
      <el-button plain @click="cancelDraw()">取消绘制</el-button>      
    </div>

    <!-- <div v-if="alertType" :class="alertType" class="alert alert-box" role="alert">{{ alertMsg }}</div> -->
    <el-dialog v-if="alertType" :visible="true">
      <el-alert title="" center :type="alertType" show-icon> {{ alertMsg }} </el-alert>
    </el-dialog>

  </div>
</template>
   
<script>
import PolygonDraw from "~/components/PolygonDraw.vue";
  
export default {
  name: "PolygonView",
  
  // mixins: [dialogControlorMixin, entMixin],
  
  components: { PolygonDraw },
  
  data() {
    return {
      alertType: null,
      alertMsg: '',
      alertTime: null,

      canvasWidth: 0,
      canvasHeight: 0,

      areas:[
        {
          title: 'test1',
          color: 'red',
          points:[
            {x: 10, y: 20},
            {x: 100, y: 200},
            {x: 150, y: 210},
            {x: 110, y: 120},
            {x: 70, y: 50},
          ]
        },
        {
          title: 'test2',
          color: 'blue',
          points:[
            {x: 210, y: 220},
            {x: 300, y: 400},
            {x: 350, y: 410},
            {x: 310, y: 320},
            {x: 170, y: 150},
          ]
        }
      ]
    };
  },

  mounted(){
    this.setTimer()   
  },
  
  methods: {
    imgOnLoad(){
      this.canvasWidth = this.$refs.backgroundImg.offsetWidth
      this.canvasHeight = this.$refs.backgroundImg.offsetHeight
    },
    drawArea() {
      // console.log(e)
      this.$refs.polygonDrawRef.create()
    },
    cancelDraw(){
      this.$refs.polygonDrawRef.createCancel()
    },
    onAreaChanged(area){
      console.log('Area "' + area.index + '.' + area.title + '" changed!')
    },
    onAreaCreated(area){
      console.log('Area "' + area.index + '.' + area.title + '" created!')
    },
    onAreaDel(area){
      console.log('Area "' + area.index + '.' + area.title + '" deleted!')
    },
    onAreaSelected(area){
      if(area){
        console.log('Area "' + area.index + '.' + area.title + '" selected!')
      }else{
        console.log('Area unselected!')        
      }
    },
    showError: function (msg) {
      this.showAlert("error", msg);
      // alert(msg);
    },
    showSuccess: function (msg) {
      //alert(msg);
      this.showAlert("success", msg);
    },
    showAlert: function (type, msg) { //为防止显示后导致右键菜单隐藏失效，延时200ms再显示
      setTimeout(() => {
        this.alertType = type;
        this.alertMsg = msg;
        this.alertTime = new Date();
        // alert(msg);
      }, 200)
    },
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (!this.alertTime) {
            return
          }
          // console.log('开始定时...每过一秒执行一次')
          let now = new Date();
          //显示信息，3秒后消失
          if (parseInt(now - this.alertTime) > 3000) {
            this.alertType = "";
            this.alertMsg = "";
          }
        }, 1000)
      }
    },
  },
};
</script>
   
<style>
.canvas-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.pic-box {
  /* display: flex; */
  /* position: absolute; */
  top: 0;
  left: 0;
}

.pic-img {
  position: absolute;
  left: 0;
  top: 0;
  object-fit: none;
  z-index: 1;
}

#canvas {
  position: absolute;
  /* display: flex; */
  top: 0;
  left: 0;
  /* width: 500px;
   height: 400px; */
  /* width: 100%;
   height: 100%; */
  z-index: 10;
}
</style>
  