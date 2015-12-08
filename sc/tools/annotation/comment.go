package annotation

import (
	"go/ast"
	"regexp"
	"strings"
)

//实体映射表
type BeanToTable struct {
	Table *Table //表信息
}

//表
type Table struct {
	Name    string    //表名
	Columns *[]Column //列信息
}

//表->列
type Column struct {
	Name    string //列名
	Identif bool   //是否唯一标识
}

var regComment = regexp.MustCompile(`(go:@)|([a-zA-Z]+)`) //=[go:@ column value id]

func (this *BeanToTable) ToColumn(fields []*ast.Field) {
	columns := []Column{}
	for _, field := range fields { //遍历字段
		comments := field.Doc.List //当前字段注解
		column := Column{}
		for _, comment := range comments { //遍历当前字段的注解
			comm := strings.Replace(comment.Text, "//", "", 2)
			annot := regComment.FindAllString(comm, -1)
			if annot[0] == "go:@" {
				switch annot[1] {
				case "identif":
					column.Identif = true
					break
				case "column":
					column.Name = annot[3]
					break
				}
			}
		}
		columns = append(columns, column)
	}
	this.Table.Columns = &columns
}

func (this *BeanToTable) ToTable(comment string) {
	annot := regComment.FindAllString(comment, -1)
	if annot[0] == "go:@" {
		switch annot[1] {
		case "table":
			this.Table = &Table{Name: annot[3]}
			break
		}
	}
}
