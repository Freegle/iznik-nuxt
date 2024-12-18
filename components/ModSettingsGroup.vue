<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <GroupSelect v-model="groupid" modonly />
    </div>
    <div v-if="group && group.mysettings" class="mt-2">
      <NoticeMessage v-if="group.settings.closed" variant="danger" class="mb-1">
        Your community is currently closed.  You can change this in <em>Features for Members</em>.
      </NoticeMessage>
      <NoticeMessage v-if="group.autofunctionoverride" variant="danger" class="mb-1">
        Your community is subject to restrictions.  Auto-approve is disabled.  <em>All Posts Moderated</em>
        will have been set to <em>Yes</em> but you can choose to set this back to <em>No</em> in <em>Features for Moderators</em>.
        If you have questions, ask on
        <!-- eslint-disable-next-line -->
        <external-link href="https://discourse.ilovefreegle.org/c/central/9">Central</external-link>.
      </NoticeMessage>
      <NoticeMessage v-if="group.overridemoderation !== 'None'" variant="danger" class="mb-1">
        Your community is subject to restrictions.  All posts will be moderated.  Your community setting is unaffected
        and will take effect when this restriction is lifted.
        If you have questions, ask on
        <!-- eslint-disable-next-line -->
        <external-link href="https://discourse.ilovefreegle.org/c/central/9">Central</external-link>.
      </NoticeMessage>
      <NoticeMessage v-if="group.tnkey && group.tnkey.url" variant="info" class="mt-1 mb-1">
        You can also find your TrashNothing settings
        <!-- eslint-disable-next-line -->
        <ExternalLink :href="group.tnkey.url">here</ExternalLink>.
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
              <NoticeMessage variant="warning" class="mb-2">
                Remember not to use copyrighted images.  See <ExternalLink href="https://wiki.ilovefreegle.org/How_to_add_a_picture_to_a_community_home_page">
                  here
                </ExternalLink>
                for more info.
              </NoticeMessage>
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
          <b-btn v-b-toggle.accordion-rules block href="#" variant="secondary">
            Rules
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-rules" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p>
              This section records information about rules you might have on your group.
            </p>
            <p>
              When we ask <strong>do you allow any</strong>, you should answer yes if you
              allow any at all, even if you don't allow all of them.  For example, if you allow
              some requests for animals, but not all, answer <em>Yes</em>.  Similarly, if you allow
              tickets but not coupons, answer <em>Yes</em>.  Only answer <em>No</em> if you do not allow any
              <strong>at all</strong>.
            </p>
            <p v-if="readonly" class="text-info">
              Only owners can change these rules.
            </p>
            <div class="d-flex flex-wrap">
              <strong class="mr-1 mt-2">Copy rules from:</strong>
              <GroupSelect v-model="copyfrom" modonly class="mb-2 mr-2" />
              <div>
                <b-btn variant="secondary" :disabled="copyfrom <= 0" @click="copy">
                  <v-icon name="copy" /> Copy
                </b-btn>
              </div>
            </div>
            <div :key="rulesBump">
              <h4>Rules about the group</h4>
              <ModGroupRule
                :groupid="groupid"
                name="fullymoderated"
                label="Do you moderate all posts?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="requirefirstpostoffer"
                label="Do you require a member’s first post to be an Offer?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="limitconcurrentwanteds"
                label="Do you limit the number of Wanted posts allowed at one time?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="restrictcrossposting"
                label="Do you restrict cross-posting to other groups?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="allowloans"
                label="Do you allow any loans or requests to borrow?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="suggesteddonations"
                label="Do you allow people to ask for a donation to charity when offering items?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="declareselling"
                label="Do you inform members that they must declare if they intend to sell items on?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="restrictpersonalinfo"
                label="Do you restrict personal info in posts eg telephone numbers, addresses?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="restrictpersonalinfo"
                label="Do you remove any members purely for being out of your group area?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <h4>Rules about specific items</h4>
              <ModGroupRule
                :groupid="groupid"
                name="animalswanted"
                label="Do you allow any requests for animals on your group?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="animalsoffer"
                label="Do you allow any offers of animals for rehoming on your group?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="weapons"
                label="Do you allow any requests or offers of weapons on your group?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="firearms"
                label="Do you allow any offers or requests for guns if members have a firearms license?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="knives"
                label="Do you allow any offers or requests for household or craft knives?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="knivesrestrict"
                label="If so, do you restrict these to over 18s and only if personally collected?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="medicationsprescription"
                label="Do you allow any offers or requests for prescription medication?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="medicationsotc"
                label="Do you allow any offers or requests for over-the-counter medication?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="medicationsanimals"
                label="Do you allow any offers or requests for medication for animals?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="contactlenses"
                label="Do you allow any offers or requests for Contact Lenses?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="contactlensessolutions"
                label="Do you allow any offers or requests for Contact Lens Solutions?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="tobacco"
                label="Do you allow any offers or requests for tobacco?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="vaping"
                label="Do you allow any offers or requests for Vaping products?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="alcohol"
                label="Do you allow any offers or requests for Alcohol?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="gascylinders"
                label="Do you allow any offers or requests for Gas Cylinders?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <ModGroupRule
                :groupid="groupid"
                name="tickets"
                label="Do you allow any offers or requests for vouchers, coupons or tickets?"
                type="toggle"
                toggle-checked="Yes"
                toggle-unchecked="No"
              />
              <h4>Other rules</h4>
              <ModGroupRule
                :groupid="groupid"
                name="other"
                label="Please add in information about any rules you have which aren't covered by the questions above."
                type="textarea"
              />
            </div>
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
              name="settings.engagement"
              label="Member engagement?"
              description="We take various steps to nudge members to become more active freeglers.  This may result in them receiving occasional emails/notifications.  Members can turn this on/off themselves, so you would only turn this off if you want to override their decision."
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
              description="Auto-reposting is proven to help more posts get replies. We mail the member before auto-reposting so that they can choose what happens.  0 to disable."
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.offer"
              label="OFFER repost time"
              description="Controls when the member can manually repost, and when auto-repost kicks in.  0 = always show manual Repost button."
              class="mr-2"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.reposts.wanted"
              label="WANTED repost time"
              description="Controls when the member can manually repost, and when auto-repost kicks in.  0 = always show manual Repost button."
              class="mr-2"
            />
            <NoticeMessage variant="warning">
              The following setting will soon be retired in favour of the "post visibility" setting further down.
            </NoticeMessage>
            <ModGroupSetting
              :groupid="groupid"
              name="settings.nearbygroups"
              label="Show posts to nearby freeglers?"
              description="Freeglers may live just outside your community.  Some posts from your community may be closer than some in the community they live in.  We can add posts from your community which are near their location to their mails so that they don't miss out.  In miles, 0 to disable."
              type="number"
              :step="1"
            />
            <ModGroupPostVisibility :groupid="groupid" />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.showjoin"
              label="Show Join button?"
              description="On the map in Browse, Join buttons will display below the map.  You can control how far from the member's own location (i.e. their postcode) this community will show.  You can use this to discourage people joining from further away, but please remember that many people commute to work, might be moving house, or have friends/family/partners in different locations.  In miles, 0 = always show."
              type="number"
              :step="1"
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
              name="settings.widerchatreview"
              label="Quicker Chat Review?"
              description="Chat messages between members may get sent for review to check they're ok.  They will always show for you if the recipient is a member of your group.  You can choose whether they are also shown to other Freegle mods who have chosen this setting, in which case they can be approved quickly if they are innocent (but can't be rejected).  Otherwise they'll only show for mods on the group."
              type="toggle"
              toggle-checked="All Freegle Mods"
              toggle-unchecked="Just this group"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          <b-btn v-b-toggle.accordion-microvolunteering block href="#" variant="secondary">
            Microvolunteering
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-microvolunteering" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
            <ModGroupSetting
              :groupid="groupid"
              name="microvolunteering"
              label="Allow members to perform small and useful tasks?"
              description="Is microvolunteering enabled?"
              type="toggle"
              toggle-checked="Enabled"
              toggle-unchecked="Disabled"
            />
            <NoticeMessage v-if="!group.microvolunteering" variant="info" class="mb-2">
              None of the following options will be active, as microvolunteering is turned off.
            </NoticeMessage>
            <ModGroupSetting
              :groupid="groupid"
              name="microvolunteeringoptions.approvedmessages"
              label="Review approved messages"
              description="Members may be shown approved messages which haven't been reviewed and asked to say if they're OK or not.  Messages which aren't OK will show in Messages->Review for mods to check."
              type="toggle"
              toggle-checked="Enabled"
              toggle-unchecked="Disabled"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="microvolunteeringoptions.wordmatch"
              label="Match similar items"
              description="Members may be shown popular items and asked to choose two which are similar.  This data will be used to improve our search."
              type="toggle"
              toggle-checked="Enabled"
              toggle-unchecked="Disabled"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="microvolunteeringoptions.photorotate"
              label="Photo rotate"
              description="Members may be shown photos and asked to click to rotate any which are wrong."
              type="toggle"
              toggle-checked="Enabled"
              toggle-unchecked="Disabled"
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
              All groups are now checked for spammers.  If any are found, they and their posts will be removed.
            </p>
            <p>
              It's highly recommended that these settings are turned on.
            </p>
            <p v-if="readonly" class="text-info">
              Only owners can change these settings.
            </p>
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
              description="When members reply to messages which are this far apart, in miles, then they may be flagged for review.  Default 100, 0 to disable."
              type="number"
              :step="5"
            />
            <ModGroupSetting
              :groupid="groupid"
              name="settings.spammers.worrywords"
              label="Worry words?"
              description="List of 'worry words' to force posts to Messages->Pending.  Separate by commas."
              type="input"
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
              <b-select v-model="region" :options="regionOptions" class="font-weight-bold" :disabled="!supportOrAdmin" />
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
              <nuxt-link to="/modtools/map">here</nuxt-link>,
              or all caretaker communities
              <!-- eslint-disable-next-line -->
              <nuxt-link to="/modtools/map/caretaker">here</nuxt-link>.
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
              You can link to a group Facebook page to attract more people to your group.
            </b-form-text>

            <div v-if="group.facebook && group.facebook.length">
              <div v-for="facebook in group.facebook" :key="'facebookvalid-' + facebook.id">
                <NoticeMessage v-if="!facebook.valid" variant="warning" class="mt-1">
                  <p>This group is linked to Facebook, but there's an error.  This might help:</p>
                  <p>{{ facebook.lasterror }}</p>
                  <p>Depending on the problem, unlinking and relinking might help.</p>
                </NoticeMessage>
              </div>
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
              name="onlovejunk"
              label="On LoveJunk?"
              description="On lovejunk.com too?"
              type="toggle"
              toggle-checked="On LoveJunk"
              toggle-unchecked="Not on LoveJunk"
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
              Affiliation last confirmed {{ dateshort(group.affiliationconfirmed) }}
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
import ModGroupSetting from './ModGroupSetting'
import ModGroupRule from './ModGroupRule'
import SpinButton from './SpinButton'
import NoticeMessage from './NoticeMessage'
import ModSettingsGroupFacebook from './ModSettingsGroupFacebook'
import ModGroupPostVisibility from './ModGroupPostVisibility'
const ExternalLink = () => import('~/components/ExternalLink')
const OurFilePond = () => import('~/components/OurFilePond')

