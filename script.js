let scene, camera, renderer;
let world;
let car, carBody;
let accelerate = false, brake = false, steerLeft = false, steerRight = false;

function init() {

    // THREE.js Cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, -8);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game").appendChild(renderer.domElement);

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5,10,5);
    scene.add(light);

    // CANNON.js Mundo Físico
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Chão
    const groundShape = new CANNON.Box(new CANNON.Vec3(50, 0.1, 50));
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -0.1, 0);
    world.addBody(groundBody);

    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.2, 100),
        new THREE.MeshPhongMaterial({ color: 0x444444 })
    );
    scene.add(groundMesh);

    // Carro (corpo simples no início)
    const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    car = new THREE.Mesh(carGeometry, carMaterial);
    scene.add(car);

    carBody = new CANNON.Body({
        mass: 150,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1)),
    });
    world.addBody(carBody);

    window.addEventListener('resize', onResize);

    // Controles da tela
    document.getElementById("accel").onmousedown = () => accelerate = true;
    document.getElementById("accel").onmouseup = () => accelerate = false;

    document.getElementById("brake").onmousedown = () => brake = true;
    document.getElementById("brake").onmouseup = () => brake = false;

    document.getElementById("left").onmousedown = () => steerLeft = true;
    document.getElementById("left").onmouseup = () => steerLeft = false;

    document.getElementById("right").onmousedown = () => steerRight = true;
    document.getElementById("right").onmouseup = () => steerRight = false;
}

function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const force = 4;
    const steerForce = 0.05;

    if (accelerate) carBody.velocity.z += -force;
    if (brake) carBody.velocity.z += force;
    if (steerLeft) carBody.angularVelocity.y += steerForce;
    if (steerRight) carBody.angularVelocity.y -= steerForce;

    world.step(1/60);

    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);

    camera.position.lerp(
        new THREE.Vector3(car.position.x, car.position.y + 3, car.position.z - 8),
        0.1
    );
    camera.lookAt(car.position);

    renderer.render(scene, camera);
}

// Iniciar
init();
animate();
