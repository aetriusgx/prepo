'use strict'

let gl;

let input = new Input();
let time = new Time();
let camera = new OrbitCamera(input);

let sunGeometry;
let lightGeometry;

let earth = {
	geometry: null,
	degrees: 1,
	moon: {
		geometry: null,
		degrees: 60
	}
};

let mercury = {
	geometry: null,
	degrees: 0.5
}

let venus = {
	geometry: null,
	degrees: 0.6
}

let mars = {
	geometry: null,
	degrees: 0.4
}

let jupiter = {
	geometry: null,
	degrees: 0.2
}

let saturn = {
	geometry: null,
	degrees: 0.3
}

let uranus = {
	geometry: null,
	degrees: 0.2
}

let neptune = {
	geometry: null,
	degrees: 0.15
}

let galaxy = {
	x: {
		neg: null,
		pos: null
	},
	y: {
		neg: null,
		pos: null
	},
	z: {
		neg: null,
		pos: null
	}
}

let projectionMatrix = new Matrix4();
let lightDirection = new Vector3(4, 1.5, 0);

let phongShaderProgram;
let flatShaderProgram;
let textureShaderProgram;

window.onload = window['initializeAndStartRendering'];

let loadedAssets = {
	phongTextVS: null,
	phongTextFS: null,
	flatTextVS: null,
	flatTextFS: null,
	unlitTextureVS: null,
	unlitTextureFS: null,
	sun: null,
	earth: null,
	moon: null,
	mercury: null,
	venus: null,
	mars: null,
	jupiter: null,
	saturn: null,
	uranus: null,
	neptune: null,
	galaxyNegX: null,
	galaxyNegY: null,
	galaxyNegZ: null,
	galaxyPosX: null,
	galaxyPosY: null,
	galaxyPosZ: null,
	earthSky: null,
	saturnRings: null,
	sphere: null
};

function initializeAndStartRendering() {
	initGL();
	loadAssets(function () {
		createShaders(loadedAssets);
		createScene();
		updateAndRender();
	});
}

function initGL() {
	let canvas = document.getElementById("webgl-canvas");

	try {
		gl = canvas.getContext("webgl", { alpha: false });
		gl.canvasWidth = canvas.width;
		gl.canvasHeight = canvas.height;

		gl.enable(gl.DEPTH_TEST);

	} catch (e) {

	}

	if (!gl) alert("Could not initialize WebGL");
}

function loadAssets(onLoadedCB) {
	let filePromises = [
		fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
		fetch('./shaders/phong.directionlit.fs.glsl').then((response) => { return response.text(); }),
		fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
		fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }),
		fetch('./shaders/unlit.textured.vs.glsl').then((response) => { return response.text(); }),
		fetch('./shaders/unlit.textured.fs.glsl').then((response) => { return response.text(); }),

		loadImage('./data/sun.jpg'),
		loadImage('./data/earth.jpg'),
		loadImage('./data/moon.png'),
		loadImage('./data/additional_planets/mercury.jpg'),
		loadImage('./data/additional_planets/venusAt.jpg'),
		loadImage('./data/additional_planets/mars.jpg'),
		loadImage('./data/additional_planets/jupiter.jpg'),
		loadImage('./data/additional_planets/saturn.jpg'),
		loadImage('./data/additional_planets/uranus.jpg'),
		loadImage('./data/additional_planets/neptune.jpg'),

		loadImage('./data/skybox_faces/GalaxyTex_NegativeX.png'),
		loadImage('./data/skybox_faces/GalaxyTex_NegativeY.png'),
		loadImage('./data/skybox_faces/GalaxyTex_NegativeZ.png'),
		loadImage('./data/skybox_faces/GalaxyTex_PositiveX.png'),
		loadImage('./data/skybox_faces/GalaxyTex_PositiveY.png'),
		loadImage('./data/skybox_faces/GalaxyTex_PositiveZ.png'),

		loadImage('./data/2k_earth_clouds.jpg'),
		loadImage('./data/saturn-rings.png'),

		fetch('./data/sphere.json').then((response) => { return response.json(); }),
	];

	Promise.all(filePromises).then(values => {
		loadedAssets.phongTextVS = values[0];
		loadedAssets.phongTextFS = values[1];
		loadedAssets.flatTextVS = values[2];
		loadedAssets.flatTextFS = values[3];
		loadedAssets.unlitTextureVS = values[4];
		loadedAssets.unlitTextureFS = values[5];

		loadedAssets.sun = values[6];
		loadedAssets.earth = values[7];
		loadedAssets.moon = values[8];
		loadedAssets.mercury = values[9];
		loadedAssets.venus = values[10];
		loadedAssets.mars = values[11];
		loadedAssets.jupiter = values[12];
		loadedAssets.saturn = values[13];
		loadedAssets.uranus = values[14];
		loadedAssets.neptune = values[15];

		loadedAssets.galaxyNegX = values[16];
		loadedAssets.galaxyNegY = values[17];
		loadedAssets.galaxyNegZ = values[18];
		loadedAssets.galaxyPosX = values[19];
		loadedAssets.galaxyPosY = values[20];
		loadedAssets.galaxyPosZ = values[21];

		loadedAssets.earthSky = values[22];
		loadedAssets.saturnRings = values[23];

		loadedAssets.sphere = values[24];
	}).catch(error => {
		console.error(error.message);
	}).finally(() => {
		onLoadedCB();
	})
}

