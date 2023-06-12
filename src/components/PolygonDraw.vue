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
        <canvas ref="canvas" :class="(mode=='shift') ? 'shift-cursor':'normal-cursor'"
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
      <!-- <div v-if="alertType" :class="alertType" class="alert alert-box" role="alert">{{ alertMsg }}</div> -->
      <el-dialog v-if="alertType" :visible="true">
        <el-alert title="" center :type="alertType" show-icon> {{ alertMsg }}  </el-alert>
      </el-dialog>
    </div>
  </template>
   
  <script>
  import {isExistIntersection, checkPP} from '../lib/DrawAlgorithm'

  // 迭代递归法：深拷贝对象与数组
  function deepClone(obj) {
    // 判断是否为对象
    function isObject(o) {
      return (typeof o === 'object' || typeof o === 'function') && o !== null
    }

    if (!isObject(obj)) {
      throw new Error('obj 不是一个对象！')
    }

    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [] : {}
    for (let key in obj) {
      cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    }

    return cloneObj
  }

    // import FlvCop from "@/viewsCommon/components/FlvCop.vue";
  export default {
    name: "PolygonDraw",
    emits:['created', 'createFailed', 'changed'],
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

        shiftArea: null,
        shiftBeginMousePoint: null, //移动多边形时起始点击的点
        shiftBeginPoints: null, //移动多边形时，多边形原始的点

        alertType: null,
        alertMsg: '',
        alertTime: null
      };
    },
    mounted() {
      this.setTimer()
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
          ctx.fillStyle = "rgba(161,195,255,0.5)"; //填充颜色，半透明
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

        if (this.mode === 'create'){
          if(this.points.length > 0){
            let points = [].concat(this.points)
            points.push(this.lastPoint)
            this.drawArea(this.ctx, {
              title: this.title,
              color: this.color,
              points: points
            })
          }
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
      create(title='area 1', color='black'){
        this.title = title
        this.color = color
        this.mode = 'create'
      },
      createFinish() {
        if (this.mode !== 'create') {
          return
        }
        this.mode = ''
        if (this.points.length < 3) { //多边形顶点不能小于3个
          let msg = '多边形顶点不能小于3个'
          this.$emit('createFailed', false, msg);
          this.showError(msg)
        }else if (isExistIntersection(this.points)) {
          let msg = "存在交叉线段，请重新绘制"
          this.$emit('createFailed', false, msg);
          this.showError(msg)
        }else{
          let area = { //加入到areas
            title: this.title,
            color: this.color,
            points: this.points
          }
          this.areas.push(area)
          this.$emit('created', area);
        }

        this.title = ''
        this.points = []
      },
      handleCanvasMouseUp() {
        if(this.mode === 'shift'){
          this.mode = ''
          this.shiftArea = null
          this.shiftBeginMousePoint = null
        }
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

        if(this.mode === ''){
          let p = {
            x: e.offsetX,
            y: e.offsetY
          }
          for (let i = 0; i < this.areas.length; i++) {
            if (checkPP(p, this.areas[i].points)) {
              this.mode = 'shift'
              this.shiftArea = this.areas[i]
              this.shiftBeginPoints = deepClone(this.areas[i].points) //复制本区域的点到shiftBeginPoints
              this.shiftBeginMousePoint = p
              break;
            }
          }
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
        }else if(this.mode === 'shift'){ //正在平移
          let shiftX = e.offsetX - this.shiftBeginMousePoint.x
          let shiftY = e.offsetY - this.shiftBeginMousePoint.y
          for(let i = 0; i < this.shiftBeginPoints.length; i++){
            this.shiftArea.points[i].x = this.shiftBeginPoints[i].x + shiftX
            this.shiftArea.points[i].y = this.shiftBeginPoints[i].y + shiftY
          }
          console.log('shiftX:', shiftX, ', shiftY:', shiftY)
          console.log('shiftBeginPoints[0]:', this.shiftBeginPoints[0].x, ', ', this.shiftBeginPoints[0].y)

          this.refresh()
        }
      },
      handleContextMenu(e){
        e.preventDefault();
        return false;
      },
      showError: function (msg) {
        this.showAlert("error", msg);
        // alert(msg);
      },
      showSuccess: function (msg) {
        //alert(msg);
        this.showAlert("success", msg);
      },
      showAlert: function (type, msg) { //为防止显示后导致右键菜单隐藏失效，延时100ms再显示
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
 .shift-cursor{
  cursor: move;
 }

 .normal-cursor{
  cursor: default;
 }

  </style>
  