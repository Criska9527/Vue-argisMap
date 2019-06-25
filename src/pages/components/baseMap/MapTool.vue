<template>
  <div>
    <div class="tool-content">
        <div class="tool-bar">
            <ul class="tool-wrapper">
                <li class="iconfont iconjiahao tool-item" 
                    title="放大"
                    @click="MapZoom('out')"
                >
                </li>

                <li class="iconfont iconjianhao tool-item" 
                    title="缩小"
                    @click="MapZoom('in')"
                >
                </li>

                <li class="iconfont iconmianjiceliang tool-item" 
                    title="测面" 
                    @click="Measure('measureArea')"
                >
                </li>

                <li class="iconfont iconceju tool-item" 
                    title="测距" 
                    @click="Measure('measuredistance')"
                >
                </li>
                <li class="iconfont iconbiaohui tool-item" 
                    title="标绘"
                >
                </li>

                <li class="iconfont iconbiaoji tool-item" 
                    title="标注"
                    @click="MapMarker"
                >
                </li>

                <li class="iconfont iconqingchu tool-item" 
                    title="清除"
                    @click="MapClear"
                >
                </li>
            </ul>
        </div>
        <div class="tool-pos">
            经度:{{this.lon}}  纬度：{{this.lat}}
        </div>
    </div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader';
export default {
  name: "MapTool",
  data(){
    return{
      gisModules: [
        "esri/map",
        "widgets/MearTool",
      ],
      MarkModules:[
        "esri/toolbars/draw",
        "esri/symbols/PictureMarkerSymbol", 
        "esri/graphic",
        "esri/layers/GraphicsLayer"
      ],
      PosModules:[
        "esri/map",
        "dojo/domReady"
      ],
      lon:'',
      lat:''
    }
  },
  mounted(){
    this.MapPosMouseOver()
  },
  computed:{
    map:{
      get(){
         return this.$store.state.map
      }
    }
  },
  methods:{
    //测量方法
    Measure(type){
      loadModules(this.gisModules).then(
           ([Map,MearTool]) => {
             //方式1.使用GeometryEngine
              let options = {
                  map: this.map
              };
              //方式2.使用几何服务
              // let options = {
              //     map: map,
              //     geometryServiceUrl: 'https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'
              // };
              
               //新建一个测量类
               let measureTool = new MearTool(options)
               //做类型判断
               if(type=="measuredistance"){
                  measureTool.measureDistance()
               }else if(type=="measureArea"){
                    measureTool.measureArea()
               }
            
        }
    
      );
    },
    //放大缩小方法
    MapZoom(type){
        loadModules(["esri/map"]).then(([Map])=>{
            //设置新层级
           let changelevel=null
          //获取当前地图的层级
           let level = this.map.getLevel()
           if(type=="out"){
              changelevel = ++level
           }else if(type=="in"){
              changelevel = --level
           }
           //设置当前层级
           this.map.setLevel(changelevel)
        })
    },
    //标注方法
    MapMarker(){
      loadModules(this.MarkModules)
        .then(([Draw, PictureMarkerSymbol, Graphic,GraphicsLayer])=>{

            var drawToolbar = new Draw(this.map);
            var pictureMarkerSymbol = new PictureMarkerSymbol('/static/images/markblue.png', 20, 20);
            drawToolbar.setMarkerSymbol(pictureMarkerSymbol);
            drawToolbar.activate(Draw.POINT);
            drawToolbar.on("draw-complete", function (evt) {
                drawToolbar.deactivate();
                // figure out which symbol to use
                var symbol;
                if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    symbol = pictureMarkerSymbol;
                } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    symbol = lineSymbol;
                }
                else {
                    symbol = fillSymbol;
                }
                var layer=null;
                if (!this.map.getLayer('marker')) {
                     layer = new GraphicsLayer({ id: 'marker' });
                } else { 
                     layer = this.map.getLayer('marker');
                }

                //生成随机id,以便以后信息框的使用
                let id = Math.random().toString(36).substr(2);
                evt.geometry.setCacheValue("id", id);
                var attr = {"id":id};
                layer.add(new Graphic(evt.geometry, symbol,attr));
                //弹出对话框
                //adddrawwindow(id);
                 //绑定点击事件
               
                // layer.on("click", function(evt){
                //         layermouseover(evt);
                // });
                this.map.addLayer(layer);
                

            });
            
      })
    },
    //清除方法
    MapClear(){
      loadModules(["esri/map"]).then(
           ([Map]) => {
          
          if(this.map.getLayer("measureLayer")){
                //清除测量图层
                this.map.getLayer("measureLayer").clear();
          }
          if(this.map.getLayer('marker')){
            //清除标注图层
             this.map.getLayer('marker').clear();
          }
          //this.map.graphics.clear();
        

        }
    
      );
    },
    //显示经纬度
    MapPosMouseOver(){
      loadModules(this.PosModules)
        .then(([Map,domReady])=>{
            dojo.connect(this.map, "onMouseMove", (event)=>{
                this.lon = event.mapPoint.x.toFixed(3)
                this.lat = event.mapPoint.y.toFixed(3)
                //console.log(this.lon,this.lat)
            });
      })
    }

  }
 
};
</script>
<style lang="stylus" scoped>
@import '~styles/varibles.styl'
@import '~styles/mixins.styl'
.tool-content
  cursor:pointer
  .tool-bar
    defaultdiv()
    top:  4.6rem;
    right : 0.2rem;
    font-size: 0.28rem;
    text-align: center;
    cursor: pointer;
    .tool-wrapper
      width:100%
      cursor:pointer
      .tool-item
        padding: .12rem .16rem
        cursor:pointer
  .tool-pos
    defaultdiv()
    bottom: 0.32rem;
    left : 0.2rem;
    font-size:.3rem
    padding:.1rem
    

</style>


