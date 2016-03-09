package scsql

import (
	"bytes"
	"log"
	"scgo/sc/data"
	"scgo/sc/tools"
	"scgo/sc/tools/uuid"
	"strings"
)

const (
	SC_I     = 0
	SC_D     = 1
	SC_U     = 2
	SC_S     = 3
	SC_S_ONE = 4

	SELECTD        = "select"
	FROM           = "from"
	INSERT         = "insert"
	INTO           = "into"
	VALUES         = "values"
	UPDATE         = "update"
	SET            = "set"
	DELETED        = "delete"
	WHERE          = "where"
	ORDER          = "order"
	BY             = "by"
	DESC           = "desc"
	ASC            = "asc"
	SPACE          = " "
	PARENTHESESL_L = "("
	PARENTHESESL_R = ")"
)

type SCSQL struct {
	S_TYPE       int                   //当前想要执行的操作
	sql          string                //生成的sql
	Args         []interface{}         //参数值
	Operate      int                   //准备执行的操作
	Entity       data.EntityInterface  //实体
	Table        data.TableInformation //表信息
	DataBaseType string                //数据库类型 mysql、oracle ...
}

//Parse SQL
func (this *SCSQL) ParseSQL() {
	if this.S_TYPE == SC_I { //insert
		this.genInsert()
	} else if this.S_TYPE == SC_D { //delete
		this.genDelete()
	} else if this.S_TYPE == SC_U { //update
		this.genUpdate()
	} else if this.S_TYPE == SC_S { //select
		this.genSelect()
	} else if this.S_TYPE == SC_S_ONE { //select one
		this.genSelectOne()
	}
}

//Primary Key Is Blank
func (this *SCSQL) PrimaryKeyIsBlank() bool {
	table := this.Table
	entity := this.Entity
	columns := table.Columns()
	for _, v := range columns {
		field := entity.Field(v)
		if field.PrimaryKey() && tools.IsNotBlank(field.Value()) {
			return true
		}
	}
	return false
}

//delete
func (this *SCSQL) genDelete() {
	var wr bytes.Buffer
	entity := this.Entity
	table := this.Table
	columns := table.Columns()
	wr.WriteString(DELETED + SPACE + table.TableName() + SPACE + WHERE + SPACE)
	for i, v := range columns {
		field := entity.Field(v)
		if i > 0 {
		}
		log.Println(field)
	}
}

//update
func (this *SCSQL) genUpdate() {
	var wr bytes.Buffer
	entity := this.Entity
	table := this.Table
	columns := table.Columns()
	args := make([]interface{}, 0, len(columns))
	wr.WriteString(UPDATE + SPACE + table.TableName() + " t " + SET + SPACE)
	sft := &sift{stype: this.S_TYPE}
	var i int
	for _, v := range columns {
		field := entity.Field(v)
		sft.genExp(v, field)
		if !field.PrimaryKey() && !field.FieldExp().IsSet() && tools.IsNotBlank(field.Value()) {
			if i > 0 {
				wr.WriteString(", ")
			}
			wr.WriteString("t." + v + " = ?")
			args = append(args, field.Value())
			i++
		}
	}
	_, sftSql, vals := sft.genSiftSql()
	args = append(args, vals...)
	this.sql = wr.String() + sftSql
	this.Args = args
}

//insert
func (this *SCSQL) genInsert() {
	var wr bytes.Buffer
	var wrcom bytes.Buffer
	var wrval bytes.Buffer
	entity := this.Entity
	table := this.Table
	columns := table.Columns()
	args := make([]interface{}, 0, len(columns))
	wr.WriteString(INSERT + SPACE + INTO + SPACE + table.TableName() + SPACE)

	for i, v := range columns {
		field := entity.Field(v)
		if i > 0 {
			wrcom.WriteString(",")
			wrval.WriteString(",")
		}
		if field.PrimaryKey() {
			uuid := uuid.NewV1()
			field.SetValue(uuid.String())
		}
		wrcom.WriteString(v)
		wrval.WriteString("?")
		args = append(args, field.Value())
	}
	wr.WriteString(PARENTHESESL_L + wrcom.String() + PARENTHESESL_R + SPACE)
	wr.WriteString(VALUES + PARENTHESESL_L + wrval.String() + PARENTHESESL_R + SPACE)
	this.sql = wr.String()
	this.Args = args
}

