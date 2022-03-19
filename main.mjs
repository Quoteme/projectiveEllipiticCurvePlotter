import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

let camera, scene, renderer, controls;
let mesh, grid;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.y = 100;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let a = getUrlVars()["a"] ?? 0;
	let b = getUrlVars()["b"] ?? -1;
	let c = getUrlVars()["c"] ?? 0;
	mesh = meshifySolution(solve(a,b,c));
	scene.add(mesh)

	grid = new THREE.GridHelper(1000,100, 0xff00ff, 0x888888,);
	scene.add(grid);

	window.addEventListener( 'resize', onWindowResize );
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );

}

/**
 * Solve an elliptic equaiton: y^2=x^3+ax^2+bx+c
 * Only return the solutions with a positive y value, because the
 * negative ones are the same up to a sign flip
 */
function solve(a,b,c, ylim=[-60,60], accuracy=0.001){
	let solutions = []
	let res;
	for(let x=ylim[0]; x<=ylim[1]; x+=accuracy){
		res = x**3+a*x**2+b*x+c;
		if(res>0){
			solutions.push([x,+Math.sqrt(res)]);
			solutions.push([x,-Math.sqrt(res)]);
		}
		else if(res==0)
			solutions.push([x,0])
	}
	return solutions
}

function meshifySolution(points, color=0xff8888, scale=10, pointSize=1){
	const geometry = new THREE.BufferGeometry().setFromPoints(
		points.map( ([x,y]) => new THREE.Vector3(scale*x,0,scale*y))
	)
	const material = new THREE.PointsMaterial( { size: 1.2, color: color } );
	const solutions = new THREE.Points( geometry, material );
	return solutions
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
