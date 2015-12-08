package main

import (
	"flag"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"scgo/sc/tools/annotation"
	"scgo/sc/tools/scorm"
)

func main() {
	fmt.Println("main")

	fileDir := flag.String("fileDir", "", "root path")
	xmlDir := flag.String("xmlDir", "", "xmlDir path")
	flag.Parse()

	fmt.Println(*xmlDir)

	f, err := parser.ParseFile(
		token.NewFileSet(),
		*fileDir,
		nil,
		parser.ParseComments,
	)
	if err != nil {
		fmt.Println(err)
	}
	//bean转换table
	annot := annotation.BeanToTable{}
	//分析orm
	orm := scorm.Orm{}
	for _, decl := range f.Decls {
		tdecl, ok := decl.(*ast.GenDecl)
		if !ok || tdecl.Doc == nil {
			continue
		}
		for _, comment := range tdecl.Doc.List { //遍历注释
			annot.ToTable(comment.Text) //获得表信息
		}
		sdecl := tdecl.Specs[0].(*ast.TypeSpec).Type.(*ast.StructType)
		//获取字段
		fields := sdecl.Fields.List
		annot.ToColumn(fields) //获得列信息
		orm.ToOrm(fields)      //orm
	}
	//fmt.Printf("%+v\n", annot.Table)
	//fmt.Printf("%+v\n", annot.Table.Columns)
	//fmt.Println(err, f.Name.Name, f.Decls)
}
