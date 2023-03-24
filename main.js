import * as THREE from 'three';
import { Car, renderMap } from './utility';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let pause = false;
let toggle = true;
let ready;
let angleMoved;
let score;
let mileage = 7;
const run_timeElement = document.getElementById('run_time');
const appElement = document.getElementById('app');
const instructionElement = document.getElementById('instructions');
const startElement = document.getElementById('start_button');
const gameendElement = document.getElementById('gameend');
startElement.addEventListener('click', StartGame);
let otherVehicles = [];
let lastTimeStamp;
const angleInitial = Math.PI;
const camera_angle_initial = Math.PI * (1.1);
const povcamera_angle_initial = Math.PI * (0.7);
let accelerate = false;
let decelerate = false;
let right = false;
let left = false;
let health = 100;
let fuel = 100;
let time = 0;
let speed = 0;
let startTime = 0;
let can;


const trackRadius = 625;
const trackWidth = 200;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;
const arcAngle1 = (1 / 3) * Math.PI;
const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);
// const arcCenterX = (Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius) / 2;
const scene = new THREE.Scene();


const loader = new GLTFLoader();



let x_coord = -trackRadius;
let y_coord = 0;

const car = Car(2);
scene.add(car);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directLight = new THREE.DirectionalLight(0xffffff, 0.6);
directLight.position.set(100, -300, 400);
scene.add(directLight)


const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 4000;
const cameraHeight = cameraWidth / aspectRatio;

const ortho_camera = new THREE.OrthographicCamera(
  cameraWidth / -2,   //left
  cameraWidth / 2,    //right
  cameraHeight / 2,   //top
  cameraHeight / -2,  //bottom
  0,                  // near plane
  1000                // far plane
);

ortho_camera.position.set(0, -210, 500);
ortho_camera.lookAt(0, 0, 0);


const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100000);
camera.up.set(0, 0, 1)


let cameralookx = Math.cos(angleInitial) * trackRadius;
let cameralooky = Math.sin(angleInitial) * trackRadius;

let camera_x_position = Math.cos(camera_angle_initial) * trackRadius;
let camera_y_position = Math.sin(camera_angle_initial) * trackRadius;

camera.lookAt(cameralookx, cameralooky, car.position.z)
camera.position.set(camera_x_position, camera_y_position, 160)



const povcamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100000);
povcamera.up.set(0, 0, 1)

let povcameralookx = Math.cos(povcamera_angle_initial) * trackRadius;
let povcameralooky = Math.sin(povcamera_angle_initial) * trackRadius;


povcamera.lookAt(povcameralookx, povcameralooky, car.position.z)
povcamera.position.set(car.position.x, car.position.y, 50)


renderMap(cameraWidth, cameraHeight * 2, scene);



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

appElement.appendChild(renderer.domElement);

loader.load('./2rows_roof_tribune/scene.gltf', function (gltf) {
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  const numObjects = 14;
  for (let i = 0; i < numObjects; i++) {
    const angle = i * Math.PI * 2 / numObjects;
    const x = (outerTrackRadius + 250) * Math.cos(angle);
    const y = (outerTrackRadius + 250) * Math.sin(angle);
    const object = gltf.scene.clone();
    object.position.set(x, y, 200);
    object.rotateX(Math.PI / 2)
    object.rotateY(Math.PI)

    object.rotation.y = -angle + 1.5 * Math.PI;
    scene.add(object);
  }
}, undefined, function (error) {
  console.error(error);
});



loader.load('./low_poly_person/scene.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  const numObjects = 150;
  for (let i = 0; i < numObjects; i++) {
    const angle = i * Math.PI * 2 / numObjects;
    const x = (outerTrackRadius + (THREE.MathUtils.randFloat(50, 150))) * Math.cos(angle);
    const y = (outerTrackRadius + (THREE.MathUtils.randFloat(50, 150))) * Math.sin(angle);
    const object = gltf.scene.clone();
    object.position.set(x, y, 10);
    console.log(object)
    object.rotateX(Math.PI / 2)
    object.rotateY(Math.PI)

    object.rotation.y = -angle + 1.5 * Math.PI;
    scene.add(object);
  }
}, undefined, function (error) {
  console.error(error);
});

loader.load('./barricade/scene.gltf', function (gltf) {
  gltf.scene.scale.set(500, 600, 500);
  const numObjects = 45;
  for (let i = 0; i < numObjects; i++) {
    const angle = i * Math.PI * 2 / numObjects;
    const x = (outerTrackRadius) * Math.cos(angle);
    const y = (outerTrackRadius) * Math.sin(angle);
    const object = gltf.scene.clone();
    object.position.set(x, y, 10);
    console.log(object)
    object.rotateX(Math.PI / 2)
    object.rotateY(Math.PI)

    object.rotation.y = -angle + 1.5 * Math.PI;
    scene.add(object);
  }
}, undefined, function (error) {
  console.error(error);
});

