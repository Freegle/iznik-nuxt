<template>
  <div class="bg-white">
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1>
          How can we help?
        </h1>
        <p>
          These are the most common questions we get asked - please have a look and see if this is what you need.
        </p>
        <VueFaqAccordion
          :items="myItems"
          class="mt-2 mb-2 p-0"
        />
        <h1>
          Something else?
        </h1>
        <p>If your question isn't answered above, or you wish to compliment or complain, then you can <b>contact your volunteer team</b>, who will be happy to hear whether Freegle is doing a great job or needs changing.</p>
        <h5>Which Freegle community do you need help with?</h5>
        <div v-if="loggedIn">
          <GroupSelect id="contactmods" class="mt-2 mb-2" @change="groupChange" />
          <br>
          <ChatButton :groupid="contactGroupId" size="lg" title="Contact community volunteers" variant="success" class="mt-2 mb-2" />
        </div>
        <div class="text-muted">
          <hr>
          <p>
            Your local volunteers will usually be the best way for you to get help, and it helps us if you use them where
            possible.
          </p>
          <div v-if="!loggedIn" class="mb-1">
            <b-alert variant="info" show>
              Please sign in using the menu option at the top to contact your community volunteers.
            </b-alert>
          </div>
          <p>But you can also contact:</p>
          <ul>
            <li>
              Our support volunteers at <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>. They
              deal with questions about this site, or problems with freegling where your local community volunteers can't help.
            </li>
            <li>
              Our national mailbox volunteers at <a href="mailto:info@ilovefreegle.org">info@ilovefreegle.org</a>. They
              deal with more general questions about Freegle which aren't specific to one community, or if you have issues you can't resolve
              with your local team.   Please be aware that we have very limited powers.  Local groups are autonomous, but we can help
              negotiate, explain and make suggestions where appropriate.
            </li>
            <li>
              Our media volunteers at <a href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</a>. Please use this if
              you are a member of the media and want to help publicise Freegle.  For urgent press enquiries only, call +44 (0)7962 449573.
            </li>
          </ul>
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>

