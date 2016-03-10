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

//分页
//type PageInterface interface {
//	New(pageNo, pageSize int)
//}

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
	Table() TableInformation
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

//------------------Page begin-------------------------------
//分页
type Page struct {
	FirstResult int //开始位置
	MaxResults  int //查询几条
	PageNo      int //页号
	PageSize    int //每页数
	Total       int //查询结果：总数量
	TotalPage   int //查询结果：总页数
}

func (this *Page) New(pageNo, pageSize int) {
	if pageNo <= 0 {
		pageNo = 1
	}
	this.FirstResult = (pageNo - 1) * pageSize
	this.MaxResults = pageSize
	this.PageNo = pageNo
	this.PageSize = pageSize
}

//------------------Page end-------------------------------
