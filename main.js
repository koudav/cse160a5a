// imports also taken from cse160 discord
import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
    
  }

  const canvas = document.querySelector( '#c' );
  const renderer = new THREE.WebGLRenderer( { antialias: true, castShadow:true, canvas } );

  const fov = 90;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  
  
  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');
  const controls = new OrbitControls(camera, view1Elem);

  const cameraHelper = new THREE.CameraHelper(camera);

  function updateCamera() {
    camera.updateProjectionMatrix();
  }

function main() {
    camera.position.set(0, 2, -1);
	camera.position.z = 3;

    controls.target.set(0, 0, 1);
    controls.update();

    /*const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);*/

    /*const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();*/

	const scene = new THREE.Scene();
    scene.add(cameraHelper);

	/*const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry1 = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );*/

	const shapes = []; // just an array we can use to rotate the shapes
	const loader = new THREE.TextureLoader();

	/*const texture1 = loader.load( 'https://threejs.org/manual/examples/resources/images/wall.jpg' );
	texture1.colorSpace = THREE.SRGBColorSpace;*/

	/*const material1 = new THREE.MeshBasicMaterial( {
		map: texture1
	} );
	const shape1 = new THREE.Mesh( geometry1, material1 );
    shape1.position.x = -1.5;
	scene.add( shape1 );
	shapes.push( shape1 ); // add to our list of shapes to rotate*/

    // SETUP HERE
    scene.background = new THREE.Color(0x00033D);

    const planeSize = 40;
		const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

    renderer.shadowMap.enabled = true;

    // LIGHTING HERE
    const amb_color = 0xFFFF44;
    const amb_intensity = 1;
    const amb_light = new THREE.AmbientLight(amb_color, amb_intensity);
    scene.add(amb_light);

    const dir_color = 0xFF3333;
    const dir_intensity = 1;
    const dir_light = new THREE.DirectionalLight(dir_color, dir_intensity);
    dir_light.position.set(0, 10, 0);
    dir_light.target.position.set(-2, 0, 0);
    scene.add(dir_light);
    scene.add(dir_light.target);

    const helper = new THREE.DirectionalLightHelper(dir_light);
    scene.add(helper);

    const point_color = 0xFFFFFF;
    const point_intensity = 10;
    const point_light = new THREE.PointLight(point_color, point_intensity);
    point_light.position.set(1.5, 1.5, 1.5);
    point_light.castShadow = true;
    scene.add(point_light);
    // SHAPES HERE  
    
    // Image by Lumina Obscura from Pixabay
    const skybox_texture = loader.load('./resources/images/nightskybox.jpg')
    scene.background = skybox_texture;

    // needs credit
    const cube1_texture = loader.load( './resources/images/redlizard.jpg' );
	  cube1_texture.colorSpace = THREE.SRGBColorSpace;

    let cube1_lengths = [1, 1, 1];
    let cube1_coords = [1, 1, 1]; 
    const cube1 = makeCubeMesh(cube1_texture, cube1_lengths, cube1_coords);
    scene.add(cube1);
    shapes.push(cube1);

    let cube2_texture = loader.load( './resources/images/gray.jpg' );
    let cube2_lengths = [1, 1, 1];
    let cube2_coords = [];
    let cube2;
    for (let i = 0; i < 20; ++i) {
      cube2_coords = [2 * i * -0.2, 2, -i];
      cube2 = makeCubeMesh(cube2_texture, cube2_lengths, cube2_coords);
      scene.add(cube2);
      shapes.push(cube2);
    }

    let cube3_texture = loader.load( './resources/images/gray.jpg' );
    let cube3_lengths = [10, 0.2, 10];
    let cube3_coords = [1, 5, 1];
    const cube3 = makeCubeMesh(cube3_texture, cube3_lengths, cube3_coords);
    scene.add(cube3);
    //shapes.push(cube3);

    // needs credit
    const cylinder1_texture = loader.load( './resources/images/blueturtle.webp' );
    cube1_texture.colorSpace = THREE.SRGBColorSpace;

    let cylinder1_lengths = [0.5, 0.5, 1, 16];
    let cylinder1_coords = [-2, 1, 1]; 
    const cylinder1 = makeCylinderMesh(cylinder1_texture, cylinder1_lengths, cylinder1_coords);
    scene.add(cylinder1);
    shapes.push(cylinder1);

    const sphere1_texture = loader.load( './resources/images/gray.jpg' );
    sphere1_texture.colorSpace = THREE.SRGBColorSpace;

    let sphere1_lengths = [0.5, 12, 12];
    let sphere1_coords = [2, 2, 2];
    const sphere1 = makeSphereMesh(sphere1_texture, sphere1_lengths, sphere1_coords);
    scene.add(sphere1);
    shapes.push(sphere1);

    /*const sphere1_texture = loader.load( './resources/images/yellowrat.jpg' );
    sphere1_texture.colorSpace = THREE.SRGBColorSpace;

    let sphere1_lengths = [0.5, 12, 12];
    let sphere1_coords = [1.5, -0.5, 0];
    const sphere1 = makeSphereMesh(sphere1_texture, sphere1_lengths, sphere1_coords);
    scene.add(sphere1);
    shapes.push(sphere1);*/

    /*const cube2 = new THREE.Mesh( geometry1, material1 );
    cube2.position.x = 0;
	scene.add( cube2 );
	//shapes.push( cube2 ); // add to our list of shapes to rotate

    const cube3 = new THREE.Mesh( geometry1, material1 );
    cube3.position.x = 1.5;
	scene.add( cube3 );
	//shapes.push( cube3 ); // add to our list of shapes to rotate*/

    // OBJ HERE

		const mtlLoader = new MTLLoader();
		mtlLoader.load( './resources/objs/pokeball/pokeball.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
            // pokeball by Jose Ramos [CC-BY] via Poly Pizza
			objLoader.load( './resources/objs/pokeball/pokeball.obj', ( pokeball ) => {
                pokeball.position.x = -0.5;
                pokeball.position.y = 1;
                pokeball.position.z = 0.2;
				scene.add( pokeball );

			} );

		} );




    // FUNCTS HERE

    function makeCubeMesh(texture, lengths, coords) {
        let boxWidth = lengths[0];
	    let boxHeight = lengths[1];
	    let boxDepth = lengths[2];
	    const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
        const material = new THREE.MeshLambertMaterial( {
            map: texture
        } );
        material.receiveShadow = true;

        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.position.x = coords[0];
        cube.position.y = coords[1];
        cube.position.z = coords[2];

        return cube;
    }

    function makeCylinderMesh(texture, lengths, coords) {
        let radiusTop = lengths[0];
        let radiusBottom = lengths[1];
        let height = lengths[2];
        let radialSegments = lengths[3];

        const geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments );
        const material = new THREE.MeshLambertMaterial( {
            map: texture
        } );
        material.receiveShadow = true;

        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.castShadow = true;
        cylinder.position.x = coords[0];
        cylinder.position.y = coords[1];
        cylinder.position.z = coords[2];

        return cylinder;
    }

    function makeSphereMesh(texture, lengths, coords) {
        let radius = lengths[0];
        let widthSegments = lengths[1];
        let heightSegments = lengths[2];

        const geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
        const material = new THREE.MeshLambertMaterial( {
            map: texture
        } );
        material.receiveShadow = true;

        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.position.x = coords[0];
        sphere.position.y = coords[1];
        sphere.position.z = coords[2];

        return sphere;
    }

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		shapes.forEach( ( shape1, ndx ) => {

			const speed = .2 + ndx * .1;
			const rot = time * speed;
			shape1.rotation.x = rot;
			shape1.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
