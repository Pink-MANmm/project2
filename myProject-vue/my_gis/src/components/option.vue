<template>
  <div id="function">
    <div id="mission">任务列表</div>
    <div id="missionList">
      <div id="missions">
        <div v-for="item in Info" key="item.name" class="Mission">
          <div v-if="item.name.length>=6" class="missionName" :lon="item.longitude" :lat="item.latitude" :zoom="item.zoom" :name="item.name">{{item.name.slice(0, 6) + '...'}}</div>
          <div v-else class="missionName" :lon="item.longitude" :lat="item.latitude" :zoom="item.zoom" :name="item.name">{{item.name}}</div>
          <div class="del" @click="del(item)">X</div>
        </div>
      </div>
      <div id="compare" @click="compare" :status="status">
        <div>时间戳对比</div>
      </div>
      <div id="Green">
        <div>植被覆盖率检测</div>
      </div>
    </div>
  </div>
  <delMisssion :delName="delMiss.name" @delConfirm="delConfirm"></delMisssion>
  <addMission @add="add"></addMission>
</template>

<script>
import $ from 'jquery'
import addMission from '@/components/addMission.vue'
import delMisssion from '@/components/delMission.vue'

export default {
  props: {
    compareStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: 'single',
      Info: [],
      delMiss: {}
    }
  },
  methods: {
    compare() {
      if (this.status === 'single') {
        $('.years').css('display', 'block')
        $('#referenceWindow').attr('id', 'referenceWindow1')
        $('#targetWindow').attr('id', 'targetWindow1')
        $('#main').css({ 'margin-right': '308px', 'margin-left': '138px' })
        this.status = 'double'
        $('#compare').children('div').text('取消对比')
      } else if (this.status === 'double') {
        $('.years').css('display', 'none')
        $('#referenceWindow1').attr('id', 'referenceWindow')
        $('#targetWindow1').attr('id', 'targetWindow')
        $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
        this.status = 'single'
        $('#compare').children('div').text('时间戳对比')
      }
      this.$emit('compare', this.status)
    },
    add(miss) {
      this.Info.push(miss)
    },
    del(miss) {
      $('#del-confirm').css('display', 'block')
      this.delMiss = miss
    },
    delConfirm() {
      this.Info.splice(this.Info.indexOf(this.delMiss), 1)
    }
  },
  watch: {
    compareStatus: {
      handler(newVal, oldVal) {
        this.status = newVal
      }
    }
  },
  async created() {
    const { data: Info } = await this.$http.get('/get/')
    this.Info = Info.data
  },
  components: {
    addMission,
    delMisssion
  }
}
</script>

<style lang="less" scoped>
#function {
  position: relative;
  display: none;
  float: right;
  width: 166px;
  height: 100%;
  background-color: rgb(26 17 48);
  border-left: 4px solid black;
  overflow: hidden;
  user-select: none;
}
#mission {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 8%;
  font-size: 3vh;
  color: rgb(207, 196, 219);
  text-align: center;
  background-color: rgb(105 77 192);
  box-shadow: 0 8px 5px rgb(19 18 18);
  user-select: none;
}
#missionList {
  width: 100%;
  height: 92%;
  background-color: rgb(24 17 40);
  box-shadow: 0 8px 5px rgb(19 18 18);
}
#missions {
  height: 87%;
  overflow-y: scroll;
}
#missions::-webkit-scrollbar {
  width: 10px;
  height: 200px;
}
#missions::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #42027e;
}
#missions::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: rgb(24 17 40);
}
#compare {
  position: relative;
  height: 6%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(207, 196, 219);
  text-align: center;
  background-color: rgb(105 77 192);
  font-size: 20px;
  cursor: pointer;
}
#compare:hover {
  background-color: rgb(80, 57, 149);
}
#Green {
  position: relative;
  height: 6%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(207, 196, 219);
  text-align: center;
  background-color: rgb(105 77 192);
  font-size: 20px;
  cursor: pointer;
}
.Mission {
  height: 25px;
  margin: 7px 2px;
  color: rgb(207, 196, 219);
  line-height: 25px;
}
.missionName {
  float: left;
  width: 80%;
  cursor: pointer;
  background-color: rgb(27 32 83);
  box-shadow: 5px 5px 5px rgb(19 18 18);
}
.del {
  float: left;
  width: 20%;
  text-align: center;
  background-color: rgb(18, 21, 58);
  box-shadow: 5px 5px 5px rgb(19 18 18);
  cursor: pointer;
}
</style>