package mysql

import (
	"github.com/snxamdf/scgo/sc/data/scdb"

	_ "github.com/go-sql-driver/mysql"
)

//alias 别名,driverName 驱动名称
func New(alias, driverName string) *scdb.Repository {
	c := &scdb.Config{
		Alias:        alias,
		DriverName:   driverName,
		UserName:     "root",
		PassWord:     "root",
		Ip:           "localhost",
		Prot:         "3306",
		DBName:       "testdb",
		Charset:      "UTF8",
		MaxIdleConns: 10,
		MaxOpenConns: 100,
	}
	c.MySqlInit()
	e := &scdb.Repository{}
	e.SetDBSource(c)
	return e
}

func init() {
	scdb.Connection = New("mysql_dev", "mysql")
}
