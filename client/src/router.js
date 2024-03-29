import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Profile from "@/components/Auth/Profile.vue";
import Signin from "@/components/Auth/Signin.vue";
import Signup from "@/components/Auth/Signup.vue";
import AddPost from "@/components/Posts/AddPost.vue";
import Posts from "@/components/Posts/Posts.vue";
import Post from "@/components/Posts/Post.vue";
import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path: "/profile",
			name: "profile",
			component: Profile,
			beforeEnter: AuthGuard
		},
		{
			path: "/signin",
			name: "signin",
			component: Signin
		},
		{
			path: "/signup",
			name: "signup",
			component: Signup
		},
		{
			path: "/post/addpost",
			name: "addpost",
			component: AddPost,
			beforeEnter: AuthGuard
		},
		{
			path: "/posts",
			name: "posts",
			component: Posts
		},
		{
			path: "/posts/:postId",
			name: "post",
			component: Post,
			props: true
		}
	]
});
