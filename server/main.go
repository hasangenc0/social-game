package main

import (
  "log"
  "net/http"
)

func getUsers() {
  // Todo
}

func main() {
  fs := http.FileServer(http.Dir("../client/build"))
  http.Handle("/", fs)

  log.Println("🔥 Server listening.")
  http.ListenAndServe(":8080", nil)
}

