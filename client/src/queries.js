import { gql } from "apollo-boost";

// POST QUERIES
export const GET_POSTS = gql`
	query {
		getPosts {
			_id
			title
			imgUrl
		}
	}
`;

export const GET_POST = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			_id
			title
			imgUrl
			categories
			description
			likes
			createdDate
			messages {
				_id
				messageBody
				messageDate
				messageUser {
					_id
					username
					avatar
				}
			}
		}
	}
`;

export const INFINITE_SCROLL_POSTS = gql`
	query($pageNum: Int!, $pageSize: Int!){
		infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
			hasMore
			posts {
				_id
				title
				imgUrl
				categories
				description
				likes
				createdDate
				messages {
					_id
				}
				createdBy {
					_id
					username
					avatar
				}
			}
		}
	}
`;

//POST MUTATION
export const ADD_POST = gql`
	mutation($title: String!, $imgUrl: String!, $description: String!, $categories: [String]!, $creatorId: ID!){
		addPost(title: $title, imgUrl: $imgUrl, description: $description, categories: $categories, creatorId: $creatorId){
			_id
			title
			imgUrl
			description
			categories
		}
	}
`;

// USER'S MUTATION
export const SIGNIN_USER = gql`
	mutation($username: String!, $password: String!) {
		signInUser(username: $username, password: $password){
			token
		}
	}
`;

export const SIGNUP_USER = gql`
	mutation($username: String!, $email: String!, $password: String!){
		signUpUser(username: $username, email: $email, password: $password){
			token
		}
	}
`;

// USER'S QUERIES
export const GET_CURRENT_USER = gql`
	query {
		getCurrentUser {
			_id
			username
			email
			password
			avatar
			joinDate
			favorites {
				_id
				title
				imgUrl
			}
		}
	}
`;
