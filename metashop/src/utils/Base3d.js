import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入控制器，轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入模型解析器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Base3d {
  // selector代表要找的dom对象
  constructor(selector, onFinish, firstModelName) {
    this.firstModelName = firstModelName;
    // 画布
    this.container = document.querySelector(selector);
    this.camera;
    this.scene;
    this.renderer;
    this.model;
    this.panzi;
    this.animateAction;
    this.clock = new THREE.Clock();
    this.onFinish = onFinish;
    this.init();
    this.animate();
    this.progressFn;
  }
  //加载事件赋值
  onProgress(fn) {
    this.progressFn = fn;
  }
  init() {
    //   初始化场景
    this.initScene();
    // 初始化相机
    this.initCamera();

    // 初始化渲染器
    this.initRenderer();
    // 控制器，控制方向
    this.initControls();
    // 添加物体
    this.addMesh();

    // 监听场景大小改变，调整渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // 监听滚轮事件
    // window.addEventListener("mousewheel", this.onMouseWheel.bind(this));
  }
  initScene() {
    this.scene = new THREE.Scene();
    this.setEnvMap("000");
  }
  initCamera() {
    // 选择透视相机
    this.camera = new THREE.PerspectiveCamera(
      45,//视野角度
      window.innerWidth / window.innerHeight,//视野宽高比
      0.25,//最近可视距离
      200//最远可视距离
    );
    this.camera.position.set(-1.0, 1.6, 3.7);//相机位置
  }
  initRenderer() {
    //抗锯齿
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置屏幕像素比为当前屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置电影级别色调映射指对图像颜色进行映射变换的算法。目的， 调整图像的灰度，使得处理后的图像人眼看起来更加舒适，能更好的表达原图里的信息与特征。
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //设置曝光程度为3，值越大亮度越高
    this.renderer.toneMappingExposure = 3;
    // 渲染器渲染的东西放到画布
    this.container.appendChild(this.renderer.domElement);
  }
  //加载场景hdr
  setEnvMap(hdr) {
    new RGBELoader().setPath("./files/hdr/").load(hdr + ".hdr", (texture) => {
      //纹理设置球形映射
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // 场景背景设置为返回的纹理对象
      this.scene.background = texture;
      this.scene.environment = texture;
    });
  }
  //渲染函数
  render() {
    //帧与帧的时间差
    var delta = this.clock.getDelta();
    //根据时间差更新混合器
    this.mixer && this.mixer.update(delta);
    this.renderer.render(this.scene, this.camera);
  }
  //渲染器不断加载并绑定下一帧，实现动画
  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  // 控制器，控制方向
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.minDistance = 2;
  }
  //加载模型
  setModel(modelName) {

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader().setPath("files/gltf/");
      loader.load(
        modelName,
        (gltf) => {

          //清空之前的model
          this.model && this.model.removeFromParent();
          this.model = gltf.scene.children[0];
          // if ("bag2.glb" == modelName && !this.panzi) {
          //底盘模型
          // this.panzi = gltf.scene.children[5];
          // this.scene.add(this.panzi);

          // // 修改摄像头为模型摄像头
          // this.camera = gltf.cameras[0];
          // //   调用动画
          // this.mixer = new THREE.AnimationMixer(gltf.scene.children[1]);
          // this.animateAction = this.mixer.clipAction(gltf.animations[0]);
          // //   设置动画播放时长
          // this.animateAction.setDuration(20).setLoop(THREE.LoopOnce);
          // //   设置播放完成之后停止
          // this.animateAction.clampWhenFinished = true;
          //   播放动画
          //   this.animateAction.play();

          // 设置灯光
          // this.spotlight1 = gltf.scene.children[2].children[0];
          // this.spotlight1.intensity = 1;
          // this.spotlight2 = gltf.scene.children[3].children[0];
          // this.spotlight2.intensity = 1;
          // this.spotlight3 = gltf.scene.children[4].children[0];
          // this.spotlight3.intensity = 1;
          // }
          // this.scene.add(gltf.scene);

          this.scene.add(this.model);
          resolve(this.modelName + "模型添加成功");
          this.camera.position.set(-1.0, 1.6, 3.7);//相机位置
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        },
        (e) => {
          //   console.log("模型加载进度");
          //   console.log(e);
          //模型加载事件
          this.progressFn(e);
        }
      );
    });
  }
  async addMesh() {
    //加载完模型再关闭loading并渲染
    let res = await this.setModel(this.firstModelName);
    this.onFinish(res);
  }
  //根据屏幕大小调节尺寸
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.render();
  }
  //监听滚动播放动画
  onMouseWheel(e) {
    // console.log(this.animateAction);
    let timeScale = e.deltaY > 0 ? 1 : -1;
    this.animateAction.setEffectiveTimeScale(timeScale);
    this.animateAction.paused = false;
    this.animateAction.play();
    if (this.timeoutid) {
      clearTimeout(this.timeoutid);
    }
    //300ms内不滚动就在0.5s内暂停播放
    this.timeoutid = setTimeout(() => {
      this.animateAction.halt(0.5);
    }, 300);
  }
}

export default Base3d;
