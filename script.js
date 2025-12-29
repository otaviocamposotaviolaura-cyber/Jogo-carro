let scene, camera, renderer;
let car;
let speed = 0;
let direction = 0;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, -8);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game").appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5,10,5);
    scene.add(light);

    // Chão
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshPhongMaterial({color: 0x444444})
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Carro (caixa simples)
    const carGeo = new THREE.BoxGeometry(1, 0.5, 2);
    const carMat = new THREE.MeshPhongMaterial({color: 0xff0000});
    car = new THREE.Mesh(carGeo, carMat);
    car.position.y = 0.25;
    scene.add(car);

    animate();

    // Mobile buttons
    document.getElementById("accel").onmousedown = () => speed = 0.05;
    document.getElementById("accel").onmouseup = () => speed = 0;

    document.getElementById("brake").onmousedown = () => speed = -0.05;
    document.getElementById("brake").onmouseup = () => speed = 0;

    document.getElementById("left").onmousedown = () => direction = 0.03;
    document.getElementById("left").onmouseup = () => direction = 0;

    document.getElementById("right").onmousedown = () => direction = -0.03;
    document.getElementById("right").onmouseup = () => direction = 0;
}

function animate() {
    requestAnimationFrame(animate);

    car.rotation.y += direction;
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;

    camera.position.lerp(
        new THREE.Vector3(car.position.x, car.position.y + 3, car.position.z - 8),
        0.1
    );
    camera.lookAt(car.position);

    renderer.render(scene, camera);
}

init();
