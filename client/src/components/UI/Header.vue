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
		  <v-text-field flex dark prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>
		  <v-spacer></v-spacer>
		  <v-toolbar-items class="hidden-xs-only">
		  	<v-btn flat v-for="item in links" :key="item.title" color="secondary" :to="item.link">
		  		<v-icon left class="hidden-xs-only">{{ item.icon }}</v-icon>
		  		{{ item.title}}
		  	</v-btn>
		  	<!-- profile -->
		  	<v-btn color="success" flat to="/profile" v-if="user">
		  		<v-icon class="hidden-sm-only">account_box</v-icon>
		  		<v-badge right color="primary">
		  		  <span slot="badge">1</span> <!--slot can be any component-->
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
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			sideNav: false
		}
	},
	computed: {
		...mapGetters(["user"]),
		links() {
			let items = [
				{ icon: 'chat', title: 'Posts', link: '/posts' },
				{ icon: 'lock_open', title: 'Sign in', link: '/signin' },
				{ icon: 'create', title: 'Sign up', link: '/signup' }
			];
			if(this.user){
				items = [
					{ icon: 'chat', title: 'Posts', link: '/posts' },
					{ icon: 'stars', title: 'Create Post', link: '/post/add' }
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
		}
	}
};
</script>