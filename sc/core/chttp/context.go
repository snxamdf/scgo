package chttp

import (
	"bytes"
	"net/http"
	"net/url"
	"scgo/sc/data"
)

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
