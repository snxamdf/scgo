package chttp

import (
	"bytes"
	"net/http"
	"net/url"
	"scgo/sc/data"
)

type Context struct {
	Response http.ResponseWriter
	Request  *http.Request
	Params   url.Values
}

func (this *Context) GetParam(key string) []string {
	return this.Params[key]
}

func (this *Context) BindData(entity data.Interface) {
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
