"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createStage } from "@/lib/scene/stage";
import { yarnMaterial,yarnTextures } from "@/lib/scene/yarn";

const colors=[{name:"Dusty rose",hex:"#d99aa5"},{name:"Sage",hex:"#a8b89a"},{name:"Sunflower",hex:"#e8b84b"},{name:"Lilac",hex:"#b6a1c6"},{name:"Plum",hex:"#794b68"},{name:"Warm cream",hex:"#ebd6ae"}];
export default function YarnBraid(){
 const host=useRef<HTMLDivElement>(null),section=useRef<HTMLElement>(null);const [picked,setPicked]=useState([0,1,2]);const current=useRef(picked);current.current=picked;const [failed,setFailed]=useState(false);
 useEffect(()=>{const el=host.current!;let stage:ReturnType<typeof createStage>;try{stage=createStage(el,{fov:32,cam:[0,0,7.7]});}catch{setFailed(true);return;}
 const segments=160,radial=8;const owned:ReturnType<typeof yarnTextures>[]=[];
 const strands=Array.from({length:3},(_,i)=>{const tex=yarnTextures({base:"#ffffff"});owned.push(tex);tex.map.repeat.set(28,2);tex.bump.repeat.set(28,2);const material=yarnMaterial(tex);const pos=new Float32Array((segments+1)*(radial+1)*3),uv=new Float32Array((segments+1)*(radial+1)*2),indices:number[]=[];
 for(let s=0;s<=segments;s++)for(let r=0;r<=radial;r++){const v=s*(radial+1)+r;uv.set([s/segments,r/radial],v*2);if(s<segments&&r<radial){const a=v,b=v+radial+1;indices.push(a,b,a+1,b,b+1,a+1);}}
 const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.BufferAttribute(pos,3));geo.setAttribute("uv",new THREE.BufferAttribute(uv,2));geo.setIndex(indices);const mesh=new THREE.Mesh(geo,material);stage.scene.add(mesh);return {geo,pos,material,i};});
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let braid=0;
 stage.start((_dt,time)=>{const rect=section.current!.getBoundingClientRect();const progress=THREE.MathUtils.clamp((window.innerHeight-rect.top)/(rect.height+window.innerHeight*.2),0,1);const target=THREE.MathUtils.smoothstep(progress,.2,.7);braid+=(target-braid)*.06;
 strands.forEach(({geo,pos,material,i})=>{material.color.set(colors[current.current[i]].hex);const t=reduce?0:time*.35;
 for(let s=0;s<=segments;s++){const u=s/segments,phase=u*Math.PI*7-t+i*Math.PI*2/3;const fy=Math.sin(u*6+t+i*1.8)*.32+(i-1)*.75,by=Math.sin(phase)*.35;const fz=Math.cos(u*4+t+i)*.3,bz=Math.cos(phase)*.4;const cy=fy+(by-fy)*braid,cz=fz+(bz-fz)*braid;
 for(let r=0;r<=radial;r++){const a=r/radial*Math.PI*2;pos.set([(u-.5)*12,cy+Math.cos(a)*.09,cz+Math.sin(a)*.09],(s*(radial+1)+r)*3);}}
 geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();});});
 return()=>{owned.forEach(t=>t.dispose());stage.dispose();};},[]);
 return <section className="braid-section" id="yarn" ref={section}><div className="wide-heading"><span className="eyebrow">YOUR COLORS. YOUR LITTLE WORLD.</span><h2>A little yarn.<br/><span className="gradient">Endless possibilities.</span></h2><p>Pick three shades. Scroll to watch them come together.</p></div><div className="braid-canvas" ref={host}>{failed&&<div className="static-strands">{picked.map((i,n)=><i key={n} style={{background:colors[i].hex}}/>)}</div>}</div><div className="braid-bottom"><div><span className="eyebrow">YOUR PALETTE</span><strong>{picked.map(i=>colors[i].name).join(" · ")}</strong></div><div className="braid-swatches">{colors.map((c,i)=><button key={c.name} className={picked.includes(i)?"chosen":""} style={{background:c.hex}} aria-label={`Add ${c.name} to palette`} aria-pressed={picked.includes(i)} onClick={()=>setPicked(p=>p.includes(i)?p:[...p.slice(1),i])}>{picked.includes(i)&&"✓"}</button>)}</div><a className="pill-button" href="#custom">Make it yours <span>↗</span></a></div><p className="scene-disclaimer">A playful yarn visualization. Available yarn shades are confirmed on enquiry.</p></section>;
}
