<template>
  <div>
      <home-header></home-header>
      <base-map></base-map>
      <change-map></change-map>
      <map-tool></map-tool>
      <nav-bar></nav-bar>
  
  </div>
</template>
<script>
import HomeHeader from './components/Header'
import BaseMap from './components/baseMap/BaseMap'
import ChangeMap from './components/baseMap/ChangeMap'
import MapTool from './components/baseMap/MapTool'
import NavBar from './components/NavBar'
import MapMain from './components/baseMap/MapMain'

export default {
  name: "Home",
  components: {
      HomeHeader,
      BaseMap,
      ChangeMap,
      MapTool,
      NavBar,
      MapMain
      

  }
};
</script>
<style lang="stylus" scoped>

</style>


