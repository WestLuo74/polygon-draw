<template>
    <div>
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
        />
        <canvas ref="canvas"></canvas>
        <!--存储已生成的点线，避免被清空-->
        <!-- <canvas
          ref="canvasSave"
          @click="handleCanvasSaveClick"
          @mousemove="handleCanvasSaveMove"
          @mouseup="handleCanvasMouseUp"
          @mousedown="handleCanvasMouseDown"
        ></canvas> -->
      </div>
    </div>
  </template>
   
  <script>
  // import FlvCop from "@/viewsCommon/components/FlvCop.vue";
  export default {
    name: "PolygonDraw",
    data() {
      return {
        // ctxSave: "",
        // canSave: "",
        ctx: "",
        can: "",
        debug: false,
      };
    },
    mounted(){
      this.initCanvas()
      this.refresh()
    },
    props: ['areas'],
    watch: {
    },
    methods: {
      drawArea(area){
        let pointArr = area.points;
        this.ctx.beginPath();
        if (pointArr.length > 1) {
          this.ctx.moveTo(pointArr[0].x, pointArr[0].y);
          for (var i = 1; i < pointArr.length; i++) {
            this.ctx.lineTo(pointArr[i].x, pointArr[i].y);
            this.ctx.strokeStyle = area.color;
            this.ctx.fillStyle = "rgba(161,195,255,1)"; //填充颜色
          }
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke(); //绘制
        }
      },
      refresh(){
        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        for(let area of this.areas){
          this.drawArea(area)
        }
      },
      initCanvas() {
        this.can = this.$refs["canvas"];
        this.can.width = this.$refs["canvasBox"].clientWidth;
        this.can.height = this.$refs["canvasBox"].clientHeight;
        // console.log(can.width, can.height);
        this.ctx = this.can.getContext("2d");
        this.ctx.strokeStyle = this.lineColor; //线条颜色
        this.ctx.fillStyle = "rgba(64, 158, 255,0.1)"; //填充颜色
        this.ctx.lineWidth = 4; //线条粗细
        this.ctx.globalAlpha = 0.7; //半透明
   
        // this.canSave = this.$refs["canvasSave"];
        // this.canSave.width = this.$refs["canvasBox"].clientWidth;
        // this.canSave.height = this.$refs["canvasBox"].clientHeight;
        // this.ctxSave = this.canSave.getContext("2d");
        // this.ctxSave.strokeStyle = this.lineColor; //线条颜色
        // this.ctxSave.fillStyle = "rgba(64, 158, 255,0.1)"; //填充颜色
        // this.ctxSave.lineWidth = 4; //线条粗细
        // this.ctxSave.globalAlpha = 0.7; //半透明

        // console.log(can);
        // console.log(canSave);
      },
      handleCanvasMouseUp() {
       
      },
      handleCanvasMouseDown(e) {
        if(this.debug){
          console.log(e)
        }
      },
      handleCanvasSaveClick(e) {
        if(this.debug){
          console.log(e)
        }
      },
      handleCanvasSaveMove(e) {
        if(this.debug){
          console.log(e)
        }
      },
    }
  };
  </script>
   
<style scoped>
  .canvas-box {
    position: relative;
    width: 100%;
    height: 100%;
  }

canvas {
   position: absolute;
   top: 0;
   left: 0;
    /* width: 1000px;
    height: 800px; */
   width: 100%;
   height: 100%;
 }
  </style>
  