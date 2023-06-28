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
              <div v-if="emessage">
                <NoticeMessage variant="info">
                  <div class="text-muted small">
                    <v-icon name="info-circle" />
                    <span v-if="refmsg && refmsg.type === 'Offer'">
                      This is no longer available.
                    </span>
                    <span v-else> Thanks, this has now been received. </span>
                  </div>
                </NoticeMessage>
                <div class="preline forcebreak mt-1">
                  {{ emessage }}
                </div>
              </div>
              <div v-else>
                <v-icon name="info-circle" />
                <span v-if="refmsg && refmsg.type === 'Offer'">
                  We've let them know this is no longer available.
                </span>
                <span v-else> This has now been received. </span>
                <div class="text-muted small">
                  This is an automated message.
                </div>
              </div>
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
              <div v-if="emessage">
                <NoticeMessage variant="info">
                  <div class="small">
                    <v-icon name="info-circle" />
                    <span v-if="refmsg && refmsg.type === 'Offer'">
                      This is no longer available.
                    </span>
                    <span v-else> Thanks, this has now been received. </span>
                  </div>
                </NoticeMessage>
                <div class="preline forcebreak mt-1">
                  {{ emessage }}
                </div>
              </div>
              <div v-else>
                <v-icon name="info-circle" />
                <span v-if="refmsg && refmsg.type === 'Offer'">
                  This is no longer available.
                </span>
                <span v-else> Thanks, this has now been received. </span>
                <div class="text-muted small">
                  This is an automated message.
                </div>
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
