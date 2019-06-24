//
//"http://t0.tianditu.com/vec_c/wmts"
// //"http://t0.tianditu.com/cva_c/wmts"
define([
        "dojo/_base/declare",
        "esri/layers/tiled",
        "esri/layers/TiledMapServiceLayer",
        "esri/SpatialReference",
        "esri/geometry/Extent",
        "esri/layers/TileInfo"
],
    function (declare, tiled, TiledMapServiceLayer, SpatialReference, Extent, TileInfo) {
        return declare([TiledMapServiceLayer], {
            _url: null,
            spatialReType: null,
            noteType: null,

            //构造函数
            constructor: function (url, options) {
               /*  this.spatialReference = new SpatialReference({ wkid: 4326 });
                this.initialExtent = (this.fullExtent = new Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
                */ 
                var cornerCoordinate = 20037508.3427892;
                
                this.spatialReference = options.noteType.substr(4,1) == 'w' ? new esri.SpatialReference({wkid: 102100}) : new esri.SpatialReference({wkid: 4326});
                var extent = options.noteType.substr(4,1) == 'w' ? new esri.geometry.Extent(-cornerCoordinate, -cornerCoordinate, cornerCoordinate, cornerCoordinate, this.spatialReference) : new esri.geometry.Extent(-180, -90, 180, 90, this.spatialReference);
                this.initialExtent = (this.fullExtent = extent);
                
                //切片信息
                this._url = url;
                this.spatialReType = options.spatialReType ? options.spatialReType : "geographic";
                this.noteType = options.noteType ? options.noteType : "vec_c";
                this.tileInfo = this.getTiledinfo(this.spatialReType);
                this.loaded = true;
                this.onLoad(this);
            },
            //获取切片信息
            getTiledinfo: function (type) {
                var tileInfo;
                if (type == "geographic") {
                    tileInfo = new TileInfo({
                        "dpi": 90.71428571428571,
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {
                            "x": -180,
                            "y": 90
                        },
                        "spatialReference": {
                            "wkid": 4326
                        },
                        "lods": [
                            { "level": 1, "resolution": 0.7031249999891485, "scale": 2.958293554545656E8 },
                            { "level": 2, "resolution": 0.35156249999999994, "scale": 1.479146777272828E8 },
                            { "level": 3, "resolution": 0.17578124999999997, "scale": 7.39573388636414E7 },
                            { "level": 4, "resolution": 0.08789062500000014, "scale": 3.69786694318207E7 },
                            { "level": 5, "resolution": 0.04394531250000007, "scale": 1.848933471591035E7 },
                            { "level": 6, "resolution": 0.021972656250000007, "scale": 9244667.357955175 },
                            { "level": 7, "resolution": 0.01098632812500002, "scale": 4622333.678977588 },
                            { "level": 8, "resolution": 0.00549316406250001, "scale": 2311166.839488794 },
                            { "level": 9, "resolution": 0.0027465820312500017, "scale": 1155583.419744397 },
                            { "level": 10, "resolution": 0.0013732910156250009, "scale": 577791.7098721985 },
                            { "level": 11, "resolution": 0.000686645507812499, "scale": 288895.85493609926 },
                            { "level": 12, "resolution": 0.0003433227539062495, "scale": 144447.92746804963 },
                            { "level": 13, "resolution": 0.00017166137695312503, "scale": 72223.96373402482 },
                            { "level": 14, "resolution": 0.00008583068847656251, "scale": 36111.98186701241 },
                            { "level": 15, "resolution": 0.000042915344238281406, "scale": 18055.990933506204 },
                            { "level": 16, "resolution": 0.000021457672119140645, "scale": 9027.995466753102 },
                            { "level": 17, "resolution": 0.000010728836059570307, "scale": 4513.997733376551 },
                            { "level": 18, "resolution": 0.000005364418029785169, "scale": 2256.998866688275 },
                            { "level": 19, "resolution": 2.68220901485e-6, "scale": 1128.499433344138 },
                            { "level": 20, "resolution": 1.341104507425e-6, "scale": 564.2497166720688 }
                        ]
                    });
                } else if (type == "Mercator") {
                    tileInfo = new TileInfo({
                        "dpi": 90.71428571428571,
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {
                            "x": -20037508.3427892,
                            "y": 20037508.3427892
                        },
                        "spatialReference": {
                            "wkid": 102100
                        },
                        
                        "lods": [
                            { "level": 1, "resolution": 78271.51696402048, "scale": 2.958293554545656E8 },
                            { "level": 2, "resolution": 39135.75848201024, "scale": 1.479146777272828E8 },
                            { "level": 3, "resolution": 19567.87924100512, "scale": 7.39573388636414E7 },
                            { "level": 4, "resolution": 9783.93962050256, "scale": 3.69786694318207E7 },
                            { "level": 5, "resolution": 4891.96981025128, "scale": 1.848933471591035E7 },
                            { "level": 6, "resolution": 2445.98490512564, "scale": 9244667.357955175 },
                            { "level": 7, "resolution": 1222.99245256282, "scale": 4622333.678977588 },
                            { "level": 8, "resolution": 611.49622628141, "scale": 2311166.839488794 },
                            { "level": 9, "resolution": 305.748113140705, "scale": 1155583.419744397 },
                            { "level": 10, "resolution": 152.8740565703525, "scale": 577791.7098721985 },
                            { "level": 11, "resolution": 76.43702828517625, "scale": 288895.85493609926 },
                            { "level": 12, "resolution": 38.21851414258813, "scale": 144447.92746804963 },
                            { "level": 13, "resolution": 19.109257071294063, "scale": 72223.96373402482 },
                            { "level": 14, "resolution": 9.554628535647032, "scale": 36111.98186701241 },
                            { "level": 15, "resolution": 4.777314267823516, "scale": 18055.990933506204 },
                            { "level": 16, "resolution": 2.388657133911758, "scale": 9027.995466753102 },
                            { "level": 17, "resolution": 1.194328566955879, "scale": 4513.997733376551 },
                            { "level": 18, "resolution": 0.5971642834779395, "scale": 2256.998866688275 },
                            { "level": 19, "resolution": 0.2985821417389698, "scale": 1128.499433344138 },
                            { "level": 20, "resolution": 0.1492910708694849, "scale": 564.2497166720688 }
                        ]
                    });
                } else {
                    alert("WMTS服务解析错误");
                    return;
                }

                return tileInfo;
            },


            //重写getTileUrl方法来获取切片
            getTileUrl: function (level, row, col) {

                var tileUrl;
				//"proxy/proxy.ashx?"+
				//'a27506858784ec68e9dc545a68ba1cc6',,f9ccb94730c9b51cb2986a98d897b297
                tileUrl = this._url + "?tk=fa20dafdf90309705f4f88fd3e071fed&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+this.noteType.substr(0,3)+"&STYLE=default&TILEMATRIXSET="+this.noteType.substr(4,1)+"&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                return tileUrl;
            }
        });


    });