import{t as l,b as h,d as m,I as C,N as i,C as M,M as f,c as p,R as w,a as u,A as y,o as g}from"./index-1601f4b8.js";import{r as S}from"./colors-e29a5892.js";const{scene:z}=l(),o=8,t=.25,c=t*2,A=new h(t,c,o,o*2),E=new m,e=new C(A,E,i);e.castShadow=!0;e.receiveShadow=!0;z.add(e);const n=new M,r=new f;for(let s=0;s<i;s+=1)n.set(S()),e.setColorAt(s,n),r.setPosition(Math.random()*10-5,Math.random()*10,Math.random()*10-5),e.setMatrixAt(s,r);e.instanceColor.needsUpdate=!0;const T=await p(e,{type:w.Dynamic,collider:u.Capsule,events:y.CONTACT_EVENTS,halfHeight:c/2,radius:t});for(const a of T)g("start",a,(...d)=>{});