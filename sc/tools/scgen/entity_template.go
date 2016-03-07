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

func (this *{{.Name}}Bean) Entity() *{{.Name}} {
	return this.bean
}

func (this *{{.Name}}Bean) Entitys() *{{.Name}}s {
	return this.beans
}

func (this *{{.Name}}Bean) Table() data.TableInformation {
	return {{.TabName}}TableInformation
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
{{$beanName:=.Name}}
{{range $bean:=.Fileld}}
func (this *{{$beanName}}) {{upperFirst $bean.Name}}() {{fieldType $bean.Type}} {
	{{if equal "int" (fieldType $bean.Type)}}v, _ := strconv.Atoi(*this.id.Pointer())
	return v{{else}}return *this.{{$bean.Name}}.Pointer(){{end}}
}
{{end}}
	
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
	{{range .Fileld}}b.WriteString(fmt.Sprintf(` + "`" + `"{{lower .Name}}":%q` + "`" + `, this.{{upperFirst .Name}}()))
	{{end}}b.WriteString("}")
	return b.String()
}

//----------------------New{{.Name}} end--------------------------------------

//----------------------init() end--------------------------------------
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
//----------------------init() end--------------------------------------
`
