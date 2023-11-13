const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: ["./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			animate: {
				"spin-slow": "spin 3s linear infinite"
			}
		}
	},
	plugins: []
});
