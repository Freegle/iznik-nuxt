import shuffle from '@/mixins/shuffle'

export default {
  mixins: [shuffle],
  methods: {
    prioritise(jobs, len) {
      // For now we just shuffle.
      jobs = this.shuffle(jobs).slice(0, len)
      return jobs
    }
  }
}
