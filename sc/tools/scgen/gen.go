package main

import (
	"bytes"
	"fmt"
	"os"
	"scgo/sc/tools/annotation"
	"text/template"
)

//生成实体实现类 impl_entity_user.go
func genEntity(path string, annot annotation.BeanToTable) {
	fout, err := os.Create(path)
	defer fout.Close()
	if err != nil {
		fmt.Println(path, err)
		return
	}
	buf := bytes.Buffer{}
	temple := newTmpl(entityTemp)
	temple.Execute(&buf, annot)
	n, err := fout.Write(buf.Bytes())
	fmt.Println(n, err)
}

//生成action类 impl_entity_user.go
func genAction(path string, annot annotation.BeanToTable) {
	fout, err := os.Create(path)
	defer fout.Close()
	if err != nil {
		fmt.Println(path, err)
		return
	}
	buf := bytes.Buffer{}
	temple := newTmpl(actionTemp)
	temple.Execute(&buf, annot)
	n, err := fout.Write(buf.Bytes())
	fmt.Println(n, err)
}

func newTmpl(s string) *template.Template {
	return template.Must(template.New("T").Funcs(funcmap).Parse(s))
}
