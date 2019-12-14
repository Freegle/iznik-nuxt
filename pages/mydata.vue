<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" md="6" offset-md="3" class="bg-white">
        <h1>Fetching your data</h1>
        <b-alert v-if="error" variant="danger" show>
          Something went wrong.  Please try again, and if this keeps happening then contact <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>.
        </b-alert>
        <div v-else>
          <div v-if="status">
            <div v-if="status.completed">
              <p>
                You might have heard that the General Data Protection Regulation (GDPR) regulation gives you the
                "right to access" and the "right to portability" of your data. Below is
                the personal data you have provided to Freegle (except for some temporary logging
                information which we keep for upto 7 days), to make accessing this easy for all freeglers.
                You can also download all this data
                in a commonly-used machine-readable format (<a href="https://www.json.org/" target="_blank">JSON</a>).
              </p>
              <!--              TODO DESIGN MINOR Style as a button. We need to have it as a link so that we can use the download attribute.-->
              <a :href="downloadlink" download="mydata.json">
                Download in machine-readable format
              </a>
              <p class="mt-2">
                There may be a lot of information here, so if you have any questions, please
                <nuxt-link to="/help">
                  contact us
                </nuxt-link>.
              </p>
              <p>
                Freegle volunteers may also have some personal data, predominately in the form of email
                correspondence about Freegle matters. If you want access to this please request this
                formally via the <a href="mailto:DPO@ilovefreegle.org">Data Protection Officer (DPO)</a>
                who will organise the return of this additional information.
              </p>
              <h2>About you</h2>
              <div class="row">
                <div class="col-sm-6">
                  Your full name:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Your_full_name }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Your first name:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Your_first_name }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Your last name:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Your_last_name }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Our internal ID for you:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Our_internal_ID_for_you }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Your Yahoo ID:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Your_Yahoo_ID }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Yahoo's internal ID for you:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Yahoo_internal_ID_for_you }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Your role on the system:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Your_role_on_the_system }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Permissions you have on the site:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Permissions_you_have_on_the_site }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  When you joined the site:
                </div>
                <div class="col-sm-6">
                  {{ status.data.When_you_joined_the_site | dateonly }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  When you last accessed the site:
                </div>
                <div class="col-sm-6">
                  {{ status.data.When_you_last_accessed_the_site | dateonly }}
                </div>
              </div>
              <h2>Your settings</h2>
              <div class="row">
                <div class="col-sm-6">
                  Hide profile picture:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Hide_profile_picture }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Last location you entered:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Last_location_you_entered }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Last location you posted from:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Last_location_you_posted_from }}
                </div>
              </div>
              <div v-if="mod" class="row">
                <div class="col-sm-6">
                  Show members that you are a moderator
                </div>
                <div class="col-sm-6">
                  {{ status.data.Show_members_that_you_are_a_moderator }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Whether we can publish your OFFERs/WANTEDs outside the site:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Whether_we_can_publish_your_posts_outside_the_site }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Whether we can scan your messages to protect other users:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Whether_we_can_scan_your_messages_to_protect_other_users }}
                </div>
              </div>
              <h2>Your profile pictures</h2>
              <div v-for="image in status.data.images" :key="image.thumb">
                <b-img-lazy thumbnail :src="image.thumb" />
              </div>
              <h2>Logins</h2>
              <p>These are the ways in which you have registered to use the site.</p>
              <div v-for="login in status.data.logins" :key="login.id">
                <b-row>
                  <b-col cols="4">
                    {{ login.added | dateonly }}
                  </b-col>
                  <b-col cols="4">
                    <span v-if="login.type === 'Native'">Email / password</span>
                    <span v-else-if="login.type === 'Link'">Email link / password</span>
                    <span v-else>
                      {{ login.type }}
                    </span>
                  </b-col>
                  <b-col cols="4">
                    Last used {{ login.lastaccess | dateonly }}
                  </b-col>
                </b-row>
              </div>
              <h2>Email addresses</h2>
              <div class="row">
                <div class="col-sm-6">
                  Whether your preferred email is bouncing:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Whether_your_email_is_bouncing }}
                </div>
              </div>
              <br>
              <div v-for="email in status.data.emails" :key="email.id">
                <b-row v-if="!email.ourdomain">
                  <b-col cols="4">
                    {{ email.email }}
                  </b-col>
                  <b-col cols="3">
                    added {{ email.added | dateonly }}
                  </b-col>
                  <b-col cols="3">
                    <span v-if="email.validated">
                      validated {{ email.validated | dateonly }}
                    </span>
                    <span v-else>
                      not validated
                    </span>
                  </b-col>
                  <b-col cols="2">
                    <span v-if="email.preferred">
                      (preferred email)
                    </span>
                  </b-col>
                </b-row>
              </div>
              <h2>Your addresses</h2>
              <div v-for="address in status.data.addresses" :key="address.id">
                {{ address.singleline }}
              </div>
              <h2>Notifications</h2>
              <div class="row">
                <div class="col-sm-6">
                  Send Facebook notifications:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_Facebook_notifications }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Send notifications for Android/IOS apps:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_notifications_for_apps }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Send push notifications to web browsers:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_push_notifications_to_web_browsers }}
                </div>
              </div>
              <div v-if="mod" class="row">
                <div class="col-sm-6">
                  Send email notifications of mod work:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Send_notifications_of_mod_work }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Send email notifications for chat messages:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_email_notifications_for_chat_messages }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Send email notifications of chat messages you send:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_email_notifications_of_chat_messages_you_send }}
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  Send emails about notifications on the site:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Notifications.Send_emails_about_notifications_on_the_site }}
                </div>
              </div>
              <div v-if="status.data.phone">
                <h2>Phone number</h2>
                <p>{{ status.data.phone }}</p>
              </div>
              <h2>Memberships</h2>
              <p>
                Which communities you are a member of.  You can change your settings or leave groups from
                <nuxt-link to="/settings">
                  here
                </nuxt-link>.
              </p>
              <ShowMore :items="status.data.memberships">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="4">
                      {{ s.item.namedisplay }}
                    </b-col>
                    <b-col cols="4">
                      <span v-if="s.item.mysettings.emailfrequency === -1">Immediately</span>
                      <span v-else-if="s.item.mysettings.emailfrequency === 0">Never</span>
                      <span v-else>
                        {{ s.item.mysettings.emailfrequency | pluralize('hour', { includeNumber: true }) }}
                      </span>
                    </b-col>
                    <b-col cols="4">
                      Community Event mails
                      <span v-if="s.item.mysettings.eventsallowed">On</span>
                      <span v-else>Off</span>
                      <br>
                      Volunteering mails
                      <span v-if="s.item.mysettings.volunteeringallowed">On</span>
                      <span v-else>Off</span>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Memberships History</h2>
              <p>When you joined or rejoined communities.</p>
              <ShowMore :items="status.data.membershipshistory">
                <template v-slot:item="s">
                  <b-row>
                    <b-col>
                      {{ s.item.namedisplay }}
                    </b-col>
                    <b-col>
                      joined {{ s.item.added | dateonly }}
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Searches</h2>
              <p>Here's what you've searched for:</p>
              <ShowMore :items="status.data.searches">
                <template v-slot:item="s">
                  <b-row>
                    <b-col>
                      {{ s.item.date | dateonly }}
                    </b-col>
                    <b-col>
                      Searched for <em>{{ s.item.term }}</em>
                    </b-col>
                    <b-col>
                      <span v-if="s.item.location">
                        near {{ s.item.location }}
                      </span>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Invitations</h2>
              <div class="row">
                <div class="col-sm-6">
                  Number of remaining invitations you can send to other people:
                </div>
                <div class="col-sm-6">
                  {{ status.data.Number_of_remaining_invitations_you_can_send_to_other_people }}
                </div>
              </div>
              <br>
              <ShowMore :items="status.data.invitations">
                <template v-slot:item="s" keyfield="date">
                  You invited <em>{{ s.item.email }}</em> on {{ s.item.date | dateonly }}
                </template>
              </ShowMore>
              <h2>Posts</h2>
              <ShowMore :items="status.data.messages">
                <template v-slot:item="s">
                  <ExportPost :post="s.item" />
                </template>
              </ShowMore>
              <h2>Chats</h2>
              <p>This just shows messages you have sent, not those from other people.</p>
              <ShowMore :items="status.data.chatrooms">
                <template v-slot:item="s">
                  <ExportChat :chat="s.item" />
                </template>
              </ShowMore>
              <h2>Ratings</h2>
              <p>These are other freeglers that you have given a thumbs up or down to.  Your rating is in blue.</p>
              <ShowMore :items="status.data.ratings">
                <template v-slot:item="s">
                  <Ratings :id="s.item.ratee" :show-name="true" size="sm" />
                </template>
              </ShowMore>
              <h2>ChitChat</h2>
              <p>This just shows what you have posted, or replies you've made.</p>
              <ShowMore :items="status.data.newsfeed">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <!-- eslint-disable-next-line -->
                    <b-col cols="6 prewrap">{{ s.item.message }}</b-col>
                    <b-col cols="3">
                      <b-btn variant="link" :to="'/chitchat/' + s.item.id">
                        View thread
                      </b-btn>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>ChitChat Loves</h2>
              <p>These are any ChitChat posts you've loved.</p>
              <ShowMore :items="status.data.newsfeed">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <b-col cols="3">
                      <b-btn variant="link" :to="'/chitchat/' + s.item.id">
                        View thread
                      </b-btn>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>ChitChat Reports</h2>
              <p>These are any ChitChat posts you've reported.</p>
              <ShowMore :items="status.data.newsfeed_reports">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <b-col cols="3">
                      <b-btn variant="link" :to="'/chitchat/' + s.item.newsfeedid">
                        View thread
                      </b-btn>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Stories</h2>
              <p>These are any stories you've told us.</p>
              <ShowMore :items="status.data.stories">
                <template v-slot:item="s">
                  <b>{{ s.item.headline }}</b> <br>
                  {{ s.item.story }}
                </template>
              </ShowMore>
              <h2>Stories Loves</h2>
              <p>These are any stories you've loved.</p>
              <ShowMore :items="status.data.stories_likes">
                <template v-slot:item="s">
                  <b-btn variant="link" :to="'/story/' + s.item.id">
                    View story
                  </b-btn>
                </template>
              </ShowMore>
              <h2>About Me</h2>
              <p>These are any "about me" info you've given us</p>
              <ShowMore :items="status.data.aboutme">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <!-- eslint-disable-next-line -->
                    <b-col cols="9" class="prewrap">{{ s.item.text }}</b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Community Events</h2>
              <p>These are community events which you've created.</p>
              <ShowMore :items="status.data.communityevents">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <b-col cols="6">
                      {{ s.item.title }}
                    </b-col>
                    <b-col cols="3">
                      <b-btn variant="link" :to="'/communityevent/' + s.item.id">
                        Details
                      </b-btn>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Volunteering Opportunities</h2>
              <p>These are volunteering opportunities which you've created.</p>
              <ShowMore :items="status.data.volunteering">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="3">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <b-col cols="6">
                      {{ s.item.title }}
                    </b-col>
                    <b-col cols="3">
                      <b-btn variant="link" :to="'/volunteering/' + s.item.id">
                        Details
                      </b-btn>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <div v-if="mod">
                <h2>Alerts</h2>
                <p>These are messages you've sent to volunteers on behalf of a Freegle team.</p>
                <ShowMore :items="status.data.alerts">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="3">
                        {{ s.item.responded | dateonly }}
                      </b-col>
                      <b-col cols="6">
                        {{ s.item.subject }}
                      </b-col>
                      <b-col cols="3">
                        {{ s.item.response }}
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
              </div>
              <h2>Donations</h2>
              <p>These are any donations you have made via the site to support Freegle.</p>
              <ShowMore :items="status.data.donations">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="2">
                      {{ s.item.source }}
                    </b-col>
                    <b-col cols="2">
                      ref {{ s.item.TransactionID }}
                    </b-col>
                    <b-col cols="2" class="forcebreak">
                      {{ s.item.Payer }}
                    </b-col>
                    <b-col cols="2" class="forcebreak">
                      {{ s.item.PayerDisplayName }}
                    </b-col>
                    <b-col cols="2">
                      {{ s.item.timestamp | dateonly }}
                    </b-col>
                    <b-col cols="2">
                      &pound;{{ s.item.GrossAmount }}
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <div v-if="mod">
                <h2>Bans</h2>
                <p>These are users you have banned (except spammers).</p>
                <ShowMore :items="status.data.bans" keyfield="date">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="4">
                        {{ s.item.date | dateonly }}
                      </b-col>
                      <b-col cols="4">
                        {{ s.item.group }}
                      </b-col>
                      <b-col cols="4">
                        {{ s.item.email }}
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
              </div>
              <div v-if="mod">
                <h2>Spammers</h2>
                <p>These are users you have reported as spammers.</p>
                <ShowMore :items="status.data.spammers">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="3">
                        {{ s.item.added | dateonly }}
                      </b-col>
                      <b-col cols="4">
                        {{ s.item.collection }} {{ s.item.email }}
                      </b-col>
                      <b-col cols="5">
                        {{ s.item.reason }}
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
                <h2>Whitelisted domains</h2>
                <p>
                  You see chat messages to review, and some of these may contain links.  These are domains where you have
                  marked a link as not spam.
                </p>
                <ShowMore :items="status.data.spamdomains">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="6">
                        {{ s.item.date | dateonly }}
                      </b-col>
                      <b-col cols="6">
                        {{ s.item.domain }}
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
              </div>
              <div v-if="mod">
                <h2>Excluded locations</h2>
                <p>These are locations that you have excluded from the group mapping.</p>
                <ShowMore :items="status.data.locations" keyfield="date">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="4">
                        {{ s.item.date | dateonly }}
                      </b-col>
                      <b-col cols="4">
                        {{ s.item.group }}
                      </b-col>
                      <b-col cols="4">
                        {{ s.item.location }}
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
              </div>
              <div v-if="mod">
                <h2>Notes on users</h2>
                <p>These are mod notes that you have made on users.</p>
                <ShowMore :items="status.data.comments">
                  <template v-slot:item="s">
                    <b-row>
                      <b-col cols="3">
                        {{ s.item.date | dateonly }}
                      </b-col>
                      <b-col cols="3">
                        #{{ s.item.userid }} {{ s.item.email }}
                      </b-col>
                      <b-col cols="6">
                        <span v-if="s.item.user1">{{ s.item.user1 }}</span>
                        <span v-if="s.item.user2">{{ s.item.user2 }}</span>
                        <span v-if="s.item.user3">{{ s.item.user3 }}</span>
                        <span v-if="s.item.user4">{{ s.item.user4 }}</span>
                        <span v-if="s.item.user5">{{ s.item.user5 }}</span>
                        <span v-if="s.item.user6">{{ s.item.user6 }}</span>
                        <span v-if="s.item.user7">{{ s.item.user7 }}</span>
                        <span v-if="s.item.user8">{{ s.item.user8 }}</span>
                        <span v-if="s.item.user9">{{ s.item.user9 }}</span>
                        <span v-if="s.item.user10">{{ s.item.user10 }}</span>
                        <span v-if="s.item.user11">{{ s.item.user11 }}</span>
                      </b-col>
                    </b-row>
                  </template>
                </ShowMore>
              </div>
              <h2>Notifications</h2>
              <p>These are when you've clicked on notifications for the site.</p>
              <ShowMore :items="status.data.notifications">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="6">
                      {{ s.item.date | dateonly }}
                    </b-col>
                    <b-col cols="6">
                      <span v-if="s.item.url">
                        {{ s.item.url }}
                      </span>
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
              <h2>Logs</h2>
              <p>
                These are detailed internal logs relating to your activity.  There may be a very large number
                of these, and they're not very interesting - but you can view them if you like.
              </p>
              <div class="btn btn-white js-showlogs">
                View logs
              </div>
              <ul class="list-unstyled js-logs" />
              <h2>Exports</h2>
              <p>These are any other times you've viewed this data.</p>
              <b-row>
                <b-col cols="4">
                  <b>Requested</b>
                </b-col>
                <b-col cols="4">
                  <b>Started</b>
                </b-col>
                <b-col cols="4">
                  <b>Completed</b>
                </b-col>
              </b-row>
              <ShowMore :items="status.data.exports">
                <template v-slot:item="s">
                  <b-row>
                    <b-col cols="4">
                      {{ s.item.requested | datetime }}
                    </b-col>
                    <b-col cols="4">
                      {{ s.item.started | datetime }}
                    </b-col>
                    <b-col cols="4">
                      {{ s.item.completed | datetime }}
                    </b-col>
                  </b-row>
                </template>
              </ShowMore>
            </div>
            <div v-else-if="status.started">
              <notice-message variant="info">
                This may take a few minutes, so please keep this tab open and be patient...
              </notice-message>
              <b-img-lazy src="~/static/loader.gif" />
              <b-alert variant="success" show>
                Your data export has been started...
              </b-alert>
            </div>
            <div v-else-if="status.infront > 1">
              <notice-message variant="info">
                This may take a few minutes, so please keep this tab open and be patient...
              </notice-message>
              <b-img-lazy src="~/static/loader.gif" />
              <b-alert variant="warning" show>
                You're in a queue (sorry).  Data exports ahead of you: {{ status.infront }}
              </b-alert>
            </div>
            <div v-else-if="status.infront === 1">
              <notice-message variant="info">
                This may take a few minutes, so please keep this tab open and be patient...
              </notice-message>
              <b-img-lazy src="~/static/loader.gif" />
              <b-alert variant="warning" show>
                Your export will start soon...
              </b-alert>
            </div>
            <div v-else class="text-center">
              <b-img-lazy src="~/static/loader.gif" />
            </div>
          </div>
          <div v-else class="text-center">
            <b-img-lazy src="~/static/loader.gif" />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ShowMore from '../components/ShowMore'
