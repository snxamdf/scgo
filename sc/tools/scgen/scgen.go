package main

import (
	"flag"
	"fmt"
)

func main() {
	fmt.Println("main")
	rootPath := flag.String("entity", "", "root path")
	xmlDir := flag.String("xmlDir", "", "xmlDir path")
	flag.Parse()
	fmt.Println(*rootPath)
	fmt.Println(*xmlDir)
}
