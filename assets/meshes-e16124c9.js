import{j as M,V as C,g as G,y,I as d,N as s,B as S,k as A,l as f,m as v,O as T,P as B,T as P,n as U,p as I,q as N,d as O,D as j,M as h,C as D,c as F,R,a as z}from"./index-6117cbb4.js";import{r as E}from"./colors-e29a5892.js";class K extends M{scale=0;constructor(o=1){super(),this.scale=o}getPoint(o,u=new C){const p=o*3-1.5,x=Math.sin(2*Math.PI*o),b=0;return u.set(p,x,b).multiplyScalar(this.scale)}}const{scene:V}=G(),[k,q]=await Promise.all([y("glb/ship.glb"),y("glb/asteroid.glb")]),l={geometry:localStorage.getItem("sword.demo.mesh.geometry")??"box"},e=.5,H=new K(1);let t,n,i,a;if(l.geometry==="asteroid"){const r=q.scene.getObjectByName("Asteroid");a=r.geometry,t=new d(r.geometry,r.material,s),n=new Float32Array(a.attributes.position.array),i=t.geometry.index?new Uint32Array(t.geometry.index.array):void 0}else if(l.geometry==="ship"){const r=k.scene.getObjectByName("Collider");a=r.geometry,t=new d(r.geometry,r.material,s),n=new Float32Array(a.attributes.position.array),i=t.geometry.index?new Uint32Array(t.geometry.index.array):void 0}else{a={box:new S(e,e,e),cone:new A(e,e*2,3),cylinder:new f(e,e,e*2,5),icosahedron:new v(e),octahedron:new T(e,1),plane:new B(e,e),tetrahedron:new P(e),torus:new U(e,e/3,4,6),torusKnot:new I(e,e/3,15,6),tube:new N(H,15,e/2,6,!1)}[l.geometry];const r=new O;r.side=j,r.flatShading=!0,t=new d(a,r,s),n=new Float32Array(a.attributes.position.array),i=t.geometry.index?new Uint32Array(t.geometry.index.array):void 0}t.castShadow=!0;t.receiveShadow=!0;V.add(t);const W=new h,c=new h;W.copy(t.matrixWorld).invert();const g=new D,m=20,w=m/2;for(let r=0;r<s;r+=1)g.set(E()),t.setColorAt(r,g),c.setPosition(Math.random()*m-w,Math.random()*m,Math.random()*m-w),t.setMatrixAt(r,c);t.instanceMatrix.needsUpdate=!0;t.instanceColor.needsUpdate=!0;await F(t,{type:R.Dynamic,collider:z.Trimesh,vertices:n,indices:i});
