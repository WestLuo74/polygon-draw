<template>
    <div>
      <PolygonDraw
        :areas="areas"
        ref="polygonDrawRef"
        style="height: 600px; width: 100%"
      />
      <div class="dialog-footer" style="margin-top: 10px">        
        <el-button plain @click="DrawArea()">绘制区域</el-button>
        <el-button plain @click="DrawArea(true)">取消</el-button>
        <el-button plain @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>
  </template>
   
  <script>
  // import config from "../config";
  // import dialogControlorMixin from "@vcom/mixins/dialogControlorMixin";
  // import entMixin from "@vcom/mixins/entMixin";
  import PolygonDraw from "../components/PolygonDraw.vue";
   
  export default {
    name: "PolygonView",
   
    // mixins: [dialogControlorMixin, entMixin],
   
    components: { PolygonDraw },
   
    data() {
      return {
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
   
    methods: {
      DrawArea() {
        // console.log(e)
        this.$refs.polygonDrawRef.create()
      },
      // 重置
      resetForm() {
      },
      // 确定
      submitForm() {
      },
    },
  };
  </script>
   
  <style>
  .intrusion {
    display: flex;
    justify-content: space-between;
  }
   
  .item_title {
    background-color: aliceblue;
    margin-top: 10px;
  }
   
  .item_row {
    display: flex;
    justify-content: space-between;
  }
   
  .block .show-input {
    width: 55% !important;
    margin-right: 250px !important;
  }
  .block .el-slider__input {
    width: 100px !important;
  }
  .block .el-slider__input .el-input {
    width: 100% !important;
  }
  .areaDash {
    width: 500px;
    height: 500px;
  }
  .DrawStyle {
    width: 150px !important;
  }
  </style>
  