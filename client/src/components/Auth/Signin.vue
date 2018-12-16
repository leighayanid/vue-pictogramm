<template>
	<v-container text-xs-center mt-5 pt-5>
	  <v-layout row wrap>
	    <v-flex xs12 sm6 offset-sm3>
	      <h1>Welcome back!</h1>
	    </v-flex>
	  </v-layout>
	  <!-- error alert component -->
	  <v-layout v-if="error" row wrap>
	    <v-flex xs12 sm6 offset-sm3>
	      <form-alert :message="error.message"></form-alert>
	    </v-flex>
	  </v-layout>
	  <v-layout row wrap>
	    <v-flex xs12 sm6 offset-sm3>
	      <v-card color="secondary" dark>
	        <v-container>
	          <v-form @submit.prevent="handleSignInUser">
	            <v-layout row>
	              <v-flex xs12>
	                <v-text-field
	                  prepend-icon="face"
	                  label="Username"
	                  type="text"
	                  required
	                  v-model="username"
	                ></v-text-field>
	              </v-flex>
	            </v-layout>
	             <v-layout row>
	              <v-flex xs12>
	                <v-text-field
	                  prepend-icon="extension"
	                  label="Password"
	                  type="password"
	                  required
	                  v-model="password"
	                ></v-text-field>
	              </v-flex>
	            </v-layout>
	             <v-layout row>
	              <v-flex xs12>
	                <v-btn color="accent" mt-5 type="submit">Sign in</v-btn>
	                <h3>Don't have an account? <router-link to="/signup">Sign up</router-link></h3>
	              </v-flex>
	            </v-layout>
	          </v-form>
	        </v-container>
	      </v-card>
	    </v-flex>
	  </v-layout>
	</v-container>
</template>
<script>
import { mapGetters } from 'vuex';

	export default{
		name: "Signin",
		data() {
			return {	
				username: '',
				password: ''
			}
		},
		computed: {
			...mapGetters(["user", "error"])
		},
		watch: {
			user(value){
				//if user value changes from null to object, redirect to homepage
				if(value){
					this.$router.push('/');
				}
			}
		},
		methods: {
			handleSignInUser(){
				this.$store.dispatch("signInUser", { 
					username: this.username,
					password: this.password 
				});
			}
		}
	};
</script>