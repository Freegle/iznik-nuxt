<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are the notes for members on your communities, oldest first.
    </p>
    <p>
      For GDPR reasons we should not keep notes older than three years unless they are still relevant.  You can
      delete notes from here.
    </p>
    <p>
      Soon there will be:
    </p>
    <ul>
      <li>
        A button
        to "bump" the note
      </li>
      <li>
        A mail warning about notes which
        will be automatically deleted if not reviewed.
      </li>
    </ul>
    <p>
      ...but they're not ready yet.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import helpBox from '@/mixins/helpBox'

export default {
  components: { NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'notes'
    }
  }
}
</script>
