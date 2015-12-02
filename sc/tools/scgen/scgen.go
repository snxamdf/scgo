package main

import (
	"flag"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"scgo/sc/tools/annotation"
)

func main() {
	fmt.Println("main")

	fileDir := flag.String("fileDir", "", "root path")
	xmlDir := flag.String("xmlDir", "", "xmlDir path")
	flag.Parse()
	fmt.Println(*fileDir)
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
	for _, decl := range f.Decls {
		tdecl, ok := decl.(*ast.GenDecl)
		if !ok || tdecl.Doc == nil {
			continue
		}
		for _, comment := range tdecl.Doc.List { //遍历注释
			fmt.Printf("%+v\n", comment)
		}
		fmt.Println(" ------------------------------------------------------------------------------------------ ")
		sdecl := tdecl.Specs[0].(*ast.TypeSpec).Type.(*ast.StructType)
		//获取字段
		fields := sdecl.Fields.List
		annot := annotation.Annotation{}
		for _, field := range fields { //遍历字段
			//fmt.Printf("%+v\n", field.Doc.Text())
			//fmt.Printf("%+v\n", field)
			//fmt.Printf("%+v\n", field.Tag) //取得 `orm:""`
			//fmt.Printf("%+v\n", field.Names[0].Name)
			//fmt.Printf("%+v\n", field.Doc.List) //当前字段的注解
			fieldComments := field.Doc.List //获得注解
			//fieldName := field.Names[0].Name

			annot.ColumnAnnota(fieldComments) //分析获取
			fmt.Println(annot)
		}
	}
	//fmt.Println(err, f.Name.Name, f.Decls)
}
