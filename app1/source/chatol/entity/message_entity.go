package entity

import (
	"github.com/snxamdf/scgo/sc/data"
)

//go:generate $GOPATH/src/scgo/sc/tools/scgen/scgen.exe -fileDir=$GOFILE -projectDir=study/app1 -moduleName=chatol -goSource=source
//go:@Table value=users
type Message struct {

	//go:@Column value=u_id
	//go:@Identif
	id data.String

	//go:@Column value=u_name
	name data.String

	//go:@Column value=u_phone
	phone data.String

	//go:@Column value=u_age
	age data.Integer

	tt data.Integer
}
