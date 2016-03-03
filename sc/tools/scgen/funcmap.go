package main

import (
	"strings"
	"text/template"
)

var (
	funcmap = template.FuncMap{
		"lower": func(s string) string {
			return strings.ToLower(s)
		},
		//"lowerFirst": func(s string) string { return strings.ToLowerFirst(s) },
		"upper": func(s string) string {
			return strings.ToUpper(s)
		},
		//"upperFirst": func(s string) string { return strings.ToUpperFirst(s) },
		"isBlank": func(s string) bool {
			if strings.Trim(s, " ") == "" || s == "nil" || s == "null" {
				return true
			}
			return false
		},
		"isNotBlank": func(s string) bool {
			if strings.Trim(s, " ") != "" && s != "nil" && s != "null" {
				return true
			}
			return false
		},
	}
)
