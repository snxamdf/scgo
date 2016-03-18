//scgen
package action

import (
	"github.com/snxamdf/scgo/app1/source/chatol/entity"
	"github.com/snxamdf/scgo/sc/core/chttp"
)

func init() {
	chttp.Action("/chatol/index", index).Get()
}

//gen
func index(c chttp.Context) {
	e := entity.NewMessage()
	c.BindData(e)
	c.JSON(e.JSON(), true)
}
