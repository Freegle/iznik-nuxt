<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      Here you can change the areas that postcodes map to on your community.
    </p>
    <ul>
      <li>Click on the little polygon on the top right of the map, under the Search box, to add a new area.</li>
      <li>Click on an existing area to select it.  Untick <em>Share areas</em> if one is hidden below another.</li>
      <li>Once selected, an area will be red.  Click on it again to make it editable - you'll see little dots appear which you can then drag.</li>
      <li>Once you select an area, you can't move or zoom the map, so position the map first.  Click <em>Cancel</em> to unselect it.</li>
      <li>If you're remapping an area with a lot of points, it might be simpler to add a new simpler one and delete the old one.</li>
      <li>You can change the name of an area, and then click <em>Save</em>.</li>
      <li><em>Areas to review</em> helps you see where mapping has changed or could be improved.</li>
    </ul>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'areamap'
    }
  }
}
</script>
