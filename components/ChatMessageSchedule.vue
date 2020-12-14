<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <b-card border-variant="success">
          <b-card-title>
            <h4>
              <v-icon name="calendar-alt" scale="2" /> Current Availability
            </h4>
          </b-card-title>
          <b-card-text>
            <div v-if="matches && matches.length">
              <p>Here's when you're both available.  Now use chat to make the final arrangements.</p>
              <span v-for="match in matches" :key="'match-' + match.hour+ '-' + match.date" class="border border-success rounded p-1 mr-1 font-weight-bold">
                {{ formatDate(match.date ) }}
                <span v-if="match.hour === 0">morning</span>
                <span v-if="match.hour === 1">afternoon</span>
                <span v-if="match.hour === 2">evening</span>
              </span>
            </div>
            <div v-else>
              <p>
                We don't know a time when you're both available yet.  Please use the <em>Edit yours</em> button to
                say when you're available.
              </p>
            </div>
          </b-card-text>
          <b-card-footer class="pl-0 pr-0">
            <div class="d-flex flex-row justify-content-between">
              <b-btn variant="secondary" @click="theirAvailability">
                <v-icon name="eye" /> View theirs
              </b-btn>
              <b-btn variant="primary" @click="myAvailability">
                <v-icon name="pen" /> Edit yours
              </b-btn>
            </div>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <AvailabilityModal ref="myavailability" :otheruid="otheruser ? otheruser.id : null" :chatid="chat.id" :thisuid="me.id" />
    <AvailabilityModal ref="theiravailability" :chatid="chat.id" :thisuid="otheruser ? otheruser.id : null" :mine="false" />
  </div>
</template>
<script>
import ChatBase from '~/components/ChatBase'
const AvailabilityModal = () => import('~/components/AvailabilityModal')

export default {
  components: {
    AvailabilityModal
  },
  extends: ChatBase,
  computed: {
    today() {
      return this.$dayjs().toISOString()
    },
    tomorrow() {
      return this.$dayjs()
        .add('day', 1)
        .toISOString()
    },
    matches() {
      // Make sure we exclude matches in the past, which may be returned.
      const t = this.$dayjs().unix()
      return this.chatmessage.matches.filter(item => {
        // There are some DST niggles in the date, so be a bit flexible about how we decide whether a date is
        // today or not.
        return Math.abs(this.$dayjs(item.date).unix() - t) < 24 * 60 * 60
      })
    }
  },
  methods: {
    formatDate(date) {
      const d = this.$dayjs(date)
      const u = d.unix()
      const today = this.$dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
      const tomorrow = this.$dayjs()
        .add(1, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)

      if (Math.abs(u - today.unix()) < 24 * 60 * 60) {
        return 'This'
      } else if (Math.abs(u - tomorrow.unix()) < 24 * 60 * 60) {
        return 'Tomorrow'
      } else {
        return d.format('dddd Do')
      }
    },
    myAvailability() {
      this.$refs.myavailability.show()
    },
    theirAvailability() {
      this.$refs.theiravailability.show()
    }
  }
}
</script>
