import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
import colors from "vuetify/es5/util/colors"

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: "md",
  theme: {
	  primary: colors.pink.base,
	  secondary: colors.pink.lighten3,
	  accent: colors.deepPurple.accent4,
	  error: colors.red.base,
	  warning: colors.yellow.base,
	  info: colors.blue.base,
	  success: colors.green.base
  }
});
