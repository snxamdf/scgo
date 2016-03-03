package mysql

import (
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

func (this *Repository) Select(entityInterface data.EntityInterface) {
	var db = this.dbSource.DB()
	defer db.Close()
	csql := scSql{sTYPE: SC_S, table: entityInterface.Table()}
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
	for rows.Next() {
		vals := make([]interface{}, colsLen)
		for i := 0; i < colsLen; i++ {
			colm := cols[i]
			if field := entityInterface.Field(colm); field != nil {
				vals[i] = field.Value()
			}
		}
		rows.Scan(vals...)
	}
}
