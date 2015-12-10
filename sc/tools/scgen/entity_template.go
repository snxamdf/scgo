package main

var entityTemp = `//scgen
package entity

import (
	"bytes"
	"fmt"
	"strings"
)

func New{{.Bean.Name}}() *Users {
	return &{{.Bean.Name}}{}
}

func (this *{{.Bean.Name}}) SetValue(filed, value string) {
	switch filed {
		{{range $bean:=.Bean.Fileld}}case "{{lower $bean.Name}}":
			this.{{$bean.Name}}.SetValue(value)
		break
		{{end}}
	}
}

func (this *{{.Bean.Name}}) JSON() string {
	var b bytes.Buffer
	b.WriteString("{")
	{{range .Bean.Fileld}}b.WriteString(fmt.Sprintf(` + "`" + `"{{lower .Name}}":%q` + "`" + `, this.{{.Name}}.Value()))
	{{end}}b.WriteString("}")
	return b.String()
}
`
