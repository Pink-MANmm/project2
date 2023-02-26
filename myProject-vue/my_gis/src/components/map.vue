<template>
  <div id="main">
    <div id="targetWindow" class="esri-widget">
      <button id="screenshotBtn" class="action-button esri-widget" aria-label="Select screenshot area" title="Select screenshot area">
        Select screenshot area
      </button>
    </div>
    <div id="referenceWindow"></div>
    <div id="screenshotDiv" class="hide">
      <img class="js-screenshot-image" />
      <div>
        <label>将图片命名为 </label><input type="text" placeholder="图片名称" id="textInput" autofocus />
      </div>
      <button id="downloadBtn" class="action-button" aria-label="Download image" title="Download image">
        下载图片
      </button>
      <button id="closeBtn" class="action-button" aria-label="Back to webscene" title="Back to webscene">
        返回视图
      </button>
    </div>
    <div id="maskDiv" class="hide screenshotCursor"></div>
  </div>
</template>

<script>
import esriConfig from '@arcgis/core/config'
import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import * as watchUtils from '@arcgis/core/core/watchUtils'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'
import WMTSLayer from '@arcgis/core/layers/WMTSLayer'
import Search from '@arcgis/core/widgets/Search'
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils'

import $ from 'jquery'

export default {
  props: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {
    esriConfig.apiKey = 'AAPK9f8135a480454ea4b70232ccf6a79b04DEexFeYOe35LNlHDY3w4Kx1ZcFXzRnHsfCa6K3dH9eHIp_ESWxamC0WaKNxqdvLf'

    //1.底图id资源切换
    function changeBasemap(id) {
      const Layer = new WMTSLayer({
        portalItem: {
          id: String(id)
        }
      })

      const basemap = new Basemap({
        baseLayers: [Layer]
      })

      return basemap
    }

    //2.2D巡查功能
    const layer = new TileLayer({
      url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
    })

    const toggleBasemap = new Basemap({
      baseLayers: [layer]
    })

    //3.2D与3D切换功能
    $('#position').on('click', '#Tog', function () {
      if ($(this).attr('status') == '2D') {
        targetWindowMap.basemap = changeBasemap('8dcb11bfabb2493b893e5be933fcea3d')
        $(this).attr('status', '3D')
        $('#toggle-img').attr('src', require('@/assets/logo/badge-3d-fill.svg'))
      } else {
        targetWindowMap.basemap = toggleBasemap
        $(this).attr('status', '2D')
        $('#toggle-img').attr('src', require('@/assets/logo/badge-3d.svg'))
      }
    })

    //4.定义目标视图与参照视图
    const targetWindowMap = (this.targetWindowMap = new Map({
      basemap: toggleBasemap,
      ground: 'world-elevation'
    }))

    const targetWindowView = new SceneView({
      container: 'targetWindow',
      map: targetWindowMap,
      center: [104.15442473620293, 35.943228829155416],
      zoom: 15
    })

    targetWindowView.ui.remove('attribution')

    const referenceWindowMap = new Map({
      basemap: changeBasemap('8dcb11bfabb2493b893e5be933fcea3d'),
      ground: 'world-elevation'
    })
    const referenceWindowView = new SceneView({
      map: referenceWindowMap,
      container: 'referenceWindow',
      center: [104.15442473620293, 35.943228829155416],
      zoom: 15,
      ui: {
        components: []
      },
      popup: {
        dockOptions: {
          position: 'top-left'
        }
      }
    })

    //5.目标视图与参照视图之间的同步对比功能

    referenceWindowView.on(['drag', 'mouse-wheel'], function (event) {
      event.stopPropagation()
    })
    //referenceWindow通过targetWindow来控制地图移动
    targetWindowView.when(function () {
      referenceWindowView.when(function () {
        watchUtils.watch(targetWindowView, 'extent', function (extent) {
          //stationary表示targetWindowView中的地图移动完毕
          if (targetWindowView.stationary) {
            //将显示中心同步
            referenceWindowView.goTo({
              center: targetWindowView.center
            })
          }
          //两个对比窗口的显示范围同步
          referenceWindowView.extent = extent
        })
      })
    })

    //6.地点搜索功能

    const search = new Search({
      //Add Search widget
      view: targetWindowView
    })
    targetWindowView.ui.add(search, 'top-right')

    //7.经纬度获取

    targetWindowView.on('click', function (e) {
      let geom = webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y)
      $('.pos:eq(0)').val(geom[0])
      $('.pos:eq(1)').val(geom[1])
      $('.pos:eq(2)').val(targetWindowView.zoom)
    })

    //9.截图功能

    // 触发区域选择模式的按钮
    const screenshotBtn = document.getElementById('screenshotBtn')

    // 用于选择区域的橙色蒙板
    const maskDiv = document.getElementById('maskDiv')

    // 用于我们在其中显示打印预览的标签
    const screenshotDiv = document.getElementById('screenshotDiv')

    // 下载按钮
    const downloadBtn = document.getElementById('downloadBtn')

    // 用于隐藏打印预览的按钮
    const closeBtn = document.getElementById('closeBtn')

    //添加截图ui按钮
    targetWindowView.ui.add(screenshotBtn, 'bottom-left')

    // 添加事件监听器以触发区域选择模式
    screenshotBtn.addEventListener('click', () => {
      screenshotBtn.classList.add('active')
      targetWindowView.container.classList.add('screenshotCursor')
      let area = null

      // 监听拖动事件并计算所选区域
      const dragHandler = targetWindowView.on('drag', event => {
        // 防止事件冒泡
        event.stopPropagation()

        // 判断用户是否开始拖动或正在拖动
        if (event.action !== 'end') {
          // 通过拖动光标来计算所选区域的范围
          const xmin = clamp(Math.min(event.origin.x, event.x), 0, targetWindowView.width)
          const xmax = clamp(Math.max(event.origin.x, event.x), 0, targetWindowView.width)
          const ymin = clamp(Math.min(event.origin.y, event.y), 0, targetWindowView.height)
          const ymax = clamp(Math.max(event.origin.y, event.y), 0, targetWindowView.height)
          if (parseInt($('#compare').attr('status')) === 1) {
            area = {
              x: xmin,
              y: ymin,
              width: xmax - xmin,
              height: ymax - ymin
            }
          } else {
            area = {
              x: xmin,
              y: ymin,
              width: xmax - xmin,
              height: ymax - ymin
            }
          }
          // 设置标记所选区域的 div 元素的位置
          setMaskPosition(area)
        }
        // 判断用户是否停止拖动
        else {
          // 从场景视图中删除拖动事件监听器
          dragHandler.remove()
          // 拍摄所选区域的屏幕截图
          targetWindowView.takeScreenshot({ area: area, format: 'png' }).then(screenshot => {
            // 展示截图预览
            showPreview(screenshot)

            // 创建要下载的图像
            downloadBtn.onclick = () => {
              const text = document.getElementById('textInput').value
              const Layer = new WMTSLayer({
                portalItem: {
                  id: String($('.active').attr('id'))
                }
              })
              // 如果存在命名，则添加给截图
              if (text) {
                const dataUrl = getImageWithText(screenshot, text)
                downloadImage(`${text}.png`, dataUrl)
              }
              // 否则仅下载截图
              else {
                downloadImage(`${Layer.portalItem.title}.png`, screenshot.dataUrl)
              }
            }

            // 屏幕截图模式已禁用
            screenshotBtn.classList.remove('active')
            targetWindowView.container.classList.remove('screenshotCursor')
            setMaskPosition(null)
          })
        }
      })

      function setMaskPosition(area) {
        if (area) {
          maskDiv.classList.remove('hide')
          maskDiv.style.left = `${area.x}px`
          maskDiv.style.top = `${area.y}px`
          maskDiv.style.width = `${area.width}px`
          maskDiv.style.height = `${area.height}px`
        } else {
          maskDiv.classList.add('hide')
        }
      }

      function clamp(value, from, to) {
        return value < from ? from : value > to ? to : value
      }
    })

    // 创建将追加到 DOM 的图像
    // 以便用户可以预览他们将下载的内容
    function showPreview(screenshot) {
      screenshotDiv.classList.remove('hide')
      // 添加屏幕截图数据URL作为图像元素的src
      const screenshotImage = document.getElementsByClassName('js-screenshot-image')[0]
      screenshotImage.width = screenshot.data.width
      screenshotImage.height = screenshot.data.height
      screenshotImage.src = screenshot.dataUrl
    }

    // 返回通过向 Web 场景图像添加自定义文本而创建的新图像
    function getImageWithText(screenshot, text) {
      const imageData = screenshot.data

      // 要将文本添加到屏幕截图中，我们创建了一个新的画布元素
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = imageData.height
      canvas.width = imageData.width

      // 将屏幕截图数据添加到画布
      context.putImageData(imageData, 0, 0)
      context.font = '20px Arial'
      context.fillStyle = '#000'
      context.fillRect(0, imageData.height - 40, context.measureText(text).width + 20, 30)

      // 从文本输入标签中添加文本
      context.fillStyle = '#fff'
      context.fillText(text, 10, imageData.height - 20)

      return canvas.toDataURL()
    }

    function downloadImage(filename, dataUrl) {
      // 下载在微软浏览器中的处理方式不同
      // 因为不支持元素的下载属性<a>
      if (!window.navigator.msSaveOrOpenBlob) {
        // 在支持下载属性的浏览器中
        // 创建一个链接，编程单击将触发下载
        const element = document.createElement('a')
        element.setAttribute('href', dataUrl)
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      } else {
        // 对于 MS 浏览器，可将数据转换为 Blob
        const byteString = atob(dataUrl.split(',')[1])
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: mimeString })

        // 下载文件
        window.navigator.msSaveOrOpenBlob(blob, filename)
      }
    }
    // 单击时隐藏打印预览 html 元素
    closeBtn.addEventListener('click', () => {
      screenshotDiv.classList.add('hide')
    })
    //10.任务切换功能（单击不同任务，在视图中显示对应的任务）
    $('#missions').on('click', '.missionName', function () {
      console.log($(this))
      $(this).addClass('act').parents().siblings().children().removeClass('act')
      targetWindowView.center = [parseFloat($(this).attr('lon')), parseFloat($(this).attr('lat'))]
      targetWindowView.zoom = parseInt($(this).attr('zoom'))
      referenceWindowView.center = [parseFloat($(this).attr('lon')), parseFloat($(this).attr('lat'))]
      referenceWindowView.zoom = parseInt($(this).attr('zoom'))
    })

    //11.根据年份，切换底图资源
    $('body').on('click', '#left .year', function () {
      $(this).addClass('active').siblings().removeClass('active')
      targetWindowMap.basemap = changeBasemap($(this).attr('id'))
    })

    $('body').on('click', '#right .year', function () {
      $(this).addClass('active').siblings().removeClass('active')
      referenceWindowMap.basemap = changeBasemap($(this).attr('id'))
    })
  }
}
</script>

<style lang="less" scoped>
#main {
  position: relative;
  margin-left: 0;
  height: 100%;
}

#referenceWindow {
  float: left;
  width: 0;
  height: 100%;
  margin: 0;
  padding: 0;
}

#targetWindow {
  float: left;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#targetWindow1 {
  border-right: 4px solid black;
}

#referenceWindow1,
#targetWindow1 {
  float: left;
  width: 50%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.action-button {
  padding: 0.6em;
  border: 1px solid #0079c1;
  text-align: center;
  background-color: white;
  cursor: pointer;
}
.action-button:hover,
.action-button:focus {
  background: #0079c1;
  color: white;
}
#screenshotDiv {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}
#screenshotDiv > * {
  margin: 0.5em;
}
#maskDiv {
  position: absolute;
  background: rgba(255, 51, 0, 0.1);
  border: 2px dashed rgb(255, 51, 0);
}
.hide {
  display: none;
}
</style>