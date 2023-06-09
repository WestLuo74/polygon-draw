<template>
  <div id="app">
      <div>
          <polygonView></polygonView>
      </div>
  </div>
</template>
<script>
// import polygonCrop from '../../dist/PolygonCropper.umd';
import polygonView from './views/PolygonView.vue';

export default {
  name: 'App',
  data() {
    return {
      
    };
  },
  components: {
    polygonView
  },
  methods: {
   
  }
};
</script>

<style>
  #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
  }

  .some-class {
      border: 1px solid #2c3e50;
  }
</style>
