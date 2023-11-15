module.exports = {
	extends : ['eslint:recommended', 'semistandard', 'standard'],
	env     : { browser: true },
	parser  : '@typescript-eslint/parser',
	// parserOptions : { project: '*/tsconfig.json', sourceType: 'module' },
	plugins : ['@typescript-eslint'],
	rules   : {
		'no-console'                  : 'off',
		'no-useless-constructor'      : 'off',
		'no-tabs'                     : 'off',
		indent                        : ['error', 'tab'],
		'space-before-function-paren' : ['error', 'never'],
		semi                          : [2, 'always'],
		'key-spacing'                 : ['error', { align: { beforeColon: true, afterColon: true, on: 'colon' } }],
		'no-unused-vars'              : 'off',
		'newline-per-chained-call'    : ['error', { ignoreChainWithDepth: 4 }]
	}
};
