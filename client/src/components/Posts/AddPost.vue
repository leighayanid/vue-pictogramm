<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome to Vue Pictogramm!</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">
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
          <!-- BUTTON -->
          <v-layout row>
            <v-flex xs12>
              <v-btn
                :loading="loading"
                :disabled="!isFormValid || loading"
                color="info"
                mt-5
                type="submit"
              >
                Add Post
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      title: "",
      description: "",
      imgUrl: "",
      categories: [],
      isFormValid: true,
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 30 || "Title must be less than 30 characters"
      ],
      descriptionRules: [
        description => !!description || "Description is required",
        description =>
          description.length < 250 ||
          "Description must be less than 250 characters"
      ],
      imageRules: [imgUrl => !!imgUrl || "Image url is required"],
      categoriesRules: [
        categories => !!categories || "Categories are required",
        categories => categories.length < 1 || "Atleast 1 entry is required."
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "loading"])
  },
  watch: {
    user(value) {
      //if user value changes from null to object, redirect to homepage
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          description: this.description,
          imgUrl: this.imgUrl,
          categories: this.categories,
          creatorId: this.user._id
        });
      }
      this.$router.push("/");
    }
  }
};
</script>