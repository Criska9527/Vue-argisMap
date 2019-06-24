<template>
  <div>
      <home-header></home-header>
      <base-map></base-map>
      <change-map></change-map>
      <map-tool></map-tool>
  </div>
</template>
<script>
import HomeHeader from './components/Header'
import BaseMap from './components/baseMap/BaseMap'
import ChangeMap from './components/baseMap/ChangeMap'
import MapTool from './components/baseMap/MapTool'
export default {
  name: "Home",
  components: {
      HomeHeader,
      BaseMap,
      ChangeMap,
      MapTool

  }
};
</script>
<style lang="stylus" scoped></style>


