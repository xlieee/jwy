<template>
  <div class="login lh-banner">
    <img src="../../assets/img/login-pic.png" alt="" class="login-pic">
    <div class="loginForm">
      <h2>账户登录</h2>
      <Form ref="form" :model="form">
        <Row >
          <i-col span="24">
            <FormItem prop="user" label=''>
                <Input type="text" v-model="form.idCard" placeholder="请输入账号"/>
            </FormItem>
          </i-col>
          <i-col span="24">
            <FormItem prop="pwd" label=''>
                <Input type="text" v-model="form.password" placeholder="请输入密码"/>
            </FormItem>
          </i-col>
          <!-- <i-col span="12">
            <FormItem prop="pwd" label=''>
                <Checkbox v-model="form.single">记住密码</Checkbox>
            </FormItem>
          </i-col> -->
          <i-col span="24">
            <FormItem prop="pwd" label=''>
                <span style='float:right;font-size:14px;color:#0B2444;cursor:pointer' @click="modal = true">忘记密码？</span>
            </FormItem>
          </i-col>
          <i-col span="24">
            <FormItem>
                <Button class="submitBtn" @click="handleSubmit">登录</Button>
            </FormItem>
          </i-col>
          
        </Row>
      </Form>

    </div>
    <Modal
        v-model="modal"
        title="忘记密码"
        @on-ok="ok"
        footer-hide
        class-name="vertical-center-modal"
        @on-cancel="ok">
        <div class="forgetText">
          <img src="../../assets/img/forgetPwd.svg" alt="">
          <p>忘记密码，请联系管理员！</p>
        </div>
    </Modal>
    <div class="waves">
      <canvas width="1160" height="937" style="width: 1160px; height: 937px;"></canvas>
    </div>
  </div>
</template>
<script>

import ShaderProgram from '../../libs/point'
import { login } from '_index/api/user.js'
export default {
  data () {
    return {
      form: {
        idCard  : '',
        password: ''
      },
      modal: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleSubmit () {
      console.log(this.form)
      if (this.form.idCard && this.form.password) {
        sessionStorage.activeIndex = 0
        login(this.form).then(res => {
          console.log(res)
          if (res.code === 0) {
            localStorage.token = res.data.access_token
            this.$router.push('/')
            this.$Message.success(res.msg)
          } else {
            this.$Message.error(res.msg)
          }
        })
        
      }
    },
    ok () {
      this.modal = false
    },
    init () {
      const pointSize = 2.5

      const waves = new ShaderProgram(document.querySelector('.waves'), {
        texture : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQV0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC',
        uniforms: {
          size : { type: 'float', value: pointSize },
          field: { type: 'vec3', value: [0, 0, 0] },
          speed: { type: 'float', value: 5 }
        },
        vertex: `
          #define M_PI 3.1415926535897932384626433832795

          precision highp float;

          attribute vec4 a_position;
          attribute vec4 a_color;

          uniform float u_time;
          uniform float u_size;
          uniform float u_speed;
          uniform vec3 u_field;
          uniform mat4 u_projection;

          varying vec4 v_color;

          void main() {

            vec3 pos = a_position.xyz;

            pos.y += (
              cos(pos.x / u_field.x * M_PI * 8.0 + u_time * u_speed) +
              sin(pos.z / u_field.z * M_PI * 8.0 + u_time * u_speed)
            ) * u_field.y;

            gl_Position = u_projection * vec4( pos.xyz, a_position.w );
            gl_PointSize = ( u_size / gl_Position.w ) * 100.0;

            v_color = a_color;

          }`,
        fragment: `
          precision highp float;

          uniform sampler2D u_texture;

          varying vec4 v_color;

          void main() {

            gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);

          }`,
        onResize (w, h, dpi) {

          const position = [], color = []

          const width = 400 * (w / h)
          const depth = 400
          const height = 3
          const distance = 5

          for (let x = 0; x < width; x += distance) {
            for (let z = 0; z < depth; z += distance) {

              position.push(-width / 2 + x, -30, -depth / 2 + z)
              color.push(0, 1 - (x / width) * 1, 0.5 + x / width * 0.5, z / depth)
            }
          }

          this.uniforms.field = [width, height, depth]

          this.buffers.position = position
          this.buffers.color = color
          this.uniforms.size = (h / 400) * pointSize * dpi

        }
      })
      console.log(waves, 'waves')
    }
    
  }
}
</script>
<style lang="scss">
.login{
  background: url('../../assets/img/login-background.jpg') no-repeat center center;
  height: calc(100vh - 162px);
  position: relative;
  .login-pic{
    position: absolute;
    top: 0;
    left: 0;
  }
  .loginForm{
    width: 440px;
    height: 455px;
    background: #fff;
    box-shadow:0px 6px 14px 0px rgba(11,36,68,0.1);
    border-radius:4px;
    position: absolute;
    top: calc((100% - 455px) / 2);
    right: 8%;
    padding: 50px 40px;
    z-index: 999;
    h2{
      text-align: center;
      font-size:28px;
      font-weight:600;
      color:#0B2444;
      line-height:40px;
      margin-bottom: 40px;
    }
    .ivu-checkbox-wrapper{
      font-size: 14px;
      color: #0B2444;
    }
    .submitBtn{
      background: #F66F6A;
      width: 100%;
      height: 55px;
      font-size: 18px;
      color: #fff;
      border: 0;
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
      border-color: #F66F6A;
      background-color: #F66F6A;
    }
  }
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
    .ivu-modal-header p, .ivu-modal-header-inner{
      font-size: 18px;
    }
    .forgetText{
      overflow: hidden;
      img{
        float: left;
        margin: 21px 33px 23px 62px;
      }
      p{
        float: left;
        font-size:18px;
        font-weight:600;
        color:#303133;
        line-height:117px;
      }
    }
}
.lh-banner{
  width:100vw; 
  height: calc(100vh - 162px);
  background-repeat:no-repeat; 
  background-position:center center; 
  position:relative; 
  background-size:cover;
  overflow:hidden; 
  display:flex; 
  align-items:center; 
  justify-content:center;
}
.lh-banner:before{
  content:''; 
  display:block; 
  width:100%; 
  height:100%; 
  background:rgba(0,0,0,.4); 
  position:absolute; 
  left:0; 
  // top:20%;
}
.waves {
	position:absolute;
	left:0;
	top:0;
	right:0;
  bottom:0;
  canvas:nth-of-type(1){
    display: none;
  }
  canvas:nth-of-type(2){
    position: absolute;
    top: 0
  }
}
canvas {
  display:block;
}
</style>