<template>
  <div class="d-flex justify-content-center">
    <div class="privacy__container px-3 bg-white">
      <h1 class="text-center">
        Privacy
      </h1>
      <p>
        We won’t pass on your email address to anyone else, and other freeglers can't see it.
      </p>
      <p>
        Other freeglers can see your name, profile picture and approximate location.  If you don't want that, you can change it in <nuxt-link to="/settings">
          Settings.
        </nuxt-link>
      </p>
      <p>
        We try to protect you from spammers and fraudsters.  Sometimes our volunteers may read what you write to check
        that it's not spam, phishing or fraud.  If we happen to find something which is against Freegle rules,
        we may take further action.
      </p>
      <p>
        If you put phone numbers, email addresses or postal addresses into your posts on Freegle, other people will
        be able to see them.  If you're concerned about this, don't do it!
      </p>
      <p>
        So that potential new users can see what is being offered on Freegle, we make some details of posts public,
        i.e. the item name, approximate location, the description and any photos. No personal details are made public
        unless in this information.
      </p>
      <h2>Cookies and Tracking</h2>
      <p>
        You'll have seen lots of irritating popups on websites about consent for cookies.  We don't have one of those
        because we don't store any data for logged out visitors which would require that consent.
      </p>
      <p>Here are some technical details on what happens when you're logged out.</p>
      <ul>
        <li>
          We store a session cookie.  That's strictly necessary for the site to function, and does not require
          consent.
        </li>
        <li>
          We store some information in your browser's local storage, because of the way the site works.  There's not
          much in it except if you're trying to reply to a post.  That's like the "shopping cart" example
          in the Information Commissioner's
          <a href="https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/" target="_blank" rel="noopener">advice</a>
          and does not require consent.
        </li>
        <li>
          We use <a href="https://analytics.google.com">Google Analytics</a> to collect traffic statistics.  This is
          configured in a way that means it <a href="https://law.stackexchange.com/questions/28367/gdpr-whats-classed-as-an-opt-in-for-google-analytics-cookie-and-do-i-need-to">does not require consent</a>.
          We have a data processing agreement with Google, we have enabled IP anonymization/masking, disabled
          data sharing, and are not using any other google services in combination with Google Analytics.
        </li>
        <li>
          We use Google and Facebook's code to allow you to log in.  They store a few third-party cookies, of their
          own, but before you've logged in they don't know who you are.  If you are concerned about these, you can
          install a privacy blocker such as <a href="https://www.ghostery.com/">Ghostery</a> and still use the site.
        </li>
      </ul>
      <p>Once you log in, you're giving us consent to do the following.</p>
      <ul>
        <li>
          We store more information in your local storage.  Part of this is so that you don't need to log in as often,
          and the rest is to speed up the site (it's a cache).
        </li>
        <li>
          We show jobs ads from <a href="http://adview.online/">AdView</a>, both on the site and in emails.
          We'd prefer not to,
          but we don't raise enough from <nuxt-link to="/donate">
            donations
          </nuxt-link> alone to keep going.
          We pass them your IP address, but not your personal information.
        </li>
      </ul>
      <h2>Sentry</h2>
      <p>
        When something goes wrong on the website, we log it to a third party site call
        <a href="https://sentry.io">Sentry</a>.  They help organise the logs and make it easier for us to identify
        and fix problems.  This <a href="https://docs.sentry.io/data-management/sensitive-data/">should not include</a>
        any of your personal data.
        You can read their privacy policy <a href="https://sentry.io/privacy/">here</a>.
      </p>
      <h2>Inspectlet</h2>
      <p>
        On a small fraction of sessions, we use <a href="https://www.inspectlet.com/" target="_blank">Inspectlet</a>.
        This helps us work out which bits of the website are working well for freeglers, and which aren't.
        You can read their privacy policy <a href="https://docs.inspectlet.com/hc/en-us/articles/360002994432-Privacy-Impact-Assessment-under-GDPR">here</a>,
        and opt out of this <a href="https://www.inspectlet.com/optout" target="_blank">here</a>.
      </p>
      <h2>Got questions?</h2>
      <p>
        Privacy is a complicated and important area, which we take seriously.  If you have questions or concerns,
        please <nuxt-link to="/help">
          contact us.
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [buildHead],
  head() {
    return this.buildHead('Privacy', 'What data we keep and how we protect it')
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.privacy__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
