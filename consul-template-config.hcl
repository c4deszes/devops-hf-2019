consul {
	address = "localhost:8500"
	retry {
		enabled = true
		attempts = 3
		backoff = "500ms"
	}
}
template {
	source = "nginx.conf.ctmpl"
	destination = "nginx.conf"
	perms = 0600
	command = "reload.."
}