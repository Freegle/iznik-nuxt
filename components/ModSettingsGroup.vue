<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <GroupSelect v-model="groupid" modonly />
    </div>
    <div v-if="group && group.mysettings" class="mt-2">
      <NoticeMessage v-if="group.settings.closed" variant="danger" class="mb-1">
        Your community is currently closed.  You can change this in <i>Features for Members</i>.
      </NoticeMessage>
      <NoticeMessage v-if="group.ontn && group.tnsettings" variant="info" class="mt-1 mb-1">
        You can also find your TrashNothing settings
        <!-- eslint-disable-next-line -->
        <ExternalLink :href="group.tnsettings">here</ExternalLink>.
      </NoticeMessage>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-addresses block href="#" variant="secondary">
            Community Addresses
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-addresses" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>Here's how your members can reach you by email:</p>
            <p>
              <!-- eslint-disable-next-line -->
              <ExternalLink :href="'mailto:' + group.modsemail">{{ group.modsemail }}</ExternalLink>
            </p>
            <p>Members can post by email.  Please only use this for members who really need it:</p>
            <p>
              <!-- eslint-disable-next-line -->
              <ExternalLink :href="'mailto:' + group.groupemail">{{ group.groupemail }}</ExternalLink>
            </p>
            <p v-if="!Object.values(shortlinks).length">
              Your community has no shortlinks at the moment.
            </p>
            <div v-else class="mb-2">
              <p>Your community has the following shortlinks:</p>
              <ModSettingShortlink v-for="shortlink in shortlinks" :key="'shortlink-' + shortlink.id" :shortlink="shortlink" />
            </div>
            <p>
              You can add more shortlinks
              <!-- eslint-disable-next-line -->
              <a href="/shortlinks" target="_blank">here</a>.
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-your block href="#" variant="secondary">
            Your Settings
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-your" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>
              These settings affect how this community behaves for you. If you change them, it'll only affect you.
            </p>
            <b-form-group label="Are you actively moderating this community?">
              <b-form-text class="mb-2">
                We notify you about work to do for active communities.
              </b-form-text>
              <OurToggle
                v-model="active"
                class="mt-2"
                :height="30"
                :width="150"
                :font-size="14"
                :sync="true"
                :labels="{checked: 'Active', unchecked: 'Backup'}"
                color="#61AE24"
              />
            </b-form-group>
            <b-form-group label="Standard Messages to use for this community:">
              <b-form-text class="mb-2">
                The Standard Messages you choose controls which collection of standard message buttons you can use.
                You can see the settings for them on the separate tab.
              </b-form-text>
              <b-select v-model="modconfig" :options="modConfigOptions" class="mb-2 font-weight-bold" />
            </b-form-group>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-appearance block href="#" variant="secondary">
            How It Looks
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-appearance" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>These are various settings about how the community appears to freeglers on the site and in emails.</p>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <b-form-group label="Profile picture">
              <b-form-text class="mb-2">
                This is used in emails and on the site. It needs to look good small, like a Facebook profile picture.
                Avoid text - it's not readable.  Aim for a simple image that people will recognise as relating to your
                location.
              </b-form-text>
              <GroupProfileImage
                :image="group.profile ? group.profile : '/placeholder.png'"
                :alt-text="'Profile picture for ' + group.namedisplay"
              />
              <b-btn v-if="!readonly" variant="secondary" class="mt-2 d-block" @click="uploadProfile">
                <v-icon name="camera" /> Upload photo
              </b-btn>
              <OurFilePond
                v-if="uploadingProfile"
                imgtype="Group"
                imgflag="group"
                :groupid="groupid"
                @photoProcessed="profileUploaded"
              />
            </b-form-group>
            <ModGroupSetting
              :groupid="groupid"
              name="tagline"
              label="Tagline"
              description="This should be short and snappy. Include some local reference that people in your area will feel connected to."
            />
            <!--          TODO MT POSTLAUNCH Worry words in group description-->
            <ModGroupSetting
              :groupid="groupid"
              name="welcomemail"
              label="Welcome email"
              description="This is emailed out to new members.  Keep it short.  Positive - use 'do' not 'don't'."
              type="textarea"
              :rows="10"
            />
            <b-form-group label="Description">
              <b-form-text class="mb-2">
                This is a longer description which will display on the community page and elsewhere on the site.
                HTML is OK in here, and if you're really geeky, Bootstrap-4 styling.
              </b-form-text>
              <div v-if="!editingDescription">
                <!-- eslint-disable-next-line -->
                <div v-html="group.description" class="border border-info rounded p-2 mb-2" />
                <b-btn v-if="!readonly" variant="white" @click="editingDescription = true">
                  <v-icon name="pen" /> Edit
                </b-btn>
              </div>
              <div v-else>
                <VueEditor v-model="group.description" :editor-options="editorOptions" />
                <SpinButton variant="white" name="save" label="Save" :handler="saveDescription" class="mt-2" />
              </div>
            </b-form-group>
            <b-form-group label="Keywords">
              <p>You can change the keywords shown in the subject line for posts, and used in other places.</p>
              <div class="d-flex flex-wrap justify-content-between border rounder border-info p-2">
                <ModGroupSetting
                  :groupid="groupid"
                  name="settings.keywords.offer"
                  label="OFFER keyword"
                  class="mr-2"
                />
                <ModGroupSetting
                  :groupid="groupid"
                  name="settings.keywords.taken"
                  label="TAKEN keyword"
                  class="mr-2"
                />
                <ModGroupSetting
                  :groupid="groupid"
                  name="settings.keywords.wanted"
                  label="WANTED keyword"
                  class="mr-2"
                />
                <ModGroupSetting
                  :groupid="groupid"
                  name="settings.keywords.received"
                  label="RECEIVED keyword"
                  class="mr-2"
                />
              </div>
            </b-form-group>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-features-members block href="#" variant="secondary">
            Features for Members
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-features-members" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>
              These affect how the community (the code, not the people) behaves for members.
            </p>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.closed"
              label="Closed for COVID-19"
              description="Whether members can post on your community or whether they will see a COVID-19 warning."
              type="toggle"
              toggle-checked="Closed"
              toggle-unchecked="Open"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.communityevents"
              label="Community Events"
              description="Whether members can post local community events."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.volunteering"
              label="Volunteer Opportunities"
              description="Whether members can post requests for volunteers."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.stories"
              label="Stories"
              description="Whether members are prompted to tell us their Freegle Story for publicity."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.allowedits.moderated"
              label="Moderated members can edit?"
              description="When this setting is Yes (for most communities), moderated members can edit their own posts; edits go live immediately but are retrospectively reviewed from Messages->Edits. When this setting is No, moderated members cannot edit."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.allowedits.group"
              label="Members on Group Settings can edit?"
              description="When this setting is Yes (for most groups), members on Group Settings can edit their own posts; edits go live immediately. When this setting is No, members on Group Settings cannot edit."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.relevant"
              label="Send relevant messages to members?"
              description="Email specific messages to members based on their searches and posting history.  Members can turn this on/off themselves, so you would only turn this off if you want to override their decision."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.newsfeed"
              label="Send occasional digests of chitchat to members?"
              description="We can send an occasional mail to members of recent activity from other members on ChitChat (like the old cafe groups).  This encourages them to take part.  Members can turn this off themselves, so you would only turn this off if you want to override their decision."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.newsletter"
              label="Send newsletters to members?"
              description="Email occasional newsletters to members.  Members can turn this on/off themselves, so you would only turn this off if you want to override their decision."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.maxagetoshow"
              label="Expire posts"
              description="Posts will be considered as expired (i.e. no longer available) after the greater of this number of days and the maximum duration of autoreposts (i.e. max * repost time).  Set to 0 to use the default of 30 days. Max 90 days."
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.chaseups"
              label="Chaseup"
              description="Ask what's happening with the item this number of days after the last reply (0 to disable)"
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.max"
              label="Max auto-reposts"
              description="Auto-reposting is proven to help more posts get replies. We mail the member before auto-reposting, and we don't auto-repost messages which have replies (which might be in progress).  0 to disable."
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.offer"
              label="OFFER repost time"
              description="Controls when the member can manually repost, and when auto-repost kicks in."
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.wanted"
              label="WANTED repost time"
              description="Controls when the member can manually repost, and when auto-repost kicks in."
              class="mr-2"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-features-mods block href="#" variant="secondary">
            Features for Moderators
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-features-mods" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>
              These affect how the community (the code, not the people) behaves for volunteers; they're less
              obvious to members.
            </p>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.moderated"
              label="All Posts Moderated"
              description="When this setting is No (for most groups), all new members are Moderated and members can be changed to Group Settings (meaning unmoderated) once they have made a valid post. When this setting is Yes, all posts must be moderated no matter what setting the user has."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.autoadmins"
              label="Suggest ADMINs?"
              description="Freegle has a selection of ADMINs which you can adapt to your group, which we can suggest from time to time.  You can edit or delete each suggested ADMIN, so you'd only turn this off if you never wanted to even seen them."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.nearbygroups"
              label="Nearby members?"
              description="Members may live outside your community, but near the boundary.  You can make them aware of your community if they are nearby.  In miles, 0 to disable."
              type="number"
              :step="1"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-spam block href="#" variant="secondary">
            Spam Detection
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-spam" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>
              These are protection features to stop spammers or scammers targeting freeglers.  It's highly recommended
              to turn all these on.
            </p>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.spammers.check"
              label="Check for spammer members?"
              description="We can automatically check your membership for known spammers."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.spammers.remove"
              label="Auto-remove spammer members?"
              description="We can automatically remove known spammers."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.spammers.messagereview"
              label="Check for spam messages to group?"
              description="Check posted messages and put possible spam in Messages->Spam?"
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.spammers.replydistance"
              label="Reply distance check?"
              description="When members reply to messages which are this far apart, in miles, then they may be flagged for review.  Default 50, 0 to disable."
              type="number"
              :step="5"
            />
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-dups block href="#" variant="secondary">
            Duplicate Detection
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-dups" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.duplicates.check"
              label="Flag duplicate messages?"
              description="We can flag messages which look the same in ModTools."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <div class="d-flex flex-wrap">
              <ModGroupSetting
                :groupid="groupid"
                name="settings.duplicates.offer"
                label="OFFER duplicate period"
                class="mr-2"
              />
              <ModGroupSetting
                :groupid="groupid"
                name="settings.duplicates.taken"
                label="TAKEN duplicate period"
                class="mr-2"
              />
              <ModGroupSetting
                :groupid="groupid"
                name="settings.duplicates.wanted"
                label="WANTED duplicate period"
                class="mr-2"
              />
              <ModGroupSetting
                :groupid="groupid"
                name="settings.duplicates.received"
                label="RECEIVED duplicate period"
                class="mr-2"
              />
            </div>
            <b-form-text class="mb-2">
              All periods are in days.
            </b-form-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-maps block href="#" variant="secondary">
            Mapping
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-maps" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <b-form-group label="Region">
              <b-form-text class="mb-2">
                Each community is an in region of the UK.
                <span v-if="region">
                  You can see other communities in this region
                  <!-- eslint-disable-next-line -->
                  <nuxt-link :to="'/explore/region/' + group.region">here</nuxt-link>.
                </span>
              </b-form-text>
              <b-select v-model="region" :options="regionOptions" class="font-weight-bold" :disabled="readonly" />
            </b-form-group>
            <ModGroupSetting
              :groupid="groupid"
              name="cga"
              label="Core Group Area (CGA)"
              description="This is the area that the community 'owns'."
              type="textarea"
              :rows="3"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="dpa"
              label="Default Posting Area (DPA)"
              description="This is the area for which this the community is the default one suggested for freeglers to use."
              type="textarea"
              :rows="3"
            />
            <b-form-text class="mb-2">
              You can visualise these areas by cutting and pasting the data into
              <!-- eslint-disable-next-line -->
              <ExternalLink href="https://arthur-e.github.io/Wicket/sandbox-gmaps3.html">this tool</ExternalLink>.
              You can also view all community areas
              <!-- eslint-disable-next-line -->
              <nuxt-link to="/modtools/map">here</nuxt-link>.
            </b-form-text>
            <b-form-group label="Areas">
              <b-form-text class="mb-2">
                Each postcode in a group lies within an area, which is something that a freegler would recognise as a
                description of a rough location.  You can set these areas up here:
              </b-form-text>
              <b-btn variant="secondary" :to="'/modtools/map/' + groupid">
                <v-icon name="map-marker-alt" /> View Areas
              </b-btn>
            </b-form-group>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.includearea"
              label="Include area name in post location?"
              description="When constructing a post subject, should we include the area name?"
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.includepc"
              label="Include postcode in post location?"
              description="When constructing a post subject, should we include the first part of the postcode?"
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.map.zoom"
              label="Default zoom for maps"
              description="Where we show maps on the site for this community, which Google zoom level should we use?"
              class="mr-2"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-social block href="#" variant="secondary">
            Social Media
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-social" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <b-form-text class="mb-2">
              You can auto-tweet the subject and picture of posts to attract more people to your group.
            </b-form-text>
            <NoticeMessage v-if="group.twitter.locked" variant="danger">
              This group's Twitter account has been locked.  Please log in to Twitter to unlock it.  Then
              we'll try again to tweet.  After that, you may need to link it again - if so you'll see a
              message here.
            </NoticeMessage>
            <NoticeMessage v-else-if="!group.twitter.valid" variant="warning">
              This group is not linked to a Twitter account.  Please link it to get more publicity.
            </NoticeMessage>
            <div v-else>
              <v-icon name="check" class="text-success" /> Linked to
              <a :href="'https://twitter.com/' + group.twitter.name">@{{ group.twitter.name }}</a>
              <span class="text-muted small">
                {{ group.twitter.authdate | dateshort }}
              </span>
            </div>
            <ExternalLink class="btn btn-white mt-2" :href="'https://modtools.org/twitter/twitter_request.php?groupid=' + group.id">
              Link to Twitter
            </ExternalLink>

            <b-form-text class="mb-2">
              You can link to a group Facebook page to attract more people to your group.
            </b-form-text>

            <div v-if="group.facebook && group.facebook.length">
              <ModSettingsGroupFacebook v-for="facebook in group.facebook" :key="'facebook-' + facebook.id" :groupid="group.id" :facebook="facebook" />
            </div>
            <NoticeMessage v-else variant="warning">
              <p>This group is not linked to Facebook.  Please link it to get more publicity.</p>
              <ExternalLink class="btn btn-white mt-2" :href="'https://modtools.org/facebook/facebook_request.php?type=Page&groupid=' + group.id">
                Link to Facebook
              </ExternalLink>
            </NoticeMessage>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-stats block href="#" variant="secondary">
            Status
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-stats" accordion="settings-accordion" role="tabpanel">
          <p v-if="readonly" class="text-info">
            Only owners can change these settings.
          </p>
          <b-card-body>
            <p>
              These are various high-level settings about how the community behaves.  Normally you don't change
              these once a community is live.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="publish"
              label="Enabled on website?"
              description="Is this available for people to use?"
              type="toggle"
              toggle-checked="Visible"
              toggle-unchecked="Hidden"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="onhere"
              label="Hosted on the site?"
              description="Hosted on www.ilovefreegle.org (normally yes, but some are hosted elsewhere)."
              type="toggle"
              toggle-checked="Hosted"
              toggle-unchecked="Elsewhere"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="onmap"
              label="Shown on the map?"
              description="Normally you'd set this yes, except for a few hidden test groups."
              type="toggle"
              toggle-checked="Visible"
              toggle-unchecked="Hidden"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="ontn"
              label="On TrashNothing?"
              description="On trashnothing.com too?"
              type="toggle"
              toggle-checked="On TN"
              toggle-unchecked="Not on TN"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="mentored"
              label="Caretakers?"
              description="Whether this community is being run by Caretakers."
              type="toggle"
              toggle-checked="Caretakers"
              toggle-unchecked="Local volunteers"
            />
            <p v-if="group.affiliationconfirmed">
              Affiliation last confirmed {{ group.affiliationconfirmed | dateshort }}
              <span class="text-muted">
                by <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ group.affiliationconfirmedby }}
              </span>
            </p>
            <p v-else>
              Affiliation not confirmed yet.
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import ModSettingShortlink from './ModSettingShortlink'
import GroupProfileImage from './GroupProfileImage'
import OurFilePond from './OurFilePond'
import ModGroupSetting from './ModGroupSetting'
import SpinButton from './SpinButton'
import NoticeMessage from './NoticeMessage'
import ModSettingsGroupFacebook from './ModSettingsGroupFacebook'
const ExternalLink = () => import('~/components/ExternalLink')

