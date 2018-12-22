const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

//type definition and resolvers
const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'typedefs.gql');
const typeDefs = fs.readFileSync(filepath, 'utf-8'); // utf-8 encoding
const resolvers = require('./resolvers');

//mongoose models
const User = require('./models/User');
const Post = require('./models/Post');

//connect to mongodb atlas database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
.then(() => {
	console.log('Database is successfully connected')
})
.catch(err => {
	console.error(err)
});

//verify jwt token passed from client
const getUser = async token => {
	if(token){
		try{
			return await jwt.verify(token, process.env.SECRET);
		}catch(err){
			throw new AuthenticationError("Your session has ended. Please sign in again.");
		}
	}
}

//create apollo graphql server using typeDefs, resolvers and context object
const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: (error) => ({ 
		name: error.name, 
		message: error.message.replace('Context creation failed:', '')
	}),
	context: async ({ req }) => {
		const token = req.headers["authorization"];
		return { User, Post, currentUser: await getUser(token) };
	}
});

server.listen().then(({ url }) => {
	console.log(`Listening to port ${url}`);
})