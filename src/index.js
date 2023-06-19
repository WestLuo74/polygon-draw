import {PolygonDraw} from "./components/PolygonDraw.vue";

PolygonDraw.install = Vue => {
    Vue.component(PolygonDraw.name, PolygonDraw)
}

const components = [PolygonDraw];
 
const install = function (Vue) {
    // 判断是否安装，安装过就不继续往下执行
    if (install.installed) return (install.installed = true);
    // 遍历注册所有组件
    components.map((component) => Vue.component(component.name, component));
};
 
// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}
export { install, PolygonDraw };
 
export default {
    // 导出的对象必须具有install，才能被Vue.use()方法安装
    install,
    // 具体组件列表
    PolygonDraw,
};