loader.load('./barricade/scene.gltf', function (gltf) {
  gltf.scene.scale.set(500, 400, 500);
  const numObjects = 20;
  for (let i = 0; i < numObjects; i++) {
    const angle = i * Math.PI * 2 / numObjects;
    const x = (innerTrackRadius + 5) * Math.cos(angle);
    const y = (innerTrackRadius + 5) * Math.sin(angle);
    const object = gltf.scene.clone();
    object.position.set(x, y, 10);
    console.log(object)
    object.rotateX(Math.PI / 2)
    object.rotateY(Math.PI)

    object.rotation.y = -angle + 1.5 * Math.PI;
    scene.add(object);
  }
}, undefined, function (error) {
  console.error(error);
});

loader.load('./fuel_can/scene.gltf', function (gltf) {
  gltf.scene.scale.set(0.05, 0.05, 0.05);
  const numObjects = 1;
  for (let i = 0; i < numObjects; i++) {
    const angle = i * Math.PI * 2 / numObjects;
    const x = (innerTrackRadius + (THREE.MathUtils.randFloat(50, 320))) * Math.cos(angle);
    const y = (innerTrackRadius + (THREE.MathUtils.randFloat(50, 320))) * Math.sin(angle);
    can = gltf.scene.clone();
    can.position.set(x, y, 10);
    can.rotateX(Math.PI / 2)
    can.rotateY(Math.PI)

    scene.add(can);
  }
}, undefined, function (error) {
  console.error(error);
});




reset();


function reset() {
  angleMoved = 0;
  movePlayerCar(0);
  score = 0;
  health = 100;
  fuel = 100;
  speed = 0;
  time = 0;
  x_coord = -trackRadius;
  y_coord = 0;
  run_timeElement.innerText = "Score: " + score + " Health: " + health + " Fuel: " + fuel + " Time: " + time
  lastTimeStamp = undefined;

  otherVehicles.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  otherVehicles = [];
  pause = false;
  toggle = true;

  const lists = gameendElement.getElementsByTagName('ul');
  while (lists.length > 0) {
    gameendElement.removeChild(lists[0]);
  }

  const h2s = gameendElement.getElementsByTagName('h2');
  while (h2s.length > 0) {
    gameendElement.removeChild(h2s[0]);
  }

  const buttons = gameendElement.getElementsByTagName('button');
  while (buttons.length > 0) {
    gameendElement.removeChild(buttons[0]);
  }

  instructionElement.style.zIndex = 7;
  gameendElement.style.zIndex = 4;

  renderer.render(scene, camera);
  ready = true;
}

function StartGame() {
  if (ready) {
    ready = false;
    for (let i = 0; i < 3; i++) {
      addVehicle(i);
    }
    health = 100;
    fuel = 100;
    time = 0;
    startTime = performance.now();
    toggle = true;
    renderer.setAnimationLoop(animation);
    instructionElement.style.zIndex = 0
  }
}

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" || event.key === "W" || event.key === "w") {
    StartGame();
    accelerate = true;
    return;
  }

  if (event.key === "ArrowDown" || event.key === "S" || event.key === "s") {
    decelerate = true;
    return;
  }

  if (event.key === "ArrowRight" || event.key === "D" || event.key === "d") {
    right = true;
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "A" || event.key === "a") {
    left = true;
    return;
  }

  if (event.key === "T" || event.key === "t") {
    toggle = !toggle;
    return;
  }

  if (event.key === "R" || event.key === "r") {
    reset();
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key === "ArrowUp" || event.key === "W" || event.key === "w") {
    StartGame();
    accelerate = false;
    decelerate = true;
    return;
  }

  if (event.key === "ArrowDown" || event.key === "S" || event.key === "s") {
    decelerate = false;
    return;
  }


  if (event.key === "ArrowRight" || event.key === "D" || event.key === "d") {
    right = false;
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "A" || event.key === "a") {
    left = false;
    return;
  }

});

