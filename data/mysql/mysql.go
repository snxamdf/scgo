package mysql

import (
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/snxamdf/scgo/data"
	"github.com/snxamdf/scgo/data/config"
	"github.com/snxamdf/scgo/data/scdb"
)

//alias 别名,driverName 驱动名称
func New(cfg *config.Config) {
	config.Conf = cfg
	if config.B == false {
		config.Conf.Init()
	}
	scdb.Connection = scdb.NewRepository(data.DATA_BASE_MYSQL, config.Conf.Dbs.Default)
	log.Println("new mysql", scdb.Connection)
}
