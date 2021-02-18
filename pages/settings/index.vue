<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
              <fieldset class="form-gradoup">
                <input
                  v-model="userForm.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="userForm.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="New Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right"
                @click.stop.prevent="update"
                :disabled="disable">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click.stop.prevent="logout"
            :disabled="disable">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'authenticated',
  name: 'settingsPage',
  computed: {
    ...mapState(['user'])
  },
  async created () {
    // 如果有user，说明已登录，直接获取store中的user信息
    if (this.user) {
      const {
        image,
        username,
        bio
      } = this.user
      this.userForm = {
        image,
        username,
        bio,
        email: this.user.email,
        password: ''
      }
    }
  },
  data () {
    return {
      userForm: {
        image: '',
        username: '',
        bio: '',
        email: '',
        password: ''
      },
      disable: false
    }
  },
  methods: {
    // 更新user后跳转profile页面
    async update () {
      this.disable = true
      const { data } = await updateUser({
        user: this.userForm
      })
      this.$router.push({
        name: 'profile',
        params: {
          username: data.user.username
        }
      })
    },
    logout () {
      this.disable = true
      Cookie.remove('user')
      this.$store.commit('setUser', null)
      this.$router.push('/')
    }
  }
};
</script>

<style>
</style>