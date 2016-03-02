package chttp

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"runtime/debug"
)

var temp = template.Template{}

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
