import shuffle from '@/mixins/shuffle'

export default {
  mixins: [shuffle],
  methods: {
    prioritise(jobs, len) {
      // We want to show jobs with the ones with the highest CPC first, because that will generate the most
      // for us.  But if the CPC is the same, then we can randomise the order - perhaps increasing the
      // chances of a click.

      // For now we just slick; the jobs are shown with the ones which generate us most first.  This does mean
      // people will see the same jobs, though.
      jobs.forEach(j => {
        j.sortBy = j.cpc.toFixed(3) + '-' + Math.random()
      })

      jobs.sort((a, b) => {
        return a.sortBy.localeCompare(b.sortBy)
      })

      jobs = jobs.slice(0, len)

      return jobs
    }
  }
}
