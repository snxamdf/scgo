//scgen
package action

import (
	"log"
	"study/app1/source/chatol/entity"
	"study/app1/source/chatol/service"

	"github.com/snxamdf/scgo/sc/core/chttp"
)

func init() {
	chttp.Action("/chatol/index", index).Get()
}

//gen
func index(c chttp.Context) {
	bean := entity.NewMessageBean()
	page := c.Page()
	log.Println("page", page)
	msg := entity.NewMessage()
	c.BindData(msg)
	msg.Age().FieldExp().Gt().And()
	msg.Age().FieldSort().Asc(1)
	bean.SetEntity(msg)
	err := service.MessageService.SelectPage(bean, page)
	log.Println(err)

	c.HTML("/chatol/chatol", bean)
}
