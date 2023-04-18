<template>
  <!-- main -->
  <div class="main-agile">
    <h1>Modern Flip Sign In Form</h1>
    <div id="w3ls_form" class="signin-form">
      <!-- Sign In Form -->
      <form id="signin">
        <div class="ribbon">
          <a
            href="#"
            id="flipToRecover"
            class="flipLink"
            title="Click Here to SignUp"
            >注册</a
          >
        </div>
        <h2>登录</h2>
        <p>用户名：</p>
        <input
          type="text"
          name="User Name"
          placeholder=""
          required=""
          v-model="data.loginFormData.username"
        />
        <p>密码：</p>
        <input
          type="password"
          name="Password"
          placeholder=""
          required=""
          v-model="data.loginFormData.password"
        />
        <input type="checkbox" id="brand" value="" />
        <div class="loginTip" id="loginTip"></div>
        <input type="button" value="点击登录" @click="login" />
        <!-- <div class="signin-agileits-bottom"> 
					<p><a href="#">Forgot password ?</a></p>    
				</div> -->
      </form>
      <form id="signup" action="#" method="post">
        <div class="ribbon">
          <a
            href="#"
            id="flipToRecover1"
            class="flipLink"
            title="Click Here to signin"
            >登录</a
          >
        </div>
        <h3>注册</h3>
        <p>用户名：</p>
        <input
          type="text"
          v-model="data.signupFormData.username"
          name="User Name"
          placeholder=""
          required=""
        />
        <p>手机号：</p>
        <input
          type="text"
          v-model="data.signupFormData.phone"
          name="Phone"
          placeholder=""
          required=""
        />
        <p>密码：</p>
        <input
          type="password"
          v-model="data.signupFormData.password"
          name="Password"
          placeholder=""
          required=""
        />

        <div class="signUpTip" id="signUpTip"></div>
        <input type="button" value="点击注册" @click="signup" />
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import Loading from "../components/Loading.vue";
import {
  SketchOutlined,
  RadarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, watch } from "vue";
import * as api from "../api/index.js";
import { useStore } from "vuex";
import { showToast } from "vant";
import "vant/es/toast/style";
import Base3d from "../utils/Base3d";
import $ from "jquery";
import axios from "axios";
const route = useRoute();
const router = useRouter();
const store = useStore();
// console.log(route);
const data = reactive({
  products: [],
  isLoading: true,
  scenes: [],
  pIndex: 0,
  sceneIndex: 0,
  base3d: {},
  descIndex: 0,
  progress: 0,
  loginFormData: {
    username: "",
    password: "",
  },
  signupFormData: {
    username: "",
    password: "",
    phone: "",
  },
});
function LoadingFinish() {
  data.isLoading = false;
}
$(function () {
  // Checking for CSS 3D transformation support
  $.support.css3d = supportsCSS3D();

  var w3ls_form = $("#w3ls_form");

  // Listening for clicks on the ribbon links
  $(".flipLink").click(function (e) {
    // Flipping the forms
    w3ls_form.toggleClass("flipped");

    // If there is no CSS3 3D support, simply
    // hide the sign in form (exposing the signup one)
    if (!$.support.css3d) {
      $("#signin").toggle();
    }
    e.preventDefault();
  });

  // A helper function that checks for the
  // support of the 3D CSS3 transformations.
  function supportsCSS3D() {
    var props = ["perspectiveProperty", "WebkitPerspective", "MozPerspective"],
      testDom = document.createElement("a");

    for (var i = 0; i < props.length; i++) {
      if (props[i] in testDom.style) {
        return true;
      }
    }

    return false;
  }
});

