<template>
	<v-container fluid grid-list-xl>
	  <v-layout row wrap v-if="infiniteScrollPosts">
	    <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
	      <v-card hover>
	        <v-card-media
	          height="30vh"
	          :src="post.imgUrl"
	          lazy>
	        </v-card-media>
	        <v-card-actions>  
	        	<v-card-title primary>
	        	 <div class="headline">{{ post.title }}</div>
	        	 <span class="grey--text">{{ post.likes }} likes - {{ post.messages.length }} comments</span>
	        	</v-card-title>
	        	<v-spacer></v-spacer>
	        	<v-btn icon @click="showPostCreator = !showPostCreator">
	        		<v-icon>{{`keyboard_arrow_${ showPostCreator ? 'up' : 'down'}`}}</v-icon>
	        	</v-btn>
	        </v-card-actions>
	      	<v-slide-y-transition>
	      		<v-card-text v-if="showPostCreator" class="grey lighten-4">
	      		  <v-list-tile avatar>
	      		    <v-list-tile-avatar>
	      		      <img :src="post.createdBy.avatar">
	      		    </v-list-tile-avatar>
	      		    <v-list-tile-content>
	      		      <v-list-tile-title class="text--primary">{{ post.createdBy.username }}</v-list-tile-title>
	      		      <v-list-tile-sub-title class="font-weight-thin">Added {{ post.createdDate }}</v-list-tile-sub-title>
	      		    </v-list-tile-content>
	      		    <v-list-tile-action>
	      		      <v-btn icon color="grey lighten-1">info</v-btn>
	      		    </v-list-tile-action>
	      		  </v-list-tile>
	      		</v-card-text>
	      	</v-slide-y-transition>
	      </v-card>
	    </v-flex>
	    <v-layout column>
	      <v-flex xs12>
	        <v-layout justify-center row>
	          <v-btn color="info" @click="showMore">Fetch more post</v-btn>
	        </v-layout>
	      </v-flex>
	    </v-layout>
	  </v-layout>
	</v-container>
</template>
<script>
import { INFINITE_SCROLL_POSTS } from '../../queries';
const pageSize = 2;

	export default{
		name: "Posts",
		data() {
			return {
				pageNum: 1,
				showMoreEnabled: true,
				showPostCreator: false
			}
		},
		apollo: {
			infiniteScrollPosts: {
				query: INFINITE_SCROLL_POSTS,
				variables: {
					pageNum: 1,
					pageSize
				}
			}
		},
		methods: {
			showMore(){
				this.pageNum += 1;
				//fetch more data and transform original result
				this.$apollo.queries.infiniteScrollPosts.fetchMore({
					variables: {
						pageNum: this.pageNum, //increment page num 
						pageSize
					},
					updateQuery: (prevResult, { fetchMoreResult }) => {
						const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
						const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
						this.showMoreEnabled = hasMore;

						return {
							infiniteScrollPosts: {
								__typename: prevResult.infiniteScrollPosts.__typename,
								//merge old post to new posts
								posts: [
									...prevResult.infiniteScrollPosts.posts,
									...newPosts
								],
								hasMore
							}
						}
					}
				});
			}
		}
	};
</script>