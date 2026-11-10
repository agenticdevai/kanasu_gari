"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createStage } from "@/lib/scene/stage";
import { makeCraft } from "@/lib/scene/yarn";
import type { Product } from "@/lib/products";

type Props={items:Product[];onSelect:(product:Product)=>void;detail?:boolean};
export default function CraftStage(props:Props){
  const host=useRef<HTMLDivElement>(null);const live=useRef(props);live.current=props;
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const el=host.current!;let stage:ReturnType<typeof createStage>|undefined;
    try{stage=createStage(el,{fov:props.detail?33:34,cam:[0,.1,props.detail?3.4:5.1],look:[0,.05,0]});}catch{setFailed(true);return;}
    const {scene,camera}=stage;const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const entries=props.items.map((product,i)=>{const craft=makeCraft(product.id);craft.group.traverse(o=>o.userData.index=i);scene.add(craft.group);return {...craft,product,x:0,y:0,z:0,rotation:0,scale:1};});
    const wood=new THREE.MeshStandardMaterial({color:0xb9a184,roughness:.65});
    const shelf=new THREE.Mesh(new THREE.BoxGeometry(1,.065,.65),wood);shelf.position.y=-1.05;
    if(!props.detail)scene.add(shelf);
    const line=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1,12),new THREE.MeshStandardMaterial({color:0x9d7d67,roughness:.7}));line.rotation.z=Math.PI/2;line.position.y=1.15;if(!props.detail)scene.add(line);
    let hot=-1,dragging=false,lastX=0,rotation=0,velocity=0,moved=false;
    const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
    const pick=(e:PointerEvent)=>{const r=el.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);const hit=ray.intersectObjects(entries.map(p=>p.group),true)[0];return hit?Number(hit.object.userData.index):-1;};
    const down=(e:PointerEvent)=>{lastX=e.clientX;dragging=true;moved=false;el.setPointerCapture(e.pointerId);};
    const move=(e:PointerEvent)=>{if(dragging){const dx=e.clientX-lastX;if(Math.abs(dx)>2)moved=true;velocity=dx*.008;rotation+=velocity;lastX=e.clientX;}else{hot=pick(e);el.style.cursor=hot>=0?"grab":"default";}};
    const up=(e:PointerEvent)=>{dragging=false;if(!moved){const i=pick(e);if(i>=0&&!props.detail)live.current.onSelect(entries[i].product);}};
    const leave=()=>{hot=-1;};
    el.addEventListener("pointerdown",down);el.addEventListener("pointermove",move);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",()=>{dragging=false;});el.addEventListener("pointerleave",leave);
    stage.start((dt,time)=>{
      if(!stage)return;const {vw}=stage.viewSize();const n=entries.length;const gap=Math.min(1.1,vw*.85/Math.max(1,n));
      shelf.scale.x=Math.min(10,vw*.94);line.scale.y=Math.min(10,vw*.94);
      if(!dragging){velocity*=.94;if(props.detail)rotation+=velocity;else rotation*=.95;}
      entries.forEach((entry,i)=>{const on=i===hot;const targetX=props.detail?0:(i-(n-1)/2)*gap;const targetZ=on&&!props.detail ? .45 : 0;
        const ease=1-Math.exp(-dt*8);entry.x+=(targetX-entry.x)*ease;entry.z+=(targetZ-entry.z)*ease;entry.y+=((on?.12:0)-entry.y)*ease;
        const scale=props.detail?1:Math.min(.92,gap*.9);entry.scale+=((on?scale*1.1:scale)-entry.scale)*ease;
        entry.group.position.set(entry.x,entry.y+(reduce?0:Math.sin(time*.85+i*.7)*.025),entry.z);
        entry.group.scale.setScalar(entry.scale);entry.group.rotation.y=(props.detail?rotation:rotation*.3+(on?Math.sin(time*.7)*.2:Math.sin(i)*.14));entry.group.rotation.z=reduce?0:Math.sin(time*.8+i)*.018;
      });
    });
    return()=>{el.removeEventListener("pointerdown",down);el.removeEventListener("pointermove",move);el.removeEventListener("pointerup",up);el.removeEventListener("pointerleave",leave);entries.forEach(e=>e.dispose());stage?.dispose();};
  },[props.items,props.detail]);
  return <div className={`craft-stage ${props.detail?"detail-stage":""}`} ref={host} role="img" aria-label={props.detail?"Stylized crochet model. Drag to rotate.":"Interactive 3D crochet collection. Select a creation to explore."}>{failed&&<div className="webgl-fallback">{props.items.map(p=><button key={p.id} onClick={()=>props.onSelect(p)}><img src={p.image} alt={p.name}/><span>{p.name}</span></button>)}</div>}</div>;
}