import loginRequired from '@/mixins/loginRequired.js'
const NoticeMessage = () => import('~/components/NoticeMessage')
const ExportPost = () => import('~/components/ExportPost')
const ExportChat = () => import('~/components/ExportChat')
const Ratings = () => import('~/components/Ratings')

export default {
  components: {
    ShowMore,
    NoticeMessage,
    ExportPost,
    ExportChat,
    Ratings
  },
  mixins: [loginRequired],
  data: function() {
    return {
      status: null,
      id: null,
      tag: null,
      error: false,
      started: false
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    mod() {
      return (
        this.me.systemrole === 'Moderator' ||
        this.me.systemrole === 'Support' ||
        this.me.systemrole === 'Admin'
      )
    },
    downloadlink() {
      return process.env.API + '/export?id=' + this.id + '&tag=' + this.tag
    }
  },
  async mounted() {
    const ret = await this.$axios.post(process.env.API + '/export', {
      dup: Date.now()
    })

    if (ret.status === 200 && ret.data.ret === 0 && ret.data.tag) {
      this.id = ret.data.id
      this.tag = ret.data.tag
      this.started = true
      setTimeout(this.checkStatus, 3000)
    } else {
      this.error = true
    }
  },
  methods: {
    async checkStatus() {
      const ret = await this.$axios.get(process.env.API + '/export', {
        params: {
          id: this.id,
          tag: this.tag
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.status = ret.data.export

        if (!this.status.completed) {
          // Not done yet.
          setTimeout(this.checkStatus, 3000)
        }
      } else {
        console.log('Failed', ret)
        this.error = true
      }
    },
    showEvent(id) {
      console.log(
        'Refs',
        this.$refs['eventmodal-' + id],
        id,
        'eventmodal-' + id
      )
      this.$refs['eventmodal-' + id].show()
    },
    download() {
      window.open(
        process.env.API + '/export?id=' + this.id + '&tag=' + this.tag,
        '_blank'
      )
    }
  }
}
</script>
