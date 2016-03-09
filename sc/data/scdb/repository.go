package scdb

import (
	"database/sql"
	"scgo/sc/data"
	"scgo/sc/data/scsql"
)

type RepositoryInterface interface {
	DB() *sql.DB
	Save(entity data.EntityInterface) (sql.Result, error)
	Update(entity data.EntityInterface) (sql.Result, error)
	SaveOrUpdate(entity data.EntityInterface) (sql.Result, error)
	Delete(entity data.EntityInterface)
	Execute(sql string, args ...interface{})
	Select(entityBean data.EntityBeanInterface) error
	Prepare(csql scsql.SCSQL) (*sql.Stmt, error)
}
