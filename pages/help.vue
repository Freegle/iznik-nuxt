<template>
  <div class="bg-white">
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1 class="d-flex flex-wrap justify-content-between">
          <span>
            How can we help?
          </span>
          <div>
            <b-btn variant="primary" to="/donate">
              Donate
            </b-btn>
          </div>
        </h1>
        <p v-if="isApp">
          If you like this app - or not - <a href='#' class="d-inline" @click="showRateMe">please leave a review</a>.<br />
          Mobile app version: {{ mobileVersion }}.
        </p>
        <p>
        <b-card no-body>
          <b-tabs content-class="mt-3" card>
            <b-tab active>
              <template v-slot:title>
                <h4 class="ml-2 mr-2">
                  Frequently Asked Questions
                </h4>
              </template>
              <p>
                These are the most common questions we get asked - please have a look and see if this is what you need.
                If not, you can contact us lower down this page.
              </p>
              <p>Click on a question to expand the answer.</p>

              <Question id="COVID-19">
                <template slot="title">
                  <b>COVID-19</b>
                </template>
                <template slot="content">
                  <p>
                    The Government has
                    advised local authorities that Household Waste Recycling Centres (HWRCs) can be open, but says
                    you should consider using on-line reuse platforms such as ours first.  You can read their advice
                    <!-- eslint-disable-next-line -->
                    <ExternalLink href="https://www.gov.uk/government/publications/coronavirus-covid-19-advice-to-local-authorities-on-prioritising-waste-collections/managing-household-waste-and-recycling-centres-hwrcs-in-england-during-the-coronavirus-covid-19-pandemic">here</ExternalLink>.
                  </p>
                </template>
              </Question>
              <Question id="wanted">
                <template slot="title">
                  <b>How do I post a WANTED?</b>
                </template>
                <template slot="content">
                  <p>
                    If you're looking for something, use the <nuxt-link to="/find">
                      Ask
                    </nuxt-link> feature.
                  </p>
                  <p>
                    This will let you search what's currently on offer - and if you what you're looking for isn't
                    there, you'll see a button to post a WANTED to ask people for it.
                  </p>
                </template>
              </Question>
              <Question id="toomany">
                <template slot="title">
                  <b>I'm getting too many emails</b>
                </template>
                <template slot="content">
                  <p>
                    If you go to the <nuxt-link to="/settings">
                      Settings Page
                    </nuxt-link> then you can change how many mails
                    you get in your <em>Mail Settings</em>.
                  </p>
                  <p>
                    If you want to pause mails for a while, you can do that there too.
                  </p>
                </template>
              </Question>
              <Question id="offertaken">
                <template slot="title">
                  <b>My OFFER has been TAKEN - what do I do?</b>
                </template>
                <template slot="content">
                  <p>
                    If someone has collected your OFFER, then make sure you're logged in (click on <em>Sign in</em> on
                    the top left if you need to), then go to <nuxt-link to="/myposts">
                      My Posts
                    </nuxt-link>, find your post,
                    and click this:
                  </p>

                  <b-btn variant="primary">
                    Mark as TAKEN
                  </b-btn>

                  <p>
                    Similarly, if you have received your WANTED, go to <nuxt-link to="/myposts">
                      My Posts
                    </nuxt-link>, find your post,
                    and click this:
                  </p>

                  <b-btn variant="primary">
                    Mark as RECEIVED
                  </b-btn>

                  <p>
                    If you have multiple posts showing, you may need to click the post to expand it before the buttons appear.
                  </p>
                </template>
              </Question>
              <Question id="repost">
                <template slot="title">
                  <b>How can I repost something?</b>
                </template>
                <template slot="content">
                  <p>
                    If you've not had any replies, this happens automatically now.  Have a look on the
                    <nuxt-link to="/">
                      Home Page
                    </nuxt-link>, and click on the post.  You can see the time until the
                    auto-repost is due on there, like this:
                  </p>
                  <p>
                    <span class="success"> Auto-repost due in 2 days</span>
                  </p>
                  <p>
                    If you have had replies, you need to use the <em>Repost</em> button in the same place.
                  </p>
                </template>
              </Question>
              <Question id="changeemail">
                <template slot="title">
                  <b>How do I change my email address?</b>
                </template>
                <template slot="content">
                  <p>
                    You can do this from your <nuxt-link to="/settings">
                      Settings
                    </nuxt-link>, in the
                    <em>Personal Information</em> section.
                  </p>
                </template>
              </Question>
              <Question id="unsubscribe">
                <template slot="title">
                  <b>How do I leave/unsubscribe?</b>
                </template>
                <template slot="content">
                  <p>
                    If you'd like to leave Freegle, then go <nuxt-link to="/unsubscribe">
                      here
                    </nuxt-link>.
                  </p>
                </template>
              </Question>
              <Question id="termsetc">
                <template slot="title">
                  <b>Where are your terms of use etc?</b>
                </template>
                <template slot="content">
                  <p>
                    Click to read our <nuxt-link to="/terms">
                      terms of use
                    </nuxt-link>,
                    <nuxt-link to="/privacy">
                      privacy statement
                    </nuxt-link>, and
                    <nuxt-link to="/disclaimer">
                      disclaimer
                    </nuxt-link>.
                  </p>
                </template>
              </Question>
              <Question id="whatdata">
                <template slot="title">
                  <b>What data do you store about me?</b>
                </template>
                <template slot="content">
                  <p>
                    You can see what data we store about you, and download it, <nuxt-link to="/mydata">
                      here
                    </nuxt-link>.
                  </p>
                </template>
              </Question>
              <Question id="youcanhelp">
                <template slot="title">
                  <b>How you can help!</b>
                </template>
                <template slot="content">
                  <p>
                    Freegle is run by volunteers - so if you can help, please get in touch!
                  </p>
                  <p>
                    If you'd like to spread the word you can download a poster or ask for "business cards" to hand out:
                  </p>
                  <b-btn to="/promote" variant="primary">
                    Find out more
                  </b-btn>
                  <p>
                    If you would like to help run one of the local communities, which is a good place to start, please use
                    the <em>Contact</em> button below.
                  </p>
                  <p>
                    You can also volunteer nationally.  We really need people in these areas:
                  </p>
                  <ul>
                    <li>
                      Publicity: if you can help locally or nationally, especially with councils, we'd love to hear from you.
                    </li>
                    <li>
                      Fundraising: we run on volunteers and donations, and just about get by, but we could do so much more with more.
                    </li>
                    <li>
                      Graphics: we need people who can produce striking images, posters, etc.
                    </li>
                    <li>
                      User Experience (UX): if you work in this area we could use your help.
                    </li>
                    <li>
                      IT geeks who know some of these: VueJS/Bootstrap 4/CSS/PHP/Percona/nginx - find us on
                      <a target="_blank" href="https://github.com/Freegle">GitHub</a>.
                    </li>
                  </ul>
                  <p>
                    <!-- eslint-disable-next-line -->
                    You can reach us at <ExternalLink href="mailto:volunteers@ilovefreegle.org">volunteers@ilovefreegle.org</ExternalLink>.
                  </p>
                  <p>
                    Or if you'd like to donate to our charity, you can do that <nuxt-link to="/donate">
                      here
                    </nuxt-link> or
                    here:
                  </p>
                  <p>
                    <donation-button :direct-donation="true" />
                  </p>
                </template>
              </Question>
              <Question v-if="!isApp" id="mobile">
                <template slot="title">
                  <b>Do you have a mobile app?</b>
                </template>
                <template slot="content">
                  <p>
                    We do! Freegling is easy on mobiles and tablets, and you get notifications of replies so you don't have to rely on email. Download using these links or search for Freegle in your app store - it's free!
                  </p>
                  <div class="d-flex justify-content-between">
                    <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct" class="mt-2" target="_blank">
                      <img alt="Freegle Android app on Google Play" title="Freegle Android app on Google Play" class="img-responsive" src="/en-play-badge.png">
                    </a>
                    <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&amp;mt=8" class="mt-2" target="_blank">
                      <img alt="Freegle app for iPhone, iPad, and iPod touch" title="Freegle app for iPhone, iPad, and iPod touch" class="img-responsive" src="/app-store-black-sm.png">
                    </a>
                  </div>
                  <p class="mt-2">
                    The app is only available in the UK app stores. We support Android 4.4/iOS 10 or later.
                  </p>
                </template>
              </Question>
            </b-tab>

            <b-tab>
              <template v-slot:title>
                <h4 class="ml-2 mr-2">
                  Why Freegle?
                </h4>
              </template>

              <p>
                Here's why we think you should freegle!  You can also read about how our charity is structured, why we
                do what we do, and so on at <nuxt-link to="/about">
                  About Us
                </nuxt-link>.
              </p>
              <p>
                Click on a question to expand the answer.
              </p>

              <Question id="convince">
                <template slot="title">
                  <b>Go on, convince me!</b>
                </template>
                <template slot="content">
                  <h5>Because it saves money, time and the planet - and it's free.</h5>
                  <p>What, you need more reasons? Ok!</p>
                  <ul>
                    <li>
                      It's easy and convenient when giving - someone will come and take your stuff away, and you don't
                      have to pay the council.
                    </li>
                    <li>
                      You're helping out someone nearby - either giving them something they need, or giving them the gift
                      of free space.
                    </li>
                    <li>
                      It's good for the environment - it saves resources, and sometimes people will upcycle things to
                      give them a whole new life. And it might reduce your council's costs a bit.
                    </li>
                    <li>
                      It's fun! You meet lovely people, and each time you freegle you make the world just that little bit
                      better.
                    </li>
                  </ul>
                  <p>
                    Don't just take our word for it - read other freeglers' <nuxt-link to="/stories">
                      stories
                    </nuxt-link>...
                  </p>
                </template>
              </Question>
              <Question id="surely">
                <template slot="title">
                  <b>Surely nobody would want this?</b>
                </template>
                <template slot="content">
                  <p>
                    You might not want something - but someone else might.  How would you find out?  Offer it up on Freegle!
                  </p>
                  <p>
                    If someone wants it, great!  If nobody does, do whatever you were going to do with it otherwise.
                  </p>
                  <p>
                    Give it a try - all you have to lose is your unwanted stuff!
                  </p>
                </template>
              </Question>
              <Question id="freecycle">
                <template slot="title">
                  <b>What about Freecycle?</b>
                </template>
                <template slot="content">
                  <p>
                    Freegle originally grew out of Freecycle a decade ago, but we've developed in different ways.
                    So what are the differences?
                  </p>
                  <ul>
                    <li>
                      Our site is much easier to use.  We would say that...but it's true.
                    </li>
                    <li>
                      We have a nice mobile app.  Get it on
                      <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct">Google Play</a> or
                      <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&amp;mt=8">iTunes</a>.
                    </li>
                    <li>
                      We have lots of lovely, local, friendly volunteers to help you out.
                    </li>
                    <li>
                      We're based in the UK and run by volunteers, whereas Freecycle is based in the US and centrally
                      run.
                    </li>
                    <p>
                      Plenty of people use both, so whatever works for you.  And make sure you tell other people about
                      us - so many people have never heard of the idea at all, and throw away usable stuff.
                    </p>
                  </ul>
                </template>
              </Question>
              <Question id="gumtree">
                <template slot="title">
                  <b>What about Gumtree?</b>
                </template>
                <template slot="content">
                  <p>
                    Gumtree does have a freebies section, but it's mostly about selling.  We're not in it to make a profit
                    (we're a charity) so we're all about helping people to give and get things for free.
                  </p>
                </template>
              </Question>
              <Question id="ebay">
                <template slot="title">
                  <b>Why not eBay it?</b>
                </template>
                <template slot="content">
                  <p>
                    You could - and if you need the money, go for it.  But it's quite a hassle to do that, and then
                    you have to post it off.  Plus people are quite picky about what they're paying for.
                  </p>
                  <p>
                    You can also help us when you sell on <b>eBay</b>.  Make sure you're signed in to eBay, then click
                    below and <em>Save as favourite</em>.
                  </p>
                  <a href="http://www.ebay.co.uk/egw/ebay-for-charity/charity-profile/Freegle/74430" target="_blank" rel="noopener">
                    <b-img fluid class="img-rounded img-responsive" src="/ebayvote.PNG" />
                  </a>
                </template>
              </Question>
              <Question id="trashnothing">
                <template slot="title">
                  <b>What about Trash Nothing?</b>
                </template>
                <template slot="content">
                  <p>
                    Most Freegle communities are on trash nothing, and we're friends with them - so you can use
                    Freegle communities from there if you like.
                  </p>
                </template>
              </Question>
              <Question id="charityshops">
                <template slot="title">
                  <b>What about charity shops?</b>
                </template>
                <template slot="content">
                  <p>
                    Charity shops are great - they help charities raise funds they need.  But you don't always
                    know what will sell and what won't, and there are some things they won't take.  And you might
                    not have any near you.
                  </p>
                  <p>
                    But plenty of folk use both - as long as you don't throw it away if someone else could use it.
                  </p>
                </template>
              </Question>
            </b-tab>
          </b-tabs>
        </b-card>

        <h1>
          Something else?
        </h1>
        <p>If your question isn't answered above, or you wish to compliment or complain, then you can <b>contact your volunteer team</b>, who will be happy to hear whether Freegle is doing a great job or needs changing.</p>
        <h5>Which Freegle community do you need help with?</h5>
        <b-card v-if="loggedIn" no-body>
          <b-card-body class="p-3">
            <GroupRememberSelect v-model="contactGroupId" remember="contactmods" class="mb-3" />
            <ChatButton :groupid="contactGroupId" size="md" title="Contact community volunteers" variant="primary" class="mb-2" />
          </b-card-body>
        </b-card>
        <div class="text-muted">
          <hr>
          <p>
            Your local volunteers will usually be the best way for you to get help, and it helps us if you use them where
            possible.
          </p>
          <div v-if="!loggedIn" class="mb-1">
            <notice-message>
              Please sign in using the menu option at the top to contact your community volunteers.
            </notice-message>
          </div>
          <p>But you can also contact:</p>
          <ul>
            <li>
              <!-- eslint-disable-next-line -->
              Our support volunteers at <ExternalLink href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</ExternalLink>. They
              deal with questions about this site, or problems with freegling where your local community volunteers can't help.
            </li>
            <li>
              <!-- eslint-disable-next-line -->
              Our national mailbox volunteers at <ExternalLink href="mailto:info@ilovefreegle.org">info@ilovefreegle.org</ExternalLink>. They
              deal with more general questions about Freegle which aren't specific to one community, or if you have issues you can't resolve
              with your local team.   Please be aware that we have very limited powers.  Local groups are autonomous, but we can help
              negotiate, explain and make suggestions where appropriate.
            </li>
            <li>
              <!-- eslint-disable-next-line -->
              Our media volunteers at <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink>. Please use this if
              you are a member of the media and want to help publicise Freegle.  For urgent press enquiries only, call +44 (0)7962 449573.
            </li>
          </ul>
          <p>This version of the site was built on {{ version }}.</p>
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
    <client-only>
      <RateAppModal ref="rateappmodal" />
    </client-only>
  </div>
</template>

<script>
import { TabsPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import buildHead from '@/mixins/buildHead.js'
import Question from '../components/Question'

const GroupRememberSelect = () => import('~/components/GroupRememberSelect')
const ChatButton = () => import('~/components/ChatButton.vue')
const NoticeMessage = () => import('~/components/NoticeMessage')
const DonationButton = () => import('~/components/DonationButton')
const ExternalLink = () => import('~/components/ExternalLink')

Vue.use(TabsPlugin)
const RateAppModal = () => import('~/components/RateAppModal') // CC

export default {
  components: {
    Question,
    GroupRememberSelect,
    ChatButton,
    NoticeMessage,
    RateAppModal,
    DonationButton,
    ExternalLink
  },
  mixins: [buildHead],
  data() {
    return {
      contactGroupId: null
    }
  },
  methods: { // CC
    showRateMe() {
      window.localStorage.removeItem('rateappnotagain')
      this.$refs.rateappmodal.show()
    }
  },
  computed: {
    isApp() {
      return process.env.IS_APP
    },
    mobileVersion() {
      return process.env.MOBILE_VERSION
    },
    version() {
      const date = new this.$dayjs(process.env.BUILD_DATE)

      return date.format('Do MMMM, YYYY') + ' at ' + date.format('HH:mm')
    }
  },
  head() {
    return this.buildHead(
      'Help',
      'Questions?  Problems?  Our lovely volunteers will be happy to help.'
    )
  }
}
</script>
