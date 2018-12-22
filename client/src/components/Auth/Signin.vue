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
	          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignInUser">
	            <v-layout row>
	              <v-flex xs12>
	                <v-text-field
	                	:rules="usernameRules"
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
	                	:rules="passwordRules"
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
	                <v-btn :loading="loading" :disabled="!isFormValid" color="accent" mt-5 type="submit">	
	                	Sign in
	                	<span slot="loader" class="custom-loader">
	                		<v-icon light>cached</v-icon>
	                	</span>
	              	</v-btn>
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
				password: '',
				usernameRules: [
					username => !!username || 'Username is required',
					username => username.length < 20 || 'Username must be less than 10 characters'
				],
				passwordRules: [
					password => !!password || 'Password is required',
					password => password.length >= 4 || 'Password must be atleast 7 characters'
				],
				isFormValid: true
			}
		},
		computed: {
			...mapGetters(["user", "error", "loading"])
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
				if (this.$refs.form.validate()) {
					this.$store.dispatch("signInUser", { 
						username: this.username,
						password: this.password 
					});
				}
			}
		}
	};
</script>

<style>
	.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>