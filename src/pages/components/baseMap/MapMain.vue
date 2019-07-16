<template></template>

<script>
import { loadModules } from "esri-loader";
export default {
  name: "MapMain",
  computed: {
    map: {
      get() {
        return this.$store.state.map;
      }
    }
  },
  methods: {
    map_addPoints(data, datatype, popwindowParam) {
      loadModules([
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/Color"
      ]).then(
        ([
          Point,
          GraphicsLayer,
          Graphic,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          TextSymbol,
          Color
        ]) => {
          const map = this.map;
          if (map.getLayer(datatype)) {
            map.removeLayer(map.getLayer(datatype));
          }
          var drawGraphicsLayer = new GraphicsLayer({
            id: datatype
          });
          map.addLayer(drawGraphicsLayer, 1);
          var symbol;
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            try {
              var lon = Number(data[i]["lon"] || data[i]["Longitude"]);
              var lat = Number(data[i]["lat"] || data[i]["Latitude"]);
              var point = new Point(lon, lat);
              //监测数据符号
              symbol = new PictureMarkerSymbol(
                "/static/images/point.png",
                35,
                32
              );
            } catch (error) {
              console.log(error);
            }
            // symbol = new SimpleMarkerSymbol({
            //     "color": [120,100,0,64],
            //     "size": 8,
            //     "style": SimpleMarkerSymbol.STYLE_CIRCLE,
            //     "outline": {
            //       "color": [0,0,0,255],
            //       "width": 1,
            //     }
            //   });

            var graphic = new Graphic(point, symbol, data[i]);
            drawGraphicsLayer.add(graphic);
            var textSym = new TextSymbol(data[i]["NAME"]);
            textSym.setOffset(0, 10);
            textSym.setColor(new Color([255, 255, 255, 1]));
            var textgraphic = new Graphic(point, textSym);
            drawGraphicsLayer.add(textgraphic);
            console.log(drawGraphicsLayer);
          }

          //图标点击事件
          drawGraphicsLayer.on("click", layerClick);
          drawGraphicsLayer.on("mouse-over", mouseOverLayer);
          drawGraphicsLayer.on("mouse-out", mouseOutLayer);
          //图层的点击事件
          function layerClick(e) {
            var graphic = e.graphic;
            var mapPoint = graphic.geometry;
            var attributes = graphic.attributes;
            var infoWidth = 200;
            var infoHeight = 100;
            map.infoWindow.resize(infoWidth, infoHeight);
            //source添加路径
            /*if (!popwindowParam.url) {
					    if (attributes.OutportCode) {
					        popwindowParam.url = urls['Ent'];
					    } else if (attributes.AQI) {
					        popwindowParam.url = urls['Air'];
					    }
					}
					map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popwindowParam.url + "?lon=" + attributes['lon'] + "&lat=" + attributes['lat'] + "&id=" + attributes['code'] + "&name=" + attributes["name"]) + "'/>");
          map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + attributes.name + "</font>");*/
            console.log(attributes);
            map.infoWindow.setTitle(attributes.SiteName);
            let html = `<ul>
                         <li>所在流域:${attributes.RiverRegion}</li>
                         <li>类型:${attributes.ControlClassify}</li>
                        </ul>`;
            map.infoWindow.setContent(html);
            map.infoWindow.show(mapPoint);
          }

          function mouseOverLayer(event) {
            map.setMapCursor("pointer");
            var font = new esri.symbol.Font();
            font.setSize("10pt");
            font.setFamily("微软雅黑");
            var cpoint = event.graphic.geometry;
            var text = new esri.symbol.TextSymbol(
              event.graphic.attributes.NAME
            );
            text.setFont(font);
            text.setColor(new dojo.Color([0, 0, 0, 1]));
            text.setOffset(20, -25);
            var labelGraphic = new esri.Graphic(cpoint, text);
            map.graphics.add(labelGraphic);
          }

          function mouseOutLayer(params) {
            map.graphics.clear();
            map.setMapCursor("default");
          }
        }
      );
    },
    map_addlayer(type, url, id) {
      const map = this.map;
      loadModules([
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer"
      ]).then(([ArcGISDynamicMapServiceLayer, FeatureLayer]) => {
        let url;
        let layer;
        if (type == "featurelayer") {
          layer = new FeatureLayer("/layer", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            id: id
          });
        } else {
          new ArcGISDynamicMapServiceLayer(
            "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer",
            {
              useMapImage: true
            }
          );
        }
        map.addLayer(layer);
      });
    }
  }
};
</script>

