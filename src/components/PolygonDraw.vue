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
      <!-- <div v-if="alertType" :class="alertType" class="alert alert-box" role="alert">{{ alertMsg }}</div> -->
      <el-dialog v-if="alertType" :visible="true">
        <el-alert title="" center :type="alertType" show-icon> {{ alertMsg }}  </el-alert>
      </el-dialog>
    </div>
  </template>
   
  <script>
  //判断两个线段是否相交
  function isIntersection(a, b, c, d) {
    /** 1 解线性方程组, 求线段交点. **/
    // 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
    if (denominator == 0) {
      return false;
    }

    // 线段所在直线的交点坐标 (x , y)
    var x =
      ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
        (b.y - a.y) * (d.x - c.x) * a.x -
        (d.y - c.y) * (b.x - a.x) * c.x) /
      denominator;
    var y =
      -(
        (b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
        (b.x - a.x) * (d.y - c.y) * a.y -
        (d.x - c.x) * (b.y - a.y) * c.y
      ) / denominator;

    /** 2 判断交点是否在两条线段上 **/
    if (
      // 交点在线段1上
      (x - a.x) * (x - b.x) < 0 &&
      (y - a.y) * (y - b.y) < 0 &&
      // 且交点也在线段2上
      (x - c.x) * (x - d.x) < 0 &&
      (y - c.y) * (y - d.y) < 0
    ) {
      // // 返回交点p
      // return {
      //   x: x,
      //   y: y,
      // };
      return true;
    }
    //否则不相交
    return false;
  }

  function isExistIntersection(points) {
    let result = false;
    for (let i = 0; i < points.length - 1; i++) {
      let a = points[i];
      let b = points[i + 1];
      for (let j = 0; j < points.length - 1; j++) {
        if (i == j) {
          continue;
        }
        let c = points[j];
        let d = points[j + 1];
        result = isIntersection(a, b, c, d);
        if (result) {
          return result;
        }
        // console.log(result)
      }
    }
    return result;
  }

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
          this.showError('多边形顶点不能小于3个')          
        }else if (isExistIntersection(this.points)) {
          this.showError("存在交叉线段，请重新绘制");
        }else{
          this.areas.push({ //加入到areas
            title: this.title,
            color: this.color,
            points: this.points
          })
        }

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
  </style>
  