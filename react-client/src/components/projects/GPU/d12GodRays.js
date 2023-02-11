//god ray shader technique was taken from:
//three.js-master/examples/webgl_postprocessing_godrays.html
//that example was done with a gnarly looking tree
//I inserted my own vertex models and also added fps control
//philip.bertani@gmail.com
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module';

import {
  GodRaysFakeSunShader,
  GodRaysDepthMaskShader,
  GodRaysCombineShader,
  GodRaysGenerateShader,
} from "./GodRaysShader";

import { d12Vertices } from "./graphicsFunctions.js";

let stats, renderer, uvwidth, uvheight, controls, clock;
let camera, scene, materialDepth;
let d12Mesh = [], d12group;

const sunPosition = new THREE.Vector3(0, 0, -400);
const clipPosition = new THREE.Vector4();
const screenSpacePosition = new THREE.Vector3();
const postprocessing = { enabled: true };  //A LOT of stuff gets schlopped into this object
const bgColor = 0x100725;
const sunColor = 0xffee40;

// Use a smaller size for some of the god-ray render targets for better performance.
const godrayRenderTargetResolutionMultiplier = 1; //1.0 / 2.0;  //pb

export function grInit({rendererIn,canvas,width,height}) {

    renderer = rendererIn

    camera = new THREE.PerspectiveCamera(70, width / height, .1, 3000);
    camera.position.z = 100;

    scene = new THREE.Scene();

    uvwidth = width; uvheight = height;  //dimensions of gr texture

    //materialDepth = new THREE.MeshPhongMaterial({ color: 0x2000B0 , transparent:true, opacity:.9}); //, flatShading: true });
    materialDepth = new THREE.MeshPhongMaterial({ color: 0x2000B0 })

    //renderer = new THREE.WebGLRenderer({ antialias: true });
    clock = new THREE.Clock()

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    //canvas.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, -10)
    light.castShadow = true;
    scene.add(light)

    light.shadow.mapSize.width = 1024; // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.1; // default
    light.shadow.camera.far = 3000; // default

    const d12 = d12Vertices(); window.d12 = d12;

    d12group = [new THREE.Object3D(), new THREE.Object3D()];
    const ss = 20;
    for (let j=1; j<=2; j++) {
    for (let i = 0; i < 20; i++) {
        //const vv = new THREE.BoxGeometry(4,6.47,1);
        //const vv = new THREE.DodecahedronGeometry(9,2);
        //const vv = new THREE.TorusGeometry(12, 3, 6, 9);
        const vv = new THREE.TorusGeometry(8*j, 3, 3, 6);
        let vvMesh = new THREE.Mesh(vv, materialDepth);
        //vvMesh.scale.multiplyScalar(5);
        vvMesh.position.x = d12[i * 3] * ss*j;
        vvMesh.position.y = d12[i * 3 + 1] * ss*j;
        vvMesh.position.z = d12[i * 3 + 2] * ss*j;
        const d12spherical = new THREE.Spherical()
        d12spherical.setFromVector3(vvMesh.position)

        vvMesh.rotation.x = d12spherical.phi  //Math.random() * 2;
        vvMesh.rotation.y = d12spherical.theta   //Math.random() * 3;
        vvMesh.castShadow = true;
        vvMesh.receiveShadow = true;

        d12group[j-1].add(vvMesh);
        d12Mesh.push(vvMesh);
    }
    }
    scene.add(d12group[0]);
    scene.add(d12group[1]);

    renderer.autoClear = false;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = -10;
    controls.maxDistance = 200;

    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI

    controls.minAzimuthAngle = -Math.PI/2.5
    controls.maxAzimuthAngle = Math.PI/2.5 

    //

    stats = new Stats();
    //canvas.appendChild(stats.dom);

    //window listener would go here

    initPostprocessing(width, height);

    return {renderer, camera, scene, d12group, d12Mesh, stats ,postprocessing}

}

function initPostprocessing(renderTargetWidth, renderTargetHeight) {

    postprocessing.scene = new THREE.Scene();

    //post processing takes the initial render as texture then 
    //works its magic - similar to shadertoy bufferA->bufferB->image
    postprocessing.camera = new THREE.OrthographicCamera(- 0.5, 0.5, 0.5, - 0.5, - 10000, 10000);
    postprocessing.camera.position.z = 100;

    postprocessing.scene.add(postprocessing.camera);

    postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight);
    postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight);
    postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight);

    // The ping-pong render targets can use an adjusted resolution to minimize cost

    const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
    const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
    postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight);
    postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight);

    // god-ray shaders

    const godraysMaskShader = GodRaysDepthMaskShader;
    postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone(godraysMaskShader.uniforms);
    postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial({
        uniforms: postprocessing.godrayMaskUniforms,
        vertexShader: godraysMaskShader.vertexShader,
        fragmentShader: godraysMaskShader.fragmentShader
    });

    const godraysGenShader = GodRaysGenerateShader;
    postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(godraysGenShader.uniforms);
    postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({
        uniforms: postprocessing.godrayGenUniforms,
        vertexShader: godraysGenShader.vertexShader,
        fragmentShader: godraysGenShader.fragmentShader
    });

    const godraysCombineShader = GodRaysCombineShader;
    postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(godraysCombineShader.uniforms);
    postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({
        uniforms: postprocessing.godrayCombineUniforms,
        vertexShader: godraysCombineShader.vertexShader,
        fragmentShader: godraysCombineShader.fragmentShader
    });

    const godraysFakeSunShader = GodRaysFakeSunShader;
    postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(godraysFakeSunShader.uniforms);
    postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({
        uniforms: postprocessing.godraysFakeSunUniforms,
        vertexShader: godraysFakeSunShader.vertexShader,
        fragmentShader: godraysFakeSunShader.fragmentShader
    });

    postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(bgColor);
    postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(sunColor);

    postprocessing.godrayCombineUniforms.fGodRayIntensity.value = .70;  //pb

    postprocessing.quad = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.0),
        postprocessing.materialGodraysGenerate
    );
    postprocessing.quad.position.z = - 9900;
    postprocessing.scene.add(postprocessing.quad);

}

