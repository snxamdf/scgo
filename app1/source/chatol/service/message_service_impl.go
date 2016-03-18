//scgen
package service

import (
	"database/sql"
	"github.com/snxamdf/scgo/sc/data"
	"github.com/snxamdf/scgo/sc/data/scdb"
)

var MessageService = messageService{
	repository: scdb.Connection,
}

type messageService struct {
	repository scdb.RepositoryInterface
}

//保存对象,参数 : entity data.EntityInterface
func (this *messageService) Save(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Save(entity)
}

//修改对象,参数 : entity data.EntityInterface
func (this *messageService) Update(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Update(entity)
}

//保存或修改对象,参数 : entity data.EntityInterface
func (this *messageService) SaveOrUpdate(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.SaveOrUpdate(entity)
}

//查询多条,参数 : entity data.EntityBeanInterface
func (this *messageService) Select(bean data.EntityBeanInterface) error {
	return this.repository.Select(bean)
}

//分页查询,参数 : entity data.EntityBeanInterface
func (this *messageService) SelectPage(entityBean data.EntityBeanInterface, page *data.Page) error{
	return this.repository.SelectPage(entityBean, page)
}

//分页数量,参数 : entity data.EntityInterface
func (this *messageService) SelectCount(entity data.EntityInterface) (int, error){
	return this.repository.SelectCount(entity)
}

//查询一条,参数 : entity data.EntityInterface
func (this *messageService) SelectOne(entity data.EntityInterface) error {
	return this.repository.SelectOne(entity)
}

//删除,参数 : entity data.EntityInterface
func (this *messageService) Delete(entity data.EntityInterface) (sql.Result, error) {
	return this.repository.Delete(entity)
}

//执行自定义DML语言. (DDL,DCL待添加)
func (this *messageService) Execute(sql string, args ...interface{}) {
}
