package db

import (
	"database/sql"
	"log"
)

type DBSourceInterface interface {
	Init() error
	DB() *sql.DB
}

type Config struct {
	DriverName                 string
	Alias, UserName, PassWord  string
	Ip, Prot, DBName, Charset  string
	MaxIdleConns, MaxOpenConns int
	Db                         *sql.DB
}

func (this *Config) Init() error {
	if this.Charset == "" {
		this.Charset = "UTF8"
	}
	var dataSource = this.UserName + ":" + this.PassWord + "@tcp(" + this.Ip + ":" + this.Prot + ")/" + this.DBName + "?charset=" + this.Charset
	dataSource = this.UserName + ":" + this.PassWord + "@tcp(" + this.Ip + ":" + this.Prot + ")/" + this.DBName + "?charset=" + this.Charset
	log.Println("data source :", dataSource)
	db, err := sql.Open(this.DriverName, dataSource)
	if err != nil {
		log.Println(err)
		return err
	}

	db.SetMaxIdleConns(this.MaxIdleConns)
	db.SetMaxOpenConns(this.MaxOpenConns)
	this.Db = db
	return nil
}

func (this *Config) DB() *sql.DB {
	return this.Db
}
