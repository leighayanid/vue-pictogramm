<template>
	<v-container text-xs-center mt-5 pt-5>
	  <v-layout row wrap>
	    <v-flex xs12 sm6 offset-sm3>
	      <h1>Welcome to Vue Pictogramm!</h1>
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
	      <v-card color="accent" dark>
	        <v-container>
	          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignUpUser">
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
	                	:rules="emailRules"
	                  prepend-icon="face"
	                  label="Email Address"
	                  type="email"
	                  required
	                  v-model="email"
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
	                <v-text-field
	                	:rules="passwordRules"
	                  prepend-icon="gavel"
	                  label="Confirm Password"
	                  type="password"
	                  required
	                  v-model="passwordConfirmation"
	                ></v-text-field>
	              </v-flex>
	            </v-layout>
	             <v-layout row>
	              <v-flex xs12>
	                <v-btn 
	                	:loading="loading"
	                	:disabled="!isFormValid"
	                	color="info"mt-5 type="submit">	
	                	Sign Up
	                	<span slot="loader" class="custom-loader">
	                		<v-icon light>cached</v-icon>
	                	</span>
	              	</v-btn>
	                <h3>Already have an account? <router-link to="/signin">Sign in</router-link></h3>
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
		name: "Signup",
		data() {
			return {	
				username: '',
				email: '',
				password: '',
				passwordConfirmation: '',
				isFormValid: true,
				usernameRules: [
					username => !!username || 'Username is required',
					username => username.length < 20 || 'Username must be less than 10 characters'
				],
				emailRules: [
					email => !!email || 'Email is required',
					email => /.@+./.test(email) || 'Email must be valid.'
				],
				passwordRules: [
					password => !!password || 'Password is required',
					password => password.length >= 4 || 'Password must be atleast 4 characters',
					confirmation => confirmation === this.password || 'Password must match.'
				]
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
			handleSignUpUser(){
				if (this.$refs.form.validate()) {
					this.$store.dispatch("signUpUser", { 
						username: this.username,
						email: this.email,
						password: this.password 
					});
				}
			}
		}
	};
</script>