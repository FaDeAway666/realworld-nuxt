<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form v-if="editorForm">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="editorForm.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="editorForm.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="editorForm.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tag"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keypress="addTag"
                />
                <div class="tag-list">
                  <span class="tag-default tag-pill ng-binding ng-scope"
                    v-for="(item, index) in editorForm.tagList" :key="item">
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ item }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="submitDisable"
                @click.stop.prevent="submit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postArticle, articleDetail } from '@/api/article'
export default {
  middleware: 'authenticated',
  name: "createArticle",
  data () {
    return {
      submitDisable: false,
      editorForm: null,
      tag: ''
    }
  },
  async created () {
    const { slug, article} = this.$route.params
    if (slug) {
      // const { data } = await articleDetail(slug)
      this.editorForm = article
    } else
      this.editorForm = {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
  },
  methods: {
    async submit () {
      this.submitDisable = true
      const { data } = await postArticle({
        article: this.editorForm
      })
      this.$router.push(`/article/${data.article.slug}`)
    },
    // 每次回车，添加一个tag
    addTag (e) {
      if (e.keyCode === 13) {
        this.editorForm.tagList.push(this.tag)
        this.tag = ''
      }
    },
    removeTag (index) {
      this.editorForm.tagList.splice(index, 1)
    }
  }
};
</script>

<style>
</style>