window.webConfig = {
    //系统logo替换images下的logo里的svg文件,亮色暗色各一张，图片可以找网站在线转换为svg

    //DS 默认不用改
    VITE_APP_PROD_WEB_URL: '',

    //API服务、数据资产、接口管理
    VITE_APP_PROD_API_URL:'http://192.168.100.8:8187',

    //血缘管理
    VITE_APP_PROD_BLOOD_URL:'http://192.168.100.8:7777',

    //是否展示服务开发 0否 1是
    SHOW_API:1,

    //是否展示数据资产 0否 1是
    SHOW_DATA_ASSETS:1,

    //是否展示接口开发 0否 1是
    SHOW_REST:1,

    //是否展示logo 0否 1是
    SHOW_LOGO:1,

    //资产总览首页嵌入页面,为空将隐藏首页菜单
    VITE_APP_PROD_ASSETS_HOME_URL:'http://192.168.100.163:8080/webroot/decision/view/duchamp?viewlet=%25E6%2595%25B0%25E6%258D%25AE%25E8%25B5%2584%25E4%25BA%25A7%25E5%2585%25A8%25E6%2599%25AF.fvs&page=0',

    //数据探查嵌入页面,为空将隐藏数据探查
    VITE_APP_PROD_ASSETS_QUERY_URL:'http://192.168.100.88:10824',

    //初始化的项目编号，同步修改平台嵌入的数据开发及运维里的url中的编号
    VITE_APP_PROD_PROJECT_ID:10833729111968,

    //是否嵌入到其他平台,将隐藏上和左菜单栏 0否 1是
    VITE_APP_PROD_IS_IFRAME:0

}
