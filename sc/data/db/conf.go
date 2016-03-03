package db

import (
	"database/sql"
)

type DBSourceInterface interface {
	Init() error
	DB() *sql.DB
}

type Config struct {
	Alias, UserName, PassWord  string
	Ip, Prot, DBName, Charset  string
	MaxIdleConns, MaxOpenConns int
	Db                         *sql.DB
}

func (this *Config) Init() error {
	if this.Charset == "" {
		this.Charset = "UTF8"
	}
	db, err := sql.Open("mysql", this.UserName+":"+this.PassWord+"@tcp("+this.Ip+":"+this.Prot+")/"+this.DBName+"?charset="+this.Charset)
	if err != nil {
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
