package chttp

import (
	"net/http"
)

//路由
var staticRoute *StaticRoute

var htmlRoute *StaticRoute

type StaticRoute struct {
	handle http.Handler
}

func (this *StaticRoute) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	this.handle.ServeHTTP(w, r)
}