onMounted(async () => {
  let result = await api.getProducts();
  console.log(result);
  //   data.isLoading = false;
  data.products = result.list;
  data.scenes = result.hdr;
  data.base3d = new Base3d("#product", LoadingFinish);
  //根据模型加载中事件获取模型加载进度
  data.base3d.onProgress((e) => {
    let progressNum = e.loaded / e.total;
    progressNum = progressNum.toFixed(2) * 100;
    data.progress = progressNum;
    // console.log(progressNum);
  });
  // let duration = data.base3d.animateAction._clip.duration;
  //   let time = data.base3d.animateAction.time;
  //   let index = Math.floor((time / duration) * 4);
  //   data.descIndex = index;
});

function login() {
  let loginTip = document.getElementById("loginTip");
  if (!data.loginFormData.username) {
    loginTip.innerHTML = "请输入用户名";
    return;
  }
  if (!data.loginFormData.password) {
    loginTip.innerHTML = "请输入密码";
    return;
  }
  if (data.loginFormData.username.length >= 20) {
    loginTip.innerHTML = "请输入正确的用户名";
    return;
  }
  if (
    data.loginFormData.password.length <= 7 &&
    data.loginFormData.password.length >= 12
  ) {
    loginTip.innerHTML = "请输入7-12位正确密码";
    return;
  }
  axios.post("/webapi/user/login", data.loginFormData).then((res) => {
    console.log(res.data);
    if (res.data.code == "200") {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userInfo", JSON.stringify(data.loginFormData));
      store.commit("confirmUser", data.loginFormData);

      router.push("/");
      showToast({
        message: "登录成功！",
        position: top,
      });
    } else {
      showToast({
        message: "账号或密码错误！",
        position: top,
      });
    }
  });
}
function signup() {
  if (!data.signupFormData.username) {
    signUpTip.innerHTML = "请输入用户名";
    return;
  }
  if (!data.signupFormData.phone) {
    signUpTip.innerHTML = "请输入电话号码";
    return;
  }
  if (!data.signupFormData.password) {
    signUpTip.innerHTML = "请输入密码";
    return;
  }
  if (data.signupFormData.username.length >= 20) {
    signUpTip.innerHTML = "请输入正确的用户名";
    return;
  }
  if (data.signupFormData.phone.length != 11) {
    signUpTip.innerHTML = "请输入正确的手机号";
    return;
  }

  if (data.signupFormData.password.length <= 7) {
    signUpTip.innerHTML = "请输入7-12位正确密码";
    return;
  }
  if (data.signupFormData.password.length >= 12) {
    signUpTip.innerHTML = "请输入7-12位正确密码";
    return;
  }

  axios.post("/webapi/user/checkRepeat", data.signupFormData).then((res) => {
    if (res.data.code == "200") {
      showToast({
        message: "该用户已存在",
        position: top,
      });
      return;
    } else {
      axios.post("/webapi/user/signup", data.signupFormData).then((res1) => {
        console.log(res.data);
        if (res1.data.code == "200") {
          showToast({
            message: "注册成功",
            position: top,
          });

          router.push("/");
        }
      });
    }
  });
}

window.addEventListener("mousewheel", (e) => {
  //   console.log(e);
  if (e.deltaY > 0) {
    store.commit("setFullscreen", true);
  }

  if (e.deltaY < 0) {
    store.commit("setFullscreen", false);
  }
});

// window.addEventListener("mousewheel", (e) => {
//   let duration = data.base3d.animateAction._clip.duration;
//   let time = data.base3d.animateAction.time;
//   let index = Math.floor((time / duration) * 4);
//   data.descIndex = index;
// });
</script>
  
  <style lang="less" scoped>
