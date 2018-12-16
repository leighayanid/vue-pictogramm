import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "./main";
import  { GET_POSTS, SIGNIN_USER, SIGNUP_USER, GET_CURRENT_USER } from "./queries";
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	posts: [],
  	loading: false,
    user: null,
    error: null
  },
  mutations: {
  	setPosts: (state, payload) => {
  		state.posts = payload;
  	},
  	setLoading: (state, payload) => { 
  		state.loading = payload;
  	},
    setUser: (state, payload) => {
      state.user = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('setLoading', false);
        commit('setUser', data.getCurrentUser); //adds user data to state
        console.log(data.getCurrentUser);
      })
      .catch(err => {
        commit('setLoading', false);
        console.log(err);
      });
    },
  	getPosts: ({ commit }) => {
  		commit('setLoading', true);
  		apolloClient.query({ 
        query: GET_POSTS 
      })
      .then(({ data }) => {
  				//get data from action to state via mutations
  				//commit passes data from actions along to mutation functions
  			commit('setPosts', data.getPosts);
  			commit('setLoading', false);
  		}).catch(err => {
  			console.error(err);
  			commit('setLoading', false);
  		});
  	},
    signInUser: ({ commit }, payload) => {
      localStorage.setItem('token', ''); //clear token to avoid unneccessary malformed token
      apolloClient.mutate({ 
        mutation: SIGNIN_USER, variables: payload
      })
      .then(({ data }) => {
        localStorage.setItem('token', data.signInUser.token);
        // to make sure created method is run in main.js (we run getCurrentUser), RELOAD THE PAGE WITH THIS METHOD
        router.go();
      }).catch(err => {
        commit('setError', err);
        console.error(err);
      });
    },
    signOutUser: async ({ commit }) => {
      //clear user in state
      commit('clearUser');
      //remove token in localstorage
      localStorage.setItem('token', '');
      //end session
      await apolloClient.resetStore();
      //redirect home, destroy user
      router.push('/');
    }
  },
  getters: {
  	posts: state => state.posts,
  	loading: state => state.loading,
    user: state => state.user,
    error: state => state.error
  }
});