//select one
func (this *SCSQL) genSelectOne() {
	var wr bytes.Buffer
	entity := this.Entity
	table := this.Table
	columns := table.Columns()
	sft := &sift{stype: this.S_TYPE}
	wr.WriteString(SELECTD)
	wr.WriteString(SPACE)
	for i, v := range columns {
		if i > 0 {
			wr.WriteString(",")
		}
		field := entity.Field(v)
		sft.genExp(v, field)
		wr.WriteString("t.")
		wr.WriteString(v)
	}
	wr.WriteString(SPACE)
	wr.WriteString(FROM)
	wr.WriteString(SPACE)
	wr.WriteString(table.TableName())
	wr.WriteString(SPACE)
	wr.WriteString("t")
	_, sftSql, vals := sft.genSiftSql()
	this.sql = wr.String() + sftSql
	this.Args = vals
}

//select
func (this *SCSQL) genSelect() {
	var wr bytes.Buffer
	entity := this.Entity

	table := this.Table
	columns := table.Columns()
	sft := &sift{stype: this.S_TYPE}
	wr.WriteString(SELECTD)
	wr.WriteString(SPACE)
	for i, v := range columns {
		if i > 0 {
			wr.WriteString(",")
		}
		field := entity.Field(v)
		sft.genExp(v, field)
		wr.WriteString("t.")
		wr.WriteString(v)
	}
	wr.WriteString(SPACE)
	wr.WriteString(FROM)
	wr.WriteString(SPACE)
	wr.WriteString(table.TableName())
	wr.WriteString(SPACE)
	wr.WriteString("t")
	_, sftSql, vals := sft.genSiftSql()
	this.sql = wr.String() + sftSql
	this.Args = vals
}

type sift struct {
	sifts [][]string
	stype int
}

//exp return exp ctor
func (this *sift) genExp(column string, field data.EntityField) {
	fieldExp := field.FieldExp()
	if fieldExp.IsSet() && tools.IsNotBlank(field.Value()) {
		value := fieldExp.Value()
		exp := fieldExp.Exp()
		ctor := fieldExp.Ctor().Value()
		ctorLen := len(ctor)
		for i, v := range value {
			if i <= ctorLen {
				sft := make([]string, 4)
				sft[0] = column
				sft[1] = exp[i]
				sft[2] = v
				sft[3] = ctor[i]
				this.sifts = append(this.sifts, sft)
			}
		}
		if ctorLen == 1 {
			sft := make([]string, 4)
			sft[0] = column
			sft[1] = exp[0]
			sft[2] = field.Value()
			sft[3] = ctor[0]
			this.sifts = append(this.sifts, sft)
		}
	}
}

//gen exp sift sql
func (this *sift) genSiftSql() (bool, string, []interface{}) {
	var wr bytes.Buffer
	args := make([]interface{}, 0, 1)
	var ctor string
	var val, whe string
	for _, v := range this.sifts {
		switch v[1] {
		case data.EXP_LK, data.EXP_LK_R, data.EXP_LK_L:
			whe = "like"
			like := v[1]
			if strings.Index(like, "%") == -1 {
				val = "%" + v[2] + "%"
			} else if strings.Index(like, "%") == 0 {
				val = "%" + v[2]
			} else if strings.Index(like, "%") == 4 {
				val = v[2] + "%"
			}
			args = append(args, val)
			break
		default:
			whe = v[1]
			args = append(args, v[2])
			break
		}
		wr.WriteString(ctor + SPACE + "t." + v[0] + SPACE + whe + SPACE + "?" + SPACE)
		ctor = v[3]
	}
	if tools.IsNotBlank(wr.String()) {
		return true, SPACE + WHERE + wr.String(), args
	}
	return false, "", args
}

//sql
func (this *SCSQL) SQL() string {
	log.Println("SQL :", this.sql, "ARGS :", this.Args)
	return this.sql
}
