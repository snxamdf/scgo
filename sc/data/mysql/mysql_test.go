package mysql_test

import (
	"log"
	"scgo/sc/data/mysql"
	"study/app1/source/chatol/entity"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestMysql(t *testing.T) {
	var repository = mysql.New("mysql_dev", "mysql")
	var e = entity.NewMessageBean()
	repository.Select(e)
	es := e.Entitys()
	for i, v := range es.Values() {
		log.Println(i, v.Id(), v.Name())
	}

}
