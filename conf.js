module.exports = {
	port: process.env.PORT || 5000,
	mysql:{
		host: 'localhost',
		user: process.env.USER,
		password: process.env.PASS || '',
		database: process.env.DB,
		port: process.env.PORT
	}
}