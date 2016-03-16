//scgen
package entity

import (
	"bytes"
	"fmt"
	"strconv"

	"github.com/snxamdf/scgo/sc/data"
)

//----------------------TestBean begin--------------------------------------

type TestBean struct {
	bean  *Test
	beans *Tests
}

func NewTestBean() *TestBean {
	e := &TestBean{}
	return e
}

func (this *TestBean) NewEntity() data.EntityInterface {
	return NewTest()
}

func (this *TestBean) NewEntitys(cap int) data.EntitysInterface {
	return NewTests(cap)
}

func (this *TestBean) Entity() data.EntityInterface {
	if this.bean == nil {
		return nil
	}
	return this.bean
}

func (this *TestBean) Entitys() data.EntitysInterface {
	if this.beans == nil {
		return nil
	}
	return this.beans
}

func (this *TestBean) Datas() *Tests {
	if this.beans == nil {
		return nil
	}
	return this.beans
}

func (this *TestBean) Table() data.TableInformation {
	return testTableInformation
}

func (this *TestBean) FieldNames() data.FieldNames {
	return testFieldNames
}

func (this *TestBean) SetEntity(bean data.EntityInterface) {
	this.bean = bean.(*Test)
}

func (this *TestBean) SetEntitys(beans data.EntitysInterface) {
	this.beans = beans.(*Tests)
}

//------------------------------------------------------------

//------------------------------------------------------------
type Tests struct {
	datas []data.EntityInterface
	page  *data.Page
}

func NewTests(cap int) *Tests {
	e := &Tests{}
	e.datas = make([]data.EntityInterface, 0, cap)
	return e
}

func (this *Tests) SetPage(page *data.Page) {
	this.page = page
}

func (this *Tests) Add(e data.EntityInterface) {
	this.datas = append(this.datas, e.(*Test))
}

func (this *Tests) Values() []data.EntityInterface {
	return this.datas
}

func (this *Tests) Len() int {
	return len(this.datas)
}

func (this *Tests) Get(i int) *Test {
	return this.datas[i].(*Test)
}

func (this *Tests) Table() data.TableInformation {
	return testTableInformation
}

func (this *Tests) FieldNames() data.FieldNames {
	return testFieldNames
}

func (this *Tests) JSON() string {
	var wr bytes.Buffer
	wr.WriteString("[")
	for i, v := range this.Values() {
		if i > 0 {
			wr.WriteString(",")
		}
		wr.WriteString(v.JSON())
	}
	wr.WriteString("]")
	return wr.String()
}

//----------------------TestBean end--------------------------------------

//----------------------Test begin--------------------------------------
func NewTest() *Test {
	return &Test{}
}

func (this *Test) Tid() *data.String {
	return &this.tid
}

func (this *Test) SetTid(value string) {
	this.tid.SetValue(value)
}

func (this *Test) Tname() *data.String {
	return &this.tname
}

func (this *Test) SetTname(value string) {
	this.tname.SetValue(value)
}

func (this *Test) Tage() *data.Integer {
	return &this.tage
}

func (this *Test) SetTage(value int) {
	this.tage.SetValue(strconv.Itoa(value))
}

func (this *Test) SetValue(filedName, value string) {
	this.Field(filedName).SetValue(value)
}

func (this *Test) Table() data.TableInformation {
	return testTableInformation
}

func (this *Test) FieldNames() data.FieldNames {
	return testFieldNames
}

func (this *Test) Field(filedName string) data.EntityField {
	switch filedName {
	case "tid":
		this.tid.SetPrimaryKey(true)
		return this.tid.StructType()
	case "tname":
		return this.tname.StructType()
	case "tage":
		return this.tage.StructType()
	}
	return nil
}

func (this *Test) JSON() string {
	var b bytes.Buffer
	b.WriteString("{")
	b.WriteString(fmt.Sprintf(`"tid":%q`, this.tid.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"tname":%q`, this.tname.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"tage":%q`, this.tage.Value()))
	b.WriteString("}")
	return b.String()
}

//----------------------NewTest end--------------------------------------

//----------------------init() end--------------------------------------
func init() {
	testTableInformation.SetTableName("tests")
	testColumnsArr := []string{
		"tid", "tname", "tage",
	}
	testTableInformation.SetColumns(testColumnsArr)
	testFieldNamesArr := []string{
		"tid", "tname", "tage",
	}
	testFieldNames.SetNames(testFieldNamesArr)
}

var testTableInformation data.TableInformation
var testFieldNames data.FieldNames

//----------------------init() end--------------------------------------