const OurToggle = () => import('@/components/OurToggle')

let VueEditor, htmlEditButton

if (process.client) {
  htmlEditButton = require('quill-html-edit-button').htmlEditButton
  VueEditor = require('vue2-editor').VueEditor
  const Quill = require('vue2-editor').Quill
  Quill.register('modules/htmlEditButton', htmlEditButton)
}

export default {
  components: {
    ModSettingsGroupFacebook,
    NoticeMessage,
    SpinButton,
    ModGroupSetting,
    OurFilePond,
    GroupProfileImage,
    OurToggle,
    ModSettingShortlink,
    GroupSelect,
    VueEditor,
    ExternalLink
  },
  props: {
    initialGroup: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      groupid: null,
      uploadingProfile: false,
      editingDescription: false,
      editorOptions: {
        modules: {
          htmlEditButton: {}
        }
      }
    }
  },
  computed: {
    readonly() {
      return this.group.myrole !== 'Owner'
    },
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    shortlinks() {
      return this.$store.getters['shortlinks/list']
    },
    active: {
      get() {
        return Boolean(this.group.mysettings.active)
      },
      set(newval) {
        this.saveMembershipSetting('active', newval ? 1 : 0)
      }
    },
    region: {
      get() {
        return this.group.region
      },
      set(newval) {
        this.saveGroupSetting('region', newval)
      }
    },
    modconfig: {
      get() {
        return parseInt(this.group.mysettings.configid)
      },
      set(newval) {
        this.saveMembershipSetting('configid', newval)
      }
    },
    tagline: {
      get() {
        return this.group.tagline
      },
      set() {}
    },
    modConfigs() {
      return this.$store.getters['modconfigs/configs']
    },
    modConfigOptions() {
      const ret = []
      this.modConfigs.forEach(c => {
        ret.push({
          value: c.id,
          text: c.name
        })
      })

      return ret
    },
    regionOptions() {
      return [
        { text: 'East', value: 'East' },
        { text: 'London', value: 'London' },
        { text: 'Midlands West', value: 'West Midlands' },
        { text: 'Midlands East', value: 'East Midlands' },
        { text: 'North East', value: 'North East' },
        { text: 'North West', value: 'North West' },
        { text: 'Northern Ireland', value: 'Northern Ireland' },
        { text: 'South East', value: 'South East' },
        { text: 'South West', value: 'South West' },
        { text: 'Wales', value: 'Wales' },
        { text: 'Yorkshire and the Humber', value: 'Yorkshire and the Humber' },
        { text: 'Scotland', value: 'Scotland' }
      ]
    }
  },
  watch: {
    groupid() {
      this.fetchGroup()
    }
  },
  mounted() {
    this.groupid = this.initialGroup
    this.fetchConfigs()
  },
  methods: {
    async fetchGroup() {
      this.editingDescription = false

      await this.$store.dispatch('group/fetch', {
        id: this.groupid,
        polygon: true
      })

      this.$store.dispatch('shortlinks/fetch', {
        groupid: this.groupid
      })
    },
    async fetchConfigs() {
      await this.$api.session.fetch({
        components: ['configs'],
        modtools: true
      })
    },
    async saveMembershipSetting(name, val) {
      const settings = this.group.mysettings
      settings[name] = val

      await this.$store.dispatch('auth/setGroup', {
        groupid: this.groupid,
        userid: this.myid,
        settings
      })

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups'],
        force: true
      })
    },
    uploadProfile() {
      this.uploadingProfile = true
    },
    profileUploaded(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploadingProfile = false

      // Set the image id in the group.
      this.$store.dispatch('group/update', {
        id: this.groupid,
        profile: imageid
      })
    },
    saveGroupSetting(name, val) {
      // Note that we get a sneaky progress indicator and success from SpinButton even though actually we're doing the
      // work here triggered by the set on the computed value.
      const data = {
        id: this.groupid
      }

      data[name] = val

      this.$store.dispatch('group/update', data)
    },
    async saveDescription() {
      await this.$store.dispatch('group/update', {
        id: this.groupid,
        description: this.group.description
      })

      this.editingDescription = false
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input,
select {
  max-width: 300px;
}

.card {
  border-width: medium;
  border-color: $colour-success-border;
}
</style>
