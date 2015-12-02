package annotation

import (
	"go/ast"
	"regexp"
	"strings"
)

//注解
type Annotation struct {
	column  *Column
	identif *Identif
}

//唯一标识
type Identif struct {
	value   string
	whether bool
}

//表->列
type Column struct {
	value   string
	whether bool
}

var reg = regexp.MustCompile(`(go:@)|([a-zA-Z]+)`) //=[go:@ column value id]

func (this *Annotation) ColumnAnnota(comments []*ast.Comment) {
	for _, comment := range comments { //遍历当前字段的注解
		comm := strings.Replace(comment.Text, "//", "", 2)
		annot := reg.FindAllString(comm, -1)
		//fmt.Println(comments)
		if annot[0] == "go:@" {
			switch annot[1] {
			case "identif":
				this.identif = &Identif{"identif", true}
				break
			case "column":
				this.column = &Column{annot[3], true}
				break
			default:
			}
		}
	}

}

func (this *Annotation) TableAnnota() {
}
