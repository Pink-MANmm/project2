<template>
  <div id="AI_landform">
    <div class="close" @click="close">X</div>
    <div id="deff">
      <div id="similarity">
        <div class="sim">
          <div style="user-select: none;">MSE</div><input type="text" value="0.10" class="similar">
        </div>
        <div class="sim">
          <div style="user-select: none;">SSIM</div><input type="text" value="0.80" class="similar">
        </div>
        <div class="sim">
          <div style="user-select: none;">综合相似度</div><input type="text" value="80.00%" class="similar">
        </div>
      </div>
      <div id="compare-img"><img src="../assets/pic/pic3.png" alt="" class="compare-img"><img src="../assets/pic/pic4.png" alt="" class="compare-img"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  methods: {
    close() {
      $('.close')
        .parent()
        .animate(
          {
            opacity: 0
          },
          100,
          'swing',
          function () {
            $(this).css('display', 'none')
          }
        )
    }
  }
}
</script>

<style lang="less" scoped>
#AI_landform {
  position: absolute;
  display: none;
  margin: 50px 10.55%;
  top: 30px;
  width: 80%;
  height: 75%;
  background-color: #424b5f;
  color: white;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgb(49, 48, 48);
  z-index: 2;
  opacity: 0;
}
.close {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 20px;
  height: 20px;
  z-index: 4;
  font: normal 16px/20px '';
  border-radius: 20px;
  text-align: center;
  color: #726d6d;
  border: 2px solid #726d6d;
  cursor: pointer;
  user-select: none;
}
#deff {
  width: 98%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}
#similarity {
  padding: 0 10px;
  width: 20%;
  background-color: #303644;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
.sim {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 20%;
  font: bold 20px/20px '';
}
.similar {
  margin: 15px 0;
  width: 70%;
  height: 22%;
  color: black;
  font: normal 15px/20px '';
  background: linear-gradient(120deg, #a6c0fe 0%, #6115bd 600%);
  border-radius: 3px;
  border: 1px solid black;
}
#compare-img {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.compare-img {
  height: 90%;
  width: 45%;
}
</style>