export function renderGR(md) {

    stats.begin();
    //const cc = Math.cos(time), ss = Math.sin(time);

    //we need to cancel animation frame
    //console.log(md.sum,md.sumLow,md.sumMid,md.sumHigh)
    const iMusic = [md.sum,md.sumLow,md.sumMid,md.sumHigh]
    for (let i = 0; i < 40; i++) {
        const vv = d12Mesh[i];
        vv.rotation.y = Math.sin(iMusic[i%3]*2)*3    //.01;
        vv.rotation.z = Math.cos(iMusic[(i+1)%3]*2)*3
        //vv.material.color = new THREE.Color(iMusic[0]/3,iMusic[1]/3,iMusic[2]/3)
    }

    d12group[0].rotation.x += .02 * (1+md.sum/20)//md.sumLow;
    d12group[1].rotation.y += .01 * (1+md.sumLow/20)//md.sumMid;
    //d12group.rotation.z = md.sum

    if (postprocessing.enabled) {

        clipPosition.x = sunPosition.x;
        clipPosition.y = sunPosition.y;
        clipPosition.z = sunPosition.z;
        clipPosition.w = 1;

        clipPosition.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);

        // perspective divide (produce NDC/clip space: [-1,1]x[-1,1])

        clipPosition.x /= clipPosition.w;
        clipPosition.y /= clipPosition.w;

        screenSpacePosition.x = (clipPosition.x + 1) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.y = (clipPosition.y + 1) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibilty checks

        // Give it to the god-ray and sun shaders

        postprocessing.godrayGenUniforms['vSunPositionScreenSpace'].value.copy(screenSpacePosition);
        postprocessing.godraysFakeSunUniforms['vSunPositionScreenSpace'].value.copy(screenSpacePosition);

        // -- Draw sky and sun --

        // Clear colors and depths, will clear to sky color

        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.clear(true, true, false);

        // Sun render. Runs a shader that gives a brightness based on the screen
        // space distance to the sun. Not very efficient, so i make a scissor
        // rectangle around the suns position to avoid rendering surrounding pixels.

        //const sunsqH = 0.71 * uvheight; // 0.74 depends on extent of sun from shader
        //const sunsqW = 0.71 * uvheight; // both depend on height because sun is aspect-corrected

        screenSpacePosition.x *= uvwidth;
        screenSpacePosition.y *= uvheight;

        //this does nothing important as far as i can tell
        //renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
        //renderer.setScissorTest( true );

        postprocessing.godraysFakeSunUniforms['fAspect'].value = uvwidth / uvheight;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.render(postprocessing.scene, postprocessing.camera);

        //i don't know what to do with scissor test yet
        renderer.setScissorTest(false);

        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.render(scene, camera);

        // Depth

        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget(postprocessing.rtTextureDepth);
        renderer.clear();
        renderer.render(scene, camera);

        //
        postprocessing.godrayMaskUniforms['tInput'].value = postprocessing.rtTextureDepth.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysDepthMask;
        renderer.setRenderTarget(postprocessing.rtTextureDepthMask);
        renderer.render(postprocessing.scene, postprocessing.camera);

        // -- Render god-rays --

        // Maximum length of god-rays (in texture space [0,1]X[0,1])

        const filterLen = 1.0;

        // Samples taken by filter

        const TAPS_PER_PASS = 6.0;  //why so sensitive to change in this input?  any more or less and we get banding/aliasing

        // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
        // would start with a small filter support and grow to large. however
        // the large-to-small order produces less objectionable aliasing artifacts that
        // appear as a glimmer along the length of the beams

        // pass 1 - render into first ping-pong target
        filterGodRays(postprocessing.rtTextureDepthMask.texture, postprocessing.rtTextureGodRays2, getStepSize(filterLen, TAPS_PER_PASS, 1.0));

        // pass 2 - render into second ping-pong target
        filterGodRays(postprocessing.rtTextureGodRays2.texture, postprocessing.rtTextureGodRays1, getStepSize(filterLen, TAPS_PER_PASS, 2.0));

        // pass 3 - 1st RT
        filterGodRays(postprocessing.rtTextureGodRays1.texture, postprocessing.rtTextureGodRays2, getStepSize(filterLen, TAPS_PER_PASS, 3.0));

        // final pass - composite god-rays onto colors

        postprocessing.godrayCombineUniforms['tColors'].value = postprocessing.rtTextureColors.texture;
        postprocessing.godrayCombineUniforms['tGodRays'].value = postprocessing.rtTextureGodRays2.texture;

        postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

        renderer.setRenderTarget(null);
        renderer.render(postprocessing.scene, postprocessing.camera);
        postprocessing.scene.overrideMaterial = materialDepth; //null;

    } else {

        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(scene, camera);

    }

    stats.end();
  
}

function getStepSize(filterLen, tapsPerPass, pass) {
    return filterLen * Math.pow(tapsPerPass, -pass);
}

function filterGodRays(inputTex, renderTarget, stepSize) {

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

    postprocessing.godrayGenUniforms['fStepSize'].value = stepSize;
    postprocessing.godrayGenUniforms['tInput'].value = inputTex;

    renderer.setRenderTarget(renderTarget);
    renderer.render(postprocessing.scene, postprocessing.camera);
    postprocessing.scene.overrideMaterial = null;

}
