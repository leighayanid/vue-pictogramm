import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "./main";
import  { 
  GET_POSTS, SIGNIN_USER, 
  SIGNUP_USER, GET_CURRENT_USER, 
  INFINITE_SCROLL_POSTS,
  ADD_POST, SEARCH_POSTS, GET_USER_POSTS, 
  UPDATE_USER_POST, DELETE_USER_POST } from "./queries";
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	posts: [],
  	loading: false,
    user: null,
    error: null,
    authError: null,
    searchResults: [],
    userPosts: []
  },
  mutations: {
  	setPosts: (state, payload) => {
  		state.posts = payload;
  	},
    setSearchResults: (state, payload) => {
      if(payload != null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
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
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
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
    getUserPosts: ({commit}, payload) => {
      apolloClient.query({
        query: GET_USER_POSTS,
        variables: payload
      }).then(({ data }) =>{
        console.log(data.getUserPosts);
        commit('setUserPosts', data.getUserPosts);
      }).catch(err => {
        console.error(err);
      });
    },
    searchPosts: ({commit}, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        console.log(data.searchPosts);
        commit('setSearchResults', data.searchPosts);
      }).catch(err => console.error(err));
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
    addPost: ({ commit }, payload) =>{
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
        },
        //rerun specific queries after performing the mutation in order to get fresh data
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            }
          }
        ]
      }).then(({ data }) => {
        console.log(data.addPost);
      }).catch(err => {
        console.error(err);
      });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      }).then(({ data }) => {
        // console.log('user post', state.userPosts);
        // console.log('updated post', data.updateUserPost);
        const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
        const userPosts = [...state.userPosts.slice(0, index), data.updateUserPost, ...state.userPosts.slice(index + 1)];
        commit('setUserPosts', userPosts);
      }).catch(err => {
        console.error(err);
      });
    },
    deleteUserPost: ({ state, commit}, payload) => {
      apolloClient.mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      }).then(({ data }) =>{
        const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
        const userPosts = [...state.userPosts.slice(0, index), ...state.userPosts.slice(index + 1)];
        commit('setUserPosts', userPosts);
      }).catch(err => {
        console.error(err);
      });
      router.go();
    }
  },
  getters: {
  	posts: state => state.posts,
    searchResults: state => state.searchResults,
  	loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
    userPosts: state => state.userPosts
  }
});
