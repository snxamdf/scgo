package chttp

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type Context struct {
	Response http.ResponseWriter
	Request  *http.Request
	Params   url.Values
}

type action map[string]func(Context)

type Handle struct {
	action      action
	permissions []string
	method      string
}

var handle = &Handle{
	action: make(action),
}

func (me *Handle) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()
	ix := strings.Index(url, "?")
	if ix > 0 {
		url = url[0:ix]
	}
	if hdfunc, ok := me.action[url]; ok {
		c, err := me.Context(w, r)
		if err != nil {
			fmt.Errorf(err.Error())
		}
		hdfunc(c)
	} else {
		w.Write([]byte("404"))
	}
}

func (me *Handle) Context(w http.ResponseWriter, r *http.Request) (Context, error) {
	values := url.Values{}
	err := r.ParseForm()
	if err != nil {
		fmt.Println(err)
		return Context{}, err
	}
	if r.Method == "GET" {
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

func Run(port string) {
	http.ListenAndServe(port, handle)
}
