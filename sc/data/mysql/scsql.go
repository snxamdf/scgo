package mysql

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

type scSql struct {
	sTYPE int
	sql   string
	table data.TableInformation
}

func (this *scSql) TableToSql() {
	if this.sTYPE == SC_I { //insert

	} else if this.sTYPE == SC_D { //delete

	} else if this.sTYPE == SC_U { //update

	} else if this.sTYPE == SC_S { //select
		this.genSelect()
	}
}

func (this *scSql) genSelect() {
	var wr bytes.Buffer
	wr.WriteString(SELECTD)
	wr.WriteString(SPACE)
	for i, colm := range this.table.Columns() {
		if i > 0 {
			wr.WriteString(",")
		}
		wr.WriteString("t.")
		wr.WriteString(colm)
	}
	wr.WriteString(SPACE)
	wr.WriteString(FROM)
	wr.WriteString(SPACE)
	wr.WriteString(this.table.TableName())
	wr.WriteString(SPACE)
	wr.WriteString("t")
	this.sql = wr.String()
}

func (this *scSql) Sql() string {
	log.Println("SQL :", this.sql)
	return this.sql
}