<style scoped lang="scss">
/* The faq-wrapper class is used within the third party vue-faq-accordion component */
::v-deep .faq-wrapper {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
</style>

<script>
// TODO DESIGN Make this a bit prettier.
const VueFaqAccordion = () => import('vue-faq-accordion')
const GroupSelect = () => import('~/components/GroupSelect.vue')
const ChatButton = () => import('~/components/ChatButton.vue')

// TODO It's not ideal that the links below are a rather than nuxt-link, because that causes a page load.
// TODO Would be nice to be able to do a direct URL link into each of these.

export default {
  components: {
    GroupSelect,
    VueFaqAccordion,
    ChatButton
  },
  data() {
    return {
      contactGroupId: null,
      myItems: [
        {
          title: 'How do I post a WANTED?',
          value:
            '            <p>If you\'re looking for something, use the <a href="/find">Find</a> feature.</p>\n' +
            '            <p>\n' +
            "              This will let you search what's currently on offer - and if you what you're looking for isn't\n" +
            "              there, you'll see a button to post a WANTED to ask people for it.\n" +
            '            </p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: "I'm getting too many emails",
          value:
            '            <p>\n' +
            '              If you go to the <a href="/settings">Settings Page</a> then you can change how many mails you get in\n' +
            '              your <em>Mail Settings</em>.\n' +
            '            </p>\n' +
            '\n' +
            '            <p>If you want to pause mails for a while, you can do that there too.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'My OFFER has been TAKEN - what do I do?',
          value:
            '            <p>\n' +
            "              If someone has collected your OFFER, then make sure you're logged in (click on <em>Sign in</em> on\n" +
            '              the top left if you need to), then go to <a href="/myposts">My Posts</a>, find your post, click to\n' +
            '              expand it, and click this:\n' +
            '            </p>\n' +
            '            <button class="btn btn-success inline mb-1">\n' +
            '              Mark as TAKEN\n' +
            '            </button>\n' +
            '            <p>\n' +
            '              Similarly, if you have received your WANTED, go to <a href="/myposts">My Posts</a>, find your post,\n' +
            '              and click this:\n' +
            '            </p>\n' +
            '            <button class="btn btn-success inline mb-1">\n' +
            '              Mark as RECEIVED\n' +
            '            </button>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'How can I repost something?',
          value:
            '            <p>If you\'ve not had any replies, this happens automatically now.  Have a look on the <a href="/">Home Page</a>, and click on the post.  You can see the time until the auto-repost is due on there, like this:</p>\n' +
            '            <p>\n' +
            '              <span class="success"> Auto-repost due in 2 days</span></span>\n' +
            '            </p>\n' +
            '            <p>If you have had replies, you need to use the <em>Repost</em> button in the same place.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'How do I change my email address?',
          value:
            '            <p>You can do this from your <a href="/settings">Settings</a>, in the <em>Personal Information</em> section.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'How do I leave/unsubscribe?',
          value:
            '            <p>If you\'d like to leave Freegle, then go <a href="/unsubscribe">here</a>.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'Where are your terms of use etc?',
          value:
            '            <p>Click to read our <a href="/terms">terms of use</a>, <a href="/privacy">privacy statement</a>, and <a href="/disclaimer">disclaimer</a>.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'What data do you store about me?',
          value:
            '            <p>You can see what data we store about you, and download it, <a href="/mydata">here</a>.</p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },
        {
          title: 'How you can help!',
          value:
            '            <p>Freegle is run by volunteers - so if you can help, please get in touch!</p>\n' +
            '            <p>If you\'d like to spread the word you can download a poster or ask for "business cards" to hand out:</p>\n' +
            '            <p /><div class="btn btn-success js-cards">\n' +
            '              Find out more\n' +
            '            </div>\n' +
            '            </p>\n' +
            '            <p>If you would like to help run one of the local communities, which is a good place to start, please use the <em>Contact</em> button below.</p>\n' +
            '            <p>You can also volunteer nationally.  We really need people in these areas:</p>\n' +
            '            <ul>\n' +
            "              <li>Publicity: if you can help locally or nationally, especially with councils, we'd love to hear from you.</li>\n" +
            '              <li>Fundraising: we run on volunteers and donations, and just about get by, but we could do so much more with more.</li>\n' +
            '              <li>Graphics: we need people who can produce striking images, posters, etc.</li>\n' +
            '              <li>User Experience (UX): if you work in this area we could use your help.</li>\n' +
            '              <li>IT geeks who know some of these: VueJS/Bootstrap 4/CSS/PHP/Percona/nginx - find us on <a target="_blank" href="https://github.com/Freegle">GitHub</a>.</li>\n' +
            '            </ul>\n' +
            '            <p>\n' +
            '              You can reach us at <a href="mailto:volunteers@ilovefreegle.org">volunteers@ilovefreegle.org</a>.\n' +
            '            </p><p>Or if you\'d like to donate to our charity, you can do that <a href="/donate">here</a> or here:</p>\n' +
            '            <p>\n' +
            '              <a target="_blank" rel="noopener" href="https://freegle.in/paypalbutton">\n' +
            '                <span class="btn btn-primary btn-lg">\n' +
            '                  <img alt="PayPal" class="img-thumbnail" src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg">\n' +
            '                  &nbsp;Donate\n' +
            '                </span>\n' +
            '              </a>\n' +
            '            </p>\n',
          category: '<h4>Frequently Asked Questions</h4>'
        },

        {
          title: 'Go on, convince me!',
          value:
            "<h3>Because it saves money, time and the planet - and it's free.</h3>\n" +
            '<p>What, you need more reasons?  Ok!</p>\n' +
            '<ul>\n' +
            '    <li>\n' +
            "        It's easy and convenient when giving - someone will come and take your stuff away, and you don't have to\n" +
            '        pay the council.\n' +
            '    </li>\n' +
            '    <li>\n' +
            "        You're helping out someone nearby - either giving them something they need, or giving them the gift of\n" +
            '        free space.\n' +
            '    </li>\n' +
            '    <li>\n' +
            "        It's good for the environment - it saves resources, and sometimes people will upcycle things to give them a whole\n" +
            "        new life.  And it might reduce your council's costs a bit.\n" +
            '    </li>\n' +
            '    <li>\n' +
            "        It's fun!  You meet lovely people, and each time you freegle you make the world just that little bit better.\n" +
            '    </li>\n' +
            '</ul>\n' +
            '<p>Don\'t just take our word for it - read other freeglers\' <a href="/stories">stories</a>...</p>',
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'Surely nobody would want this?',
          value:
            '<p>You might not want something - but someone else might.  How would you find out?  Offer it up on Freegle!</p>',
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'Surely nobody would give away this?',
          value:
            "<p>Same thing - maybe you wouldn't gve it away, but someone else might.  Have a look.</p>",
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'What about Freecycle?',
          value:
            "<p>Freegle originally grew out of Freecycle, but we've developed in different ways.  So what are the differences?</p>\n" +
            '<ul>\n' +
            '    <li>\n' +
            "        Our site is much easier to use.  We would say that...but it's true.\n" +
            '    </li>\n' +
            '    <li>\n' +
            '        We have a nice mobile app.  Get it on <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct">\n' +
            '        Google Play\n' +
            '        </a> or\n' +
            '        <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&amp;mt=8">iTunes</a>.\n' +
            '    </li>\n' +
            '    <li>\n' +
            '        We have lots of lovely, local, friendly volunteers to help you out.\n' +
            '    </li>\n' +
            '    <li>\n' +
            "        We're based in the UK and run by volunteers, whereas Freecycle is based in the US.\n" +
            '    </li>\n' +
            '</ul>\n',
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'What about Gumtree?',
          value:
            '<p>\n' +
            "    Gumtree does have a freebies section, but it's mostly about selling.  We're not in it to make a profit\n" +
            "    (we're a charity) so we're all about helping people to give and get things for free.\n" +
            '</p>\n',
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'Why not eBay it?',
          value:
            "<p>You could - and if you need the money, go for it.  But it's quite a hassle to do that, and then " +
            "you have to post it off.  Plus people are quite picky about what they're paying for.</p>",
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'What about Trash Nothing?',
          value:
            '<p>Most Freegle communities are on trash nothing - so you can use them from there if you like.</p>',
          category: '<h4>Why Freegle?</h4>'
        },
        {
          title: 'What about charity shops?',
          value:
            "<p>Charity shops are great - they help charities raise funds they need.  But you don't always know what will\n" +
            "    sell and what won't, and there are some things they won't take.</p>",
          category: '<h4>Why Freegle?</h4>'
        }
      ]
    }
  },
  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user']())
      return ret
    }
  },
  methods: {
    groupChange(groupid) {
      this.contactGroupId = groupid
    }
  }
}
</script>
