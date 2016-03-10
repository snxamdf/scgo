package chttp

import (
	"bytes"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"runtime/debug"
	"scgo/sc/data"
)

var temp = template.Template{}

//当前请求的上下文
type Context struct {
	Response http.ResponseWriter
	Request  *http.Request
	Params   url.Values
}

//获取参数
func (this *Context) GetParam(key string) []string {
	return this.Params[key]
}

//绑定实体数据
func (this *Context) BindData(entity data.EntityInterface) {
	for k, v := range this.Params {
		var b bytes.Buffer
		for i, v := range v {
			if i > 0 {
				b.WriteString(",")
			}
			b.WriteString(v)
		}
		entity.SetValue(k, b.String())
	}
}

//跳转html模版页面
func (c *Context) HTML(name string, data interface{}) {
	defer func() {
		if err := recover(); err != nil {
			if Conf.Debug {
				log.Println(err, string(debug.Stack()))
			} else {
				log.Panicln(err)
			}
		}
	}()
	t, err := template.ParseFiles(Conf.Template.Dir + name)
	if err != nil {
		log.Println(err)
	}
	err = t.Execute(c.Response, data)
	if err != nil {
		http.Error(c.Response, err.Error(), http.StatusInternalServerError)
	}
}

//响应json
func (c *Context) JSON(v interface{}) {
	defer func() {
		if err := recover(); err != nil {
			if Conf.Debug {
				log.Println(err, string(debug.Stack()))
			} else {
				log.Panicln(err)
			}
		}
	}()
	err := json.NewEncoder(c.Response).Encode(v)
	if err != nil {
		http.Error(c.Response, err.Error(), http.StatusInternalServerError)
	}
}

//重定向
func (c *Context) Redirect(url string, status ...int) {
	code := http.StatusFound
	if len(status) == 1 {
		code = status[0]
	}
	http.Redirect(c.Response, c.Request, url, code)
}

//Page
func (c *Context) Page() *data.Page {
	page := &data.Page{}

	return page
}
