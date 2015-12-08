package cache

import (
	"fmt"
	"testing"
)

func TestCacheSet(t *testing.T) {
	command("SET", "key1", "张三")

	getSet, _ := command("GET", "key1")
	fmt.Println(getSet)

	command("LPUSH", "key1", "")
}

func init() {
	Conf = &Config{
		Address: "10.100.130.62:6379",
	}
	Init(*Conf)
	fmt.Println(Conf)
}
