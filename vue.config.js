module.exports = {
    // 定义axios的代理，解决跨域问题
    publicPath: "/",
    // 部署应用包时的基本 URL
    outputDir: "dist",
    //输出文件目录，当运行 vue-cli-service build 时生成的生产环境构建文件的目录

    productionSourceMap: false,
    devServer: {
        // 配置webpack-dev-serve的行为 （webpack启动的本地服务器的行为）
        // 所有devserve的选项都支持
        host: "localhost",
        port: 5000,
        allowedHosts: "all",
        hot: true,

        //代理
        proxy: {
            //如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器

            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
                }
            },
        },
        client: {
            overlay: true
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
};