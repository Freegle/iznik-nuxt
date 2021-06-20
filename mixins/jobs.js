import shuffle from '@/mixins/shuffle'

export default {
  mixins: [shuffle],
  methods: {
    prioritise(jobs, len) {
      // For now we just slick; the jobs are shown with the ones which generate us most first.  This does mean
      // people will see the same jobs, though.
      jobs = jobs.slice(0, len)
      return jobs
    }
  }
}