function animation(timestamp) {
  if (!lastTimeStamp) {
    lastTimeStamp = timestamp;
    return;
  }

  const timeDelta = timestamp - lastTimeStamp;

  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(angleMoved) / (Math.PI * 2))

  if (laps !== score) {
    score = laps;
  }

  otherVehicles.forEach((vehicle) => {
    const laps = Math.floor(Math.abs(vehicle.angle) / (Math.PI * 2))
    if (laps != vehicle.score) {
      vehicle.score = laps;
      console.log("vehicle: ", vehicle.opp, " score: ", vehicle.score)
    }
  })

  if (fuel > 0 && !pause) {
    fuel -= 0.05;
    if (fuel <= 0) {
      pause = true;
      const h2Element = document.createElement('h2');

      h2Element.textContent = "Ran out of Fuel";

      gameendElement.appendChild(h2Element);
      let new_arr = [...otherVehicles, { opp: 22, score: score }]
      new_arr.sort((a, b) => b.score - a.score);
      const list = document.createElement('ul');
      new_arr.forEach((vehicle) => {
        if (vehicle.opp === 22) {
          const item = document.createElement('li');
          item.textContent = `User Player: Score - ${vehicle.score}`;
          list.appendChild(item);
        }
        else {
          const item = document.createElement('li');
          item.textContent = `Opponent ${vehicle.opp}: Score - ${vehicle.score}`;
          list.appendChild(item);
        }
      });
      gameendElement.appendChild(list);
      const buttonElement = document.createElement('button');

      buttonElement.setAttribute('id', 'restart_button');

      buttonElement.textContent = "Restart Game";

      buttonElement.addEventListener('click', reset);

      gameendElement.appendChild(buttonElement);
      gameendElement.style.zIndex = 8
    }
  }

  let did_crash = detect_crash();

  if (did_crash === true && !pause) {
    health -= 10
    if (health <= 0) {
      pause = true;
      const h2Element = document.createElement('h2');

      h2Element.textContent = "Health hit a zero";

      gameendElement.appendChild(h2Element);
      let new_arr = [...otherVehicles, { opp: 22, score: score }]
      new_arr.sort((a, b) => b.score - a.score);
      const list = document.createElement('ul');
      new_arr.forEach((vehicle) => {
        if (vehicle.opp === 22) {
          const item = document.createElement('li');
          item.textContent = `User Player: Score - ${vehicle.score}`;
          list.appendChild(item);
        }
        else {
          const item = document.createElement('li');
          item.textContent = `Opponent ${vehicle.opp}: Score - ${vehicle.score}`;
          list.appendChild(item);
        }
      });
      gameendElement.appendChild(list);
      const buttonElement = document.createElement('button');

      buttonElement.setAttribute('id', 'restart_button');

      buttonElement.textContent = "Restart Game";

      buttonElement.addEventListener('click', reset);

      gameendElement.appendChild(buttonElement);
      gameendElement.style.zIndex = 8
    }
  }

  let did_collect = fuel_collect();

  if (did_collect === true && !pause) {
    const angle = Math.PI * (THREE.MathUtils.randFloat(1, 3))
    const x = (innerTrackRadius + (THREE.MathUtils.randFloat(50, 320))) * Math.cos(angle);
    const y = (innerTrackRadius + (THREE.MathUtils.randFloat(50, 320))) * Math.sin(angle);
    can.position.set(x, y, 10);
    fuel = 100;
  }

  time = (performance.now() - startTime) / 1000;

  const obj = {
    x: can.position.x,
    y: can.position.y
  }
  const player_car_frontzone = CenterofZone(car.position, angleInitial + angleMoved, 15)

  const distance = difference(player_car_frontzone, obj)

  run_timeElement.innerHTML = "Score: " + score + "&ensp;&ensp;&ensp;Health: " + health + "&ensp;&ensp;&ensp;Fuel: " + Math.round(fuel) + "&ensp;&ensp;&ensp;Time: " + time.toFixed(2) + "&ensp;&ensp;&ensp;Next fuel can: " + distance.toFixed(0);

  moveOtherVehicles(timeDelta);

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  if (toggle) {
    renderer.render(scene, camera);
  }
  else {
    renderer.render(scene, povcamera);
  }
  renderer.setScissorTest(true);
  renderer.setScissor(16, window.innerHeight - (window.innerHeight / 4) - 16 - 26, (window.innerWidth / 4), (window.innerHeight / 4));
  renderer.setViewport(16, window.innerHeight - (window.innerHeight / 4) - 16 - 26, (window.innerWidth / 4), (window.innerHeight / 4));
  renderer.render(scene, ortho_camera)
  renderer.setScissorTest(false);

  lastTimeStamp = timestamp;
}

