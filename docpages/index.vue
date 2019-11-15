<template>
  <div class="w-100">
    <div class="mx-auto p-5" :style="innerStyle">
      <h1>Developer docs</h1>
      <p>The idea is we can use this to write <em>live</em> documentation.</p>

      <b-button v-b-toggle.collapse-group-select block size="lg" class="my-3">
        GroupSelect
      </b-button>
      <b-collapse id="collapse-group-select" class="my-3">
        <h3>Default mode</h3>
        <div class="my-3">
          <group-select v-model="groupSelect.default.value" />
          <span class="pl-3">value is <code>{{ debugValue(groupSelect.default.value) }}</code></span>
        </div>

        <h3>With <code>all</code> option</h3>
        <div class="my-3">
          <group-select v-model="groupSelect.all.value" all />
          <span class="pl-3">value is <code>{{ debugValue(groupSelect.all.value) }}</code></span>
        </div>
      </b-collapse>

      <b-button v-b-toggle.collapse-group-remember-select block size="lg" class="my-3">
        GroupRememberSelect
      </b-button>
      <b-collapse id="collapse-group-remember-select" class="my-3">
        <h3>Default mode</h3>
        <div class="my-3">
          <group-remember-select v-model="groupRememberSelect.default.value" remember="docs" />
          <span class="pl-3">
            value is <code>{{ debugValue(groupRememberSelect.default.value) }}</code>
            stored value is <code>{{ debugValue(groupRememberSelectDefaultStored) }}</code>
          </span>
        </div>

        <h3>With <code>all</code> option</h3>
        <div class="my-3">
          <group-remember-select v-model="groupRememberSelect.all.value" remember="docs-all" all />
          <span class="pl-3">
            value is <code>{{ debugValue(groupRememberSelect.all.value) }}</code>
            stored value is <code>{{ debugValue(groupRememberSelectAllStored) }}</code>
          </span>
        </div>
      </b-collapse>

      <b-button v-b-toggle.collapse-notice-message block size="lg" class="my-3">
        NoticeMessage
      </b-button>
      <b-collapse id="collapse-notice-message" class="my-3">
        <notice-message class="my-3">
          In the <em>info</em> variant (default)
        </notice-message>

        <notice-message class="my-3" variant="warning">
          In the <em>warning</em> variant
        </notice-message>

        <notice-message class="my-3" variant="danger">
          In the <em>danger</em> variant
        </notice-message>
      </b-collapse>

      <b-button v-b-toggle.collapse-start-end-collection block size="lg" class="my-3">
        StartEndCollection
      </b-button>
      <b-collapse id="collapse-start-end-collection" class="my-3">
        <h3>Default mode</h3>
        <StartEndCollection v-model="startEndCollection.default.dates" />
        <pre>{{ startEndCollection.default.dates }}</pre>

        <h3>With <code>add-date-if-empty</code> option</h3>
        <StartEndCollection v-model="startEndCollection.addDateIfEmpty.dates" add-date-if-empty />
        <pre>{{ startEndCollection.addDateIfEmpty.dates }}</pre>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import GroupSelect from '@/components/GroupSelect'
import GroupRememberSelect from '@/components/GroupRememberSelect'
import NoticeMessage from '@/components/NoticeMessage'
import StartEndCollection from '@/components/StartEndCollection'
export default {
  components: {
    GroupSelect,
    GroupRememberSelect,
    NoticeMessage,
    StartEndCollection
  },
  data() {
    return {
      groupSelect: {
        default: {
          value: null
        },
        all: {
          value: null
        }
      },
      groupRememberSelect: {
        default: {
          value: null
        },
        all: {
          value: null
        }
      },
      startEndCollection: {
        default: {
          dates: []
        },
        addDateIfEmpty: {
          dates: []
        }
      }
    }
  },
  computed: {
    groupRememberSelectDefaultStored() {
      return this.$store.getters['group/remembered']('docs')
    },
    groupRememberSelectAllStored() {
      return this.$store.getters['group/remembered']('docs-all')
    },
    innerStyle() {
      return {
        width: '1000px',
        backgroundColor: 'white'
      }
    }
  },
  methods: {
    debugValue(val) {
      // Q: why add extra String() call?
      // A: it means it actually shows "undefined" when value is undefined
      return String(JSON.stringify(val))
    }
  }
}
</script>

<style lang="scss">
pre {
  background-color: #eee;
  padding: 20px;
  margin: 20px 0;
}
</style>
