<template>
  <div>
    <div class="change-content" @click="handleChangeMap">
      <img class="change-img" :src="imgUrl" alt>
      <div class="change-title">{{maptype}}</div>
    </div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader';
export default {
  name: "ChangeMap",
  data() {
    return {
      imgUrl: "/static/images/mapVec.png",
      gisModules: [
        "esri/map",
        "widgets/GaoDeLayer",
        "widgets/GaodeImageLayer",
        "widgets/GaodeAnnoLayer",
        "widgets/TDTLayer"
      ]
    };
  },
  computed: {
    //使用计算属性接收vuex-store里的值
    maptype: {
      get() {
        return this.$store.state.maptype;
      }
    },
    map:{
        get(){
          return this.$store.state.map
        }
    }
  },
  methods: {
    handleChangeMap() {
      let map =this.map
      //arcgis的相关方法，切换
      loadModules(this.gisModules).then(
        ([Map, GaoDeLayer,GaodeImageLayer,GaodeAnnoLayer,TDTLayer]) => {
                    // if(map.getLayer('Vec'))
           //console.log(this.$store.state.map)
           if(this.maptype == "矢量图"){
               this.imgUrl = "/static/images/mapImg.png";
               map.removeLayer(map.getLayer("base-vec"));
               var basemap = new GaodeImageLayer();
               basemap.id="base-img"
               map.addLayer(basemap)
           }else{
               this.imgUrl = "/static/images/mapVec.png";
               map.removeLayer(map.getLayer("base-img"));
               var basemap = new GaoDeLayer();
               basemap.id="base-vec"
               map.addLayer(basemap)
           }
           console.log(map)
           //将类型传递给store并改变值
           this.$store.commit("changetype", this.maptype);
        
            
        }
    
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~styles/varibles.styl'
@import '~styles/mixins.styl'
.change-content
  defaultdiv()
  bottom: 0.32rem;
  right: 0.2rem;
  font-size: 0.28rem;
  text-align: center;
  cursor: pointer;
  .change-img
    width: 1.32rem;
    margin-bottom: -0.32rem;
  .change-title
    margin-bottom: 0.2rem;
</style>


