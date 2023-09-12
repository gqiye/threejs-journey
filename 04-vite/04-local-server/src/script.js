import * as THREE from 'three';
// ThreeJS的三要素——场景(scene)、相机(camera)、渲染器(renderer)。
console.log(THREE)
// 新建一个场景
// 场景是所有物体的容器
const scene = new THREE.Scene();
// 红色正方体
// 新建一个盒子几何
const geometry = new THREE.BoxGeometry(1,1,1);
// 网格基础材料 
const material = new THREE.MeshBasicMaterial({color:0xff0000});
// 网格
const mesh = new THREE.Mesh(geometry,material);
// 画面移动也能造成位置移动,在场景渲染之前都能生效
// z 向前
// y 向上
// x 向右

// mesh.position.x =1;
// mesh.position.y =1;
// mesh.position.z =-1;
// 场景是可以旋转的,会造成相机的视觉差
// 直接设置mesh的x,y,z,效果同上
mesh.position.set(2,0.6,-1)
// 将物体添加到场景 
scene.add(mesh); 
// 将向量直接重置为1,影响的是x轴的(貌似) 转换向量为单位向量,方向设置与原向量相通,但其距离远点的距离为1
// mesh.position.normalize();
// 获取向量长度
console.log('vecotr3',mesh.position.length()) 

// 缩放 scale
// mesh.scale.x=2
// 参数xyz,必输
mesh.scale.set(2,0.5,0.5)


// 场景点的方向旋转顺序,重新设置
// 初始旋转为xyz
mesh.rotation.reorder('YXZ')
// 旋转 rotation 旋转
// 旋转一圈就是一个圆周率(大概)
// gimbal lock 万向节锁
mesh.rotation.x = 2;
mesh.rotation.y = Math.PI/2;

// 四元数 quaternion 四元数
// 




// 轴助手
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

/**
 *  相机
 */
// 相机
// 在three中 y向上,x向有,z向用户
const sizes = { width:800,height:600}
const {width,height} = sizes
// 正投影相机 OrthographicCamera( left, right, top, bottom, near, far )
// 添加透视相机
// 参数 1. 角度 2.横纵比
//*fov：管理小视场或大视场
//*纵横比：宽/高，是渲染~视口的大小
const camera = new THREE.PerspectiveCamera(75,width/height);
// 获取场景到照相机的距离 camera.position是一个矢量
console.log("mesh.position.distanceTo(camera.position)", mesh.position.distanceTo(camera.position))
// 相机默认位置位于图形的原点,因此移动出来才能看到图形
// 在渲染之前都可以进行移动
// z 向前
// y 向上
// x 向右
camera.position.z=2;
camera.position.x=0.6;
camera.position.y=0.6;

// 让相机看指定的物体
// 参数为矢量 vector3
// 让其指向场景的中心 为之前设置过的场景
console.log(mesh.position,'mesh.position')
camera.lookAt(mesh.position)

// 将相机添加到场景
scene.add(camera);

//renderer canvas渲染器
const canvas = document.querySelector('.webgl');
// 新建一个webgl渲染器
const renderer = new THREE.WebGLRenderer({canvas});
// 设定画布宽度高度 
renderer.setSize(width,height);

// 渲染场景 1.场景 2.相机
renderer.render(scene, camera)
