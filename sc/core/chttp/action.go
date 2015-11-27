package chttp

func Action(url string, actionMethod func(Context)) {
	handle.action[url] = actionMethod
}

func Action1(url string, actionMethod func(Context), permissions []string) {
	handle.action[url] = actionMethod
	handle.permissions = permissions
}

func Action2(url string, actionMethod func(Context), method string) {
	handle.action[url] = actionMethod
	handle.method = method
}

func Action3(url string, actionMethod func(Context), permissions []string, method string) {
	handle.action[url] = actionMethod
	handle.permissions = permissions
	handle.method = method
}
