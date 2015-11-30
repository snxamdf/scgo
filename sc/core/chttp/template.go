package chttp

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
)

var temp = template.Template{}

func (c *Context) HTML(name string, data interface{}) error {
	t, err := template.ParseFiles(name)
	if err != nil {
		fmt.Println(err)
	}
	err = t.ExecuteTemplate(c.Response, name, data)
	if err != nil {
		http.Error(c.Response, err.Error(), http.StatusInternalServerError)
	}
	return err
}

func (c *Context) JSON(v interface{}) error {
	err := json.NewEncoder(c.Response).Encode(v)
	if err != nil {
		http.Error(c.Response, err.Error(), http.StatusInternalServerError)
	}
	return err
}

func (c *Context) Redirect(url string, status ...int) {
	code := http.StatusFound
	if len(status) == 1 {
		code = status[0]
	}
	http.Redirect(c.Response, c.Request, url, code)
}
