<template>
  <div>
    <JobsTopBar />
    <GroupSelect v-model="groupid" all modonly />
  </div>
</template>
<script>
import JobsTopBar from '../../../components/JobsTopBar'
import GroupSelect from '../../../components/GroupSelect'
import loginRequired from '../../../mixins/loginRequired'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  layout: 'modtools',
  components: { GroupSelect, JobsTopBar },
  mixins: [loginRequired, createGroupRoute('modtools/messags/pending')]
}
</script>
