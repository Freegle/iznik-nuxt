<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="6">
        <b-row class="bs-wizard">
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum active">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot active" />
            <div class="bs-wizard-info text-center">
              Where are you?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              What is it?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Who are you?
            </div>
          </b-col>
        </b-row>

        <h1 class="text-center">
          First, tell us where you are
        </h1>
        <p class="text-center">
          We'll use this to show your offer to people nearby.  Don't worry, we won't give other people your postcode.
        </p>
        <b-row>
          <b-col class="text-center">
            <postcode @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <b-row v-if="postcode">
          <b-col class="text-center">
            <nuxt-link to="/give/whatisit">
              <fa icon="check-circle" class="text-success mt-2 fa-bh" />
            </nuxt-link>
          </b-col>
        </b-row>
        <b-row v-if="postcode" class="mt-1">
          <b-col class="text-center">
            Freegle has local communities for each area.  We'll show your offer on this community first:
          </b-col>
        </b-row>
        <b-row v-if="postcode" class="mt-1">
          <b-col class="text-center">
            <b-form-select v-model="group" :options="groupOptions" @change="groupChange" />
          </b-col>
        </b-row>
        <b-row v-if="postcode" class="mt-1">
          <b-col class="text-center text-muted">
            Click on the name above to choose a different community.
          </b-col>
        </b-row>
        <b-row v-if="postcode" class="mt-1">
          <b-col class="text-center mt-4" cols="6" offset="3">
            <nuxt-link to="/give/whatisit" class="decornone">
              <b-btn variant="success" size="lg" block>
                Next >>
              </b-btn>
            </nuxt-link>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </b-col>
</template>
<style scoped>
.bs-wizard {
  margin-top: 40px;
}
.bs-wizard {
  border-bottom: solid 1px #e0e0e0;
  padding: 0 0 10px 0;
}
.bs-wizard > .bs-wizard-step {
  padding: 0;
  position: relative;
}
.bs-wizard > .bs-wizard-step + .bs-wizard-step {
}
.bs-wizard > .bs-wizard-step .bs-wizard-stepnum {
  color: #595959;
  font-size: 16px;
  margin-bottom: 5px;
}
.bs-wizard > .bs-wizard-step .bs-wizard-info {
  color: #999;
  font-size: 14px;
}
.bs-wizard > .bs-wizard-step > .bs-wizard-dot.active {
  position: absolute;
  width: 30px;
  height: 30px;
  display: block;
  background: #84cf96;
  top: 45px;
  left: 50%;
  margin-top: -15px;
  margin-left: -15px;
  border-radius: 50%;
}
.bs-wizard > .bs-wizard-step > .bs-wizard-dot {
  position: absolute;
  width: 30px;
  height: 30px;
  display: block;
  background: lightgrey;
  top: 45px;
  left: 50%;
  margin-top: -15px;
  margin-left: -15px;
  border-radius: 50%;
}
.bs-wizard > .bs-wizard-step > .bs-wizard-dot.active:after {
  content: ' ';
  width: 14px;
  height: 14px;
  background: green;
  border-radius: 50px;
  position: absolute;
  top: 8px;
  left: 8px;
}
.bs-wizard > .bs-wizard-step > .bs-wizard-dot:after {
  content: ' ';
  width: 14px;
  height: 14px;
  background: darkgray;
  border-radius: 50px;
  position: absolute;
  top: 8px;
  left: 8px;
}
.bs-wizard > .bs-wizard-step > .progress {
  position: relative;
  border-radius: 0px;
  height: 8px;
  box-shadow: none;
  margin: 20px 0;
}
.bs-wizard > .bs-wizard-step > .progress > .progress-bar {
  width: 0px;
  box-shadow: none;
  background: #fbe8aa;
}
.bs-wizard > .bs-wizard-step.complete > .progress > .progress-bar {
  width: 100%;
}
.bs-wizard > .bs-wizard-step.active > .progress > .progress-bar {
  width: 50%;
}
.bs-wizard > .bs-wizard-step:first-child.active > .progress > .progress-bar {
  width: 0%;
}
.bs-wizard > .bs-wizard-step:last-child.active > .progress > .progress-bar {
  width: 100%;
}
.bs-wizard > .bs-wizard-step.disabled > .bs-wizard-dot {
  background-color: #f5f5f5;
}
.bs-wizard > .bs-wizard-step.disabled > .bs-wizard-dot:after {
  opacity: 0;
}
.bs-wizard > .bs-wizard-step:first-child > .progress {
  left: 50%;
  width: 50%;
}
.bs-wizard > .bs-wizard-step:last-child > .progress {
  width: 50%;
}
.bs-wizard > .bs-wizard-step.disabled a.bs-wizard-dot {
  pointer-events: none;
}
select {
  max-width: 400px !important;
}
</style>
<script>
// TODO DESIGN When you select a postcode, the button disappears.  I'd like it to do that gracefully.
// TODO Norfolk and redirection to another site?
import Postcode from '~/components/Postcode'

export default {
  components: {
    Postcode
  },
  data() {
    return {
      id: null,
      postcode: null,
      source: process.env.API + '/locations?typeahead=',
      group: null
    }
  },
  computed: {
    groupOptions() {
      const ret = []

      if (this.postcode) {
        for (const group of this.postcode.groupsnear) {
          if (group.type === 'Freegle') {
            ret.push({
              value: group.id,
              text: group.namedisplay
            })
          }
        }
      }

      return ret
    }
  },
  async asyncData({ app, params, store }) {},
  methods: {
    getLocation() {},
    postcodeSelect(pc) {
      console.log('Postcode selected', pc)
      this.postcode = pc
      this.group = pc && pc.groupsnear ? pc.groupsnear[0].id : null
    },
    postcodeClear() {
      console.log('postcode cleared')
      this.postcode = null
      this.group = null
    },
    groupChange() {}
  }
}
</script>
