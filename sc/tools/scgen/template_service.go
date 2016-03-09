package main

var serviceTempImpl = `//scgen
package service

import (
	"scgo/sc/data"
	"scgo/sc/data/scdb"
)

var {{.Name}}Service = {{lowerFirst .Name}}Service{
	repository: scdb.Connection,
}

type {{lowerFirst .Name}}Service struct {
	repository scdb.RepositoryInterface
}

func (this *{{lowerFirst .Name}}Service) Select(bean data.EntityBeanInterface) {
	this.repository.Select(bean)
}
`

var serviceTemp = `//scgen
package service
`
