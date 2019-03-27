import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

//global component
import FormAlert from "@/components/Shared/FormAlert";
Vue.component("form-alert", FormAlert);
Vue.use(VueApollo);

//setup apollo client
export const defaultClient = new ApolloClient({
	uri: "https://fullstack-vue-graphql-starter-bxcfnsjjrk.now.sh/graphql",
	//include auth token with request we made to backend
	fetchOptions: {
		credentials: "include",
		mode: "no-cors"
	},
	request: operation => {
		//if no token with key of 'token' in localstorage, add it
		if (!localStorage.token) {
			localStorage.setItem("token", "");
		}
		// operation adds token to an authorization header which then sent to backend
		operation.setContext({
			headers: {
				authorization: localStorage.getItem("token")
			}
		});
	},
	onError: ({ graphQLErrors, networkError }) => {
		if (networkError) {
			// console.log("[networkError]", networkError);
		}
		if (graphQLErrors) {
			for (let error of graphQLErrors) {
				// console.dir(error);
				if (error.name === "AuthenticationError") {
					//set auth error in state to show in snackbar
					store.commit("setAuthError", error);
					store.dispatch("signOutUser");
				}
			}
		}
	}
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
	provide: apolloProvider.provide(), //this will going to inject apollo to each component so we can perform query and mutations
	router,
	store,
	render: h => h(App),
	created() {
		//execute get current user
		this.$store.dispatch("getCurrentUser");
	}
}).$mount("#app");
