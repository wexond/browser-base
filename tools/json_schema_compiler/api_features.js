const c = {};

const processDeclaration = (name, decl) => {
  if (!decl.contexts || decl.contexts.includes(context)) {
    if (api[name]) c[name] = api[name];
  }
};

for (const key in f) {
  if (f[key] instanceof Array) {
    for (const decl of f[key]) {
      processDeclaration(key, decl);
    }
  } else if (typeof f[key] === 'object') {
    processDeclaration(key, f[key]);
  }
}

return c;
