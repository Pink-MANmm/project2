<template>
  <div id="position">
    <p class="lPos">经度 </p>
    <input type="text" class="pos" value="0.00">
    <p class="lPos">纬度 </p>
    <input type="text" class="pos" value="0.00">
    <p class="lPos">缩放比例 </p>
    <input type="text" class="pos" value="0.00">
    <button id="Tog" status="2D" @click="Tog"><img ref="Tog" src="@/assets/logo/badge-3d.svg" alt="" id="toggle-img"></button>
    <button id="addMission" @click="addMission"><img src="@/assets/logo/plus-circle.svg" alt="" id="plus-img"></button>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {}
  },
  methods: {
    addMission() {
      $('#option').css('display', 'block')
    }
  }
}
</script>

<style lang="less" scoped>
#position {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: black;
  z-index: 7;
}
.lPos {
  position: relative;
  top: 0;
  display: inline-block;
  height: 6%;
  width: 68px;
  text-align: center;
  margin: 7.6px 5px;
  color: rgb(182, 180, 180);
  font-size: 17px;
  user-select: none;
}
.pos {
  position: relative;
  display: inline-block;
  height: 6%;
  width: 180px;
  margin: 7.6px 10px;
  color: black;
  background: linear-gradient(120deg, #a6c0fe 0%, #6115bd 600%);
  font: normal 17.5px/22.8px '';
  border: 1px solid black;
  border-radius: 5px;
}
#Tog,
#addMission {
  position: absolute;
  right: 0;
  display: inline-block;
  height: 75%;
  width: 55px;
  margin: 6.6px 10px;
  color: white;
  background: linear-gradient(120deg, #480cd2 0%, #9c09c8 100%);
  border: 2px solid rgb(116, 24, 135);
  cursor: pointer;
  user-select: none;
  border-radius: 38px;
}
#Tog {
  right: 68.2px;
}
#toggle-img {
  height: 100%;
  width: 100%;
}

#plus-img {
  height: 100%;
  width: 100%;
}
</style>