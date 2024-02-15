module.exports = {
	env: {
		es6: true,
		node: true,
		browser: true
	},
	extends: ["plugin:jsdoc/recommended"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ['jsdoc', 'unused-imports'],
	rules: {
		"object-shorthand": 1,
		'jsdoc/require-param-description': 0,
		'jsdoc/require-returns-description': 0,
		'eslint-plugin-jsdoc/check-tag-names': 0
	},
	settings: {
		'json/json-with-comments-files': [],
		'json/*': ['.json'],
	},
};