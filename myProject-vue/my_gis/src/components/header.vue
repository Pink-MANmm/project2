<template>
  <div id="navigation">
    <div id="Title">巡天</div>
    <div id="logout" @click="logout">logout</div>
    <div id="Browse" Status="1" class="nav" @click="browse" @mouseenter="showFlag" @mouseleave="hideFlag">
      <div class="flag"></div><span class="nav-text">巡查浏览</span>
    </div>|
    <div id="Missions" class="nav" @click="missions" @mouseenter="showFlag" @mouseleave="hideFlag">
      <div class="flag"></div><span id="com" class="nav-text">任务管理</span>
    </div>|
    <div id="landform" class="nav" @click="landform" @mouseenter="showFlag" @mouseleave="hideFlag">
      <div class="flag"></div><span class="nav-text">地貌变化监测</span>
    </div>|
    <div id="identify" class="nav" @click="identify" @mouseenter="showFlag" @mouseleave="hideFlag">
      <div class="flag"></div><span class="nav-text">目标对象识别</span>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    compareStatus: {
      type: String,
      default: 'single'
    }
  },
  data() {
    return {}
  },
  methods: {
    showFlag(event) {
      event.target.children[0].style.display = 'block'
    },
    hideFlag(event) {
      event.target.children[0].style.display = 'none'
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    browse() {
      $('#AI_landform').css('display', 'none')
      $('#AI_recognize').css('display', 'none')
      $('#position').css('display', 'block')
      $('#content').css('height', '89.75%')
      if ($('#Tog').attr('status') == '3D') {
        $('#Tog').click()
      }
      $('#function').css('display', 'none')
      $('#main').css({ 'margin-right': '0', 'margin-left': '0' })
      $('.years').css('display', 'none')
      if (this.compareStatus === 'double') {
        $('#referenceWindow1').attr('id', 'referenceWindow')
        $('#targetWindow1').attr('id', 'targetWindow')
        this.$emit('compare', 'single')
      }
    },
    missions() {
      $('#AI_landform').css('display', 'none')
      $('#AI_recognize').css('display', 'none')
      $('#position').css('display', 'none')
      $('#content').css('height', '94%')
      if ($('#Tog').attr('status') == '2D') {
        $('#Tog').click()
      }
      $('#function').css('display', 'block')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $('.years').css('display', 'none')
      if (this.compareStatus === 'double') {
        $('#referenceWindow1').attr('id', 'referenceWindow')
        $('#targetWindow1').attr('id', 'targetWindow')
        this.$emit('compare', 'single')
      }
      $('#missions').css('height', '94%')
      $('#compare').css('display', 'flex')
      $('#compare').children('div').text('时间戳对比')
    },
    landform() {
      $('#AI_recognize').css('display', 'none')
      $('#position').css('display', 'none')
      $('#content').css('height', '94%')
      if ($('#Tog').attr('status') == '2D') {
        $('#Tog').click()
      }
      $('#function').css('display', 'block')
      $('#main').css({ 'margin-right': '308px', 'margin-left': '138px' })
      $('.years').css('display', 'block')
      if (this.compareStatus === 'single') {
        $('#referenceWindow').attr('id', 'referenceWindow1')
        $('#targetWindow').attr('id', 'targetWindow1')
        this.$emit('compare', 'double')
      }
      $('#missions').css('height', '100%')
      $('#compare').css('display', 'none')
      $('#AI_landform').css('display', 'block')
      $('#AI_landform').animate(
        {
          opacity: 1
        },
        100,
        'swing',
        function () {}
      )
      $('#4').click()
    },
    identify() {
      $('#AI_landform').css('display', 'none')
      $('#position').css('display', 'none')
      $('#content').css('height', '94%')
      if ($('#Tog').attr('status') == '2D') {
        $('#Tog').click()
      }
      $('#function').css('display', 'block')
      $('#left').css('display', 'block')
      $('#right').css('display', 'none')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '138px' })
      if (this.compareStatus === 'double') {
        $('#referenceWindow1').attr('id', 'referenceWindow')
        $('#targetWindow1').attr('id', 'targetWindow')
        this.$emit('compare', 'single')
      }
      $('#missions').css('height', '100%')
      $('#compare').css('display', 'none')
      $('#AI_recognize').css('display', 'block')
      $('#AI_recognize').animate(
        {
          opacity: 1
        },
        100,
        'swing',
        function () {}
      )
      $('#3').click()
    }
  }
}
</script>

<style lang="less" scoped>
#navigation {
  position: relative;
  height: 6%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 2.25vh;
  color: rgb(108, 106, 106);
  background-color: black;
  text-align: center;
  user-select: none;
}
#Title {
  position: absolute;
  left: 20px;
  width: 90px;
  height: 100%;
  font-size: 4.6vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #a4a7f2;
  font-family: cursive;
  user-select: none;
}
#logout {
  position: absolute;
  right: 20px;
  top: 5.5px;
  width: 90px;
  height: 65%;
  color: white;
  font: normal 20px/30px '';
  background: linear-gradient(120deg, #480cd2 0%, #9c09c8 100%);
  border: 2px solid rgb(116, 24, 135);
  border-radius: 30px;
  cursor: pointer;
  user-select: none;
}
#logout:hover {
  background: linear-gradient(120deg, #9c09c8 0%, #480cd2 100%);
}
#Missions,
#Browse,
#identify,
#landform {
  position: relative;
  display: inline-block;
  height: 100%;
  color: white;
  font-size: 2vh;
  text-align: center;
  width: 130px;
  cursor: pointer;
}
.nav-text{
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flag {
  position: absolute;
  display: none;
  top: -4px;
  height: 20%;
  width: 100%;
  border-radius: 5px;
  background-color: rgb(89, 11, 206);
}
</style>