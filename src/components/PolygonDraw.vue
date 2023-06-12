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
        <canvas ref="canvas"
          @click="handleCanvasSaveClick"
          @mousemove="handleCanvasSaveMove"
          @mouseup="handleCanvasMouseUp"
          @mousedown="handleCanvasMouseDown"
          @contextmenu="handleContextMenu"
        ></canvas> <!-- @dblclick="handleDbClick" -->
        
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
        mode: "",  //工作模式，'create'：在新绘制多边形；'shift':平移多边形；'change'：更改某个多边形的顶点
        debug: false,

        title: '',  //新建的area的title
        color: 'black', //新建的area的color
        points: [], //新建的area的点
        lastPoint: {}, //新建的area的最后一个点
      };
    },
    mounted(){
      this.initCanvas()
      this.refresh()
    },
    props: ['areas'],
    /*
    areas = [
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
      ...
    ]
     */
    watch: {
    },
    methods: {
      /**
       * 绘制多边形的顶点，为一个小圆形
       * @param {*} point
       * @param {*} color 
       */
      drawVertex(ctx, point, color){
          ctx.beginPath();
          ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
          ctx.strokeStyle = color;
          ctx.fillStyle = color; //填充颜色
          ctx.closePath();
          ctx.fill();
          ctx.stroke(); //绘制

      },
      drawArea(ctx, area){
        let pointArr = area.points;
        if (pointArr.length > 1) {
          ctx.beginPath();
          ctx.moveTo(pointArr[0].x, pointArr[0].y);
          for (let i = 1; i < pointArr.length; i++) {
            ctx.lineTo(pointArr[i].x, pointArr[i].y);
          }
          ctx.strokeStyle = area.color;
          ctx.fillStyle = "rgba(161,195,255,0.5)"; //填充颜色
          ctx.closePath();
          ctx.fill();
          ctx.stroke(); //绘制

          this.drawVertex(ctx, pointArr[0], area.color)
          for (let i = 1; i < pointArr.length; i++) {
            this.drawVertex(ctx, pointArr[i], area.color)
          }
        }
      },
      clearCanvas(canvas){ //重新设置canvas高宽，已达到清除canvas的目的
        var w = canvas.width;
        var h = canvas.height;
        canvas.width = w;
        canvas.height = h;
        },
      refresh(){
        // this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.clearCanvas(this.can)
        for(let area of this.areas){
          this.drawArea(this.ctx, area)
        }
        if(this.points.length > 0){
          let points = [].concat(this.points)
          points.push(this.lastPoint)
          this.drawArea(this.ctx, {
            title: this.title,
            color: this.color,
            points: points
          })
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
      create(title, color){
        this.title = title
        this.color = color
        this.mode = 'create'
      },
      createFinish(){
        if(this.mode !== 'create'){
          return
        }
        this.mode = ''
        if(this.points.length < 3){ //多边形顶点不能小于3个
          console.log('多边形顶点不能小于3个')
          return
        }
        this.areas.push({ //加入到areas
          title: this.title,
          color: this.color,
          points: this.points
        })
        this.title = ''
        this.points = []
      },
      handleCanvasMouseUp() {
       
      },
      handleCanvasMouseDown(e) {
        console.log("Mouse down: " + e.buttons)
        if(this.mode === 'create'){
          let newPoint = {
            x: e.offsetX,
            y: e.offsetY
          }
          this.points.push(newPoint)
          if(e.buttons == 2){ //右键结束
            this.createFinish()
          }
          this.refresh()
        }
      },
      // handleDbClick(){
      //   if(this.mode === 'create'){ //双击结束
      //     this.createFinish()
      //     this.refresh()
      //   }
      // },
      handleCanvasSaveClick(e) {
        if(this.debug){
          console.log(e)
        }
      },
      handleCanvasSaveMove(e) {
        if(this.mode === 'create'){
          this.lastPoint = {
            x: e.offsetX,
            y: e.offsetY
          }
          
          this.refresh()
        }
      },
      handleContextMenu(e){
        e.preventDefault();
        return false;
      }
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
  