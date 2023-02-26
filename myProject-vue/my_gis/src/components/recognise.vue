<template>
  <div id="AI_recognize">
    <div class="close" ref="close" @click="close">X</div>
    <div id="recognize">
      <span id="span">飞机数目 <input type="text" value="12" class="recIn"></span>
      <img src="../assets/pic/pic1.png" alt="" id="imag">
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
#AI_recognize {
  position: absolute;
  display: none;
  margin: 50px 35.5%;
  top: 0;
  width: 30%;
  height: 88%;
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
#recognize {
  width: 100%;
  height: 100%;
}
#span {
  position: absolute;
  top: 3%;
  left: 2.6%;
  font: normal 15px/30px '';
}
.recIn {
  height: 3%;
  width: 120px;
  background: linear-gradient(120deg, #a6c0fe 0%, #6115bd 600%);
  font: normal 15px/30px '';
  color: black;
  border: 1px solid black;
  border-radius: 5px;
}
#imag {
  position: absolute;
  width: 95%;
  height: 85%;
  top: 10%;
  left: 2.6%;
  border: 2px solid black;
  border-radius: 5px;
}
</style>