<template>
    <div>
        <div class="bar-content">
            <ul class="bar-wrapper">
                <li class="bar-item bar-item-title">
                    <span class="iconfont icongongneng"></span>
                    功能
                </li>
                <li class="bar-item" 
                    v-for="(item,index) of list" 
                    :key="index"
                    @click="listclick(item.type)"
                >
                <span class="iconfont" :class="item.fontstyle"></span>
                {{item.name}}
                </li>
            </ul>
        </div>
        <!-- MapMain组件，这里引用主要是为了使用其方法 -->
        <map-main ref="MapMain"></map-main>
    </div>
</template>
<script>
//引用MapMain组件
import MapMain from '@/pages/components/baseMap/MapMain'
 //拿到MapMain组件的方法
export default {
    name:'Navbar',
    data(){
        return{
            list:[
                {
                    name:'点位',
                    type:'point',
                    fontstyle:'icondianweibiaozhutongji'
                },
                {
                    name:'海量点位',
                    type:'morepoint',
                    fontstyle:'icondashuju'
                },
                {
                    name:'表格+点位+echars',
                    type:'table',
                    fontstyle:'icontubiaozhexiantu'
                },
                {   
                    name:'(图层)FeatureLayer',
                    type:'layer',
                    fontstyle:'icontuceng'
                }
            ],
            data:null
        }
    },
    components:{
        MapMain
    },
    methods:{
        listclick(type){
           
            //根据类型的不同调用不同的方法
            if(type=="point"){
                 this.getdatafind(type)
            }else if(type=="layer"){
                this.addLayers(type)
            }
            else{
                alert('功能尚未开发')
            }
        },
        getdatafind(type){
            let url,params=null
            if(type=="point"){
                url = '/api/WaterQuality/WaterQuality.json'
                params={
                   
               }
            }

            this.$axios.get(url,{
                params:params
            }).then(this.mapshow)
        },
        mapshow(res){
            //此步骤为访问MapMain组件
            const MapMain = this.$refs.MapMain
            this.data = res.data.data
            MapMain.map_addPoints(this.data,'point')

        },
        addLayers(){
             const MapMain = this.$refs.MapMain
             MapMain.map_addlayer('featurelayer','','test')
        }
    }

}
</script>
<style lang="stylus" scoped>
@import '~styles/varibles.styl'
@import '~styles/mixins.styl'
.bar-content
    defaultdiv()
    font-size:.34rem
    left:.16rem
    top:1.72rem
    cursor:pointer
    border:2px solid white
    box-shadow: $bgshadow
    .bar-wrapper
        width:100%
        .bar-item
            padding:.12rem  .18rem
            border-bottom: solid .02rem white
        .bar-item:hover
            background:rgba(0, 132, 255, 0.9)
        .bar-item-title
            background:rgba(0, 132, 255, 0.9)
            
</style>


