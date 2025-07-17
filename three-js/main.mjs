import * as THREE from 'three';

let pageHeight = document.querySelector('body').getBoundingClientRect().height

let gridHeight = window.innerHeight * 1.4;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, gridHeight );
document.body.appendChild( renderer.domElement );
renderer.domElement.style.position = "absolute";
renderer.domElement.style.zIndex = "0";

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / gridHeight , 1, 1000 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, cubeMaterial );
const points = [];

const segmentCount = 20;
let pointX = -150;
let pointZ = 0;
for (let i = 0; i < segmentCount; i++){
    pointX += 10;
    pointZ -= 5;
    points.push(new THREE.Vector3(pointX, 100, pointZ ));
    points.push(new THREE.Vector3(pointX, -100, pointZ ));
}

//points.push( new THREE.Vector3( - 10, 0, 0 ));
//points.push( new THREE.Vector3( 0, 10, 0 ));
//points.push( new THREE.Vector3( 10, 0, 0 ));

const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.LineSegments( lineGeometry, lineMaterial );

scene.add( cube );
scene.add( line )
//camera.position.z = 5;

function animate(){
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );