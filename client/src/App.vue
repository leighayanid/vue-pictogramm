<template>
  <v-app id="app">
    <Header />
    <main>
      <v-container>
        <transition name="fade">
          <router-view/>
        </transition>

        <!-- sign in snackbar -->
        <v-snackbar
          color="success"
          v-model="authSnackbar" bottom left :timeout='5000'>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in.</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>
        
        <!-- auth error -->
         <v-snackbar
          v-if="authError"
          color="info"
          v-model="authErrorSnackbar" bottom left :timeout='5000'>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark flat to="/signin">Sign In</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import Header from '@/components/UI/Header';
import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        authSnackbar: true,
        authErrorSnackbar: true
      }
    },
    computed: {
      ...mapGetters(["authError"])
    },
    watch: {
      user(newValue, oldValue){
        if(oldValue === null){
          this.authSnackbar = false;
        }
      },
      authError(value){
        //if auth error is not null, show the auth error snackbar
        if (value !== null) {
          this.authErrorSnackbar = true;
        }
      }
    },
    components: {
      Header
    }
  }
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active,
.fade-leave-active{
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active{
  transition-delay: 0;
}

.fade-enter,
.fade-leave-active{
  opacity: 0;
  transform: translateX(-25px);
}
</style>
