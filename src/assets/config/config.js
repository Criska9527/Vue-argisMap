     // dev模式与build模式判断，区分使用url
var locationUrl = "buildUrl";
if (process.env.NODE_ENV === "development") {
       locationUrl = "devUrl";
}
const options = {
    url: 'http://61.143.248.136:8090/arcgis_js_api/library/3.27/3.27/init.js',// 这里的API地址可以是官网提供的CDN，也可在此配置离线部署的地址
    dojoConfig: {
        async: true,
        packages: [
          {
            
            location: '/static/widgets',
            name: 'widgets'
          }
        ]
      }

}
export default {
    options
}