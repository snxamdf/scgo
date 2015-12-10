package annotation

import (
	"fmt"
	"go/ast"
	"regexp"
	"strings"
)

//实体映射表
type BeanToTable struct {
	Table *Table //表信息
	Bean  *Bean
}

//表
type Table struct {
	Name    string    //表名
	Columns *[]Column //列信息
}

type Bean struct {
	Name   string    //entity名称
	Fileld *[]Fileld //bean信息
}

type Fileld struct {
	Name string //列名
}

//表->列
type Column struct {
	Name    string //列名
	Identif bool   //是否唯一标识
}

var regComment = regexp.MustCompile(`(go:@)|([a-zA-Z]+)`) //=[go:@ column value id]

func (this *BeanToTable) ToColumn(fields []*ast.Field) {
	fmt.Println("------ToColumn------")
	columns := []Column{}
	for _, field := range fields { //遍历字段
		if field.Doc == nil {
			continue
		}
		comments := field.Doc.List //当前字段注解
		column := Column{}
		for _, comment := range comments { //遍历当前字段的注解
			comm := strings.Replace(comment.Text, "//", "", 2)
			annot := regComment.FindAllString(comm, -1)
			if annot[0] == "go:@" {
				switch annot[1] {
				case "Identif":
					column.Identif = true
					break
				case "Column":
					column.Name = annot[3]
					break
				}
			}
		}
		columns = append(columns, column)
	}
	this.Table.Columns = &columns
	fmt.Println(columns)
}

func (this *BeanToTable) ToField(fields []*ast.Field) {
	fmt.Println("------ToField------")
	filelds := make([]Fileld, len(fields))
	for i, field := range fields { //遍历字段
		filelds[i].Name = field.Names[0].Name
	}
	this.Bean.Fileld = &filelds
	fmt.Println(filelds)
}

func (this *BeanToTable) BeanName(comment string) {
	this.Bean = &Bean{Name: comment}
}

func (this *BeanToTable) TableName(comment string) {
	annot := regComment.FindAllString(comment, -1)
	if annot[0] == "go:@" {
		switch annot[1] {
		case "Table":
			this.Table = &Table{Name: annot[3]}
			break
		}
	}
}
