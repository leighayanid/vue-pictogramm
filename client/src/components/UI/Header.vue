<template>
	<div>
		<v-navigation-drawer app temporary fixed v-model="sideNav">
			<v-toolbar color="primary" dark flat>
			  <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
			  <v-toolbar-title>
			  	Vue Pictogramm
			  </v-toolbar-title>
			  <v-divider></v-divider>
			</v-toolbar>
		  <v-list>
		    <v-list-tile v-for="item in links" :key="item.title" :to="item.link">
		      <v-list-tile-action>
		        <v-icon>{{ item.icon }}</v-icon>
		      </v-list-tile-action>
		      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
		    </v-list-tile>
		    <!-- sign out -->
		    <v-list-tile v-if="user">
		      <v-list-tile-action>
		        <v-icon>exit_to_app</v-icon>
		      </v-list-tile-action>
		      <v-list-tile-content>
		        Sign out
		      </v-list-tile-content>
		    </v-list-tile>
		  </v-list>
		</v-navigation-drawer>
		<v-toolbar color="primary" dark>
		  <v-toolbar-side-icon @click="toggleSideNav" dark flat></v-toolbar-side-icon>
		  <v-toolbar-title class="hidden-xs-only">
		  	<router-link to="/" tag="span" style="cursor: pointer">Vue Pictogramm</router-link>
		  </v-toolbar-title>
		  <v-spacer></v-spacer>
		  <v-text-field v-model="searchTerm" @input="handleSearchPosts" flex dark prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>
		  <v-spacer></v-spacer>
		  <v-toolbar-items class="hidden-xs-only">
		  	<v-btn flat v-for="item in links" :key="item.title" color="secondary" :to="item.link">
		  		<v-icon left class="hidden-xs-only">{{ item.icon }}</v-icon>
		  		{{ item.title}}
		  	</v-btn>
		  	<!-- profile -->
		  	<v-btn color="success" flat to="/profile" v-if="user">
		  		<v-icon class="hidden-sm-only">account_box</v-icon>
		  		<v-badge right color="primary" :class="{ 'bounce': badgeAnimated }">
		  		  <span slot="badge" v-if="userFavorites.length">{{ userFavorites.length }}</span> <!--slot can be any component-->
		  		  Profile
		  		</v-badge>
		  	</v-btn>
		  	<!-- sign out -->
		  	<v-btn color="success" flat v-if="user" @click="signout">
		  		<v-icon class="hidden-sm-only">exit_to_app</v-icon>
		  		Sign out
		  	</v-btn>
		  </v-toolbar-items>
		</v-toolbar>

		<!-- SEARCH RESULTS -->
		<v-card dark v-if="searchResults.length" id="card__search">
		  <v-list>
			    <v-list-tile v-for="result in searchResults" :key="result._id" @click="goToSearchResult(result._id)">
			      <v-list-tile-title>{{ result.title }}</v-list-tile-title>
			      <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
			      <!-- show icon if favorited by user -->
				    <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
				 			 <v-icon>favorite</v-icon>
				    </v-list-tile-action>
		    </v-list-tile>
		  </v-list>
		</v-card>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			sideNav: false,
			badgeAnimated: false,
			searchTerm: ''
		}
	},
	computed: {
		...mapGetters(["user", "userFavorites", "searchResults"]),
		links() {
			let items = [
				{ icon: 'chat', title: 'Posts', link: '/posts' },
				{ icon: 'lock_open', title: 'Sign in', link: '/signin' },
				{ icon: 'create', title: 'Sign up', link: '/signup' }
			];
			if(this.user){
				items = [
					{ icon: 'chat', title: 'Posts', link: '/posts' },
					{ icon: 'stars', title: 'Create Post', link: '/post/addpost' }
				];
			}
			return items;
		} 
	},
	methods: {
		toggleSideNav() {
			this.sideNav = !this.sideNav;
		},
		signout() {
			this.$store.dispatch('signOutUser');
		},
		handleSearchPosts(){
			this.$store.dispatch('searchPosts', {
				searchTerm: this.searchTerm
			});
		},
		goToSearchResult(id){
			this.searchTerm = '';
			this.$router.push(`/posts/${id}`);
			this.$store.commit('clearSearchResults');
		},
		formatDescription(description){
			return description.length > 20 ? `${description.slice(0, 20)}...` : description;
		},
		checkIfUserFavorite(resultId) {
			return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId);
		}
	},
	watch: {
		userFavorites(value) {
			if(value){
				this.badgeAnimated = true;
				setTimeOut(() => (this.badgeAnimated = false), 1000);
			}
		}
	}
};
</script>

<style scoped>
	.bounce{
		animation: bounce 1s both;
	}

	#card__search {
		position: absolute;
		width: 100vw;
		z-index: 8;
		top: 10%;
		left: 0%;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			-webkit-transform: translate3d(0,0,0);
			   -moz-transform: translate3d(0,0,0);
			    -ms-transform: translate3d(0,0,0);
			     -o-transform: translate3d(0,0,0);
			        transform: translate3d(0,0,0);
		}
		40%, 43% {
			-webkit-transform: translate3d(0,-20px,0);
		   -moz-transform: translate3d(0,-20px,0);
		    -ms-transform: translate3d(0,-20px,0);
		     -o-transform: translate3d(0,-20px,0);
		        transform: translate3d(0,-20px,0);
		}
		70% {
			-webkit-transform: translate3d(0,-10px,0);
		   -moz-transform: translate3d(0,-10px,0);
		    -ms-transform: translate3d(0,-10px,0);
		     -o-transform: translate3d(0,-10px,0);
		        transform: translate3d(0,-10px,0);
		}
		90% {
			-webkit-transform: translate3d(0,-4px,0);
		   -moz-transform: translate3d(0,-4px,0);
		    -ms-transform: translate3d(0,-4px,0);
		     -o-transform: translate3d(0,-4px,0);
		        transform: translate3d(0,-4px,0);
		}
	}
</style>