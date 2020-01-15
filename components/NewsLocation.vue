<template>
  <b-card no-body class="p-2">
    <b-card-text class="">
      <div class="d-block d-sm-none w-100">
        <b-form-select v-model="selectedArea" :options="areaOptions" class="d-block" @change="areaChange" />
        <div v-if="me.settings.mylocation && me.settings.mylocation.area.name" class="d-block mt-1">
          <v-icon name="map-marker-alt" />
          <span>{{ me.settings.mylocation.area.name }}</span>
        </div>
      </div>
      <div class="d-none d-sm-flex align-items-center">
        <div v-if="me.settings.mylocation && me.settings.mylocation.area.name" class="w-50">
          <v-icon name="map-marker-alt" />
          <span>{{ me.settings.mylocation.area.name }}</span>
        </div>
        <b-form-select v-model="selectedArea" :options="areaOptions" class="w-50" @change="areaChange" />
      </div>
    </b-card-text>
  </b-card>
</template>
<script>
export default {
  data: function() {
    return {
      areaOptions: [
        {
          value: 'nearby',
          text: 'Show chitchat from nearby'
        },
        {
          value: 1609,
          text: 'Show chitchat within 1 mile'
        },
        {
          value: 3128,
          text: 'Show chitchat within 2 miles'
        },
        {
          value: 8046,
          text: 'Show chitchat within 5 miles'
        },
        {
          value: 16093,
          text: 'Show chitchat within 10 miles'
        },
        {
          value: 32186,
          text: 'Show chitchat within 20 miles'
        },
        {
          value: 80467,
          text: 'Show chitchat within 50 miles'
        },
        {
          value: 0,
          text: 'Show chitchat from anywhere'
        }
      ]
    }
  },
  computed: {
    me() {
      const user = this.$store.getters['auth/user']
      return user
    },
    selectedArea: {
      get: function() {
        const remembered = this.$store.getters['newsfeed/area']

        return remembered || 0
      },
      set: function(newval) {
        this.$store.commit('newsfeed/area', {
          area: newval
        })
      }
    }
  },
  methods: {
    areaChange() {
      this.$emit('changed')
    }
  }
}
</script>
