let scene, camera, renderer, world;
let carBody;
let accelerate = false, brake = false, steerLeft = false, steerRight = false;

// Configurações do carro
const CAR_MAX_SPEED = 18;
const ENGINE_POWER = 600;
const STEER_ANGLE = 0.03;

function init() {
    // THREE — Cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    // Câmera atrás do carro
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 300);

    // Render
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game").appendChild(renderer.domElement);

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5,10,5);
    scene.add(light);

    // CANNON — Física
    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0)
    });

    // Chão grande (cidade simples)
    const groundShape = new CANNON.Box(new CANNON.Vec3(60, 1, 60));
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -1, 0);
    world.addBody(groundBody);

    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(120, 2, 120),
        new THREE.MeshStandardMaterial({ color: 0x2f2f2f })
    );
    groundMesh.position.copy(groundBody.position);
    scene.add(groundMesh);

    // Carro
    const carShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
    carBody = new CANNON.Body({ mass: 160 });
    carBody.addShape(carShape);
    carBody.position.set(0, 1, 0);
    world.addBody(carBody);

    const carMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0xff2222 })
    );
    scene.add(carMesh);
    carBody.mesh = carMesh;

    setupControls();
    animate();
}

function setupControls() {
    // Teclado
    document.addEventListener("keydown", (e)=>{
        if(e.key === "ArrowUp" || e.key === "w") accelerate = true;
        if(e.key === "ArrowDown" || e.key === "s") brake = true;
        if(e.key === "ArrowLeft" || e.key === "a") steerLeft = true;
        if(e.key === "ArrowRight" || e.key === "d") steerRight = true;
    });

    document.addEventListener("keyup", (e)=>{
        if(e.key === "ArrowUp" || e.key === "w") accelerate = false;
        if(e.key === "ArrowDown" || e.key === "s") brake = false;
        if(e.key === "ArrowLeft" || e.key === "a") steerLeft = false;
        if(e.key === "ArrowRight" || e.key === "d") steerRight = false;
    });

    // Botões Mobile
    document.getElementById("btn-accelerate").ontouchstart = ()=>accelerate=true;
    document.getElementById("btn-accelerate").ontouchend = ()=>accelerate=false;
    document.getElementById("btn-brake").ontouchstart = ()=>brake=true;
    document.getElementById("btn-brake").ontouchend = ()=>brake=false;
    document.getElementById("btn-left").ontouchstart = ()=>steerLeft=true;
    document.getElementById("btn-left").ontouchend = ()=>steerLeft=false;
    document.getElementById("btn-right").ontouchstart = ()=>steerRight=true;
    document.getElementById("btn-right").ontouchend = ()=>steerRight=false;
}

function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);

    // Motor / velocidade
    if (accelerate && carBody.velocity.length() < CAR_MAX_SPEED) {
        const force = new CANNON.Vec3(
            Math.sin(carBody.quaternion.y) * ENGINE_POWER,
            0,
            Math.cos(carBody.quaternion.y) * ENGINE_POWER
        );
        carBody.applyForce(force, carBody.position);
    }

    if (brake) carBody.velocity.scale(0.93, carBody.velocity);

    if (steerLeft) carBody.quaternion.y += STEER_ANGLE;
    if (steerRight) carBody.quaternion.y -= STEER_ANGLE;

    carBody.mesh.position.copy(carBody.position);
    carBody.mesh.quaternion.copy(carBody.quaternion);

    // Câmera segue atrás
    camera.position.set(
        carBody.position.x - 6 * Math.sin(carBody.quaternion.y),
        carBody.position.y + 3,
        carBody.position.z - 6 * Math.cos(carBody.quaternion.y)
    );
    camera.lookAt(carBody.position);

    renderer.render(scene, camera);
}

init();
