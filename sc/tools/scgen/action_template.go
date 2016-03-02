package main

var actionTemp = `//scgen
package action

import (
	"scgo/sc/core/chttp"
	"study/app1/source/entity"
)

func init() {
	chttp.Action("/get", get).Get()
	chttp.Action("/post", post).Post()
}

//gen
func get(c chttp.Context) {
	e := entity.New{{.Bean.Name}}()
	c.BindData(e)
	c.JSON(e.JSON())
}

//gen
func post(c chttp.Context) {
	e := entity.New{{.Bean.Name}}()
	c.BindData(e)
	c.HTML("/test/test.html", e)
}
`
