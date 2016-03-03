package data

//实体字段接口
type EntityField interface {
	Value() *string
	Type() string
	SetValue(value string)
}

//实体
type EntityInterface interface {
	SetValue(filed, value string)
	Field(filedName string) EntityField
	JSON() string
	Table() TableInformation
	//News() []EntityInterface
}

type TableInformation struct {
	tableName string
	columns   []string
}

func (this *TableInformation) SetTableName(tableName string) {
	this.tableName = tableName
}

func (this *TableInformation) SetColumns(columns []string) {
	this.columns = columns
}

func (this *TableInformation) TableName() string {
	return this.tableName
}

func (this *TableInformation) Columns() []string {
	return this.columns
}

//字符串类型
type String struct {
	value string
}

//整型类型
type Integer struct {
	value string
}

func (this *Integer) SetValue(value string) {
	this.value = value
}

func (this *Integer) Value() *string {
	return &this.value
}

func (this *Integer) Type() string {
	return "int"
}

func (this *Integer) StructType() *Integer {
	return this
}

func (this *String) SetValue(value string) {
	this.value = value
}

func (this *String) Value() *string {
	return &this.value
}

func (this *String) Type() string {
	return "string"
}

func (this *String) StructType() *String {
	return this
}