function createShaders(loadedAssets) {
	phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

	phongShaderProgram.attributes = {
		vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
		vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
		vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
	};

	phongShaderProgram.uniforms = {
		worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
		viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
		projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
		lightDirectionUniform: gl.getUniformLocation(phongShaderProgram, "uLightDirection"),
		cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
		textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
	};

	flatShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.flatTextVS, loadedAssets.flatTextFS);

	flatShaderProgram.attributes = {
		vertexPositionAttribute: gl.getAttribLocation(flatShaderProgram, "aVertexPosition"),
		vertexNormalsAttribute: gl.getAttribLocation(flatShaderProgram, "aNormal"),
		vertexTexcoordsAttribute: gl.getAttribLocation(flatShaderProgram, "aTexcoords")
	};

	flatShaderProgram.uniforms = {
		worldMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uWorldMatrix"),
		viewMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uViewMatrix"),
		projectionMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uProjectionMatrix"),
		lightDirectionUniform: gl.getUniformLocation(flatShaderProgram, "uLightDirection"),
		cameraPositionUniform: gl.getUniformLocation(flatShaderProgram, "uCameraPosition"),
		textureUniform: gl.getUniformLocation(flatShaderProgram, "uTexture"),
	};

	textureShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.unlitTextureVS, loadedAssets.unlitTextureFS);

	textureShaderProgram.attributes = {
		vertexPositionAttribute: gl.getAttribLocation(textureShaderProgram, "aVertexPosition"),
		vertexTexcoordsAttribute: gl.getAttribLocation(textureShaderProgram, "aTexcoords")
	};

	textureShaderProgram.uniforms = {
		worldMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uWorldMatrix"),
		viewMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uViewMatrix"),
		projectionMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uProjectionMatrix"),
		textureUniform: gl.getUniformLocation(textureShaderProgram, "uTexture"),
		alphaUniform: gl.getUniformLocation(textureShaderProgram, "uAlpha"),
	};
}

