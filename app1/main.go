package main

import (
	_ "github.com/snxamdf/scgo/app1/source/chatol/action"
	_ "github.com/snxamdf/scgo/app1/source/common/action"

	"github.com/snxamdf/scgo/sc/core/chttp"
	_ "github.com/snxamdf/scgo/sc/data/mysql"
)

func main() {
	chttp.Conf = &chttp.Config{
		Static: chttp.Mapping{
			Dir:    "static",
			Prefix: "/static",
			Ext:    []string{"js", "css", "gif", "jpg", "png", "ico"},
		},
		Html: chttp.Mapping{
			Dir:    "template",
			Prefix: "/",
			Ext:    []string{"html", "htm"},
		},
		Error404: chttp.ErrorPage{
			Url:     "/error404",
			Message: "404 not page",
		},
		Error500: chttp.ErrorPage{
			Url:     "/error500",
			Message: "server 500 error",
		},
		Template: chttp.Template{
			Dir: "template",
		},
		Debug: true,
		Port:  ":8080",
	}

	chttp.Run()
}
