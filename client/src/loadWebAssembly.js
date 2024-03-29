// Loads a WebAssembly dynamic library, returns a promise.
// imports is an optional imports object
export default function loadWebAssembly(filename, imports) {
  // Check for wasm support.
  if (!('WebAssembly' in window)) {
    alert('you need a browser with wasm support enabled :(');
    return false;
  }

  // Fetch the file and compile it
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      // Create the imports for the module, including the
      // standard dynamic library imports
      imports = imports || {};
      imports.env = imports.env || {};
      imports.env.memoryBase = imports.env.memoryBase || 0;
      imports.env.tableBase = imports.env.tableBase || 0;
      if (!imports.env.memory) {
        imports.env.memory = new WebAssembly.Memory({ initial: 256 });
      }
      if (!imports.env.table) {
        imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });
      }
      // Create the instance.
      return new WebAssembly.instantiate(module, imports);
    });
}
