<template>
  <b-row class="wizard">
    <b-col cols="4" class="wizard__step" :class="{'active': activeStage===1}">
      <div class="wizard__stepnum">
      &nbsp;
      </div>
      <div class="wizard__progress">
        <div class="wizard__progress-bar" />
      </div>
      <a href="#" class="wizard__dot" />
      <div class="wizard__info text-center">
        Where are you?
      </div>
    </b-col>
    <b-col cols="4" class="wizard__step" :class="{active : activeStage===2}">
      <div class="wizard__stepnum">
        &nbsp;
      </div>
      <div class="wizard__progress">
        <div class="wizard__progress-bar" />
      </div>
      <a href="#" class="wizard__dot" />
      <div class="wizard__info text-center">
        What is it?
      </div>
    </b-col>
    <b-col cols="4" class="wizard__step" :class="{active : activeStage===3}">
      <div class="wizard__stepnum">
        &nbsp;
      </div>
      <div class="wizard__progress">
        <div class="wizard__progress-bar" />
      </div>
      <a href="#" class="wizard__dot" />
      <div class="wizard__info text-center">
        Who are you?
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WizardProgress',
  props: {
    activeStage: {
      type: Number,
      required: true,
      validator: value => {
        return value > 0 && value <= 3
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.wizard {
  margin-top: 20px;
  border-bottom: solid 1px $color-gray--light;
  padding: 0 0 10px 0;
}

.wizard__step {
  padding: 0;
  position: relative;
}

.wizard__progress {
  position: relative;
  border-radius: 0px;
  height: 8px;
  box-shadow: none;
  margin: 20px 0;
  background-color: $color-gray-3;
}

.wizard > .wizard__step:first-child > .wizard__progress {
  left: 50%;
  width: 50%;
}

.wizard > .wizard__step:last-child > .wizard__progress {
  width: 50%;
}

.wizard__progress-bar {
  width: 100%;
  box-shadow: none;
  background: $color-yellow--dark;
}

.wizard__dot {
  position: absolute;
  width: 30px;
  height: 30px;
  display: block;
  background: $color-gray--light;
  top: 45px;
  left: 50%;
  margin-top: -15px;
  margin-left: -15px;
  border-radius: 50%;
}

.wizard__dot::after {
  content: ' ';
  position: absolute;
  width: 14px;
  height: 14px;
  background: $color-gray--base;
  top: 8px;
  left: 8px;
  border-radius: 50%;
}

.active .wizard__dot {
  background: $color-green--medium;
}

.active .wizard__dot::after {
  background: $color-green--light-alt;
}

.wizard__stepnum {
  font-size: 16px;
  margin-bottom: 5px;
}

.wizard__info {
  color: $color-black;
  font-size: 14px;
}
</style>
