<script setup lang="ts">
import { useRenderLoop } from '@tresjs/core';
import { CapsuleGeometry, Mesh, MeshToonMaterial } from 'three';
import { ref, shallowRef } from "vue";
import { TresCanvas } from '@tresjs/core'


// const scene = new Scene()
const geometry = new CapsuleGeometry(1,1.5,4,8)
const material = new MeshToonMaterial({
  color: 0x9FB9C7,
  wireframe: true,
  wireframeLinewidth: 1,
})
const mesh = new Mesh(geometry, material)
// scene.add(capsule)
const { onLoop } = useRenderLoop()
const cameraRef = shallowRef()
const roationY = ref(0)

onLoop(() =>{
  roationY.value += 0.01
})
</script>

<template>
  <div class="threed">
  <TresCanvas alpha>
    <TresPerspectiveCamera ref="cameraRef" :position="[3,3,3]" :look-at="[0,0,0]"/>
    <primitive :object = "mesh" :scale="[1.5,1.5,1.5]" :position="[-1,-1,-1]" :rotation="[0,roationY,1]"/>
    <TresAmbientLight :intensity="1" />
  </TresCanvas>
</div>
</template>

<style scoped>
.threed {
  margin: 0;
  padding: 0;
  height: 500px;
  width: 500px;
  overflow: hidden;
}
/* #canvas{
  height: 100%;
  width: 100%;
} */
</style>