function createScene() {
	sunGeometry = new WebGLGeometryJSON(gl, textureShaderProgram);
	sunGeometry.create(loadedAssets.sphere, loadedAssets.sun);

	earth.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	earth.geometry.create(loadedAssets.sphere, loadedAssets.earth);

	earth.moon.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	earth.moon.geometry.create(loadedAssets.sphere, loadedAssets.moon);

	mercury.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	mercury.geometry.create(loadedAssets.sphere, loadedAssets.mercury);

	venus.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	venus.geometry.create(loadedAssets.sphere, loadedAssets.venus);

	mars.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	mars.geometry.create(loadedAssets.sphere, loadedAssets.mars);

	jupiter.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	jupiter.geometry.create(loadedAssets.sphere, loadedAssets.jupiter);

	saturn.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	saturn.geometry.create(loadedAssets.sphere, loadedAssets.saturn);

	uranus.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	uranus.geometry.create(loadedAssets.sphere, loadedAssets.uranus);

	neptune.geometry = new WebGLGeometryJSON(gl, phongShaderProgram);
	neptune.geometry.create(loadedAssets.sphere, loadedAssets.neptune);


	// -- Galaxy Skybox -- \\
	let galaxyScale = new Matrix4().makeScale(150.0, 150.0, 150.0);
	galaxy.x.neg = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.x.neg.create(loadedAssets.galaxyNegX);

	let galaxyNegXRotate = new Matrix4().makeRotationY(-90);
	let galaxyNegXTranslation = new Matrix4().makeTranslation(-150, 0, 0);

	galaxy.x.neg.worldMatrix.makeIdentity();
	galaxy.x.neg.worldMatrix.multiply(galaxyNegXTranslation).multiply(galaxyNegXRotate).multiply(galaxyScale);

	galaxy.x.pos = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.x.pos.create(loadedAssets.galaxyPosX);

	let galaxyPosXRotate = new Matrix4().makeRotationY(90);
	let galaxyPosXTranslation = new Matrix4().makeTranslation(150, 0, 0);

	galaxy.x.pos.worldMatrix.makeIdentity();
	galaxy.x.pos.worldMatrix.multiply(galaxyPosXTranslation).multiply(galaxyPosXRotate).multiply(galaxyScale);

	galaxy.y.neg = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.y.neg.create(loadedAssets.galaxyNegY);

	let galaxyNegYRotate = new Matrix4().makeRotationX(-90);
	let galaxyNegYTranslation = new Matrix4().makeTranslation(0, -150, 0);

	galaxy.y.neg.worldMatrix.makeIdentity();
	galaxy.y.neg.worldMatrix.multiply(galaxyNegYTranslation).multiply(galaxyNegYRotate).multiply(galaxyScale);

	galaxy.y.pos = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.y.pos.create(loadedAssets.galaxyPosY);

	let galaxyPosYRotate = new Matrix4().makeRotationX(90);
	let galaxyPosYTranslation = new Matrix4().makeTranslation(0, 150, 0);

	galaxy.y.pos.worldMatrix.makeIdentity();
	galaxy.y.pos.worldMatrix.multiply(galaxyPosYTranslation).multiply(galaxyPosYRotate).multiply(galaxyScale);

	galaxy.z.neg = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.z.neg.create(loadedAssets.galaxyNegZ);

	let galaxyNegZRotate = new Matrix4().makeRotationY(180);
	let galaxyNegZTranslation = new Matrix4().makeTranslation(0, 0, -150);

	galaxy.z.neg.worldMatrix.makeIdentity();
	galaxy.z.neg.worldMatrix.multiply(galaxyNegZTranslation).multiply(galaxyNegZRotate).multiply(galaxyScale);

	galaxy.z.pos = new WebGLGeometryQuad(gl, textureShaderProgram);
	galaxy.z.pos.create(loadedAssets.galaxyPosZ);

	let galaxyPosZRotate = new Matrix4().makeRotationY(0);
	let galaxyPosZTranslation = new Matrix4().makeTranslation(0, 0, 150);

	galaxy.z.pos.worldMatrix.makeIdentity();
	galaxy.z.pos.worldMatrix.multiply(galaxyPosZTranslation).multiply(galaxyPosZRotate).multiply(galaxyScale);

	// -- Planets -- \\
	let sunScale = new Matrix4().makeScale(0.1, 0.1, 0.1);
	let earthScale = new Matrix4().makeScale(0.03, 0.03, 0.03);

	let mercuryScale = new Matrix4().makeScale(0.017, 0.017, 0.017);
	let venusScale = new Matrix4().makeScale(0.024, 0.024, 0.024);
	let marsScale = new Matrix4().makeScale(0.020, 0.020, 0.020);
	let jupiterScale = new Matrix4().makeScale(0.05, 0.05, 0.05);
	let saturnScale = new Matrix4().makeScale(0.045, 0.045, 0.045);
	let uranusScale = new Matrix4().makeScale(0.038, 0.038, 0.038);
	let neptuneScale = new Matrix4().makeScale(0.034, 0.034, 0.034);

	let earthTranslation = new Matrix4().makeTranslation(-15, 0, 0);

	let mercuryTranslation = new Matrix4().makeTranslation(-8, 0, 0);
	let venusTranslation = new Matrix4().makeTranslation(-11, 0, 0);
	let marsTranslation = new Matrix4().makeTranslation(-20, 0, 0);
	let jupiterTranslation = new Matrix4().makeTranslation(-25, 0, 0);
	let saturnTranslation = new Matrix4().makeTranslation(-31.5, 0, 0);
	let uranusTranslation = new Matrix4().makeTranslation(-37, 0, 0);
	let neptuneTranslation = new Matrix4().makeTranslation(-42, 0, 0);

	sunGeometry.worldMatrix.makeIdentity();
	sunGeometry.worldMatrix.multiply(sunScale);

	earth.geometry.worldMatrix.multiply(earthTranslation).multiply(earthScale);
	mercury.geometry.worldMatrix.multiply(mercuryTranslation).multiply(mercuryScale);
	venus.geometry.worldMatrix.multiply(venusTranslation).multiply(venusScale);
	mars.geometry.worldMatrix.multiply(marsTranslation).multiply(marsScale);
	jupiter.geometry.worldMatrix.multiply(jupiterTranslation).multiply(jupiterScale);
	saturn.geometry.worldMatrix.multiply(saturnTranslation).multiply(saturnScale);
	uranus.geometry.worldMatrix.multiply(uranusTranslation).multiply(uranusScale);
	neptune.geometry.worldMatrix.multiply(neptuneTranslation).multiply(neptuneScale);
}

