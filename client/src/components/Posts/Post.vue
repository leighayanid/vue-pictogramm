<template>
	<v-container v-if="getPost" class="mt-3" flexbox center>
	  <v-layout row wrap>
	    <v-flex xs12>
			  <v-card hover>
			  	<v-card-title>
		        <h1>{{ getPost.title }}</h1>
		        <v-btn large icon v-if="user" @click="handleToggleLike">
		        	<v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
		        </v-btn>
		        <h3 class="ml-3 font-weight-thin">{{ getPost.likes }}</h3>
		        <v-spacer></v-spacer>
		        <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
			  	</v-card-title>
			  	<v-tooltip right>
			  	  <span>Click to enlarge image</span>
			  	  <v-card-media
			  	  	@click="toggleImageDialog"
              slot="activator"
              :src="getPost.imgUrl"
              id="post__image"
              height="60vh"
			  	  >
			  	  </v-card-media>
			  	</v-tooltip>
			  	<v-dialog
			  	  v-model="dialog"
			  	  transition="dialog-transition"
			  	>
			  	  <v-card>
			  	    <v-card-media
			  	      height="80vh"
			  	      :src="getPost.imgUrl"
			  	    >
			  	    </v-card-media>
			  	  </v-card>
			  	</v-dialog>
					<v-card-text>
					  <span v-for="(category, index) in getPost.categories" :key="index">
					  	<v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
					  </span>
					  <h3>{{ getPost.description }}</h3>
					</v-card-text>
	      </v-card>
	    </v-flex>
	  </v-layout>
	  <!-- message form -->
	  <div class="mt-3">
	  	<v-layout class="mb-3" v-if="user">
	  	  <v-flex xs12>
	  	    <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPostMessage">
	  	      <v-layout row wrap>
	  	        <v-flex xs12>
	  	          <v-text-field
	  	          	v-model="messageBody"
	  	          	@click:append-outer="handleAddPostMessage"
	  	            clearable
	  	            :append-outer-icon="messageBody && 'send'"
	  	            type="text"
	  	            prepend-icon="email"
	  	            required
	  	            label="Add message"
	  	            id="id"
	  	            :rules="messageRules"
	  	          ></v-text-field>
	  	        </v-flex>
	  	      </v-layout>
	  	    </v-form>
	  	  </v-flex>
	  	</v-layout>
	  	<!-- messages list -->
	  	<v-layout row wrap>
	  	  <v-flex xs12>
	  	    <v-list subheader two-line>
	  	      <v-subheader>Messages ({{ getPost.messages.length }})</v-subheader>
	  	      <template v-for="message in getPost.messages">
	  	      	<v-divider :key="message._id"></v-divider>
	  	      	<v-list-tile avatar inset :key="message.title">
	  	      	  <v-list-tile-avatar>
	  	      	    <img :src="message.messageUser.avatar">
	  	      	  </v-list-tile-avatar>
	  	      	  <v-list-tile-content> 
		  	      	  <v-list-tile-title>{{ message.messageBody }}</v-list-tile-title>
		  	      	  <v-list-tile-sub-title>
		  	      	  	{{ message.messageUser.username }}
		  	      	  	<span class="grey--text text--lighten-1 hidden-xs-only">{{ message.messageDate }}</span>
		  	      		</v-list-tile-sub-title>
	  	      	  </v-list-tile-content>
	  	      	  <v-list-tile-action class="hidden-xs-only">
	  	      	    <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
	  	      	  </v-list-tile-action>
		  	      </v-list-tile>
	  	      </template>
	  	    </v-list>
	  	  </v-flex>
	  	</v-layout>
	  </div>
	</v-container>
</template>

<script>
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from '../../queries';
import { mapGetters } from 'vuex';

export default{
	name: "Post",
	props: ["postId"],
	data() {
		return {
			dialog: false,
			messageBody:  '',
			isFormValid: true,
			isLiked: false,
			messageRules: [
				message => !!message || 'Message is required.',
				message => message.length < 50 || 'Message must not be less than 50 characters.' 
			]
		}
	},
	apollo: {
		getPost: {
			query: GET_POST,
			variables() {
				return {
					postId: this.postId
				}
			}
		}
	},
	computed: {
		...mapGetters(["user", "userFavorites"])
	},
	methods: {
			goToPreviousPage() {
				this.$router.go(-1);
			},
			toggleImageDialog() {
				if(window.innerWidth > 500){
					this.dialog = !this.dialog;
				}
			},
			handleAddPostMessage() {
				if(this.$refs.form.validate()){
					const variables = {
						messageBody: this.messageBody,
						userId: this.user._id,
						postId: this.postId
					};
					this.$apollo.mutate({
						mutation: ADD_POST_MESSAGE,
						variables,
						update: (cache, { data: { addPostMessage } }) => {
							const data = cache.readQuery({
								query: GET_POST,
								variables: { postId: this.postId }
							});
							// console.log('data', data);
							// console.log("add post messasge", addPostMessage)
							data.getPost.messages.unshift(addPostMessage);
							cache.writeQuery({
								query: GET_POST,
								variables: { postId: this.postId },
								data
							});
						}
					}).then(( { data }) => {
						this.$refs.form.reset();
						console.log(data.addPostMessage)
					}).catch(err => {
						console.error(err);
					});
				}
			},
			checkIfOwnMessage(message){
				return this.user && this.user._id === message.messageUser._id;
			},
			handleLikePost(){
				const variables = {
					postId: this.postId,
					username: this.user.username
				};
				this.$apollo.mutate({
					mutation: LIKE_POST,
					variables,
					update: (cache, { data: { likePost } }) => {
						const data = cache.readQuery({
							query: GET_POST,
							variables: { postId: this.postId }
						});
						data.getPost.likes += 1;
						cache.writeQuery({
							query: GET_POST,
							variables: { postId: this.postId },
							data
						});
					}
				}).populate(({ data }) => {
					// console.log('user', this.user);
					// console.log('likePost', data.likePost);
					const updatedUser = { ...this.user, favorites: data.likePost.favorites };
					this.$store.dispatch('setUser', updatedUser);
				}).catch(err => {
					console.error(err);
				});
			},
			handleUnlikePost(){
				const variables = {
					postId: this.postId,
					username: this.user.username
				};
				this.$apollo.mutate({
					mutation: UNLIKE_POST,
					variables,
					update: (cache, { data: { unlikePost } }) => {
						const data = cache.readQuery({
							query: GET_POST,
							variables: { postId: this.postId }
						});
						data.getPost.likes -= 1;
						cache.writeQuery({
							query: GET_POST,
							variables: { postId: this.postId },
							data
						});
					}
				}).populate(({ data }) => {
					// console.log('user', this.user);
					// console.log('likePost', data.likePost);
					const updatedUser = { ...this.user, favorites: data.unlikePost.favorites };
					this.$store.dispatch('setUser', updatedUser);
				}).catch(err => {
					console.error(err);
				});
			},
			handleToggleLike() {
				if (this.postLiked) {
					this.handleUnlikePost();
				} else {
					this.handleLikePost();
				}
			},
			checkIfPostLiked(postId){
				//checkif user favorites inlcude post with id of postId
				if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)){
					this.isLiked = true;
					return true;
				} else {
					this.isLiked = false;
					return false;
				}
			}
	}}
</script>

<style scoped>
#post__image {
	height: 400px important!
}
</style>