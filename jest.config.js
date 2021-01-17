module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.jest.json',
		},
	},
	verbose: true,
	testMatch: ['**.test.ts'],
};
