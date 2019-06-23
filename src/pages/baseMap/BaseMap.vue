<template>
   <div>
        <div id="map"></div>
   </div>
  
</template>
<script>
import esriLoader from "esri-loader";
import options from "config/config";
const option = options.options;
console.log(options);
export default {
  name: "BaseMap",
  data() {
    return {
      gisModules: [
        "esri/map",
        "widgets/GaoDeLayer",
        "widgets/GaodeImageLayer",
        "widgets/GaodeAnnoLayer"
      ]
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 加载地图
    initMap() {
      esriLoader
        .loadModules(this.gisModules, option)
        .then(([Map, GaoDeLayer, GaodeImageLayer,GaodeAnnoLayer]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          let map = new Map("map", {
            center: [110.017408,30.392713],
            zoom: 4,
            logo: false, slider: false

          });

          //加载高德地图
          var basemap = new GaoDeLayer();
          map.addLayer(basemap);
          // var annolayer = new GaodeAnnoLayer();
          // map.addLayer(annolayer);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
// 引入arcgis样式
@import url('https://js.arcgis.com/3.27/esri/css/esri.css');

    #map
      height: 100%;
      width: 100%;
      position: absolute;
      

</style>

