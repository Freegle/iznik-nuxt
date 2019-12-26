<template>
  <div>
    <NewsUserIntro
      v-if="userid"
      :userid="userid"
      :users="users"
      :newsfeed="newsfeed"
      append="put up a poster"
      :append-bold="info.title"
    />
    <p>To help Freegle, <b>{{ users[userid].displayname }}</b> printed a Freegle poster and put it up where people can see it.</p>
    <notice-message v-if="info.description || info.name" class="prewrap">
      <b v-if="info.name">"{{ info.name.trim() }}"</b>
      <br v-if="info.name && info.description">
      <em v-if="info.description">"{{ info.description.trim() }}"</em>
    </notice-message>
    <p class="mt-1">
      <b>We need your help to get more people freegling</b>.  Could you put one up too?
    </p>
    <iframe
      width="100%"
      height="200"
      frameborder="0"
      style="border:0"
      :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4&q=' + info.lat + ',' + info.lng"
      allowfullscreen
    />
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <nuxt-link to="/spread">
          <b-btn
            variant="primary"
            size="sm"
            class="float-right d-inline-block"
            @click="share"
          >
            <v-icon name="bullhorn" /> Put up a poster
          </b-btn>
        </nuxt-link>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import 'vue-awesome/icons/bullhorn'
import twem from '~/assets/js/twem'
import NewsBase from '~/components/NewsBase'
const NewsUserIntro = () => import('~/components/NewsUserIntro')
const NewsLoveComment = () => import('~/components/NewsLoveComment')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NewsUserIntro,
    NewsLoveComment,
    NoticeMessage
  },
  extends: NewsBase,
  computed: {
    info() {
      let info = {}
      try {
        info = JSON.parse(this.newsfeed.message)

        if (info.description) {
          const desc = twem.twem(this.$twemoji, info.description)
          info.description = desc
        }
      } catch (e) {
        console.log('Invalid noticeboard', this.newsfeed)
      }

      return info
    }
  }
}
</script>
