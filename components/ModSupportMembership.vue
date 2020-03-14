<template>
  <div>
    <b-card no-body>
      <b-card-body class="pl-3 pr-2 pt-2 pb-0">
        <b-row>
          <b-col cols="12" md="6">
            <div class="d-flex justify-content-between flex-wrap">
              <div>
                <h4>{{ membership.nameshort }}</h4>
              </div>
              <div class="pt-1">
                {{ membership.added | datetimeshort }}
              </div>
              <b-btn variant="white" size="sm">
                Remove
              </b-btn>
            </div>
          </b-col>
        </b-row>
        <div class="d-flex flex-wrap pt-1">
          <b-form-group
            label="OFFER and WANTED posts:"
            class="mr-5"
          >
            <b-form-select :value="membership.emailfrequency" @change="changeFrequency">
              <option value="-1">
                Immediately
              </option>
              <option value="1">
                Every Hour
              </option>
              <option value="2">
                Every 2 Hours
              </option>
              <option value="4">
                Every 4 Hours
              </option>
              <option value="8">
                Every 8 Hours
              </option>
              <option value="24">
                Every day
              </option>
              <option value="0">
                Never
              </option>
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Moderation status:"
            class="mr-5"
          >
            <b-form-select :value="membership.ourpostingstatus || 'DEFAULT'" @change="changePostingStatus">
              <option value="MODERATED">
                Moderated
              </option>
              <option value="DEFAULT">
                Group Settings
              </option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="Community Event mails:" class="mr-5">
            <OurToggle
              :value="(Boolean)(membership.eventsallowed)"
              class="mt-2"
              :height="30"
              :width="100"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Weekly', unchecked: 'Off'}"
              color="#61AE24"
              @change="changeEvents"
            />
          </b-form-group>
          <b-form-group label="Volunteer Opportunity mails:">
            <OurToggle
              :value="(Boolean)(membership.volunteeringallowed)"
              class="mt-2"
              :height="30"
              :width="100"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Weekly', unchecked: 'Off'}"
              color="#61AE24"
              @change="changeVolunteering"
            />
          </b-form-group>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { OurToggle },
  props: {
    membership: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeEvents() {},
    changeVolunteering() {},
    changeFrequency() {},
    changePostingStatus() {}
  }
}
</script>
