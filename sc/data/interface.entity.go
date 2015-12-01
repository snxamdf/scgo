package data

import (
	"strconv"
)

//实体接口
type EntityField interface {
	SetValue(value string)
	Value()
}

//实体
type EntityInterface interface {
	SetValue(filed, value string)
}

//字符串类型
type String struct {
	value string
}

//整型类型
type Integer struct {
	value int
}

func (this *String) SetValue(value string) {
	this.value = value
}

func (this *Integer) SetValue(value string) {
	val, err := strconv.Atoi(value)
	if err == nil {
		this.value = val
	}
}

func (this *Integer) Value() int {
	return this.value
}

func (this *String) Value() string {
	return this.value
}
