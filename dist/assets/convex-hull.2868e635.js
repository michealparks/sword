import{M as d,l as o,I as c,N as n,s as l,c as m,R as y,a as p}from"./index.f99e7c85.js";import{a as M}from"./key-events.13d2ff24.js";const i=new d,[f,h]=await Promise.all([o("ship.glb"),o("asteroid.glb")]),a=h.scene.getObjectByName("Asteroid"),g=new Float32Array(a.geometry.attributes.position.array),s=new c(a.geometry,a.material,n);l.add(s);const e=20,r=e/2;for(let t=0;t<n;t+=1)i.setPosition(Math.random()*e-r,Math.random()*e,Math.random()*e-r),s.setMatrixAt(t,i);const w=await m(s,{type:y.Dynamic,collider:p.ConvexHull,vertices:g,density:5});M(w,.1);
