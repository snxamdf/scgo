package main

var entityTemp = `//scgen
package entity

import (
	"bytes"
	"fmt"
	"scgo/sc/data"
	"strconv"
)

//----------------------{{.Name}}Bean begin--------------------------------------

type {{.Name}}Bean struct {
	bean  *{{.Name}}
	beans *{{.Name}}s
}

func New{{.Name}}Bean() *{{.Name}}Bean {
	e := &{{.Name}}Bean{}
	return e
}

func (this *{{.Name}}Bean) NewEntity() data.EntityInterface {
	return New{{.Name}}()
}

func (this *{{.Name}}Bean) NewEntitys(cap int) data.EntitysInterface {
	e := &{{.Name}}s{}
	e.datas = make([]*{{.Name}}, 0, cap)
	return e
}

func (this *{{.Name}}Bean) Entity() data.EntityInterface {
	return this.bean
}

func (this *{{.Name}}Bean) Entitys() *{{.Name}}s {
	return this.beans
}

func (this *{{.Name}}Bean) Table() data.TableInformation {
	return {{lower .Name}}TableInformation
}

func (this *{{.Name}}Bean) SetEntity(bean data.EntityInterface) {
	this.bean = bean.(*{{.Name}})
}

func (this *{{.Name}}Bean) SetEntitys(beans data.EntitysInterface) {
	this.beans = beans.(*{{.Name}}s)
}

//------------------------------------------------------------

//------------------------------------------------------------
type {{.Name}}s struct {
	datas []*{{.Name}}
}

func (this *{{.Name}}s) Add(e data.EntityInterface) {
	this.datas = append(this.datas, e.(*{{.Name}}))
}

func (this *{{.Name}}s) Values() []*{{.Name}} {
	return this.datas
}

//----------------------{{.Name}}Bean end--------------------------------------

//----------------------{{.Name}} begin--------------------------------------
func New{{.Name}}() *{{.Name}} {
	return &{{.Name}}{}
}
{{$beanName:=.Name}}{{range $bean:=.Fileld}}
func (this *{{$beanName}}) {{upperFirst $bean.Name}}() *data.{{if equal "int" (fieldType $bean.Type)}}Integer{{else if equal "string" (fieldType $bean.Type)}}String{{end}} {
	return &this.{{$bean.Name}}
}

func (this *{{$beanName}}) Set{{upperFirst $bean.Name}}(value {{if equal "int" (fieldType $bean.Type)}}int{{else}}string{{end}}) {
	this.{{$bean.Name}}.SetValue({{if equal "int" (fieldType $bean.Type)}}strconv.Itoa(value){{else}}value{{end}})
}
{{end}}
func (this *{{.Name}}) SetValue(filedName, value string) {
	this.Field(filedName).SetValue(value)
}

func (this *{{.Name}}) Table() data.TableInformation {
	return {{lower .Name}}TableInformation
}

func (this *{{.Name}}) Field(filedName string) data.EntityField {
	switch filedName {
	{{range $field:=.Fileld}}case "{{lower $field.Name}}"{{if isNotBlank $field.Column.Name}}, "{{lower $field.Column.Name}}"{{end}}:
		{{if $field.Column.Identif}}this.{{$field.Name}}.SetPrimaryKey(true)
		return this.{{$field.Name}}.StructType(){{else}}return this.{{$field.Name}}.StructType(){{end}}
	{{end}}}
	return nil
}

func (this *{{.Name}}) JSON() string {
	var b bytes.Buffer
	b.WriteString("{")
	{{range .Fileld}}b.WriteString(fmt.Sprintf(` + "`" + `"{{lower .Name}}":%q` + "`" + `, this.{{upperFirst .Name}}()))
	{{end}}b.WriteString("}")
	return b.String()
}

//----------------------New{{.Name}} end--------------------------------------

//----------------------init() end--------------------------------------
func init() {
	{{lower .Name}}TableInformation.SetTableName("{{.TabName}}")
	{{lower .Name}}Columns := []string{
		{{range $field:=.Fileld}}{{$colm:=$field.Column}}{{if isNotBlank $colm.Name}}"{{$colm.Name}}", {{end}}{{end}}
	}
	{{lower .Name}}TableInformation.SetColumns({{lower .Name}}Columns)
}

var {{lower .Name}}TableInformation data.TableInformation

//----------------------init() end--------------------------------------
`
