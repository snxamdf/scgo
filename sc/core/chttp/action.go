package chttp

func Action(url string, actionMethod func(Context)) *curl {
	if route.action == nil {
		route.action = make(map[string]*curl)
	}
	ml := &curl{
		mfunc:  actionMethod,
		method: method{ALL},
	}
	route.action[url] = ml
	return ml
}

func (this *curl) Get() *curl {
	this.method = method{GET}
	return this
}

func (this *curl) Post() *curl {
	this.method = method{POST}
	return this
}

func (this *curl) Permission(permissions ...string) *curl {
	this.permissions = permissions
	return this
}
