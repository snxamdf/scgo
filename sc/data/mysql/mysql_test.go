package mysql_test

import (
	"log"
	"scgo/sc/data/mysql"
	"study/app1/source/chatol/entity"
	"testing"
	//"sync"
)

//func TestMysqlSelect(t *testing.T) {
//	var repository = mysql.New("mysql_dev", "mysql")
//	var e = entity.NewMessageBean()
//	msg := entity.NewMessage()
//	msg.SetId("A070DAE1-E4D5-11E5-B8D4-3010B3A0F15C")
//	msg.Id().FieldExp().Eq().And()
//	e.SetEntity(msg)

//	repository.Select(e)
//	es := e.Entitys()
//	for i, v := range es.Values() {
//		log.Println(i, v.Id().Value(), v.Name().Value())
//	}
//}

//func TestMysqlUpdate(t *testing.T) {
//	var repository = mysql.New("mysql_dev", "mysql")
//	m := entity.NewMessage()
//	m.SetId("A070DAE1-E4D5-11E5-B8D4-3010B3A0F15C")
//	m.Id().FieldExp().Eq().And()
//	m.SetName("张三1")
//	//m.SetPhone("15164383441")
//	m.SetAge(25)
//	result, err := repository.Update(m)
//	row, err := result.RowsAffected()
//	log.Println("Update", row, err)
//}

//func TestMysqlSave(t *testing.T) {
//	var repository = mysql.New("mysql_dev", "mysql")
//	m := entity.NewMessage()
//	//m.SetId("A070DAE1-E4D5-11E5-B8D4-3010B3A0F15C")
//	m.SetName("张三1")
//	m.SetPhone("15164383441")
//	m.SetAge(25)
//	msgs := entity.NewMessages(5)
//	msgs.Add(m)
//	msgs.Add(m)
//	log.Println("----------", msgs)

//	result, err := repository.Save(m)
//	row, err := result.RowsAffected()
//	log.Println("Save", row, err)
//}

//func TestMysqlSaveOrUpdate(t *testing.T) {
//	var repository = mysql.New("mysql_dev", "mysql")
//	m := entity.NewMessage()
//	//m.SetId("A3FC79C5E5C611E59BB63010B3A0F15C")
//	m.Id().FieldExp().Eq().And()
//	m.SetName("张三b")
//	m.SetPhone("15164383441")
//	m.SetAge(25)
//	result, err := repository.SaveOrUpdate(m)
//	row, err := result.RowsAffected()
//	log.Println("SaveOrUpdate", row, err)
//}

func TestMysqlSelectOne(t *testing.T) {
	var repository = mysql.New("mysql_dev", "mysql")
	m := entity.NewMessage()
	m.SetId("6CDDE56AE5CD11E5A0233010B3A0F15C")
	m.Id().FieldExp().Eq().And()
	//	m.SetName("张三")
	//	m.Name().FieldExp().Lk().And()

	err := repository.SelectOne(m)

	log.Println("SelectOne", err, m.JSON())
}
