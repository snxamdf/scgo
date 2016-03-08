package scdb

import (
	"database/sql"
	"log"
	"scgo/sc/data"
	"scgo/sc/data/scsql"
)

type Repository struct {
	DBSource DBSourceInterface
}

func (this *Repository) DB() *sql.DB {
	db := this.DBSource.DB()
	return db
}

func (this *Repository) Save(entity data.EntityInterface) (sql.Result, error) {
	table := entity.Table()
	csql := scsql.SCSQL{Table: table, Entity: entity}
	if csql.PrimaryKeyIsBlank() {
		csql.S_TYPE = scsql.SC_U
	} else {
		csql.S_TYPE = scsql.SC_I
	}
	csql.ParseSQL()

	stmt, err := this.Prepare(csql)
	if err != nil {
		log.Println("error", err)
		return nil, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(csql.Args...)
	if err != nil {
		log.Println("error", err)
		return nil, err
	}
	return result, nil
}

func (this *Repository) Update(entity data.EntityInterface, args ...interface{}) {

}

func (this *Repository) SaveOrUpdate(entity data.EntityInterface, args ...interface{}) {

}

func (this *Repository) Delete(entity data.EntityInterface, args ...interface{}) {

}

func (this *Repository) Execute(sql string, args ...interface{}) {

}

func (this *Repository) Select(entityBean data.EntityBeanInterface, args ...interface{}) error {
	table := entityBean.Table()
	csql := scsql.SCSQL{S_TYPE: scsql.SC_S, Table: table, Args: args, Entity: entityBean.Entity()}
	csql.ParseSQL()

	stmt, err := this.Prepare(csql)
	if err != nil {
		log.Println("error", err)
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(csql.Args...)
	if err != nil {
		log.Println("error", err)
		return err
	}
	defer rows.Close()

	cols, err := rows.Columns()
	if err != nil {
		log.Println("error", err)
		return err
	}

	colsLen := len(cols)
	beans := entityBean.NewEntitys(5)

	for rows.Next() {
		vals := make([]interface{}, colsLen)
		bean := entityBean.NewEntity()
		for i := 0; i < colsLen; i++ {
			colm := cols[i]
			if field := bean.Field(colm); field != nil {
				vals[i] = field.Pointer()
			}
		}
		err = rows.Scan(vals...)
		if err != nil {
			log.Println("error", err)
			return err
		}
		beans.Add(bean)
	}
	entityBean.SetEntitys(beans)
	return nil
}

func (this *Repository) Prepare(csql scsql.SCSQL) (*sql.Stmt, error) {
	var db = this.DB()
	stmt, err := db.Prepare(csql.SQL())
	return stmt, err
}
