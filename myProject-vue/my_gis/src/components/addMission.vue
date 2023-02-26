<template>
  <div id="option">
    <div class="line">
      <p id="p1">任务名称</p><input type="text" id="Name">
    </div>
    <div class="line">
      <p id="p2">经度</p><input type="text" id="Lon">
      <p id="p2">纬度</p><input type="text" id="Lat">
    </div>
    <div class="line">
      <p id="p3">缩放比例</p><select name="" id="Zoom">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="1">3</option>
        <option value="1">4</option>
        <option value="1">5</option>
        <option value="1">6</option>
        <option value="1">7</option>
        <option value="1">8</option>
        <option value="1">9</option>
        <option value="1">10</option>
        <option value="1">11</option>
        <option value="1">12</option>
        <option value="1">13</option>
        <option value="1">14</option>
        <option value="1">15</option>
        <option value="1">16</option>
        <option value="1">17</option>
        <option value="1">18</option>
      </select>
    </div>
    <div class="line">
      <button id="add" @click="add">添加</button>
      <button id="cancel" @click="cancel">取消</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  methods: {
    async add() {
      let miss = {
        name: $('#Name').val(),
        longitude: $('#Lon').val(),
        latitude: $('#Lat').val(),
        zoom: $('#Zoom option:selected').text()
      }
      if (miss.name != '' && miss.longitude != '' && miss.latitude != '') {
        const { data: res } = await this.$http.post('/add/', { arr: miss })
        console.log(res)
        if (res === '添加成功') {
          this.$emit('add', miss)
        } else if (res === '添加失败') {
        }
        $('#Name').val('')
        $('#Lon').val('')
        $('#Lat').val('')
        $('#Zoom').val('1')
        $('#option').css('display', 'none')
      } else {
        alert('关键内容不能为空')
      }
    },
    cancel() {
      $('#Name').val('')
      $('#Lon').val('')
      $('#Lat').val('')
      $('#Zoom').val('1')
      $('#option').css('display', 'none')
    }
  }
}
</script>

<style lang="less" scoped>
#option {
  position: absolute;
  margin: 60px 30%;
  display: none;
  width: 40%;
  height: 26%;
  background-color: rgb(24, 23, 23);
  color: rgb(182, 180, 180);
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgb(49, 48, 48);
  z-index: 3;
  user-select: none;
}
.line {
  width: 100%;
  height: 25%;
}
#p1 {
  text-align: center;
  display: inline-block;
  width: 20%;
}
#p2 {
  text-align: center;
  display: inline-block;
  width: 15%;
}
#Name {
  width: 75%;
}
#Lat,
#Lon {
  display: inline-block;
  width: 31.52%;
}
#p3 {
  text-align: center;
  display: inline-block;
  width: 20.5%;
}
#Zoom {
  width: 10%;
}
#add {
  float: left;
  width: 50%;
  color: rgb(182, 180, 180);
  background-color: rgb(24, 23, 23);
  border-color: rgba(0, 0, 0, 0);
  cursor: pointer;
}

#add:hover,
#cancel:hover {
  background-color: #2e3031;
}
#cancel {
  width: 50%;
  color: rgb(182, 180, 180);
  background-color: rgb(24, 23, 23);
  border-color: rgba(0, 0, 0, 0);
  cursor: pointer;
}
</style>