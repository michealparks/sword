import{t as a,B as r,d as s,e as d,f as i,R as c,a as n}from"./index-22fffa8c.js";const{scene:l}=a(),e=20,t=.3,h=new r(e,t,e,1,1),y=new s({color:13421772}),o=new d(h,y);o.name="floor";o.receiveShadow=!0;l.add(o);await i(o,{ccd:!0,type:c.Fixed,collider:n.Cuboid,hx:e/2,hy:t/2,hz:e/2});export{o as floor,t as floorHeight,e as floorSize};
