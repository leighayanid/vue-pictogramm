const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = ( user, secret, expiresIn) => {
	const { username, email } = user;
	return jwt.sign({ username, email }, secret, { expiresIn });
}

module.exports = {
	Query: {
		getCurrentUser: async (_, args, { User, currentUser }) => {
			if(!currentUser){
				return null;
			}
			const user = await User.findOne({ username: currentUser.username }).populate({
				path: 'favorites',
				model: 'Post'
			});
			return user;
		},
		getPosts: async (_, args, { Post} ) => {
			const posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
				path: 'createdBy',
				model: 'User'
			});
			return posts;
		},
		getUserPosts: async(_, { userId }, { Post }) => {
			const posts = await Post.find({
				createdBy: userId
			});
			return posts;
		},
		getPost: async (_, { postId }, { Post }) => {
			const post = await Post.findOne({ _id: postId }).populate({
				path: 'messages.messageUser',
				model: 'User'
			});
			return post;
		},
		infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
			let posts;
			if(pageNum === 1){
				posts = await Post.find({}).sort({ createdDate: 'desc'}).populate({
					path: 'createdBy',
					model: 'User'
				}).limit(pageSize);
			} else {
				//if page is greater than 1, figure out how many documents to skip
				const skips = pageSize * (pageNum - 1);
				posts = await Post.find({}).sort({ createdDate: 'desc'}).populate({
					path: 'createdBy',
					model: 'User'
				}).skip(skips).limit(pageSize);
			}
			const totalDocs = await Post.countDocuments();
			const hasMore = totalDocs > pageSize * pageNum;
			return { posts, hasMore };
		},
		searchPosts: async (_, { searchTerm }, { Post }) => {
			if (searchTerm) {
				const searchResults = await Post.find(
				{ $text: { $search: searchTerm } }, //perform a text search 
				{ score: { $meta: 'textScore' } }
				).sort({
					score: { $meta: 'textScore' },
					likes: 'desc' 
				}).limit(5);
				return searchResults;
			}
		} 
	},
	Mutation: {
		signInUser: async (_, { username, password }, { User }) =>{
			const user = await User.findOne({ username });
			if(!user){
				throw new Error('User not found');
			}
			const isValidPassword = await bcrypt.compare(password, user.password);
			if(!isValidPassword	){
				throw new Error('Invalid password');
			}
			return { 
				token: createToken(user, process.env.SECRET, '1hr')
			}
		},
		signUpUser: async (_, { username, email, password }, { User }) => {
			const user = await User.findOne({ username });
			if(user) {
				throw new Error('User already exists!');
			}
			const newUser = await new User({
				username,
				email,
				password
			}).save();
			return { 
				token: createToken(newUser, process.env.SECRET, '1hr')
			}
		},
		addPost: async (_, { title, imgUrl, categories, description, creatorId}, { Post } ) => {
			const newPost = await new Post({
				title,
				imgUrl,
				categories,
				description,
				createdBy: creatorId
			}).save();
			return newPost;
		},
		addPostMessage: async (_, { messageBody, userId, postId},  { Post }) => {
			const newMessage = {
				messageBody,
				messageUser: userId
			};
			const post = await Post.findOneAndUpdate(
				//find post by id
				{ _id: postId },
				//prepend new message to beginning of messages array
				{ $push: { messages: { $each: [newMessage], $position: 0} } },
				//return fresh document after update
				{ new: true }
			).populate({
				path: 'messages.messageUser',
				model: 'User'
			});
			return post.messages[0];
		},
		updateUserPost: async (_, { postId, userId, title, imgUrl, categories, description }, { Post }) => {
			const post = await Post.findOneAndUpdate(
				{	_id: postId, createdBy: userId },
				{ $set: { title, imgUrl, categories, description } },
				{ new: true }
			);
			return post;
		},
		deleteUserPost: async (_, { postId }, { Post }) => {
			const post = await Post.findOneAndRemove({ _id: postId });
			return post;
		},
		likePost: async (_, { postId, username }, { Post, User }) => {
			//find post, add 1 to its like value
			const post = await Post.findOneAndUpdate(
				{ _id: postId },
				//increase operator to increase certain fields
				{ $inc: { likes: 1 } },
				{ new: true }
			);
			//find user, add id of post to its favorites array (which will be populated as Posts)
			const user = await User.findOneAndUpdate(
				{ username },
				{ $addToSet: { favorites: postId } },
				{ new: true }
			).populate({
				path: 'favorites',
				model: 'Post'
			});
			//return only likes from 'post' and favorites from user
			return { likes: post.likes, favorites: user.favorites };
		},
		unlikePost: async (_, { postId, username }, { Post, User }) => {
			//find post, add -1 to its like value
			const post = await Post.findOneAndUpdate(
				{ _id: postId },
				//increase operator to increase certain fields
				{ $inc: { likes: -1 } },
				{ new: true }
			);
			//find user, remove id of post to its favorites array (which will be populated as Posts)
			const user = await User.findOneAndUpdate(
				{ username },
				{ $pull: { favorites: postId } },
				{ new: true }
			).populate({
				path: 'favorites',
				model: 'Post'
			});
			//return only likes from 'post' and favorites from user
			return { likes: post.likes, favorites: user.favorites };
		}
	}
}