#include <cstdlib>
#include <ctime>
#include <iostream>

int* changeSize() {
  srand((unsigned)time(0));
  int* arr = new int[2];
  arr [0] = (rand()%1000)+1;
  arr [1] = (rand()%1000)+1;
  return arr;
}