const OurToggle = () => import('~/components/OurToggle')

let VueEditor, htmlEditButton

if (process.client) {
  const Quill = require('vue2-editor').Quill
  window.Quill = Quill
  htmlEditButton = require('quill-html-edit-button').htmlEditButton
  VueEditor = require('vue2-editor').VueEditor
  Quill.register('modules/htmlEditButton', htmlEditButton)
}

export default {
  components: {
    ModSettingsGroupFacebook,
    NoticeMessage,
    SpinButton,
    ModGroupSetting,
    ModGroupRule,
    OurFilePond,
    GroupProfileImage,
    OurToggle,
    ModSettingShortlink,
    GroupSelect,
    VueEditor,
    ExternalLink,
    ModGroupPostVisibility
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
      copyfrom: null,
      groupid: null,
      uploadingProfile: false,
      editingDescription: false,
      rulesBump: 0,
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
        polygon: true,
        tnkey: true
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

      this.fetchMe(['me', 'groups'])
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
    },
    async copy() {
      await this.$store.dispatch('group/fetch', {
        id: this.copyfrom
      })

      const copyfrom = this.$store.getters['group/get'](this.copyfrom)

      if (copyfrom) {
        let rules = copyfrom.rules
        rules = typeof rules === 'string' ? JSON.parse(rules) : rules

        await this.$store.dispatch('group/update', {
          id: this.groupid,
          rules: rules
        })

        await this.$store.dispatch('group/fetch', {
          id: this.groupid
        })

        this.rulesBump++
      }
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
