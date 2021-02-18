<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4> {{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn"
              @click="handleProfile"
              :disabled="followDisable"
              :class="{ active: (!user || user.username !== profile.username) 
                && profile.following }">
              <template v-if="user && user.username === profile.username">
                <i class="ion-gear-a"></i>
                &nbsp;
                Edit Profile Settings
              </template>
              <template v-else>
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
              </template>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="`/profile/${profile.username}`" exact
                  :class="{ active: !$route.params.favorite }">
                  My Articles {{ !$route.params.favorite }}
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="`/profile/${profile.username}/favorite`" exact
                  :class="{ active: $route.params.favorite }">
                Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <template v-if="articles.length">
            <div class="article-preview" v-for="article in articles" :key="article.slug">
              <div class="article-meta">
                <nuxt-link :to="`/profile/${article.author.username}`">
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link :to="`/profile/${article.author.username}`" class="author">
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{ article.createdAt }}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click="handleFavorite(article)"
                  :disabled="article.favoriteDisable">
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link class="preview-link" :to="`/article/${article.slug}`">
                <h1> {{ article.title }}</h1>
                <p> {{ article.description }}</p>
                <span>Read more...</span>
                <ul v-if="article.tagList.length" class="tag-list">
                  <li v-for="(tag,index) in article.tagList" :key="index" 
                    class="tag-default tag-pill tag-outline">{{ tag }}</li>
                  <!-- <li class="tag-default tag-pill tag-outline">Song</li> -->
                </ul>
              </nuxt-link>
            </div>
          </template>
          <template v-else>
            <div>No articles are here... yet.</div>
          </template>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile, follow, unfollow } from '@/api/user'
import { articleList, favorite, cancleFavorite } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'profilePage',
  async asyncData ({ params, query }) {
    const page = (query && query.page) || 1
    const limit = 5
    const [ profileRes, articleRes ] = await Promise.all([
      getProfile (params.username),
      articleList({
        limit: limit,
        offset: (page - 1) * limit,
        // 如果是favorite的文章，修改查询条件
        [params.favorite ? 'favorited' : 'author']: params.username 
      })
    ])

    const { profile } = profileRes.data
    const { articles } = articleRes.data

    // 给每个文章对象增加一个点赞禁用，在点赞期间禁止重复点击
    articles.forEach(item => {
      item.favoriteDisable = false
    })

    return {
      profile,
      articles
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      followDisable: false
    }
  },
  methods: {
    async handleFavorite (article) {
      article.favoriteDisable = true
      if (article.favorited) {
        await cancleFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await favorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      // 取消按钮禁用
      article.favoriteDisable = false
      
    },
    // 如果是自己的个人中心，就跳转settings页面
    // 如果是他人的，就进行follow和unfollow操作
    handleProfile () {
      if (this.user && this.user.username === this.profile.username) {
        this.$router.push('/settings')
      } else {
        this.handleFollow()
      }
    },
    async handleFollow () {
      this.followDisable = true
      if (this.profile.following) {
        await unfollow(this.profile.username)
        this.profile.following = false
      } else {
        await follow(this.profile.username)
        this.profile.following = true
      }
      this.followDisable = false
    }
  }
}
</script>

<style>

</style>