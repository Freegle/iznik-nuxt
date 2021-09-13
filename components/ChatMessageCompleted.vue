<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != myid" class="media">
          <b-card border-variant="info" class="ml-2">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                generator-unable-to-provide-required-alt=""
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error="brokenImage"
              />
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <span v-if="refmsg.type === 'Offer'">
                This is no longer available.
              </span>
              <span v-else>
                Thanks, this has now been received.
              </span>
            </b-card-text>
          </b-card>
        </div>
        <div v-else class="media float-right">
          <b-card border-variant="info">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                generator-unable-to-provide-required-alt=""
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error="brokenImage"
              />
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <div>
                <v-icon name="info-circle" />
                <span v-if="refmsg.type === 'Offer'">
                  We've let them know this is no longer available.
                </span>
                <span v-else>
                  This has now been received.
                </span>
              </div>
              <div class="text-muted small">
                This is an automated message.
              </div>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ChatBase from '~/components/ChatBase'

export default {
  extends: ChatBase
}
</script>
