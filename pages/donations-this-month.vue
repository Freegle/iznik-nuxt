<template>
  <div class="d-flex justify-content-around">
    <DonationThermometer ref="thermo" class="float-right text-center" />
  </div>
</template>
<script>
import DonationThermometer from '@/components/DonationThermometer'
export default {
  components: { DonationThermometer }
}
</script>
