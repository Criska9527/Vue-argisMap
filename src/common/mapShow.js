//引入esri模块
import { loadModules } from 'esri-loader'
//引入store
import store from '../store'

export default {
    map_addPoints(data, datatype, item, popwindowParam){
        loadModules([ 
        "esri/geometry/Point", 
        "esri/layers/GraphicsLayer",
        "esri/graphic", 
        "esri/symbols/PictureMarkerSymbol",
        'esri/symbols/SimpleMarkerSymbol', 
        "esri/symbols/TextSymbol",
        "esri/Color"])
        .then(([Point,GraphicsLayer,Graphic,PictureMarkerSymbol,SimpleMarkerSymbol,TextSymbol,Color])=>{
                    
        })
    }
}