function movePlayerCar(timeDelta) {
  const hypotenuse = Math.sqrt(x_coord * x_coord + y_coord * y_coord);
  const playerSpeed = getPlayerSpeed();
  angleMoved -= playerSpeed * timeDelta;

  if (right) {
    if (x_coord < -465) {
      x_coord += 3;
    }
    console.log(x_coord)
  }
  if (left) {
    if (x_coord > -795) {
      x_coord -= 3;
    }
    console.log(x_coord)
  }

  const totalPlayerAngle = angleInitial + angleMoved;
  const totalCamAngle = camera_angle_initial + angleMoved;
  const totalPovCamAngle = povcamera_angle_initial + angleMoved;

  const playerX = Math.cos(totalPlayerAngle) * hypotenuse;
  const playerY = Math.sin(totalPlayerAngle) * hypotenuse;

  let cameralookx = Math.cos(totalPlayerAngle) * trackRadius;
  let cameralooky = Math.sin(totalPlayerAngle) * trackRadius;



  car.position.x = playerX;
  car.position.y = playerY;

  let camera_x_position = Math.cos(totalCamAngle) * trackRadius;
  let camera_y_position = Math.sin(totalCamAngle) * trackRadius;

  car.rotation.z = totalPlayerAngle - Math.PI / 2;

  camera.rotation.z = totalCamAngle - Math.PI;



  camera.lookAt(cameralookx, cameralooky, car.position.z)
  camera.position.set(camera_x_position, camera_y_position, 160)


  let povcameralookx = Math.cos(totalPovCamAngle) * hypotenuse;
  let povcameralooky = Math.sin(totalPovCamAngle) * hypotenuse;


  povcamera.rotation.z = totalPovCamAngle - Math.PI;

  povcamera.lookAt(povcameralookx, povcameralooky, car.position.z)
  povcamera.position.set(playerX, playerY, 50)

}

function getPlayerSpeed() {
  if (accelerate) {
    speed += 0.0001;
    if (speed > 0.003) {
      speed = 0.003
    }
    return speed;
  }
  if (decelerate) {
    speed -= 0.00002;
    if (speed < 0) {
      speed = 0
    }
    return speed;
  }
  return speed;
}

function addVehicle(i) {
  const mesh = Car(3);
  scene.add(mesh);

  let randomx = -trackRadius + THREE.MathUtils.randFloat(-150, +150);

  console.log("vehicle position: ", randomx);

  const clockwise = true;
  const angle = Math.PI;

  const speed = THREE.MathUtils.randFloat(1.3, 1.5)
  const score = 0;

  otherVehicles.push({ mesh: mesh, clockwise: clockwise, x_coord: randomx, angle: angle, speed: speed, score: score, opp: i + 1 });
}


function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    vehicle.angle -= 0.002 * timeDelta * vehicle.speed;

    const new_hyp = Math.sqrt(vehicle.x_coord * vehicle.x_coord)

    const vehicleX = Math.cos(vehicle.angle) * new_hyp;
    const vehicleY = Math.sin(vehicle.angle) * new_hyp;

    const rotation = vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);


    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function CenterofZone(position, angle, distance) {
  const direction = angle ? -Math.PI / 2 : Math.PI / 2;

  return {
    x: position.x + Math.cos(direction) * distance,
    y: position.y + Math.sin(direction) * distance
  }
}

function difference(val1, val2) {
  return Math.sqrt((val2.x - val1.x) ** 2 + (val2.y - val1.y) ** 2);
}

function detect_crash() {
  const player_car_frontzone = CenterofZone(car.position, angleInitial + angleMoved, 15)
  const player_car_backzone = CenterofZone(car.position, angleInitial + angleMoved, -15)
  let return_val = false;

  otherVehicles.forEach((opp) => {
    const opp_car_frontzone = CenterofZone(opp.mesh.position, opp.angle, 15)
    const opp_car_backzone = CenterofZone(opp.mesh.position, opp.angle, -15)

    if (difference(player_car_frontzone, opp_car_backzone) < 30) {
      console.log('crash 1')
      speed = 0;
      return_val = true;
    }
    if (difference(player_car_frontzone, opp_car_frontzone) < 30) {
      console.log('crash 2')
      speed = 0;
      return_val = true;
    }
    if (difference(player_car_backzone, opp_car_frontzone) < 30) {
      console.log('crash 3')
      speed = 0;
      return_val = true;
    }
  })

  return return_val;
}

function fuel_collect() {
  const player_car_frontzone = CenterofZone(car.position, angleInitial + angleMoved, 15)
  let return_val = false;

  const obj = {
    x: can.position.x,
    y: can.position.y
  }

  if (difference(player_car_frontzone, obj) < 30) {
    return_val = true
  }

  return return_val;
}