import './style.css';

import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let icosahedronMesh, octahedronMesh, capsuleMesh;
let controls;

init();
animate();

function init() {
	const container = document.createElement('div');
	document.body.appendChild(container);

	// Сцена
	scene = new THREE.Scene();

	// Камера
	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.01,
		40
	);
	camera.position.set(0, 1.6, 0);

	// Рендерер
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.xr.enabled = true;
	container.appendChild(renderer.domElement);

	// Світло
	const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
	directionalLight.position.set(3, 3, 3);
	scene.add(directionalLight);

	const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
	scene.add(ambientLight);

	// 1. Icosahedron (ліворуч, на рівні камери)
	const icosahedronGeometry = new THREE.IcosahedronGeometry(0.6, 0);
	const icosahedronMaterial = new THREE.MeshStandardMaterial({
		color: 0xffd700,
		metalness: 1,
		roughness: 0.3,
	});
	icosahedronMesh = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
	icosahedronMesh.position.set(2, 2, 0);
	scene.add(icosahedronMesh);

	// 2. Octahedron (по центру, ближче до контролерів)
	const octahedronGeometry = new THREE.OctahedronGeometry(0.6);
	const octahedronMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x008080,
		transparent: true,
		opacity: 0.6,
		roughness: 0.5,
		metalness: 0.7,
	});
	octahedronMesh = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
	octahedronMesh.position.set(0, 2, 0);
	scene.add(octahedronMesh);

	// 3. Capsule (праворуч, ближче до лівого контролера)
	const capsuleGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 10, 20);
	const capsuleMaterial = new THREE.MeshStandardMaterial({
		color: 0xff4500,
		emissive: 0xff4500,
		emissiveIntensity: 2,
		metalness: 0.5,
		roughness: 0.2,
	});
	capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
	capsuleMesh.position.set(-2, -5, 0);
	scene.add(capsuleMesh);

	// Контролери
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	document.body.appendChild(ARButton.createButton(renderer));
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(render);
	controls.update();
}

function render() {
	animateObjects();
	renderer.render(scene, camera);
}

function animateObjects() {
	// Icosahedron: обертається навколо осі Y
	icosahedronMesh.rotation.y += 0.01;

	// Octahedron: пульсує масштаб
	const scale = 1 + 0.2 * Math.sin(Date.now() * 0.002);
	octahedronMesh.scale.set(scale, scale, scale);

	// Capsule: рухається вверх-вниз
	capsuleMesh.position.y = 1.5 + 0.05 * Math.sin(Date.now() * 0.002);
}
