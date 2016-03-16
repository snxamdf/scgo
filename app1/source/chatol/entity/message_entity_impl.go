//scgen
package entity

import (
	"bytes"
	"fmt"
	"strconv"

	"github.com/snxamdf/scgo/sc/data"
)

//----------------------MessageBean begin--------------------------------------

type MessageBean struct {
	bean  *Message
	beans *Messages
}

func NewMessageBean() *MessageBean {
	e := &MessageBean{}
	return e
}

func (this *MessageBean) NewEntity() data.EntityInterface {
	return NewMessage()
}

func (this *MessageBean) NewEntitys(cap int) data.EntitysInterface {
	return NewMessages(cap)
}

func (this *MessageBean) Entity() data.EntityInterface {
	if this.bean == nil {
		return nil
	}
	return this.bean
}

func (this *MessageBean) Entitys() data.EntitysInterface {
	if this.beans == nil {
		return nil
	}
	return this.beans
}

func (this *MessageBean) Datas() *Messages {
	if this.beans == nil {
		return nil
	}
	return this.beans
}

func (this *MessageBean) Table() data.TableInformation {
	return messageTableInformation
}

func (this *MessageBean) FieldNames() data.FieldNames {
	return messageFieldNames
}

func (this *MessageBean) SetEntity(bean data.EntityInterface) {
	this.bean = bean.(*Message)
}

func (this *MessageBean) SetEntitys(beans data.EntitysInterface) {
	this.beans = beans.(*Messages)
}

//------------------------------------------------------------

//------------------------------------------------------------
type Messages struct {
	datas []data.EntityInterface
	page  *data.Page
}

func NewMessages(cap int) *Messages {
	e := &Messages{}
	e.datas = make([]data.EntityInterface, 0, cap)
	return e
}

func (this *Messages) SetPage(page *data.Page) {
	this.page = page
}

func (this *Messages) Add(e data.EntityInterface) {
	this.datas = append(this.datas, e.(*Message))
}

func (this *Messages) Values() []data.EntityInterface {
	return this.datas
}

func (this *Messages) Len() int {
	return len(this.datas)
}

func (this *Messages) Get(i int) *Message {
	return this.datas[i].(*Message)
}

func (this *Messages) Table() data.TableInformation {
	return messageTableInformation
}

func (this *Messages) FieldNames() data.FieldNames {
	return messageFieldNames
}

func (this *Messages) JSON() string {
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

//----------------------MessageBean end--------------------------------------

//----------------------Message begin--------------------------------------
func NewMessage() *Message {
	return &Message{}
}

func (this *Message) Id() *data.String {
	return &this.id
}

func (this *Message) SetId(value string) {
	this.id.SetValue(value)
}

func (this *Message) Name() *data.String {
	return &this.name
}

func (this *Message) SetName(value string) {
	this.name.SetValue(value)
}

func (this *Message) Phone() *data.String {
	return &this.phone
}

func (this *Message) SetPhone(value string) {
	this.phone.SetValue(value)
}

func (this *Message) Age() *data.Integer {
	return &this.age
}

func (this *Message) SetAge(value int) {
	this.age.SetValue(strconv.Itoa(value))
}

func (this *Message) Tt() *data.Integer {
	return &this.tt
}

func (this *Message) SetTt(value int) {
	this.tt.SetValue(strconv.Itoa(value))
}

func (this *Message) SetValue(filedName, value string) {
	this.Field(filedName).SetValue(value)
}

func (this *Message) Table() data.TableInformation {
	return messageTableInformation
}

func (this *Message) FieldNames() data.FieldNames {
	return messageFieldNames
}

func (this *Message) Field(filedName string) data.EntityField {
	switch filedName {
	case "id", "u_id":
		this.id.SetPrimaryKey(true)
		return this.id.StructType()
	case "name", "u_name":
		return this.name.StructType()
	case "phone", "u_phone":
		return this.phone.StructType()
	case "age", "u_age":
		return this.age.StructType()
	case "tt":
		return this.tt.StructType()
	}
	return nil
}

func (this *Message) JSON() string {
	var b bytes.Buffer
	b.WriteString("{")
	b.WriteString(fmt.Sprintf(`"id":%q`, this.id.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"name":%q`, this.name.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"phone":%q`, this.phone.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"age":%q`, this.age.Value()))
	b.WriteString(",")
	b.WriteString(fmt.Sprintf(`"tt":%q`, this.tt.Value()))
	b.WriteString("}")
	return b.String()
}

//----------------------NewMessage end--------------------------------------

//----------------------init() end--------------------------------------
func init() {
	messageTableInformation.SetTableName("users")
	messageColumnsArr := []string{
		"u_id", "u_name", "u_phone", "u_age",
	}
	messageTableInformation.SetColumns(messageColumnsArr)
	messageFieldNamesArr := []string{
		"id", "name", "phone", "age", "tt",
	}
	messageFieldNames.SetNames(messageFieldNamesArr)
}

var messageTableInformation data.TableInformation
var messageFieldNames data.FieldNames

//----------------------init() end--------------------------------------
