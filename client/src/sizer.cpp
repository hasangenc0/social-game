#include <ctime>
#include <cstdlib>
#include <iostream>
#include <emscripten/bind.h>

using namespace emscripten;

std::vector<int> changeSize() {
  srand((unsigned)time(0));
  std::vector<int> v((rand()%600)+1, (rand()%600)+1);
  return v;
}

int say_hello() {
  printf("Hello from your wasm module\n");
  return 0;
}

EMSCRIPTEN_BINDINGS(my_module) {
  function("sayHello", &say_hello);
  function("changeSize", &changeSize);

  // register bindings for std::vector<int>
  register_vector<int>("vector<int>");
}