require([
  "esri/config",
  "esri/Map",
  "esri/views/SceneView",
  "esri/core/watchUtils",

  "esri/Basemap",
  "esri/layers/TileLayer",
  "esri/layers/WMTSLayer",
  "esri/widgets/Search",
  "esri/geometry/support/webMercatorUtils"
], function (esriConfig, Map, SceneView, watchUtils, Basemap, TileLayer, WMTSLayer, Search, webMercatorUtils) {

  esriConfig.apiKey = "AAPK9f8135a480454ea4b70232ccf6a79b04DEexFeYOe35LNlHDY3w4Kx1ZcFXzRnHsfCa6K3dH9eHIp_ESWxamC0WaKNxqdvLf";

  //1.底图id资源切换
  function changeBasemap(id) {
    const Layer = new WMTSLayer({
      portalItem: {
        id: String(id)
      }
    })

    const basemap = new Basemap({
      baseLayers: [
        Layer,
      ]
    });

    return basemap
  }

  //2.2D巡查功能
  const layer = new TileLayer({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer"
  });

  const toggleBasemap = new Basemap({
    baseLayers: [
      layer,
    ]
  });

  //3.2D与3D切换功能
  $('#position').on('click', '#Tog', function () {
    if ($(this).attr('status') == '1') {
      targetWindowMap.basemap = changeBasemap('8dcb11bfabb2493b893e5be933fcea3d')
      $(this).attr('status', '2')
      $('#toggle-img').attr('src', '../static/logo/badge-3d-fill.svg')
    } else {
      targetWindowMap.basemap = toggleBasemap
      $(this).attr('status', '1')
      $('#toggle-img').attr('src', '../static/logo/badge-3d.svg')
    }
  })

  //4.定义目标视图与参照视图
  const targetWindowMap = new Map({
    basemap: toggleBasemap,
    ground: "world-elevation",
  });

  const targetWindowView = new SceneView({
    container: "targetWindow",
    map: targetWindowMap,
    center: [104.15442473620293, 35.943228829155416],
    zoom: 15
  });

  const referenceWindowMap = new Map({
    basemap: changeBasemap('8dcb11bfabb2493b893e5be933fcea3d'),
    ground: "world-elevation",
  });
  const referenceWindowView = new SceneView({
    map: referenceWindowMap,
    container: "referenceWindow",
    center: [104.15442473620293, 35.943228829155416],
    zoom: 15,
    ui: {
      components: []
    },
    popup: {
      dockOptions: {
        position: "top-left"
      }
    }
  });

  //5.目标视图与参照视图之间的同步对比功能

  referenceWindowView.on(["drag", "mouse-wheel"], function (event) {
    event.stopPropagation()
  });
  //referenceWindow通过targetWindow来控制地图移动
  targetWindowView.when(function () {
    referenceWindowView.when(function () {
      watchUtils.watch(targetWindowView, "extent", function (extent) {
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
  });

  //6.地点搜索功能

  const search = new Search({  //Add Search widget
    view: targetWindowView
  });
  targetWindowView.ui.add(search, "top-right");

  //7.经纬度获取

  targetWindowView.on("click", function (e) {
    geom = webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y);
    $('.pos:eq(0)').val(geom[0])
    $('.pos:eq(1)').val(geom[1])
    $('.pos:eq(2)').val(targetWindowView.zoom)
  });

  //8.根据年份，切换底图资源

  $('body').on('click', '#years .year', function () {
    $(this).addClass('active').siblings().removeClass('active')
    targetWindowMap.basemap = changeBasemap($(this).attr('id'))
  })

  $('body').on('click', '#years_right .year', function () {
    $(this).addClass('active').siblings().removeClass('active')
    referenceWindowMap.basemap = changeBasemap($(this).attr('id'))
  })

  //9.截图功能

  // 触发区域选择模式的按钮
  const screenshotBtn = document.getElementById("screenshotBtn");

  // 用于选择区域的橙色蒙板
  const maskDiv = document.getElementById("maskDiv");

  // 用于我们在其中显示打印预览的标签
  const screenshotDiv = document.getElementById("screenshotDiv");

  // 下载按钮
  const downloadBtn = document.getElementById("downloadBtn");

  // 用于隐藏打印预览的按钮
  const closeBtn = document.getElementById("closeBtn");

  //添加截图ui按钮
  targetWindowView.ui.add(screenshotBtn, "bottom-left");

  // 添加事件监听器以触发区域选择模式
  screenshotBtn.addEventListener("click", () => {
    screenshotBtn.classList.add("active");
    targetWindowView.container.classList.add("screenshotCursor");
    let area = null;

    // 监听拖动事件并计算所选区域
    const dragHandler = targetWindowView.on("drag", (event) => {
      // 防止事件冒泡
      event.stopPropagation();

      // 判断用户是否开始拖动或正在拖动
      if (event.action !== "end") {
        // 通过拖动光标来计算所选区域的范围
        const xmin = clamp(Math.min(event.origin.x, event.x), 0, targetWindowView.width);
        const xmax = clamp(Math.max(event.origin.x, event.x), 0, targetWindowView.width);
        const ymin = clamp(Math.min(event.origin.y, event.y), 0, targetWindowView.height);
        const ymax = clamp(Math.max(event.origin.y, event.y), 0, targetWindowView.height);
        if (parseInt($('#compare').attr('status')) === 1) {
          area = {
            x: xmin,
            y: ymin + 45,
            width: xmax - xmin,
            height: ymax - ymin
          };
        } else {
          area = {
            x: xmin + 138,
            y: ymin + 45,
            width: xmax - xmin,
            height: ymax - ymin
          };
        }
        // 设置标记所选区域的 div 元素的位置
        setMaskPosition(area);
      }
      // 判断用户是否停止拖动
      else {
        // 从场景视图中删除拖动事件监听器
        dragHandler.remove();
        // 拍摄所选区域的屏幕截图
        targetWindowView.takeScreenshot({ area: area, format: "png" }).then((screenshot) => {
          // 展示截图预览
          showPreview(screenshot);

          // 创建要下载的图像
          downloadBtn.onclick = () => {
            const text = document.getElementById("textInput").value;
            const Layer = new WMTSLayer({
              portalItem: {
                id: String($('.active').attr('id'))
              }
            })
            // 如果存在命名，则添加给截图
            if (text) {
              const dataUrl = getImageWithText(screenshot, text);
              downloadImage(`${text}.png`, dataUrl);
            }
            // 否则仅下载截图
            else {
              downloadImage(`${Layer.portalItem.title}.png`, screenshot.dataUrl);
            }
          };

          // 屏幕截图模式已禁用
          screenshotBtn.classList.remove("active");
          targetWindowView.container.classList.remove("screenshotCursor");
          setMaskPosition(null);
        });
      }
    });

    function setMaskPosition(area) {
      if (area) {
        maskDiv.classList.remove("hide");
        maskDiv.style.left = `${area.x}px`;
        maskDiv.style.top = `${area.y}px`;
        maskDiv.style.width = `${area.width}px`;
        maskDiv.style.height = `${area.height}px`;
      } else {
        maskDiv.classList.add("hide");
      }
    }

    function clamp(value, from, to) {
      return value < from ? from : value > to ? to : value;
    }
  });

  // 创建将追加到 DOM 的图像
  // 以便用户可以预览他们将下载的内容
  function showPreview(screenshot) {
    screenshotDiv.classList.remove("hide");
    // 添加屏幕截图数据URL作为图像元素的src
    const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
    screenshotImage.width = screenshot.data.width;
    screenshotImage.height = screenshot.data.height;
    screenshotImage.src = screenshot.dataUrl;
  }

  // 返回通过向 Web 场景图像添加自定义文本而创建的新图像
  function getImageWithText(screenshot, text) {
    const imageData = screenshot.data;

    // 要将文本添加到屏幕截图中，我们创建了一个新的画布元素
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = imageData.height;
    canvas.width = imageData.width;

    // 将屏幕截图数据添加到画布
    context.putImageData(imageData, 0, 0);
    context.font = "20px Arial";
    context.fillStyle = "#000";
    context.fillRect(0, imageData.height - 40, context.measureText(text).width + 20, 30);

    // 从文本输入标签中添加文本
    context.fillStyle = "#fff";
    context.fillText(text, 10, imageData.height - 20);

    return canvas.toDataURL();
  }

  function downloadImage(filename, dataUrl) {
    // 下载在微软浏览器中的处理方式不同
    // 因为不支持元素的下载属性<a>
    if (!window.navigator.msSaveOrOpenBlob) {
      // 在支持下载属性的浏览器中
      // 创建一个链接，编程单击将触发下载
      const element = document.createElement("a");
      element.setAttribute("href", dataUrl);
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // 对于 MS 浏览器，可将数据转换为 Blob
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // 下载文件
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
  }
  // 单击时隐藏打印预览 html 元素
  closeBtn.addEventListener("click", () => {
    screenshotDiv.classList.add("hide");
  });

  //10.登出功能
  $('#logout').on('click', function () {
    location.href = '/'
  })

  //11.获取数据库数据并存储到浏览器的localStorage中
  function getLocaldata() {
    $.ajax({
      url: '/get/',
      type: 'get',
      async: false,
      success: function (data) {
        let Data = data['data']
        if (Data) {
          localStorage.setItem('data', JSON.stringify(Data))
        } else {
          let arr = [
            { name: '创建您的任务', longitude: 100, latitude: 40, zoom: 5 },
          ]
          localStorage.setItem('data', JSON.stringify(arr))
        }
      }
    })
    return localStorage.getItem('data')
  }
  let arr = JSON.parse(getLocaldata())

  //12.任务列表发生变动时的更新渲染功能
  function render() {
    $('#missions').empty()
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name.length >= 6) {
        const $info = $('<div class="Mission"><div id="' + (i + 1) + '" class="missionName" lon="' + arr[i].longitude + '" lat="' + arr[i].latitude + '" zoom="' + arr[i].zoom + '" name="' + arr[i].name + '">' + arr[i].name.slice(0, 6) + '...</div><div id="' + i + '" class="del">X</div></div>')
        $('#missions').append($info)
      } else {
        const $info = $('<div class="Mission"><div id="' + (i + 1) + '" class="missionName" lon="' + arr[i].longitude + '" lat="' + arr[i].latitude + '" zoom="' + arr[i].zoom + '" name="' + arr[i].name + '">' + arr[i].name + '</div><div id="' + i + '" class="del">X</div></div>')
        $('#missions').append($info)
      }
    }
    $('#1').addClass('act')
  }
  render()

  //13.添加任务中的确认项
  $('.line:eq(3)').on('click', '#add', function () {
    let miss = {
      name: $('#Name').val(),
      longitude: $('#Lon').val(),
      latitude: $('#Lat').val(),
      zoom: $("#Zoom option:selected").text(),
    }
    if (miss.name != '' && miss.longitude != '' && miss.latitude != '') {
      arr.push(miss)
      $.ajax({
        url: '/add/',
        type: 'POST',
        data: { 'arr': JSON.stringify(arr) },
        success: function (data) {
        }
      })
      localStorage.setItem('data', JSON.stringify(arr))
      $('#missions').empty()
      render()
      $('#Name').val('')
      $('#Lon').val('')
      $('#Lat').val('')
      $('#Zoom').val('1')
      $('#option').css('display', 'none')
    } else {
      alert('关键内容不能为空')
    }
  })

  //14.添加任务中的取消项
  $('.line:eq(3)').on('click', '#cancel', function () {
    $('#Name').val('')
    $('#Lon').val('')
    $('#Lat').val('')
    $('#Zoom').val('1')
    $('#option').css('display', 'none')
  })

  //15.单击任务添加按钮，显示添加任务的详细选项
  $('#position').on('click', '#addMission', function () {
    $('#option').css('display', 'block')
  })

  //16.管理界面中的删除任务功能
  $('#function').on('click', '#missionList', function (e) {
    if (e.target.className === 'del') {
      //显示删除任务的确认信息
      $('#del-confirm').css('display', 'block')
      //确认删除
      $('#del-y').on('click', function () {
        arr.splice(e.target.id, 1)
        $.ajax({
          url: '/delete/',
          type: 'POST',
          data: { 'arr': JSON.stringify(arr) },
          success: function (data) {
          }
        })
        //同步删除浏览器localStorage中的任务信息
        localStorage.setItem('data', JSON.stringify(arr))
        render()
        $('#del-confirm').css('display', 'none')
      })
      //取消删除
      $('#del-n').on('click', function () {
        $('#del-confirm').css('display', 'none')
      })
    }
  })

  //17.任务切换功能（单击不同任务，在视图中显示对应的任务）
  $('#missions').on('click', '.missionName', function () {
    $(this).addClass('act').parents().siblings().children().removeClass('act')
    targetWindowView.center = [parseFloat($(this).attr('lon')), parseFloat($(this).attr('lat'))]
    targetWindowView.zoom = parseInt($(this).attr('zoom'))
    referenceWindowView.center = [parseFloat($(this).attr('lon')), parseFloat($(this).attr('lat'))]
    referenceWindowView.zoom = parseInt($(this).attr('zoom'))
  })

  //18.任务管理中的时间戳对比功能
  $('#compare').on('click', function () {
    if (parseInt($(this).attr('status')) == '1') {
      $('#years').css('display', 'block')
      $('#years_right').css('display', 'block')
      $('#referenceWindow').attr('id', 'referenceWindow1')
      $('#targetWindow').attr('id', 'targetWindow1')
      $('#main').css({ 'margin-right': '308px', 'margin-left': '138px' })
      $(this).attr('status', '2')
      $(this).children('span').text('取消对比')
    } else if (parseInt($(this).attr('status')) == '2') {
      $('#years').css('display', 'none')
      $('#years_right').css('display', 'none')
      $('#referenceWindow1').attr('id', 'referenceWindow')
      $('#targetWindow1').attr('id', 'targetWindow')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $(this).attr('status', '1')
      $(this).children('span').text('时间戳对比')
    } else {
      $('#years').css('display', 'none')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $(this).attr('status', '1')
    }
  })

  //19.为导航栏不同功能添加鼠标选中时的交互响应
  $('.nav').hover(
    function () { $(this).children('div').css('display', 'block') },
    function () { $(this).children('div').css('display', 'none') }
  )
  $('#AI_landform').css('display', 'none')
  $('#AI_recognize').css('display', 'none')

  //20.单击切换至巡查浏览页面
  $('#Browse').on('click', function () {
    $('#AI_landform').css('display', 'none')
    $('#AI_recognize').css('display', 'none')
    $('#position').css('display', 'block')
    $('#content').css('height', '88%')
    if ($('#Tog').attr('status') == '2') {
      $('#Tog').click()
    }
    if ($('#function').attr('status') === '2') {
      $('#function').css('display', 'none')
      $('#main').css('margin-right', '0')
      $('#function').attr('status', '1')
    }
    if ($('#compare').attr('status') === '2') {
      $('#years').css('display', 'none')
      $('#years_right').css('display', 'none')
      $('#referenceWindow1').attr('id', 'referenceWindow')
      $('#targetWindow1').attr('id', 'targetWindow')
      $('#main').css({ 'margin-right': '0', 'margin-left': '0' })
      $('#compare').attr('status', '1')
    } else if ($('#compare').attr('status') === '3') {
      $('#years').css('display', 'none')
      $('#main').css({ 'margin-right': '0', 'margin-left': '0' })
      $('#compare').attr('status', '1')
    }
  })

  //21.单击切换至任务管理页面
  $('#Missions').on('click', function () {
    $('#AI_landform').css('display', 'none')
    $('#AI_recognize').css('display', 'none')
    $('#position').css('display', 'none')
    $('#content').css('height', '94%')
    if ($('#Tog').attr('status') == '1') {
      $('#Tog').click()
    }
    if ($('#function').attr('status') === '1') {
      $('#function').css('display', 'block')
      $('#main').css('margin-right', '170px')
      $('#function').attr('status', '2')
    }
    if ($('#compare').attr('status') === '2') {
      $('#years').css('display', 'none')
      $('#years_right').css('display', 'none')
      $('#referenceWindow1').attr('id', 'referenceWindow')
      $('#targetWindow1').attr('id', 'targetWindow')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $('#compare').attr('status', '1')
    } else if ($('#compare').attr('status') === '3') {
      $('#years').css('display', 'none')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $('#compare').attr('status', '1')
    }
    $('#missions').css('height', '94%')
    $('#compare').css('display', 'flex')
  })

  //22.地貌变化与目标识别详细界面的关闭功能
  $('.close').on('click', function () {
    $(this).parent().animate({
      opacity: 0
    }, 100, 'swing', function () {
      $(this).css('display', 'none')
    })
  })

  //23.单击切换至地貌变化监测页面
  $('#landform').on('click', function () {
    $('#AI_recognize').css('display', 'none')
    $('#position').css('display', 'none')
    $('#content').css('height', '94%')
    if ($('#Tog').attr('status') == '1') {
      $('#Tog').click()
    }
    if ($('#function').attr('status') === '1') {
      $('#function').css('display', 'block')
      $('#main').css('margin-right', '170px')
      $('#function').attr('status', '2')
    }
    if ($('#compare').attr('status') === '1') {
      $('#years').css('display', 'block')
      $('#years_right').css('display', 'block')
      $('#referenceWindow').attr('id', 'referenceWindow1')
      $('#targetWindow').attr('id', 'targetWindow1')
      $('#main').css({ 'margin-right': '308px', 'margin-left': '138px' })
      $('#compare').attr('status', '2')
    } else if ($('#compare').attr('status') === '3') {
      $('#years_right').css('display', 'block')
      $('#referenceWindow').attr('id', 'referenceWindow1')
      $('#targetWindow').attr('id', 'targetWindow1')
      $('#main').css({ 'margin-right': '308px', 'margin-left': '138px' })
      $('#compare').attr('status', '2')
    }
    $('#missions').css('height', '100%')
    $('#compare').css('display', 'none')
    $('#AI_landform').css('display', 'block')
    $('#AI_landform').animate({
      opacity: 1
    }, 100, 'swing', function () {
    })
    $('#4').click()
  })

  //24.单击切换至目标对象识别页面
  $('#identify').on('click', function () {
    $('#AI_landform').css('display', 'none')
    $('#position').css('display', 'none')
    $('#content').css('height', '94%')
    if ($('#Tog').attr('status') == '1') {
      $('#Tog').click()
    }
    if ($('#function').attr('status') === '1') {
      $('#function').css('display', 'block')
      $('#main').css('margin-right', '170px')
      $('#function').attr('status', '2')
    }
    if ($('#compare').attr('status') === '1') {
      $('#years').css('display', 'block')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '138px' })
      $('#compare').attr('status', '3')
    } else if ($('#compare').attr('status') === '2') {
      $('#years_right').css('display', 'none')
      $('#referenceWindow1').attr('id', 'referenceWindow')
      $('#targetWindow1').attr('id', 'targetWindow')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '138px' })
      $('#compare').attr('status', '3')
    }
    $('#missions').css('height', '100%')
    $('#compare').css('display', 'none')
    $('#AI_recognize').css('display', 'block')
    $('#AI_recognize').animate({
      opacity: 1
    }, 100, 'swing', function () {
    })
    $('#3').click()
  })
  //25.单击切换到自然景区页面
  $('#attractions').on('click', function () {
    $('#AI_landform').css('display', 'none')
    $('#AI_recognize').css('display', 'none')
    $('#position').css('display', 'none')
    $('#content').css('height', '94%')
    $('#compare').css('display', 'none')
    if ($('#Tog').attr('status') == '1') {
      $('#Tog').click()
    }
    if ($('#function').attr('status') === '1') {
      $('#function').css('display', 'block')
      $('#main').css('margin-right', '170px')
      $('#function').attr('status', '2')
    }
    if ($('#Green').attr('status') === '2') {
      $('#years').css('display', 'none')
      $('#years_right').css('display', 'none')
      $('#referenceWindow1').attr('id', 'referenceWindow')
      $('#targetWindow1').attr('id', 'targetWindow')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $('#Green').attr('status', '1')
    } else if ($('#Green').attr('status') === '3') {
      $('#years').css('display', 'none')
      $('#main').css({ 'margin-right': '170px', 'margin-left': '0' })
      $('#Green').attr('status', '1')
    }
    $('#missions').css('height', '94%')
    $('#Green').css('display', 'flex')
  })
});