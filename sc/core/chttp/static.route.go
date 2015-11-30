package chttp

import (
	"net/http"
)

//静态路由
var staticRoute *StaticRoute

var htmlRoute *StaticRoute

type StaticRoute struct {
	handle http.Handler
}

//静态路由实现ServeHTTP
func (this *StaticRoute) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	this.handle.ServeHTTP(w, r)
}
