package mysql_test

import (
	"log"
	"scgo/sc/data/mysql"
	"study/app1/source/entity"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestMysql(t *testing.T) {
	var repository = mysql.New("mysql_dev", "mysql")
	var e = entity.NewUser()
	repository.Select(e)
	log.Println(e.Addr)

}
