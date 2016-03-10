package main

var serviceTempImpl = `//scgen
package service

import (
	"database/sql"
	"scgo/sc/data"
	"scgo/sc/data/scdb"
)

var {{.Name}}Service = {{lowerFirst .Name}}Service{
	repository: scdb.Connection,
}

type {{lowerFirst .Name}}Service struct {
	repository scdb.RepositoryInterface
}

//查询多条,参数 : entity data.EntityBeanInterface
func (this *{{lowerFirst .Name}}Service) Select(bean data.EntityBeanInterface) error {
	return this.repository.Select(bean)
}

//保存对象,参数 : entity data.EntityInterface
func (this *{{lowerFirst .Name}}Service) Save(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Save(entity)
}

//修改对象,参数 : entity data.EntityInterface
func (this *{{lowerFirst .Name}}Service) Update(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Update(entity)
}

//保存或修改对象,参数 : entity data.EntityInterface
func (this *{{lowerFirst .Name}}Service) SaveOrUpdate(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.SaveOrUpdate(entity)
}

//查询一条,参数 : entity data.EntityInterface
func (this *{{lowerFirst .Name}}Service) SelectOne(entity data.EntityInterface) error {
	return this.repository.SelectOne(entity)
}

//删除,参数 : entity data.EntityInterface
func (this *{{lowerFirst .Name}}Service) Delete(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Delete(entity)
}

//执行自定义DML语言. (DDL,DCL待添加)
func (this *{{lowerFirst .Name}}Service) Execute(sql string, args ...interface{}) {
}
`

var serviceTemp = `//scgen
package service
`
