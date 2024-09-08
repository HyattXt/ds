window.webConfig = {
    //系统logo替换images下的logo里的svg文件,亮色暗色各一张，图片可以找网站在线转换为svg

    //DS 默认不用改
    VITE_APP_PROD_WEB_URL: '',

    //API服务、数据资产、接口管理
    VITE_APP_PROD_API_URL:'http://192.168.100.32:9999/HData/DevApi',

    //血缘管理
    VITE_APP_PROD_BLOOD_URL:'http://192.168.100.87:7777/HData/DataLineage/index.html',

    //资产运营
    VITE_APP_PROD_BUSINESS_URL:'http://192.168.100.32:9999/HData/DataLabelUi',

    //是否展示服务开发 0否 1是
    SHOW_API:1,

    //是否展示数据资产 0否 1是
    SHOW_DATA_ASSETS:1,

    //是否展示资产运营 0否 1是
    SHOW_BUSINESS:1,

    //是否展示logo 0否 1是
    SHOW_LOGO:1,

    //数据探查嵌入页面,为空将隐藏数据探查
    VITE_APP_PROD_ASSETS_QUERY_URL:'http://192.168.100.88:10824/HData/DataOpt',

    //初始化的项目编号，同步修改平台嵌入的数据开发及运维里的url中的编号
    VITE_APP_PROD_PROJECT_ID:10833729111968,

    //是否嵌入到其他平台,将隐藏上和左菜单栏 0否 1是
    VITE_APP_PROD_IS_IFRAME:0

}
