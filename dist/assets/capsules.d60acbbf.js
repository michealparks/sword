import{d as l,b as h,I as m,N as i,s as C,C as M,M as f,c as p,R as w,a as u,A as y,o as g}from"./index.f99e7c85.js";import{r as S}from"./colors.e0be99e4.js";const o=8,t=.25,d=t*2,z=new l(t,d,o,o*2),A=new h,e=new m(z,A,i);e.castShadow=!0;e.receiveShadow=!0;C.add(e);const n=new M,r=new f;for(let s=0;s<i;s+=1)n.set(S()),e.setColorAt(s,n),r.setPosition(Math.random()*10-5,Math.random()*10,Math.random()*10-5),e.setMatrixAt(s,r);e.instanceColor.needsUpdate=!0;const E=await p(e,{type:w.Dynamic,collider:u.Capsule,events:y.CONTACT_EVENTS,halfHeight:d/2,radius:t});for(const a of E)g("start",a,(...c)=>{});
