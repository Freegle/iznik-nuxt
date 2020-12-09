<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            An overview of Freegle
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Here is some suggested wording for giving an overview of Freegle.  You can use all of part of it on your
            websites, publicity and when speaking directly with residents.
          </p>

          <NoticeMessage variant="info">
            <p><b>Freegle is the UK's biggest and friendliest free online reuse network with over 2.7 million members.</b></p>

            <p>Anyone in the country can get access to a local Freegle community.  It's free to join, free to use, and everything on it is free.</p>

            <p>
              Do your unwanted but useful items need new homes? Are you looking for something?
              Freegle helps people give and get things for free in their local community. Some people have stuff they don't want any more. Other people would like things they don't have. Freegle matches them up.
              It's simple to use:
            </p>

            <ul class="mt-1 mb-1">
              <li>Post a message offering an item.</li>
              <li>Other people see it and reply to you.</li>
              <li>Choose who to give it to and they collect.</li>
              <li>You've decluttered, made someone's day and saved an item from going to waste.</li>
            </ul>

            <p>That's freegling! And it's all free.</p>

            <p>You can also search or browse the items offered, or post a request for something that other people might have.</p>

            <p><b>Don't throw it away, give it away!</b></p>
          </NoticeMessage>
          <p>
            If you're interested in how Freegle is structured and why we do it, find out more <nuxt-link to="/about">
              here
            </nuxt-link>.
          </p>
          <p>
            We send out newsletters to councils - you can see the archive and sign up
            <a href="https://us20.campaign-archive.com/home/?u=dd0a44d9aa3f6ba0e4d439318&id=8edc47538e" target="_blank">here</a>.
          </p>
        </b-card-text>
      </b-card>
    </b-col>
    <b-col>
      <CouncilsContent />
    </b-col>
  </b-row>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '../../components/NoticeMessage'
import CouncilsContent from '../../components/CouncilsContent'

export default {
  components: { NoticeMessage, CouncilsContent },
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'Councils - An overview of Freegle',
      'Here is some suggested wording for giving an overview of Freegle. You can use all of part of it on your websites, publicity and when speaking directly with residents.'
    )
  }
}
</script>
