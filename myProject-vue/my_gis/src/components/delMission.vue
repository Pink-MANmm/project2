<template>
  <div id="del-confirm">
    <div class="del-line">是否确认删除任务</div>
    <div class="del-line">
      <button id="del-y" @click="confirm">确认</button>
      <button id="del-n" @click="cancel">取消</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    delName: {
      type: String,
      default: ''
    }
  },
  methods: {
    async confirm() {
      this.$http.post('/delete/', { arr: this.delName })
      $('#del-confirm').css('display', 'none')
      this.$emit('delConfirm')
    },
    cancel() {
      $('#del-confirm').css('display', 'none')
    }
  }
}
</script>

<style lang="less" scoped>
#del-confirm {
  position: absolute;
  margin: 60px 38%;
  display: none;
  text-align: center;
  width: 25%;
  height: 85px;
  background-color: rgb(24, 23, 23);
  color: rgb(182, 180, 180);
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgb(49, 48, 48);
  z-index: 3;
  user-select: none;
}
.del-line {
  width: 100%;
  height: 50%;
  font: normal 20px/42.5px '';
}
#del-y {
  float: left;
  width: 50%;
  color: rgb(182, 180, 180);
  background-color: rgb(24, 23, 23);
  border-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  border-top: 2px solid white;
  font: normal 18px/18.4px '';
}
#del-n {
  float: right;
  width: 50%;
  color: rgb(182, 180, 180);
  background-color: rgb(24, 23, 23);
  border-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  border-top: 2px solid white;
  font: normal 18px/18.4px '';
}
#del-y:hover,
#del-n:hover {
  background-color: #2e3031;
}
</style>