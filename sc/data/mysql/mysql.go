package mysql

import (
	"scgo/sc/data/db"
)

//	"database/sql"
var re = &Repository{}

type Repository struct {
	dbSource db.DBSourceInterface
}

func New(alias string) *Repository {
	c := &db.Config{
		Alias:        alias,
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
