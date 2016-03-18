package mysql

import (
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/snxamdf/scgo/data/config"
	"github.com/snxamdf/scgo/data/scdb"
)

//alias 别名,driverName 驱动名称
func New(dbName string, cfg *config.Config) {
	config.Conf = cfg
	if config.B == false {
		config.Conf.Init()
	}
	var db config.Db
	if dbName == "" {
		db = config.Conf.DefaultDb()
	} else {
		db = config.Conf.Db(dbName)
	}
	c := &scdb.Config{
		DriverName:   db.DriverName,
		UserName:     db.UserName,
		PassWord:     db.PassWord,
		Ip:           db.IP,
		Prot:         db.Prot,
		DBName:       db.Database,
		Charset:      db.Charset,
		MaxIdleConns: db.MaxIdleConns,
		MaxOpenConns: db.MaxOpenConns,
	}
	c.MySqlInit()
	e := &scdb.Repository{}
	e.SetDBSource(c)
	scdb.Connection = e
	log.Println("new mysql", scdb.Connection)
}
