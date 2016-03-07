package scsql

import (
	"bytes"
	"log"
	"scgo/sc/data"
)

const (
	SC_I = 0
	SC_D = 1
	SC_U = 2
	SC_S = 3

	SELECTD = "select"
	FROM    = "from"
	INSERT  = "insert"
	VALUES  = "values"
	UPDATE  = "update"
	SET     = "set"
	DELETED = "delete"
	WHERE   = "where"
	ORDER   = "order"
	BY      = "by"
	DESC    = "desc"
	ASC     = "asc"
	SPACE   = " "
)

type ScSql struct {
	S_TYPE int
	sql    string
	Table  data.TableInformation
}

func (this *ScSql) TableToSql() {
	if this.S_TYPE == SC_I { //insert

	} else if this.S_TYPE == SC_D { //delete

	} else if this.S_TYPE == SC_U { //update

	} else if this.S_TYPE == SC_S { //select
		this.genSelect()
	}
}

func (this *ScSql) genSelect() {
	var wr bytes.Buffer
	wr.WriteString(SELECTD)
	wr.WriteString(SPACE)
	for i, colm := range this.Table.Columns() {
		if i > 0 {
			wr.WriteString(",")
		}
		wr.WriteString("t.")
		wr.WriteString(colm)
	}
	wr.WriteString(SPACE)
	wr.WriteString(FROM)
	wr.WriteString(SPACE)
	wr.WriteString(this.Table.TableName())
	wr.WriteString(SPACE)
	wr.WriteString("t")
	this.sql = wr.String()
}

func (this *ScSql) Sql() string {
	log.Println("SQL :", this.sql)
	return this.sql
}
