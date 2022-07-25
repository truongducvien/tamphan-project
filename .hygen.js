const changeCase = require('change-case');

module.exports = {
  helpers: {
		toLowerCase(text){
			return text.toLowerCase();
		},
    toPascalCase(text) {
      return changeCase.pascalCase(text);
    },
    createBaseClassName(level, name) {
      const atomicPrefix = `${level.slice(0, 1).toLowerCase()}-`;
      return `${atomicPrefix}${name}`;
    },
  }
};
