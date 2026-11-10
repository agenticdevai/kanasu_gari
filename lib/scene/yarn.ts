import * as THREE from "three";

export type YarnSpec = { base: string; accent?: string; zari?: string; pattern?: string; shape?: string };
export function yarnTextures(spec: YarnSpec, width = 512, height = 512) {
  const canvas = document.createElement("canvas"); canvas.width=width;canvas.height=height;
  const c=canvas.getContext("2d")!; c.fillStyle=spec.base;c.fillRect(0,0,width,height);
  const step=16;
  for(let y=-step;y<height+step;y+=step){for(let x=-step;x<width+step;x+=step){
    const dx=x+(Math.round(y/step)%2)*step/2;
    c.lineCap="round";c.lineWidth=5;c.strokeStyle="rgba(0,0,0,.14)";c.beginPath();c.moveTo(dx-5,y-5);c.quadraticCurveTo(dx-8,y+3,dx,y+7);c.quadraticCurveTo(dx+8,y+3,dx+5,y-5);c.stroke();
    c.lineWidth=2.3;c.strokeStyle="rgba(255,255,255,.34)";c.beginPath();c.moveTo(dx-4,y-6);c.quadraticCurveTo(dx-5,y+1,dx,y+4);c.quadraticCurveTo(dx+5,y+1,dx+4,y-6);c.stroke();
    c.lineWidth=.5;c.strokeStyle="rgba(255,255,255,.2)";c.beginPath();c.moveTo(dx-4,y-3);c.lineTo(dx+4,y+3);c.stroke();
  }}
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;
  const bump=map.clone();bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;
  const orm=map.clone();orm.needsUpdate=true;
  return {map,bump,orm,dispose:()=>{map.dispose();bump.dispose();orm.dispose();}};
}
export function yarnMaterial(t:ReturnType<typeof yarnTextures>,_spec?:YarnSpec){return new THREE.MeshPhysicalMaterial({map:t.map,bumpMap:t.bump,bumpScale:.025,roughness:.92,metalness:0,sheen:.45,sheenRoughness:1,sheenColor:new THREE.Color("#fff4df"),side:THREE.DoubleSide});}

