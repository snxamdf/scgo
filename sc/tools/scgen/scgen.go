package main

import (
	"flag"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"log"
	"os"
	"scgo/sc/tools/annotation"
	//"scgo/sc/tools/scorm"
	"text/template"
)

func main() {
	fmt.Println("main")

	fileDir := flag.String("fileDir", "", "root path")
	projectDir := flag.String("projectDir", "", "projectDir path")
	flag.Parse()
	GO_PATH := os.Getenv("GOPATH")
	if GO_PATH == "" {
		log.Fatalln("gopath is null")
	}
	GO_PATH += "/src/"
	projectPath := GO_PATH + *projectDir //项目目录
	fmt.Println("项目目录", projectPath)

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
	//orm := scorm.Orm{}
	for _, decl := range f.Decls {
		tdecl, ok := decl.(*ast.GenDecl)
		if !ok || tdecl.Doc == nil {
			continue
		}
		for _, comment := range tdecl.Doc.List { //遍历注释
			annot.TableName(comment.Text) //获得表信息
		}
		annot.BeanName(tdecl.Specs[0].(*ast.TypeSpec).Name.Name)
		sdecl := tdecl.Specs[0].(*ast.TypeSpec).Type.(*ast.StructType)
		//获取字段
		fields := sdecl.Fields.List
		annot.ToColumn(fields) //获得列信息
		annot.ToField(fields)  //获得field信息
		//orm.ToOrm(fields)      //orm
	}
	//fmt.Printf("%+v\n", annot.Table)
	//fmt.Printf("%+v\n", annot.Table.Columns)
	//fmt.Println(err, f.Name.Name, f.Decls)
	//fmt.Printf("%+v\n", f)
	genEntity("test.go", annot)                  //生成实体实现类
	genAction("../action/action_test.go", annot) //生成实体实现类
}

func newTmpl(s string) *template.Template {
	return template.Must(template.New("T").Funcs(funcmap).Parse(s))
}
