package mysql

import (
	"database/sql"
	"log"
	"scgo/sc/data"
	"scgo/sc/data/db"
)

type Repository struct {
	dbSource db.DBSourceInterface
}

//alias 别名,driverName 驱动名称
func New(alias, driverName string) *Repository {
	c := &db.Config{
		Alias:        alias,
		DriverName:   driverName,
		UserName:     "root",
		PassWord:     "root",
		Ip:           "localhost",
		Prot:         "3306",
		DBName:       "testdb",
		Charset:      "",
		MaxIdleConns: 10,
		MaxOpenConns: 100,
	}
	c.Init()
	return &Repository{
		dbSource: c,
	}
}

func (this *Repository) DB() *sql.DB {
	return this.dbSource.DB()
}

func (this *Repository) Select(entityBean data.EntityBeanInterface) {
	var db = this.DB()
	defer db.Close()
	table := entityBean.Table()

	csql := scSql{sTYPE: SC_S, table: table}
	csql.TableToSql()

	rows, err := db.Query(csql.Sql())
	if err != nil {
		log.Println(err)
		return
	}
	cols, err := rows.Columns()
	if err != nil {
		log.Println(err)
		return
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
		rows.Scan(vals...)
		beans.Add(bean)
	}
	entityBean.SetEntitys(beans)
}
