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
		"lowerFirst": func(s string) string {
			v := s[0:1]
			v = strings.ToLower(v) + s[1:]
			return v
		},
		"upper": func(s string) string {
			return strings.ToUpper(s)
		},
		"upperFirst": func(s string) string {
			v := s[0:1]
			v = strings.ToUpper(v) + s[1:]
			return v
		},
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
		"fieldType": func(s string) string { //判断字段类型
			switch s {
			case "String":
				return "string"
			case "Integer":
				return "int"
			}
			return ""
		},
		"equal": func(s, e string) bool {
			return s == e
		},
	}
)
