package data

//实体bean
type EntityBeanInterface interface {
	NewEntity() EntityInterface
	NewEntitys(cap int) EntitysInterface
	SetEntity(bean EntityInterface)
	SetEntitys(beans EntitysInterface)
	Table() TableInformation
	Entity() EntityInterface
}

//单个实体
type EntityInterface interface {
	SetValue(filed, value string)
	Field(filedName string) EntityField
	JSON() string
	Table() TableInformation
}

//多个个实体
type EntitysInterface interface {
	Add(e EntityInterface)
}

//------------------TableInformation begin-------------------------------
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

//------------------TableInformation begin-------------------------------
