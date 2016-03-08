package mysql_test

import (
	"log"
	"scgo/sc/data/mysql"
	"study/app1/source/chatol/entity"
	"testing"

	//"sync"

	_ "github.com/go-sql-driver/mysql"
)

func TestMysql(t *testing.T) {
	var repository = mysql.New("mysql_dev", "mysql")
	var e = entity.NewMessageBean()
	msg := entity.NewMessage()
	msg.SetAge(23)
	//msg.SetName("张三")
	msg.Age().FieldExp().GtEq().And()
	//msg.Name().FieldExp().Eq().And()
	//msg.Age().FieldExpVal("21").Gt().And()
	//msg.Age().FieldExpVal("25").Lt().And()

	e.SetEntity(msg)

	repository.Select(e)
	es := e.Entitys()
	for i, v := range es.Values() {
		log.Println(i, v.Id().Value(), v.Name().Value())
	}

	//	m := entity.NewMessage()
	//	m.SetName("张三")
	//	m.SetPhone("15164383711")
	//	m.SetAge(24)
	//	repository.Save(m)
	//	log.Println(m.Id())
}
