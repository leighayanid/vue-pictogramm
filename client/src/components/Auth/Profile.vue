<template>
	<v-container class="text-xs-center">
	  <v-flex sm6 offset-sm3 >
	    <v-card class="white--text" color="secondary">
	      <v-layout>
	        <v-flex xs5>
	          <v-img
	          contain
	            height="125px"
	            :src="user.avatar"
	          ></v-img>
	        </v-flex>
	        <v-flex xs7>
	          <v-card-title primary-title>
	            <div>
	            	<div class="headline">{{ user.username }}</div>
	            	<div>Joined {{ formatJoinDate(user.joinDate) }}</div>
	            	<div class="hidden-xs-only font-weight-thin">{{ user.favorites.length }}</div>
	            	<div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts added</div>
	            </div>
	          </v-card-title>
	        </v-flex>
	      </v-layout>
	    </v-card>
	  </v-flex>
	  <v-container v-if="!userFavorites.length">
		  <v-layout row wrap>
		    <v-flex xs12>
		      <h2>You have no favorites currently. Go and add some.</h2>
		    </v-flex>	
		  </v-layout>
	  </v-container>
	  <v-container class="mt-3" v-else>
	    <v-flex xs12>
	       <h2 class="font-weight-light">
	       	Favorited
	       	<span class="font-weight-regular">{{ userFavorites.length }}</span>
	       </h2>
	    </v-flex>
	    <v-layout row wrap>
	      <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
	        <v-card class="mt-3 ml-1 mr-2">
	          <v-img
	          	@click="goToPost(favorite._id)"
	            height="30vh"
	            :src="favorite.imgUrl"
	          ></v-img>
	          <v-card-text>
	            {{ favorite.title }}
	          </v-card-text>
	        </v-card>
	      </v-flex>
	    </v-layout>
	  </v-container>
	  <!-- profile posts -->
	  <v-container v-if="!userPosts.length">
	    <v-layout row>
	      <v-flex xs12>
	        <h2>You have no posts. Add some.</h2>
	      </v-flex>
	    </v-layout>
	  </v-container>
	  <v-container class="mt-3" v-else>
	    <v-flex xs12>
	    	<h2 class="font-weight-light">Your posts
					<span class="font-weight-regular">{{ userPosts.length }}</span>
	    	</h2>
	    </v-flex>
	    <v-layout row wrap>
	      <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
	        <v-card class="mt-3 ml-1 mr-2">
	          <v-btn @click="loadPost(post)" color="info" floating fab small dark>
	          	<v-icon>edit</v-icon>
	          </v-btn>
	           <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
	          	<v-icon>delete</v-icon>
	          </v-btn>
	          <v-img
	            height="30vh"
	            :src="post.imgUrl"
	            @click="goToPost(post._id)"
	          >
	          </v-img>
	          <v-card-text>
	            {{ post.title }}
	          </v-card-text>
	        </v-card>
	      </v-flex>
	    </v-layout>
	  </v-container>
	  <!-- edit post dialog -->
	  <v-dialog
	    v-model="editPostDialog"
	    persistent
	    xs12 sm6 offset-sm3
	    transition="dialog-transition"
	  >
	    <v-card>
	      <v-card-title class="headline grey lighten-2">
	        Update Post
	      </v-card-title>
	      <v-container>
		      <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">
	          <!-- TITLE -->
	          <v-layout row>
	            <v-flex xs12>
	              <v-text-field
	              	:rules="titleRules"
	                label="Post Title"
	                type="text"
	                required
	                v-model="title"
	              ></v-text-field>
	            </v-flex>
	          </v-layout>
	          <!-- IMAGE URL -->
	          <v-layout row>
	            <v-flex xs12>
	              <v-text-field
	                :rules="imageRules"
	                label="Image URL"
	                type="text"
	                required
	                v-model="imgUrl"
	              ></v-text-field>
	            </v-flex>
	          </v-layout>
	          <!-- IMAGE PREVIEW -->
	          <v-layout row wrap>
	            <v-flex xs12>
	              <img :src="imgUrl" height="300px">
	            </v-flex>
	          </v-layout>
	          <!-- CATEGORIES -->
	           <v-layout row wrap>
	            <v-flex xs12>
	              <v-select
	                :items="['Art', 'Education', 'Photography', 'Technology']"
	                v-model="categories"
	                label="Categories"
	                multiple
	              ></v-select>
	            </v-flex>
	          </v-layout>
	          <!-- TEXT AREA -->
	          <v-layout row wrap>
	            <v-flex xs12>
	             <v-textarea
	                :rules="descriptionRules"
	                label="Description"
	                type="text"
	                required
	                v-model="description"
	              ></v-textarea>
	            </v-flex>
	          </v-layout>
	 					<v-divider></v-divider>
	 					<v-card-actions>
	 					  <v-spacer></v-spacer>
	 					  <v-btn :disabled="!isFormValid" type="submit" class="success--text" flat>Update</v-btn>
	 					  <v-btn class="error--text" flat @click="editPostDialog = false">Cancel</v-btn>
	 					</v-card-actions>
	        </v-form>
	      </v-container>
	    </v-card>
	  </v-dialog>
	</v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

	export default{
		name: "Profile",
		data() {
			return {
				editPostDialog: false,
				title: '',
        description: '',
        imgUrl: '',
				categories: [],
				isFormValid: true,
				titleRules: [
					title => !!title || 'Title is required',
					title => title.length < 30 || 'Title must be less than 30 characters'
				],
        descriptionRules: [
          description => !!description || 'Description is required',
          description => description.length < 250 || 'Description must be less than 250 characters'
        ],
        imageRules: [
          imgUrl => !!imgUrl || 'Image url is required'
        ],
        categoriesRules: [
          categories => !!categories || 'Categories are required',
          categories => categories.length < 1 || 'Atleast 1 entry is required.'
        ]
			}
		},
		computed: {
			...mapGetters(["user", "userFavorites", "userPosts"])
		},
		created() {
			this.handleGetUserPosts();
		},
		methods: {
			handleGetUserPosts() {
				this.$store.dispatch('getUserPosts', {
					userId: this.user._id
				});
			},
			handleUpdateUserPost() {
				if(this.$refs.form.validate()){
					this.$store.dispatch('updateUserPost', {
						postId: this.postId,
						userId: this.user._id,
						title: this.title,
						imgUrl: this.imgUrl,
						categories: this.categories,
						description: this.description
					});
					this.editPostDialog = false;
				}
			},
			loadPost({ _id, title, imgUrl, categories, description}, editPostDialog = true) {
				this.editPostDialog = editPostDialog;
				this.postId = _id;
				this.title = title;
				this.imgUrl = imgUrl;
				this.categories = categories;
				this.description = description;
			},
			goToPost(postId){
				this.$router.push(`/posts/${postId}`);
			},
			handleDeleteUserPost(post){
				this.loadPost(post, false);
				const deletePost = window.confirm("Are you sure you want to delete this post?");
				if (deletePost) {
					this.$store.dispatch('deleteUserPost', {
						postId: this.postId
					});
				}
			},
			formatJoinDate(date){
				return moment(new Date(date)).format('ll');
			}
		}
	};
</script>

<style>
	.v-image{
		cursor: pointer;
	}
</style>