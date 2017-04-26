<template>
  <div class='sprite-container'>
    <h1>雪碧图合成</h1>
    <div class='sprite-header'>
      <label>文件名: <input class="number" type='text' v-model='saveFileName'></label>
      <label>图片宽: <input class="number" type='number' v-model='canvasWidth'></label>
      <label>图片高: <input class="number" type='number' v-model='canvasHeight'></label>
      图片类型：
      <label>
        png <input type='radio' v-model='imgType' value='png'>
      </label>
      <label>
        jpeg <input type='radio' v-model='imgType' value='jpeg'>
      </label>
      <label v-show="imgType === 'jpeg'">图片质量<input class="number" type='number' v-model.number='quality'></label>
      <div class="btn-group">
        <button class='btn' @click='addImg'>添加图片</button>
        <button class='btn' @click='exportImg'>导出图片</button>
        <button class='btn' @click='saveImg'>缓存本地</button>
      </div>
    </div>
    <ul class='sprite-group'>
      <li class='sprite-item' v-for="(item,index) in imgs">
        <label>选择图片<input type='file' @change='getImg(index,$event)'></label>
        <label>宽度<input class="number" type='number' v-model='item.width'></label>
        <label>高度<input class="number" type='number' v-model='item.height'></label>
        <label>X位置<input class="number" type='number' v-model='item.x'></label>
        <label>Y位置<input class="number" type='number' v-model='item.y'></label>
        <button class='btn' @click='removeImg(index)'>删除</button>
      </li>
    </ul>
  </div>
</template>
<script type='text/babel'>
  export default {
    data () {
      let data = localStorage.getItem('sprite_data')
      if (data) {
        data = JSON.parse(data)
        data.imgs.forEach(function (img) {
          let image = new Image()
          image.src = img.source
          img.src = image
        })

        return data
      }

      return {
        quality: 1,
        imgType: 'png',
        saveFileName: 'demo',
        canvasWidth: 500,
        canvasHeight: 300,
        imgs: [
          {
            src: '',
            width: 50,
            height: 50,
            x: 0,
            y: 0
          }
        ]
      }
    },
    watch: {
      canvasWidth (val) {
        this.$canvas.width = val
        this.draw()
      },

      canvasHeight (val) {
        this.$canvas.height = val
        this.draw()
      },

      imgs: {
        handler () {
          this.draw()
        },
        deep: true
      }
    },
    methods: {
      exportImg () {
        var saveLink = document.createElement('a')
        let type = 'image/' + this.imgType
        saveLink.href = this.$canvas.toDataURL(type, this.quality).replace(type, 'image/octet-stream')
        saveLink.download = this.saveFileName + '.' + this.imgType
        var event = document.createEvent('MouseEvents')
        event.initEvent('click', false, true)
        saveLink.dispatchEvent(event)
      },

      getImg (index, e) {
        this.fileToImage(e.target.files[0]).then((file) => {
          let img = this.imgs[index]
          img.src = file
          img.source = file.src
          img.width = file.width
          img.height = file.height
          this.draw()
        })
      },

      addImg () {
        this.imgs.push({
          src: '',
          width: 50,
          height: 50,
          x: 0,
          y: 0
        })
      },

      removeImg (index) {
        this.imgs.splice(index, 1)
      },

      saveImg () {
        localStorage.setItem('sprite_data', JSON.stringify(this.$data))
      },

      fileToImage (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            let image = new Image()
            image.src = this.result

            image.onload = () => {
              resolve(image)
            }
          }
        })
      },

      draw () {
        this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.imgs.forEach(({src, width, height, x, y}) => {
          if (src) {
            this.cxt.drawImage(src, x, y, width, height)
          }
        })
      }
    },

    mounted () {
      let $canvas = document.createElement('canvas')
      $canvas.setAttribute('width', this.canvasWidth)
      $canvas.setAttribute('height', this.canvasHeight)
      $canvas.setAttribute('class', 'canvas')
      document.body.appendChild($canvas)
      this.cxt = this.context = $canvas.getContext('2d')
      this.$canvas = $canvas
      this.draw()
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  * {
    box-sizing: border-box
    margin 0
  }

  html {
    background: #ffffff
  }

  .canvas {
    margin-left 10px
    background: rgba(0, 0, 0, 0.1)
  }

  .sprite-container {
    padding: 10px
  }

  .number {
    width: 100px
    height: 30px
    padding-left: 5px
  }

  .sprite-header {
    padding-top: 10px
    padding-bottom: 10px
  }

  .sprite-group {
    margin: 30px
  }

  .sprite-item {

  }

  .btn-group {
    float right
  }

  .btn {
    width: 100px
    height: 30px
    line-height: 30px
    text-align: center
    background: #ffffff
    cursor: pointer
    border: none
    outline none
    &:hover {
      color #316ccb
    }
  }
</style>
