package entity

import (
	"github.com/snxamdf/scgo/sc/data"
)

//go:generate $GOPATH/src/scgo/sc/tools/scgen/scgen.exe -fileDir=$GOFILE -projectDir=study/app1 -moduleName=test -goSource=source
//go:@Table value=tests
type Test struct {

	//go:@Column value=tid
	//go:@Identif
	tid data.String

	//go:@Column value=tname
	tname data.String

	//go:@Column value=tage
	tage data.Integer
}
