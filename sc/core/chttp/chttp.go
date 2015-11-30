package chttp

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type action map[string]*curl

type method struct {
	method string
}

type curl struct {
	permissions []string
	mfunc       func(Context)
	method      method
}

type Context struct {
	Response http.ResponseWriter
	Request  *http.Request
	Params   url.Values
}

//路由
type Route struct {
	action action
}

//路由
var route = &Route{
	action: make(map[string]*curl),
}

//实现ServeHTTP
func (this *Route) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if err := recover(); err != nil {
			log.Fatal(err)
			this.Error500(w, r)
		}
	}()
	url := r.URL.String()
	ix := strings.Index(url, "?")
	if ix > 0 {
		url = url[0:ix]
	}
	if this.isStatic(url) { //js、css、image
		if staticRoute == nil {
			staticRoute = &StaticRoute{
				handle: http.StripPrefix(Conf.Static.Prefix, http.FileServer(http.Dir(Conf.Static.Dir))),
			}
		}
		staticRoute.ServeHTTP(w, r)
		return
	} else if this.isHtml(url) { //html
		if htmlRoute == nil {
			htmlRoute = &StaticRoute{
				handle: http.StripPrefix(Conf.Html.Prefix, http.FileServer(http.Dir(Conf.Html.Dir))),
			}
		}
		htmlRoute.ServeHTTP(w, r)
		return
	} else if murl, ok := this.action[url]; ok { //请求url判断
		if murl.method.method == ALL || murl.method.method == r.Method { //请求方式判断
			//判断是否设置了url权限
			if murl.permissions != nil && len(murl.permissions) > 0 {

			} else {
				c, err := this.Context(w, r)
				if err != nil {
					fmt.Errorf(err.Error())
				}
				murl.mfunc(c) //调用函数
			}
		} else {
			this.Error404(w, r)
		}
	} else {
		this.Error404(w, r)
	}
}

//404 error
func (*Route) Error500(w http.ResponseWriter, r *http.Request) {
	if Conf.Error500.Url != "" {
		http.Redirect(w, r, Conf.Error500.Url, http.StatusFound)
		return
	} else {
		w.WriteHeader(500)
		w.Write([]byte(Conf.Error500.Message))
	}
}

//404 error
func (*Route) Error404(w http.ResponseWriter, r *http.Request) {
	if Conf.Error404.Url != "" {
		http.Redirect(w, r, Conf.Error404.Url, http.StatusFound)
		return
	} else {
		w.WriteHeader(404)
		w.Write([]byte(Conf.Error404.Message))
	}
}

//判断是否为静态js、css、image等文件请求
func (*Route) isStatic(url string) bool {
	if strings.HasPrefix(url, Conf.Static.Prefix) {
		for _, v := range Conf.Static.Ext {
			if strings.HasSuffix(url, v) {
				return true
			}
		}
		return false
	} else {
		return false
	}
}

//判断是否为静态html文件请求
func (*Route) isHtml(url string) bool {
	if strings.HasPrefix(url, Conf.Html.Prefix) {
		for _, v := range Conf.Html.Ext {
			if strings.HasSuffix(url, v) {
				return true
			}
		}
		return false
	}
	return false
}

//当前请求的上下文
func (*Route) Context(w http.ResponseWriter, r *http.Request) (Context, error) {
	values := url.Values{}
	err := r.ParseForm()
	if err != nil {
		fmt.Println(err)
		return Context{}, err
	}
	if r.Method == GET {
		values = r.Form
	} else {
		values = r.PostForm
	}
	c := Context{
		Response: w,
		Request:  r,
		Params:   values,
	}
	return c, nil
}

//运行服务
func Run() {
	err := http.ListenAndServe(Conf.Port, route)
	if err != nil {
		log.Fatal(err)
	}
}
