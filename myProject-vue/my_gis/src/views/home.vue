<template>
  <div id="home">
    <Header :compareStatus="compareStatus" @compare="compare"></Header>
    <div id="content">
      <Option @compare="compare" :compareStatus="compareStatus"></Option>
      <yearSelect :side="'left'" :z_index="3"></yearSelect>
      <yearSelect :side="'right'" :z_index="2"></yearSelect>
      <Map></Map>
    </div>
    <Bottom></Bottom>
    <Recognise></Recognise>
    <Compare></Compare>
  </div>
</template>

<script>
import Bottom from '@/components/bottom.vue'
import Compare from '@/components/compare.vue'
import Option from '@/components/option.vue'
import Header from '@/components/header.vue'
import Map from '@/components/map.vue'
import Recognise from '@/components/recognise.vue'
import yearSelect from '@/components/yearSelect.vue'

export default {
  data() {
    return {
      compareStatus: 'single',
      delName: ''
    }
  },
  methods: {
    compare(status) {
      this.compareStatus = status
    }
  },
  components: {
    Bottom,
    Compare,
    Option,
    Header,
    Map,
    Recognise,
    yearSelect
  }
}
</script>

<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;
}
#content {
  position: relative;
  width: 100%;
  height: 88%;
}
#screenshotDiv {
  position: absolute;
  height: 93.7%;
  top: 45px;
  left: 0;
  right: 0;
  bottom: 42px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}
#screenshotDiv > * {
  margin: 0.5em;
}
</style>