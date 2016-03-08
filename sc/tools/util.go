package tools

import (
	"strings"
)

func IsBlank(s string) bool {
	if strings.Trim(s, " ") == "" || s == "nil" || s == "null" {
		return true
	}
	return false
}
func IsNotBlank(s string) bool {
	if strings.Trim(s, " ") != "" && s != "nil" && s != "null" {
		return true
	}
	return false
}
