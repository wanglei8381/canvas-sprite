import Vue from 'vue'
/* eslint-disable no-unused-vars */
import App from './App.vue'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render (h) {
    return <App></App>
  }
})

window.onbeforeunload = function (e) {
  var confirmationMessage = '您确定要离开吗?'
  return confirmationMessage
}