/*--reset--*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
dl,
dt,
dd,
ol,
nav ul,
nav li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
ol,
ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
/*--start editing from here--*/
a {
  text-decoration: none;
}
.txt-rt {
  text-align: right;
} /* text align right */
.txt-lt {
  text-align: left;
} /* text align left */
.txt-center {
  text-align: center;
} /* text align center */
.float-rt {
  float: right;
} /* float right */
.float-lt {
  float: left;
} /* float left */
.clear {
  clear: both;
} /* clear float */
.pos-relative {
  position: relative;
} /* Position Relative */
.pos-absolute {
  position: absolute;
} /* Position Absolute */
.vertical-base {
  vertical-align: baseline;
} /* vertical align baseline */
.vertical-top {
  vertical-align: top;
} /* vertical align top */
nav.vertical ul li {
  display: block;
} /* vertical menu */
nav.horizontal ul li {
  display: inline-block;
} /* horizontal menu */
img {
  max-width: 100%;
}
/*--end reset--*/
body {
  font-family: Verdana;
  //  'Athiti', sans-serif;
  background: url("../assets/img/login_bg.png") repeat #00e7ff 0px 0px;
  background-attachment: fixed;
}
h1 {
  font-size: 3em;
  text-align: center;
  color: #fff;
  font-weight: 100;
}
/*-- main --*/
.loginTip {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-weight: 700;
}
.signUpTip {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-weight: 700;
}
.main-agile {
  padding: 2em 0 0;
}
/*-- Styling the forms --*/
#w3ls_form {
  z-index: 1;
  -moz-perspective: 800px;
  -webkit-perspective: 800px;
  -o-perspective: 800px;
  -ms-perspective: 800px;
  perspective: 800px;
}
.signin-form {
  width: 30%;
  height: 590px;
  margin: 2em auto;
  position: relative;
}
#w3ls_form form {
  width: 87%;
  height: 84%;
  position: absolute;
  top: 0;
  left: 0;
  -moz-transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -moz-backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  -moz-transition: 0.8s;
  -webkit-transition: 0.8s;
  -o-transition: 0.8s;
  transition: 0.8s;
  background: #12494f;
  padding: 2em;
  -webkit-box-shadow: 9px 9px 10px 1px rgba(12, 46, 49, 0.76);
  -moz-box-shadow: 9px 9px 10px 1px rgba(12, 46, 49, 0.76);
  -o-box-shadow: 9px 9px 10px 1px rgba(12, 46, 49, 0.76);
  -ms-box-shadow: 9px 9px 10px 1px rgba(12, 46, 49, 0.76);
  box-shadow: 9px 9px 10px 1px rgba(12, 46, 49, 0.76);
}

#signin {
  z-index: 100;
}
#signup {
  z-index: 1;
  opacity: 0;
  /* Rotating the sign up password form by default */
  -moz-transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
#w3ls_form.flipped #signin {
  opacity: 0;
  /**
	 * Rotating the sign in form when the
	 * flipped class is added to the container
	 */
  -moz-transform: rotateY(-180deg);
  -webkit-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}
