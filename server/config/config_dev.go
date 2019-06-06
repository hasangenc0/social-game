// +build dev

package config

import (
	"os"
	"path/filepath"
)

// Get Home Path
func getClient() (client string) {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	client = filepath.Dir(wd) + "/client/build"
	return
}

const (
	MONGODB_HOST            = ""
	MONGODB_DATABASE        = ""
	MONGODB_CONNECTION_POOL = 0
	API_PORT                = "8080"
	SOCKET_PORT							= "8080"
)

var (
	CLIENT_DIR 							= getClient()
)