function updateAndRender() {
	requestAnimationFrame(updateAndRender);

	const aspectRatio = gl.canvasWidth / gl.canvasHeight;

	time.update();
	camera.update(time.deltaTime);

	gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

	gl.clearColor(0.707, 0.707, 1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(phongShaderProgram);
	let uniforms = phongShaderProgram.uniforms;
	let cameraPosition = camera.getPosition();
	gl.uniform3f(uniforms.lightDirectionUniform, lightDirection.x, lightDirection.y, lightDirection.z);
	gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

	// -- Rotations -- \\
	let sunRotation = new Matrix4().makeRotationY(0.5);
	sunGeometry.worldMatrix.multiply(sunRotation);

	let earthRotation = new Matrix4().makeRotationY(earth.degrees % 360);
	earth.geometry.worldMatrix.premultiply(earthRotation);
	earth.geometry.worldMatrix.multiply(earthRotation);

	let moonOffset = new Matrix4().makeTranslation(new Vector3(0, 0, 3));
	let moonTranslation = new Matrix4().makeTranslation(earth.geometry.worldMatrix.getElement(0, 3), earth.geometry.worldMatrix.getElement(1, 3), earth.geometry.worldMatrix.getElement(2, 3));
	let moonRotation = new Matrix4().makeRotationY(earth.moon.degrees);
	let moonScale = new Matrix4().makeScale(0.01, 0.01, 0.01);
	let moonTRS = new Matrix4().makeIdentity();
	moonTRS.multiply(moonOffset).multiply(moonRotation).multiply(moonScale);
	earth.moon.geometry.worldMatrix.makeIdentity();
	earth.moon.geometry.worldMatrix.multiply(moonTranslation);
	earth.moon.geometry.worldMatrix.multiply(moonTRS);

	mercury.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(mercury.degrees));
	venus.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(venus.degrees));
	mars.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(mars.degrees));
	jupiter.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(jupiter.degrees));
	saturn.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(saturn.degrees));
	uranus.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(uranus.degrees));
	neptune.geometry.worldMatrix.premultiply(new Matrix4().makeRotationY(neptune.degrees));

	projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

	sunGeometry.render(camera, projectionMatrix, textureShaderProgram);
	earth.geometry.render(camera, projectionMatrix, phongShaderProgram);
	earth.moon.geometry.render(camera, projectionMatrix, phongShaderProgram);
	mercury.geometry.render(camera, projectionMatrix, phongShaderProgram);
	venus.geometry.render(camera, projectionMatrix, phongShaderProgram);
	mars.geometry.render(camera, projectionMatrix, phongShaderProgram);
	jupiter.geometry.render(camera, projectionMatrix, phongShaderProgram);
	saturn.geometry.render(camera, projectionMatrix, phongShaderProgram);
	uranus.geometry.render(camera, projectionMatrix, phongShaderProgram);
	neptune.geometry.render(camera, projectionMatrix, phongShaderProgram);

	galaxy.x.neg.render(camera, projectionMatrix, textureShaderProgram);
	galaxy.y.neg.render(camera, projectionMatrix, textureShaderProgram);
	galaxy.z.neg.render(camera, projectionMatrix, textureShaderProgram);
	galaxy.x.pos.render(camera, projectionMatrix, textureShaderProgram);
	galaxy.y.pos.render(camera, projectionMatrix, textureShaderProgram);
	galaxy.z.pos.render(camera, projectionMatrix, textureShaderProgram);

	gl.enable(gl.BLEND);
}



// EOF 00100001-10