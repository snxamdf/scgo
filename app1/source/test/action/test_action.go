//scgen
package action

import (
	"log"
	"study/app1/source/test/entity"
	"study/app1/source/test/service"

	"github.com/snxamdf/scgo/sc/core/chttp"
)

func init() {
	chttp.Action("/test/index", index).Get()
}

//gen
func index(c chttp.Context) {
	bean := entity.NewTestBean()
	page := c.Page()
	log.Println("page", page)
	err := service.TestService.SelectPage(bean, page)
	log.Println(err)
	c.JSON(bean.Entitys().JSON(), true)
}
