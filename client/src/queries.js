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