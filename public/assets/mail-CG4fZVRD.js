import{c as i,A as _,p as o,q as c}from"./index-C_mrxXDW.js";/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=i("ChevronRightIcon",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=i("FileTextIcon",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=i("LogOutIcon",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=i("MailIcon",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=i("ShieldIcon",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-vue-next v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=i("SparklesIcon",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]),T=/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?)$/,b=/(?:[zZ]|[+-]\d{2}:\d{2})$/;function g(t){if(t==null||t==="")return null;if(t instanceof Date)return Number.isNaN(t.getTime())?null:t;if(typeof t=="number"){const n=new Date(t);return Number.isNaN(n.getTime())?null:n}if(typeof t!="string"){const n=new Date(t);return Number.isNaN(n.getTime())?null:n}const a=t.trim();if(!a)return null;if(b.test(a)){const n=new Date(a);return Number.isNaN(n.getTime())?null:n}const r=a.match(T);if(r){const n=new Date(`${r[1]}T${r[2]}Z`);return Number.isNaN(n.getTime())?null:n}const l=new Date(a);return Number.isNaN(l.getTime())?null:l}function w(t){if(t==null||t==="")return t??null;const a=g(t);return a?a.toISOString():typeof t=="string"?t.trim():null}const q=_("mail",()=>{const t=o(localStorage.getItem("tm_token")||null),a=o(localStorage.getItem("tm_email")||null),r=o(localStorage.getItem("tm_emailId")||null),l=o(localStorage.getItem("tm_expiresAt")||null),n=o([]),s=o([]),m=o(null),u=o(!1),h=c(()=>!!t.value&&!!a.value),d=c(()=>{if(!l.value)return 0;const e=g(l.value);return e?Math.max(0,e.getTime()-Date.now()):0}),f=c(()=>d.value<=0),I=c(()=>s.value.filter(e=>!e.seen).length);function k(e){t.value=e.token,a.value=e.address,r.value=e.id,l.value=e.expiresAt,localStorage.setItem("tm_token",e.token),localStorage.setItem("tm_email",e.address),localStorage.setItem("tm_emailId",e.id),localStorage.setItem("tm_expiresAt",e.expiresAt)}function y(){t.value=null,a.value=null,r.value=null,l.value=null,s.value=[],m.value=null,localStorage.removeItem("tm_token"),localStorage.removeItem("tm_email"),localStorage.removeItem("tm_emailId"),localStorage.removeItem("tm_expiresAt")}function S(e){s.value=e}function x(e){m.value=e}function M(e){n.value=e}function N(e){u.value=e}function v(e=30){const p=w(new Date(Date.now()+e*60*1e3));l.value=p,localStorage.setItem("tm_expiresAt",p)}return{token:t,email:a,emailId:r,expiresAt:l,domains:n,mails:s,currentMail:m,loading:u,isAuthenticated:h,remainingTime:d,isExpired:f,unreadCount:I,setSession:k,clearSession:y,setMails:S,setCurrentMail:x,setDomains:M,setLoading:N,extendExpiry:v}});export{D as C,L as F,C as L,E as M,H as S,z as a,g as p,q as u};