export function makeCraft(id:string) {
  const group=new THREE.Group();const owned:ReturnType<typeof yarnTextures>[]=[];
  const materials=new Map<string,THREE.MeshPhysicalMaterial>();
  const mat=(color:string)=>{if(materials.has(color))return materials.get(color)!;const t=yarnTextures({base:color});owned.push(t);const m=yarnMaterial(t);materials.set(color,m);return m;};
  const ball=(color:string,x:number,y:number,z:number,sx:number,sy:number,sz:number)=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),mat(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);group.add(mesh);return mesh;};
  const tube=(color:string,points:number[][],radius:number)=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,32,radius,8,false),mat(color));group.add(m);return m;};
  const box=(color:string,x:number,y:number,z:number,w:number,h:number,d:number)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,8,8,3),mat(color));mesh.position.set(x,y,z);group.add(mesh);return mesh;};
  const flower=(x:number,y:number,z:number,kind:string)=>{
    tube("#6b8356",[[x,y-.6,z],[x+.02,y-.25,z],[x,y,z]],.025);
    const petals=kind==="sunflower"?12:8;
    for(let i=0;i<petals;i++){const a=i/petals*Math.PI*2;const petal=ball(kind==="sunflower"?"#e6ad32":"#f9e6cb",x+Math.sin(a)*.19,y+Math.cos(a)*.19,z,.085,.18,.045);petal.rotation.z=-a;}
    ball(kind==="sunflower"?"#7d563a":"#d7a13d",x,y,z+.055,.13,.13,.07);
    const leaf=ball("#81966b",x+.12,y-.4,z,.14,.055,.025);leaf.rotation.z=.5;
  };
  if(id==="bunny"){
    ball("#d0a065",0,-.18,0,.23,.32,.17);ball("#d0a065",0,.3,0,.27,.26,.22);
    [-1,1].forEach(s=>{const ear=ball("#d0a065",s*.14,.69,0,.085,.31,.065);ear.rotation.z=s*-.14;ball("#d8b49e",s*.14,.70,.058,.04,.21,.014);ball("#d0a065",s*.26,-.17,0,.075,.27,.075);ball("#d0a065",s*.12,-.62,.035,.08,.25,.09);ball("#2c1d1b",s*.105,.34,.204,.027,.033,.018);});
    ball("#b65d7c",0,-.25,.02,.29,.25,.2);ball("#b65d7c",0,.06,.225,.055,.045,.025);tube("#b65d7c",[[0,.07,.23],[-.09,.13,.22],[-.13,.06,.23],[0,.07,.23],[.1,.13,.23],[.13,.06,.23],[0,.07,.23]],.022);
  } else if(id==="sunflower"||id==="daisy"){
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(.22,.15,.33,32,8),mat("#c39d70"));pot.position.y=-.6;group.add(pot);ball("#604d3d",0,-.43,0,.19,.025,.19);flower(0,.22,0,id);if(id==="daisy"){flower(-.2,-.03,-.07,id);flower(.21,.06,-.08,id);}
  } else if(id==="bag"){
    box("#e5d7b5",0,-.27,0,.65,.48,.25);tube("#dfcba3",[[-.32,-.1,0],[-.3,.53,0],[0,.73,0],[.3,.53,0],[.32,-.1,0]],.035);
    for(let i=0;i<5;i++){const x=(i-2)*.13;for(let k=0;k<7;k++){const a=k/7*Math.PI*2;ball("#9f3b64",x+Math.cos(a)*.055,.02+Math.sin(a)*.04,0,.055,.045,.065);}ball("#742747",x,.02,.06,.035,.03,.025);}
  } else if(id==="cushion"){
    ball("#c8ae82",0,-.05,0,.52,.48,.15);for(let s=0;s<4;s++)for(let i=0;i<12;i++){const a=s*Math.PI/2;const p=(i/11-.5)*.93;ball("#cfaa3d",Math.cos(a)*p-Math.sin(a)*.47,Math.sin(a)*p+Math.cos(a)*.47-.05,0,.06,.06,.13);}for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const p=ball("#f8e7bf",Math.sin(a)*.2,Math.cos(a)*.2-.05,.15,.08,.15,.025);p.rotation.z=-a;}ball("#d3a33e",0,-.05,.17,.11,.11,.03);
  } else if(id==="keychain"){
    ball("#d65a49",0,.08,0,.32,.27,.24);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const leaf=ball("#719052",Math.sin(a)*.12,.31,Math.cos(a)*.12,.04,.025,.13);leaf.rotation.y=a;}
    [-1,1].forEach(s=>{tube("#cc654f",[[s*.25,.05,0],[s*.38,-.15,.02],[s*.42,-.3,.04]],.035);tube("#cc654f",[[s*.13,-.14,0],[s*.14,-.46,0],[s*.2,-.65,.04]],.045);ball("#49312b",s*.1,.08,.232,.022,.028,.012);});
  } else if(id==="gajra"){
    for(let i=0;i<12;i++){const a=i/12*Math.PI*1.8;const x=Math.sin(a)*.38,y=Math.cos(a)*.38-.05;for(let k=0;k<5;k++){const b=k/5*Math.PI*2;ball("#f4e5c8",x+Math.sin(b)*.07,y+Math.cos(b)*.07,0,.065,.07,.04);}ball("#d6ac5e",x,y,.04,.035,.035,.025);}
  } else {
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const petal=ball(i%2?"#c64f82":"#e3b737",Math.sin(a)*.35,Math.cos(a)*.35,0,.1,.24,.05);petal.rotation.z=-a;}ball("#e9b046",0,0,.04,.24,.24,.05);ball("#b35b73",0,0,.1,.15,.15,.03);
  }
  group.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});
  return {group,dispose:()=>{owned.forEach(t=>t.dispose());}};
}
