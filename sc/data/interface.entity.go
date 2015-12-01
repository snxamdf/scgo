package data

import (
	"strconv"
)

type Entity interface {
	SetValue(value string)
	Value()
}

type Interface interface {
	SetValue(filed, value string)
}

type String struct {
	value string
}

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

func (this *Integer) Value() string {
	return strconv.Itoa(this.value)
}

func (this *String) Value() string {
	return this.value
}