#w3ls_form.flipped #signup {
  opacity: 1;
  /* Rotating the sign up div into view */
  -moz-transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
}
/*-- //Styling the forms --*/
/*-- sign in-form --*/
.signin-form h2,
.signin-form h3 {
  font-size: 2em;
  color: #e89406;
  text-align: center;
  margin: 0 0 1em;
}
.signin-form input[type="text"],
.signin-form input[type="password"] {
  outline: none;
  font-size: 1em;
  color: #e8e8e8;
  padding: 0.8em 1em;
  margin: 0;
  width: 100%;
  border: none;
  -webkit-appearance: none;
  display: block;
  background: #256a71;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  -ms-border-radius: 3px;
  border-radius: 3px;
  //  'Athiti', sans-serif;
}
.signin-form p {
  font-size: 1em;
  color: #fff;
  margin: 1em 0 0.5em;
}
/*-- checkbox --*/
.signin-form input[type="checkbox"] {
  display: none;
}
.signin-form input[type="checkbox"] + label {
  position: relative;
  padding-left: 1.8em;
  border: none;
  outline: none;
  font-size: 1em;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin: 1.5em 0;
}
.signin-form input[type="checkbox"] + label span:first-child {
  width: 14px;
  height: 14px;
  border: 2px solid #c8c8c8;
  position: absolute;
  left: 0;
  top: 3px;
}
.signin-form input[type="checkbox"]:checked + label span:first-child:before {
  content: "";
  background: url("../images/tick.png") no-repeat;
  position: absolute;
  left: 2px;
  top: 2px;
  font-size: 10px;
  width: 10px;
  height: 10px;
}
/*-- //checkbox --*/
.signin-form input[type="button"] {
  font-size: 1em;
  color: #fff;
  background: #e89406;
  border: 3px solid #e89406;
  outline: none;
  cursor: pointer;
  padding: 0.6em 1em;
  -webkit-appearance: none;
  width: 100%;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  -ms-border-radius: 3px;
  border-radius: 3px;
}
.signin-form input[type="button"]:hover {
  background: transparent;
  color: #e89406;
  transition: 0.5s all;
  -webkit-transition: 0.5s all;
  -moz-transition: 0.5s all;
  -o-transition: 0.5s all;
  -ms-transition: 0.5s all;
}
/*-- //sign in-form --*/
/*-- Buttons & Links --*/
#signin .flipLink,
#signup .flipLink {
  display: block;
}
.ribbon {
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 75px;
  height: 75px;
  text-align: right;
}
.ribbon a {
  font-size: 13px;
  color: #fff;
  text-align: center;
  line-height: 20px;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  width: 100px;
  display: block;
  background: #e89406;
  -webkit-box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  -o-box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  -ms-box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 19px;
  right: -21px;
}
.ribbon a::before {
  content: "";
  position: absolute;
  left: 0px;
  top: 100%;
  z-index: -1;
  border-left: 3px solid #8f5408;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #8f5408;
}
.ribbon a::after {
  content: "";
  position: absolute;
  right: 0px;
  top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #8f5408;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #8f5408;
}
#signup .ribbon {
  right: inherit;
  left: -5px;
}
#signup .ribbon a {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  right: inherit;
  left: -21px;
}
/*-- //Buttons & Links --*/
/*-- sign in-bottom --*/
.signin-agileits-bottom p {
  text-align: center;
  margin: 1.5em 0;
}
.signin-agileits-bottom p a {
  color: #fff;
  -webkit-transition: 0.5s all;
  -moz-transition: 0.5s all;
  -o-transition: 0.5s all;
  -ms-transition: 0.5s all;
  transition: 0.5s all;
}
.signin-agileits-bottom p a:hover {
  color: #e89406;
}
.social-icons ul li {
  background-color: #3b5998;
  -webkit-transition: 0.5s all;
  -moz-transition: 0.5s all;
  -o-transition: 0.5s all;
  -ms-transition: 0.5s all;
  transition: 0.5s all;
  display: inline-block;
  width: 48%;
  float: left;
}
.social-icons ul li a {
  display: block;
}
.social-icons ul li a span {
  vertical-align: middle;
  color: #fff;
  float: left;
  font-size: 0.9em;
}
.social-icons ul li a span.text {
  padding: 0.6em 0;
  text-align: center;
  width: 78%;
}
.social-icons ul li span.icons {
  background: url("../images/i1.png") no-repeat #2e4a84 center;
  width: 40px;
  height: 40px;
  display: inline-block;
  border-right: 1px solid #3b5998;
}
.social-icons ul li.twt {
  background-color: #55acee;
  float: right;
}
.social-icons ul li.twt span.icons {
  background: url("../images/i2.png") no-repeat #4d9cd8 center;
  border-color: #67b0e8;
}
.social-icons ul li:hover {
  background: #2e4a84;
}
.social-icons ul li.twt:hover {
  background: #4d9cd8;
}
/*-- //sign in-bottom --*/
/*-- copyright --*/
.copyright {
  text-align: center;
  margin: 2em 0 0;
}
.copyright p {
  font-size: 1em;
  color: #fff;
  line-height: 1.8em;
}
.copyright p a {
  color: #ffa308;
  -webkit-transition: 0.5s all;
  -moz-transition: 0.5s all;
  -o-transition: 0.5s all;
  -ms-transition: 0.5s all;
  transition: 0.5s all;
}
.copyright p a:hover {
  color: #fff;
}
/*-- //copyright --*/
/*-- responsive-design --*/
@media (max-width: 1440px) {
  .signin-form {
    width: 33%;
    height: 605px;
  }
  .copyright {
    margin: 2em 0;
  }
}
@media (max-width: 1366px) {
  .signin-form {
    width: 36%;
    height: 605px;
  }
}
@media (max-width: 1080px) {
  .signin-form {
    width: 44%;
  }
}
@media (max-width: 1024px) {
  .signin-form {
    width: 47%;
  }
}
@media (max-width: 800px) {
  h1 {
    font-size: 2.5em;
  }
  .main-agile {
    padding: 1em 0 0;
  }
  .signin-form {
    width: 60%;
    margin: 1em auto;
  }
}
@media (max-width: 736px) {
  .signin-form {
    width: 67%;
    height: 570px;
  }
  #w3ls_form form {
    padding: 1.5em 2em;
    height: 88%;
  }
  .signin-form input[type="text"],
  .signin-form input[type="password"] {
    padding: 0.6em 1em;
  }
}
@media (max-width: 667px) {
  .signin-form {
    width: 71%;
    height: 560px;
  }
  .social-icons ul li span.icons {
    height: 41px;
  }
}
@media (max-width: 640px) {
  .signin-form {
    width: 72%;
  }
}
@media (max-width: 600px) {
  h1 {
    font-size: 2.2em;
  }
  .signin-form {
    width: 80%;
  }
}
@media (max-width: 568px) {
  #w3ls_form form {
    padding: 1.5em;
    width: 88%;
  }
  .signin-form {
    width: 84%;
    height: 540px;
  }
  .signin-form h2,
  .signin-form h3 {
    margin: 0;
  }
}
@media (max-width: 480px) {
  .signin-form input[type="text"],
  .signin-form input[type="password"] {
    padding: 0.4em 1em;
    width: 90.5%;
    font-size: 0.9em;
  }
  .social-icons ul li {
    width: 65%;
    float: none;
    margin: 0 auto;
    text-align: center;
  }
  .social-icons ul li.twt {
    float: none;
  }
  .social-icons {
    text-align: center;
  }
  #w3ls_form form {
    padding: 1em 1.5em;
    height: 92%;
  }
  .signin-form h2,
  .signin-form h3 {
    font-size: 1.8em;
  }
  .signin-form p {
    font-size: 0.9em;
  }
  .signin-form input[type="checkbox"] + label {
    font-size: 0.9em;
  }
  .signin-form input[type="button"] {
    font-size: 0.9em;
  }
  .signin-agileits-bottom p {
    margin: 1em 0;
  }
  .signin-form {
    height: 508px;
  }
  .copyright p {
    font-size: 0.9em;
    padding: 0 1em;
  }
}
@media (max-width: 414px) {
  h1 {
    font-size: 1.8em;
  }
  .signin-form h2,
  .signin-form h3 {
    font-size: 1.6em;
  }
  #w3ls_form form {
    width: 83%;
  }
  .social-icons ul li {
    width: 80%;
  }
  .social-icons ul li span.icons {
    height: 35px;
  }
  .social-icons ul li a span.text {
    padding: 0.4em 0;
  }
  .signin-form {
    height: 485px;
  }
}
@media (max-width: 320px) {
  h1 {
    font-size: 1.6em;
  }
  .signin-form h2,
  .signin-form h3 {
    font-size: 1.4em;
  }
  #w3ls_form form {
    width: 79%;
    padding: 0.7em 1.5em;
    height: 93%;
  }
  .signin-form {
    width: 90%;
    height: 470px;
  }
  .signin-form input[type="text"],
  .signin-form input[type="password"] {
    font-size: 0.85em;
    width: 86.5%;
  }
  .signin-form input[type="button"] {
    padding: 0.4em 1em;
  }
  .social-icons ul li {
    width: 97%;
  }
  .copyright {
    margin: 0 0 2em;
  }
}
</style>
  