import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "./main";
import  { GET_POSTS, SIGNIN_USER, SIGNUP_USER, GET_CURRENT_USER, ADD_POST } from "./queries";
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	posts: [],
  	loading: false,
    user: null,
    error: null,
    authError: null
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
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
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
      commit('clearError');
      commit('setLoading', true);
      
      localStorage.setItem('token', ''); //clear token to avoid unneccessary malformed token
      apolloClient.mutate({ 
        mutation: SIGNIN_USER,
        variables: payload
      })
      .then(({ data }) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signInUser.token);
        // to make sure created method is run in main.js (we run getCurrentUser), RELOAD THE PAGE WITH THIS METHOD
        router.go();
      }).catch(err => {
        commit('setLoading', false);
        commit('setError', err);
        console.error(err);
      });
    },
    signUpUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      
      localStorage.setItem('token', ''); //clear token to avoid unneccessary malformed token
      apolloClient.mutate({ 
        mutation: SIGNUP_USER,
        variables: payload
      })
      .then(({ data }) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signUpUser.token);
        // to make sure created method is run in main.js (we run getCurrentUser), RELOAD THE PAGE WITH THIS METHOD
        router.go();
      }).catch(err => {
        commit('setLoading', false);
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
    },
    addPost: async ({ commit }, payload) =>{
      apolloClient.mutate({
        mutation: ADD_POST,
        variables: payload,
        //this will take the update to cache and add new information created from mutation
        update: (cache, { data: { addPost } }) => {
          console.log(cache, data);
          //first read the query we need to update
          const data = cache.readQuery({ query: GET_POSTS });
          //create updated data
          data.getPosts.unshift(addPost);
          //write data back to same query
          cache.writeQuery({
            query: GET_POSTS,
            data
          }); 
        },
        //ensures that the data we're writing back should be updated immediately
        optimisticResponse: {
          __typeName: 'Mutation',
          addPost: {
            __typeName: 'Post',
            _id: -1,
            ...payload
          }
        }
      }).then(({ data }) => {
        console.log(data.addPost);
      }).catch(err => {
        console.error(err);
      });
    }
  },
  getters: {
  	posts: state => state.posts,
  	loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
