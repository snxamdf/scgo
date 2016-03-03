package main

var entityTemp = `//scgen
package entity

import (
	"bytes"
	"fmt"
	"scgo/sc/data"
)

func New{{.Name}}() *{{.Name}} {
	return &{{.Name}}{}
}

func New{{.Name}}s(cap int) []*{{.Name}} {
	return make([]*{{.Name}}, 0, cap)
}

func (this *{{.Name}}) SetValue(filedName, value string) {
	this.Field(filedName).SetValue(value)
}

func (this *{{.Name}}) Field(filedName string) data.EntityField {
	switch filedName {
	{{range $bean:=.Fileld}}case "{{lower $bean.Name}}"{{if isNotBlank $bean.Column.Name}},"{{lower $bean.Column.Name}}"{{end}}:
		return this.{{$bean.Name}}.StructType()
	{{end}}
	}
	return nil
}

func (this *{{.Name}}) JSON() string {
	var b bytes.Buffer
	b.WriteString("{")
	{{range .Fileld}}b.WriteString(fmt.Sprintf(` + "`" + `"{{lower .Name}}":%q` + "`" + `, this.{{.Name}}.Value()))
	{{end}}b.WriteString("}")
	return b.String()
}

func init() {
	{{.TabName}}TableInformation.SetTableName("{{.TabName}}")
	{{.TabName}}Columns := []string{
	{{range $field:=.Fileld}}{{$colm:=$field.Column}}{{if isNotBlank $colm.Name}}"{{$colm.Name}}",{{end}}{{end}}
	}
	{{.TabName}}TableInformation.SetColumns({{.TabName}}Columns)
}

var {{.TabName}}TableInformation data.TableInformation

func (this *{{.Name}}) Table() data.TableInformation {
	return {{.TabName}}TableInformation
}

`
