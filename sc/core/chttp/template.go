package chttp

import (
	"encoding/json"
	"fmt"
	"html/template"
)

var temp = template.Template{}

func (c *Context) HTML(name string, data interface{}) error {
	//t := template.New("temp")
	t, err := template.ParseFiles(name)
	if err != nil {
		fmt.Println(err)
	}
	err = t.ExecuteTemplate(c.Response, name, data)
	return err
}

func (c *Context) JSON(v interface{}) error {
	err := json.NewEncoder(c.Response).Encode(v)
	return err
}
