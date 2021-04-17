// Global mixin so that every component can access the logged in state and user.
export default {
  methods: {
    shuffle(array) {
      let counter = array.length

      while (counter > 0) {
        const index = Math.floor(Math.random() * counter)
        counter--
        const temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
      }

      return array
    }
  }
}
