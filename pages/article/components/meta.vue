<template>
  <div class="article-meta">
    <nuxt-link :to="`/profile/${article.author.username}`">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="`/profile/${article.author.username}`">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt }}</span>
    </div>
    <template v-if="user.username !== article.author.username">
      <button class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        @click="follow(article.author)"
        :disabled="followDisable">
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }} 
        <!-- <span class="counter">(2)</span> -->
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        @click="favorite(article)"
        :disabled="favoriteDisable">
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <button class="btn btn-outline-secondary btn-sm"
        @click="editArticle(article.slug)"
        :disabled="buttonDisable">
        <i class="ion-edit"></i> Edit Article
      </button>
      <button class="btn btn-outline-danger btn-sm"
        @click="handleDelete(article.slug)"
        :disabled="buttonDisable">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { favorite, cancleFavorite, deleteArticle, articleDetail } from '@/api/article'
import { follow, unfollow } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'articleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      followDisable: false,
      favoriteDisable: false,
      buttonDisable: false
    }
  },
  methods: {
    async follow (author) {
      this.followDisable = true
      if (author.following) {
        await unfollow(author.username)
        this.article.author.following = false
      } else {
        await follow(author.username)
        this.article.author.following = true
      }
      this.followDisable = false
    },
    async favorite (article) {
      this.favoriteDisable = true
      if (article.favorited) {
        await cancleFavorite(article.slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
      } else {
        await favorite(article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
      this.favoriteDisable = false
    },
    // 删除文章
    async handleDelete (slug) {
      this.buttonDisable = true
      await deleteArticle(slug)
      this.$router.push('/')
    },
    // 编辑文章，获得文章详情后再跳转至编辑页
    async editArticle (slug) {
      this.buttonDisable = true
      const { data } = await articleDetail(slug)
      this.$router.push({
        name: 'create',
        params: {
          slug: slug,
          article: data.article
        }
      })
    }
  }
}
</script>

<style>

</style>