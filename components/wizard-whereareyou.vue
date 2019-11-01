<template>
  <b-row class="bs-wizard">
    <b-col cols="4" class="bs-wizard-step">
      <div class="text-center bs-wizard-stepnum active">
        &nbsp;
      </div>
      <div class="progress">
        <div class="progress-bar" />
      </div>
      <a href="#" class="bs-wizard-dot active" />
      <div class="bs-wizard-info text-center">
        Where are you?
      </div>
    </b-col>
    <b-col cols="4" class="bs-wizard-step">
      <div class="text-center bs-wizard-stepnum">
        &nbsp;
      </div>
      <div class="progress">
        <div class="progress-bar" />
      </div>
      <a href="#" class="bs-wizard-dot" />
      <div class="bs-wizard-info text-center">
        What is it?
      </div>
    </b-col>
    <b-col cols="4" class="bs-wizard-step">
      <div class="text-center bs-wizard-stepnum">
        &nbsp;
      </div>
      <div class="progress">
        <div class="progress-bar" />
      </div>
      <a href="#" class="bs-wizard-dot" />
      <div class="bs-wizard-info text-center">
        Who are you?
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WizardWhereAreYou'
}
</script>
