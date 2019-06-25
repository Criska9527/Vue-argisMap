define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/number",
    "esri/layers/GraphicsLayer",
    "esri/toolbars/draw",
    "esri/symbols/TextSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/Font",
    "esri/Color",
    "esri/graphic",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/geometryEngine",
    "esri/tasks/AreasAndLengthsParameters",
    "esri/tasks/LengthsParameters",
    "esri/tasks/GeometryService",
], function (
    lang,
    declare,
    number,
    GraphicsLayer,
    Draw,
    TextSymbol,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Font,
    Color,
    Graphic,
    Polyline,
    Point,
    Polygon,
    geometryEngine,
    AreasAndLengthsParameters,
    LengthsParameters,
    GeometryService,
    ) {
        return declare(null, {
            _map: null,
            _measureMethod: "GeometryServer",//默认测量方式为几何服务
            _distanceMeasure: false,//距离测量flag
            _areaMeasure: false,//面积测量
            _options: {
                map: this._map,
                geometryServiceUrl: ''
            },
            _mapClickListener: null,
            _inputPoints: [],
            _totalDistance: 0.00,
            _totalGraphic: null,

            constructor: function (options) {
                lang.mixin(this._options, options);
                this._checkParams(options);
                this._map = this._options.map;
                this._geometryServiceUrl = this._options.geometryServiceUrl;
                //监听地图单击事件
                this._mapClickListener = this._map.on('click', this._mapClickHandler.bind(this));
                this._drawBar = new Draw(this._map);
                this._drawBar.on('draw-complete', this._drawEnd.bind(this))
                this._map.addLayer(new GraphicsLayer({
                    id: "measureLayer"
                }));
                this._font = new Font('12px').setWeight(Font.WEIGHT_BOLD);
                this._defaultMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 7, 
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 
                        new Color([255, 0, 0]), 1), new Color([255, 0, 0]));
            },
            //测量距离
            measureDistance: function () {
                this.clearMeasureActionAndGraphics();
                this._distanceMeasure = true;//激活距离测量
                this._totalDistance = 0.00;//总长度重置为0
                this._inputPoints = [];//输入点数组置为空
                this._drawBar.activate(Draw.POLYLINE);
            },
            //地图单击事件处理
            _mapClickHandler: function (evt) {
                if (this._distanceMeasure) {
                    this._distanceMeasureHandler(evt.mapPoint);
                }
            },
            /**
             * 距离测量处理
             * @param mapPoint 单击的点
             */
            _distanceMeasureHandler: function (mapPoint) {
                let me = this;
                this._inputPoints.push(mapPoint);//地图上添加鼠标点击处的点            
                //添加起点
                let textSymbol;
                if (this._inputPoints.length === 1) { //记录第一个点
                    textSymbol = new TextSymbol("起点", this._font, new Color([204, 102, 51]));
                    textSymbol.setOffset(0, -20);
                    this._map.getLayer("measureLayer").add(new Graphic(mapPoint, textSymbol));
                }
                //鼠标点击处添加点，并设置其样式
                this._map.getLayer("measureLayer").add(new Graphic(mapPoint, this._defaultMarkerSymbol));
                if (this._inputPoints.length >= 2) {
                    if (this._measureMethod === "GeometryServer") {
                        //方式一：利用ArcGIS Server的GeometryService服务，适用于具备ArcGIS Server环境的项目
                        let lengthParams = new LengthsParameters();
                        let url = this._geometryServiceUrl;
                        let geometryService = new GeometryService(url);
                        lengthParams.distanceUnit = GeometryService.UNIT_METER;
                        lengthParams.calculationType = "preserveShape";
                        let p1 = this._inputPoints[this._inputPoints.length - 2];
                        let p2 = this._inputPoints[this._inputPoints.length - 1];
                        //同一个点，解决重复添加的bug
                        if (p1.x == p2.x && p1.y == p2.y)
                            return;
                        //在两点之间画线将两点连接起来
                        let polyline = new Polyline(this._map.spatialReference);
                        polyline.addPath([p1, p2]);
                        lengthParams.polylines = [polyline];
                        //根据参数,动态计算长度
                        geometryService.lengths(lengthParams, function (distance) {
                            let _distance = number.format(distance.lengths[0]);//长度单位改为米
                            // debugger;
                            _distance = _distance.replace(",", '');//返回值每3位','隔开
                            me._totalDistance += parseFloat(_distance);//计算总长度
                            let beetwentDistances = _distance + "米";
                            let tdistance = new TextSymbol(beetwentDistances, me._font, new Color([204, 102, 51]));
                            tdistance.setOffset(40, -3);
                            me._map.getLayer("measureLayer").add(new Graphic(p2, tdistance));
                            if (me._totalGraphic) //如果总长度存在的话,就删除总长度Graphic
                                me._map.getLayer("measureLayer").remove(me._totalGraphic);
                            let total = number.format(me._totalDistance, { pattern: "#.000" });//保留三位小数
                            //设置总长度显示样式,并添加到地图上
                            let totalSymbol = new TextSymbol("总长度:" + total + "米", me._font, new Color([204, 102, 51]));
                            totalSymbol.setOffset(40, -20);
                            me._totalGraphic = me._map.getLayer("measureLayer").add(new Graphic(p2, totalSymbol));
                        });
                    } else {
                        //方式二：利用ArcGIS API中自带的GeometryEngine类，适用于地图坐标系(wkid)为3857或4326或平面投影坐标系
                        //设置距离测量的参数
                        let p1 = this._inputPoints[this._inputPoints.length - 2];
                        let p2 = this._inputPoints[this._inputPoints.length - 1];
                        //同一个点，解决重复添加的bug
                        if (p1.x == p2.x && p1.y == p2.y)
                            return;
                        //在两点之间画线将两点连接起来
                        let polyline = new Polyline(this._map.spatialReference);
                        polyline.addPath([p1, p2]);
                        let distance = 0;
                        //根据参数,动态计算长度
                        if (this._map.spatialReference.wkid == "3857" || (this._map.spatialReference.wkid == "102100") || this._map.spatialReference.wkid == "4326") {//在web麦卡托投影和WGS84坐标系下的计算方法
                            distance = geometryEngine.geodesicLength(polyline, "meters");//geodesicArea适用坐标系见官网API
                        } else {//在其他投影坐标系下的计算方法
                            distance = geometryEngine.planarLength(polyline, "meters");//planarArea适用于平面投影坐标系
                        }
        
                        let _distance = number.format(distance / 1000);
                        this._totalDistance += parseFloat(_distance);//计算总长度
                        let beetwentDistances = _distance + "千米";
                        let tdistance = new TextSymbol(beetwentDistances, this._font, new Color([204, 102, 51]));
                        tdistance.setOffset(40, -3);
                        this._map.getLayer("measureLayer").add(new Graphic(p2, tdistance));
                        if (this._totalGraphic) //如果总长度存在的话,就删除总长度Graphic
                            this._map.getLayer("measureLayer").remove(this._totalGraphic);
                        let total = number.format(this._totalDistance, { pattern: "#.000" });//保留三位小数
                        //设置总长度显示样式,并添加到地图上
                        let totalSymbol = new TextSymbol("总长度:" + total + "千米", this._font, new Color([204, 102, 51]));
                        totalSymbol.setOffset(40, -20);
                        this._totalGraphic = this._map.getLayer("measureLayer").add(Graphic(p2, totalSymbol));
                    }
                }
            },
            /**
             * 面积测量，对外暴露
             */
            measureArea: function () {
                this.clearMeasureActionAndGraphics();
                this._areaMeasure = true;
                this._drawBar.activate(Draw.POLYGON);
            },
            /**
             * 绘制结束监听事件
             */
            _drawEnd: function (evt) {
                if (this._distanceMeasure) {
                    this._inputPoints = [];
                }
                if (this._areaMeasure) {
                    let me = this;
                    let geometry = evt.geometry;
                    if (this._measureMethod === "GeometryServer") {
                        //方式一：利用ArcGIS Server的GeometryService服务，适用于具备ArcGIS Server环境的项目
                        let areasAndLengthParams = new AreasAndLengthsParameters();
                        let url = this._geometryServiceUrl;
                        let geometryService = new GeometryService(url);
                        areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
                        areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;//单位改为平方米
                        areasAndLengthParams.calculationType = 'preserveShape';
                        geometryService.simplify([geometry], function (simplifiedGeometries) {
                            areasAndLengthParams.polygons = simplifiedGeometries;
                            geometryService.areasAndLengths(areasAndLengthParams, function (result) {
                                let font = new Font("16px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
                                let lengthsResult = new TextSymbol(number.format(result.areas[0], {
                                    pattern: '#.000'
                                }) + "平方米", font, new Color([204, 102, 51]));
                                let spoint = new Point(evt.geometry.getExtent().getCenter().x, evt.geometry.getExtent().getCenter().y, me._map.spatialReference);
                                me._map.getLayer("measureLayer").add(new Graphic(spoint, lengthsResult)); //在地图上显示测量的面积
                            });
                        });
                    } else {
                        //方式二：利用ArcGIS API中自带的GeometryEngine类，适用于地图坐标系(wkid)为3857或4326或平面投影坐标系
                        let area = 0;
                        if ((geometry.spatialReference.wkid == "4326") || (geometry.spatialReference.wkid == "3857") || (geometry.spatialReference.wkid == "102100")) {
                            area = geometryEngine.geodesicArea(evt.geometry, "square-kilometers");//geodesicArea适用坐标系见官网API
                        } else {
                            area = geometryEngine.planarArea(evt.geometry, "square-kilometers");//planarArea适用于平面投影坐标系
                        }
                        this.drawArea+=parseFloat(area.toFixed(3)); 
                        let font = new Font("18px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL,
                                                            Font.WEIGHT_BOLDER);
                        let areaResult = new TextSymbol(number.format(area, { pattern: '#.000' }) + 
                                                            "平方千米", font, new Color([204, 102, 51]));
                        let spoint = new Point(geometry.getExtent().getCenter().x, geometry.getExtent().getCenter().y, this._map.spatialReference);
                        this._map.getLayer("measureLayer").add(new Graphic(spoint, areaResult));//在地图上显示测量的面积
                    } 
                }
                let resultSymbol;
                switch (evt.geometry.type) {
                    case 'polyline':
                        resultSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0,0.8]), 2);
                        break;
                    case 'polygon':
                        resultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                        break;
                }
                this._map.getLayer("measureLayer").add(new Graphic(evt.geometry, resultSymbol));
                this._distanceMeasure = false;
                this._areaMeasure = false;
                this._drawBar.deactivate();
            },
            /**
             * 清除测量动作及图上图形
             */
            clearMeasureActionAndGraphics: function () {
                this._distanceMeasure = false;
                this._areaMeasure = false;
                this._map.getLayer("measureLayer").clear();
                this._drawBar.deactivate();
            },
            /**
             * 参数校验
             */
            _checkParams: function (options) {
                if (!options.map) {
                    throw new Error("参数中必须包含map对象，参数格式：{'map': map}");
                }
                if (!options.geometryServiceUrl) {
                    this._measureMethod = "GeometryEngine";//未传入几何服务地址，改用GeometryEngine类进行测量
                    console.warn("未传入参数'geometryServiceUrl'，采用方式2计算，若地图坐标系非['4326','3857','任意平面投影坐标系']之一，可能测量失败");
                }
            },

        })

    });
