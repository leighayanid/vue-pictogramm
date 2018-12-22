<template>
	<v-container v-if="getPost" class="mt-3" flexbox center>
	  <v-layout row wrap>
	    <v-flex xs12>
			  <v-card hover>
			  	<v-card-title>
		        <h1>{{ getPost.title }}</h1>
		        <v-btn large icon v-if="user">
		        	<v-icon large color="grey">favorite</v-icon>
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
			  	  >
			  	  </v-card-media>
			  	</v-tooltip>
			  	<v-dialog
			  	  v-model="dialog"
			  	  scrollable fullscreen 
			  	  persistent :overlay="false"
			  	  max-width="500px"
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
	</v-container>
</template>

<script>
import { GET_POST } from '../../queries';
import { mapGetters } from 'vuex';

	export default{
		name: "Post",
		props: ["postId"],
		data() {
			return {
				dialog: false
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
			...mapGetters(["user"])
		},
		methods: {
			goToPreviousPage() {
				this.$router.go(-1);
			},
			toggleImageDialog() {
				if(window.innerWidth > 500){
					this.dialog = !this.dialog;
				}
			}
		}
	}
</script>

<style scoped>
#post__image{
	height: 400px important!
}
</style>