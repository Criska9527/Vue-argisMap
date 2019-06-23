     // dev模式与build模式判断，区分使用url
var locationUrl = "buildUrl";
if (process.env.NODE_ENV === "development") {
       locationUrl = "devUrl";
}
const options = {
    url: 'https://js.arcgis.com/3.27/',// 这里的API地址可以是官网提供的CDN，也可在此配置离线部署的地址
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