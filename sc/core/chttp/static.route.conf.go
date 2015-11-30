package chttp

//路由配置
var Conf *Config

type Config struct {
	Static   Mapping   //静态文件 url 映射css、js、image
	Html     Mapping   //html文件 url 映射
	Port     string    //服务商品
	Error404 ErrorPage //404错误页面
	Error500 ErrorPage //500错误页面
}

type Mapping struct {
	Dir    string
	Prefix string
	Ext    []string
}

type ErrorPage struct {
	Url     string ""
	Message string ""
}
