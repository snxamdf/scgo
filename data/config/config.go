package config

import (
	"encoding/xml"
	"io/ioutil"
	"log"
)

var (
	Conf *Config
	B    bool
)

type Config struct {
	FilePath string `xml:""`
	Dbs      Dbs    `xml:"dbs"`
}

type Dbs struct {
	Default string `xml:"default,attr"`
	Db      []Db   `xml:"db"`
}

type Db struct {
	Id           string `xml:"id,attr"`
	DriverName   string `xml:"driverName"`
	UserName     string `xml:"userName"`
	PassWord     string `xml:"passWord"`
	IP           string `xml:"ip"`
	Prot         string `xml:"prot"`
	Database     string `xml:"database"`
	Charset      string `xml:"charset"`
	MaxIdleConns int    `xml:"maxIdleConns"`
	MaxOpenConns int    `xml:"maxOpenConns"`
}

func (Config) Init() {
	B = true
	content, err := ioutil.ReadFile(Conf.FilePath)
	if err != nil {
		log.Println(err)
		B = false
	}
	err = xml.Unmarshal(content, &Conf)
	if err != nil {
		log.Println(err)
		B = false
	}
}

func (this *Config) DefaultDb() Db {
	var db Db
	var defult = this.Dbs.Default
	var dbs = this.Dbs.Db
	for _, v := range dbs {
		if v.Id == defult {
			db = v
			break
		}
	}
	return db
}

func (this *Config) Db(dbName string) Db {
	var db Db
	var dbs = this.Dbs.Db
	for _, v := range dbs {
		if v.Id == dbName {
			db = v
			break
		}
	}
	return db
}
