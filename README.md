# polygon-draw
polygon-draw is a polygon draw component for VUE.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 使用方法
示例见PolygonView.vue
#### 属性
1. areas 绘制的区域对象数组
```js
areas:[
        {
          title: 'test1', //区域标题（名称）
          color: 'red', //绘制线条颜色
          points:[ //多边形顶点
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
```
#### 方法
1. refresh() 刷新，重新绘制，一般不需要调用，除非在调用者修改了areas后
2. select(area) 设置某区域为选定，一般不需要调用，用户单击某area后会自动选中
3. create(title='area 1', color='black') 开始创建一个区域，传入title和color，然后用户在画布上点击的点组成多边形区域，右键点击完成创建，创建过程中按ESC键取消创建
4. createCancel() 取消创建，当前绘制的新area将消失
5. del(area) 删除area，一般不需要调用，用户按del键删除当前选定的area
6. select(area) 选定area，一般不需要调用，用户用鼠标左键可选中area

#### 事件
1. created 参数 area，新area创建完成后触发
2. create-failed 参数 msg， 创建失败后触发。msg为错误消息
3. changed 参数 area，area被平移或顶点拖拽后触发
4. del 参数 area，area被删除后触发
5. error 参数 msg， 操作出错后触发。msg为错误消息
6. selected 参数 area，area被选中后触发

#### 操作
1. 新建：调用create()后开始，用户用鼠标单击选中的点会连成新的area，鼠标右键单击结束
2. 平移：鼠标按住选中的area移动，area整体平移
3. 顶点拖拽：鼠标按住选中的area的某一顶点移动
