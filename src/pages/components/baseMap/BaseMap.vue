<template>
  <div>
      <div id="mapdiv">
          <div id="map"></div>
     </div>
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
        "widgets/GaodeAnnoLayer",
        "widgets/TDTLayer"
      ],
      basetype:'Gaode'
    };
  },
  computed:{
    maptype:{
      get(){
        return this.$store.state.maptype
      }
    }
  },
  mounted() {
    this.initMap();
    console.log(this.maptype)
  },
  methods: {
    // 加载地图
    initMap() {
      esriLoader
        .loadModules(this.gisModules, option)
        .then(([Map, GaoDeLayer, GaodeImageLayer,GaodeAnnoLayer,TDTLayer]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          var map = new Map("map", {
            center: [113.717369,34.746944],
            zoom: 10,
            logo: false, slider: false

          });
          //使用vuex将map对象传递出去，以供大家使用
         this.$store.dispatch('sendmap',map)

          //根据maptype的值加载不同的底图
          if(this.basetype=="Gaode"){
            //加载高德地图
            var basemap = new GaoDeLayer();
            basemap.id="base-vec"
          }else if(this.basetype=="Tdt"){
            var basemap = new TDTLayer();
          }
          //将底图添加到map
          map.addLayer(basemap);
          console.log(map)
        })
        .catch(err => {
          console.error(err);
        });
    },
    changeMap(){
      
    }
  }
};
</script>
<style lang="stylus" scoped>
// 引入arcgis样式
@import url('http://61.143.248.136:8090/arcgis_js_api/library/3.27/3.27/esri/css/esri.css');
#mapdiv
   height: 100%;
   width: 100%;
   padding: 0px;
   margin: 0px;
   #map
    width: 100%;
    height: 100%;
    background: #f8f8f8;
    position:absolute;
    
     
      

</style>

