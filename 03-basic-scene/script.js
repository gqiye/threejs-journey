console.log(THREE)
// 新建一个场景
const scene = new THREE.Scene();
// 红色正方体
// 新建一个盒子几何
const geometry = new THREE.BoxGeometry(1,1,1);
// 网格基础材料
const material = new THREE.MeshBasicMaterial({color:0xff0000});
// 网格
const mesh = new THREE.Mesh(geometry,material);
// 将物体添加到场景
scene.add(mesh);

// 相机
// 在three中 y向上,x向有,z向用户
const sizes = { width:800,height:600}
const {width,height} = sizes
// 添加透视相机
// 参数 1. 角度 2.横纵比
//*fov：管理小视场或大视场
//*纵横比：宽/高，是渲染~视口的大小
const camera = new THREE.PerspectiveCamera(75,width/height);
// 相机默认位置位于图形的原点,因此移动出来才能看到图形
camera.position.z=2;
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
