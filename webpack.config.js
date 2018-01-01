module.exports = {
	entry: './',
	modules: {
		rules: [{
			test: /.jsx$/,
			use: ['babel-loader']
		},{
			test: /.less$/,
			use: ['style-loader','css-loader','less-loader']
		}]
	}
}