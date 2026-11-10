"use client";
import {useEffect,useState} from "react";
import dynamic from "next/dynamic";
const Curtain=dynamic(()=>import("./Curtain3D"),{ssr:false});
export default function Intro(){const [visible,setVisible]=useState(false);const [opening,setOpening]=useState(false);
 useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;setVisible(true);const old=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";const timer=setTimeout(()=>setVisible(false),4500);return()=>{clearTimeout(timer);document.documentElement.style.overflow=old;};},[]);
 useEffect(()=>{if(!visible)document.documentElement.style.overflow="";},[visible]);
 if(!visible)return null;return <div className={`cinematic-intro ${opening?"opening":""}`}><Curtain openAt={800} onDone={()=>setVisible(false)} onFail={()=>{setOpening(true);setTimeout(()=>setVisible(false),1000);}}/><div className="intro-wordmark"><span>✳</span><strong>Kanasu Gari</strong><small>A LITTLE WORLD OF YARN</small></div><button className="skip-intro" onClick={()=>setVisible(false)}>Skip intro ↗</button></div>;
}
