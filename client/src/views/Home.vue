<template>
  <v-container class="home">
    <v-layout row>
      <v-dialog
        v-model="loading"
        scrollable fullscreen 
        persistent :overlay="false">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
   <v-flex xs12>
     <v-carousel v-if="!loading && posts.length > 0" v-bind="{ 'cycle': true}" interval="3000" hide-controls>
       <v-carousel-item v-for="post in posts" :key="post._id" :src="post.imgUrl">
         <h1 class="post">{{ post.title }}</h1>
       </v-carousel-item>
     </v-carousel>
   </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "home",
  created() {
    this.getImageForCarousel();
  },
  computed: {
    ...mapGetters(["loading", "posts"])
  },
  methods: {
    getImageForCarousel() {
      this.$store.dispatch("getPosts")
    }
  }
};
</script>

<style scoped>
  .post{
    position: absolute;
    top:0;
    left: 0;
    color: white;
    background: black;
  }
</style>
