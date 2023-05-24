let Z=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,n)=>(n&=63,n<36?e+=n.toString(36):n<62?e+=(n-26).toString(36).toUpperCase():n>62?e+="-":e+="_",e),"");var nt=Object.defineProperty,L=Object.getOwnPropertySymbols,rt=Object.prototype.hasOwnProperty,ot=Object.prototype.propertyIsEnumerable,U=(t,e,n)=>e in t?nt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,V=(t,e)=>{for(var n in e||(e={}))rt.call(e,n)&&U(t,n,e[n]);if(L)for(var n of L(e))ot.call(e,n)&&U(t,n,e[n]);return t};function at(t){if(t===null||Array.isArray(t)&&t.length===0)return null;let e=Number(t);return Number.isNaN(e)?null:Number(t)}var ut=/([A-Z]{3})[scn]?/,it=/[A-Z]{3}([scn]?)/,ct=/([A-Z]{3}[scn]?)/,lt=/([0,.[\]]+)/,st=/\.\]?([0-9[\]]*)/,ft=/\[\.\]/,N=/^\([^)]*\)/,mt=/^([0-9]+)/,dt=/^([0]+)/,gt=/[aA]\)?$/,bt=/E\)?$/,yt=/A\)?$/,ht=/e\)?$/,pt=/a\)?$/,vt=/[aAeE]\)?$/,x=/\[([0]+)\]/,At=/o\)?$/,Ot=/([0]+)/,T=/[0\]]\s[o%bBmk]/,wt=/^\+/,G=/^([0]+)/,It=/b$/,Ft=/B$/,Pt=/[bB]$/,H=/k\)?$/,q=/m\)?$/,I=/[bBmik]\)?$/;function Mt(t){if(pt.test(t))return"short";if(yt.test(t))return"long"}function $t(t){let[,e]=t.match(ut)||[""];return e||void 0}function xt(t){let[,e]=t.match(it)||[""];switch(e){case"s":return"narrowSymbol";case"c":return"code";case"n":return"name";default:return"symbol"}}function _t(t){return N.test(t)?"accounting":"standard"}function F(t){let[e]=lt.exec(t||"")||["0,000"];return e==="0,0"?"0,000":e}function z(t){let[e]=st.exec(t)||[""],[n]=Ot.exec(e)||[""],[,o]=x.exec(e)||["",""];return[n.length,o.length]}function Nt(t,e){let n=F(e),[o,r]=z(n);return I.test(e)?Math.max(o+r,2):o+r}function Tt(t,e){let[n]=e;return n}function kt(t,e){let n=F(e),[o,r]=z(n);if(ft.test(n)){let a=t.toString();return x.test(n)?Tt(t,[o,r]):a.indexOf(".")>-1?o:0}return x.test(n)?o:o+r}function J(t){let[e]=dt.exec(t)||[""];return e.length}function St(t,e){let n=F(e);if(n==="0,000"||vt.test(e||""))return;let o=J(n),r=t.toString(),[a]=mt.exec(r)||[""],[i]=G.exec(r)||[""];return Math.max(o,a.length-i.length)||void 0}function Bt(t){return gt.test(t)?"compact":ht.test(t)?"scientific":bt.test(t)?"engineering":"standard"}function Et(t){return N.test(t)?"never":wt.test(t)?"exceptZero":"auto"}function Ct(t){return ct.test(t)?"currency":I.test(t)?"unit":t.includes("%")?"percent":"decimal"}function X(t,e){let n=Math.floor(Math.log(t)/Math.log(1024));return e[n]}function Rt(t){let e=Math.abs(t);return e>999.9999?"kilometer":e>=.01&&e<=.0999?"centimeter":e>=.001&&e<=.00999?"millimeter":"meter"}function Lt(t){let e=Math.abs(t);return e>=.001&&e<=.00999?"gram":"kilogram"}function Ut(t,e){if(I.test(e)){if(q.test(e))return Rt(t);if(H.test(e))return Lt(t);if(It.test(e))return X(t,["bit","kilobit","megabit","gigabit","terabit"]);if(Ft.test(e))return X(t,["byte","kilobyte","megabyte","gigabyte","terabyte","petabyte"])}}function Vt(t){return I.test(t)&&!T.test(t)?"narrow":"short"}function Xt(t){switch(t){case"en-GB":default:return new Map([["one","st"],["two","nd"],["few","rd"],["other","th"]])}}function jt(t){let{value:e,formatted:n,locale:o,format:r}=t,a=new Intl.PluralRules(o,{type:"ordinal"}).select(e),i=Xt(o).get(a);return T.test(r)?`${n} ${i}`:`${n}${i}`}function Dt(t){return t.reduce((e,n)=>{let{type:o,value:r}=n;return o==="integer"?(e[o]=e[o]||[],e[o].push(r)):e[o]=r,e},{})}function Wt(t){let{value:e,numberFormatter:n,format:o}=t,{minusSign:r,integer:a,group:i,decimal:b,fraction:l,percentSign:f}=Dt(n.formatToParts(e));return[r,a.join(i||""),b,l,T.test(o)&&" ",f].filter(Boolean).join("")}function Zt(t){let e=t;for(;e>=1024;)e/=1024;return e}function Gt(t){let e=Math.abs(t);return e>999.9999?t/1e3:e>=.01&&e<=.0999?t*100:e>=.001&&e<=.00999?t*1e3:t}function Ht(t){let e=Math.abs(t);return e>=.001&&e<=.00999?t*1e3:t}function qt(t,e){return Pt.test(e)?Zt(t):q.test(e)?Gt(t):H.test(e)?Ht(t):t}function zt(t){let{locale:e}=t||{},{locale:n,numberingSystem:o}=V(V({},Intl.DateTimeFormat(e).resolvedOptions()),t);return{locale:n,numberingSystem:o}}function _(t,e,n){let o=at(t);if(o===null)return"";let r=e||"0,0",{locale:a,numberingSystem:i}=zt(n),b=F(r),l=qt(o,r),f={compactDisplay:Mt(r),currency:$t(r),currencyDisplay:xt(r),currencySign:_t(r),maximumFractionDigits:Nt(l,r),minimumFractionDigits:kt(l,r),minimumIntegerDigits:St(l,r),notation:Bt(r),numberingSystem:i,signDisplay:Et(r),style:Ct(r),useGrouping:b.includes(","),unit:Ut(o,r),unitDisplay:Vt(r)},d=new Intl.NumberFormat(a,f),u=d.format(l);return J(b)===0&&(u=u.replace(G,"")),r.includes("%")&&(u=Wt({value:l,numberFormatter:d,format:r})),At.test(r)&&(u=jt({value:l,formatted:u,format:r,locale:a})),N.test(r)&&l<0&&(u=`(${u})`),u}_.partial=t=>e=>_(e,t);var K=_;K.partial("0,0.00");K.partial("0,0");function Jt(t){return t.reduce((e,n)=>e+n,0)/t.length}const Kt=1e5,Qt=5e5,Yt=.09,j=.05,te=.05;function ee(t){t.additionalAmount||(t.additionalAmount=0),t.additionalLimit||(t.additionalLimit=0)}function ne(t){var e=9007199254740881,n=2n**53n-111n,o=5667072534355537n,r=BigInt(t)%n;return function(){return Number(r=r*o%n)/e}}const re=ne(Date.now());function oe(t){return Math.floor(re()*(t+1))}function ae({iterationCount:t=1,pulseVip:e,initial:n,percentADay:o,firstIterationDays:r,additionalDeposits:a,withdrawSettings:i}){if(!n)return[];const b=o<0;o>0&&(o/=100),ee(a);const l=e?100:60,f=e?Qt:Kt;let d=0,u=0;const k=[];for(let p=1;p<=t;p++){const v=n,S=p===1&&l===60?r:l,A=[];let M=0,c=v;for(var P=1;P<=S;P++){if(d++,c<f&&(c+=a.additionalVolumeBusdAmount,a.additionalLimit===0||u<=a.additionalLimit))switch(a.additionalAmountInterval){case"daily":{u++,c+=a.additionalAmount;break}case"weekly":{d%7===0&&(u++,c+=a.additionalAmount);break}case"bi-weekly":{d%14===0&&(u++,c+=a.additionalAmount);break}case"monthly":{d%30===0&&(u++,c+=a.additionalAmount);break}}const s=c,g=s<f;let m=0;b&&(o=(100.5+oe(4)/2)/100),g?m=c*o-s:m=(o-1)*c;const R=m*te;m-=R,M+=m,g&&(c>f?c=f:c+=m);const et={day:P,daySinceBegin:d,startedWith:s,currentValue:c,canCompound:g,profitOfThisDay:m,referrerCut:R,profitUntilNow:M,percentADay:o};A.push(et)}const $=v+M;let y=$,h=null;if(i!=null&&i.withdrawPercentInVFX){const s=y*i.withdrawPercentInVFX/100,g=s*j,m=s-g;y-=s,h={amountBefore:$,withdrawFee:g,amountAfterFee:m,remainingAmount:y}}const B=y*j,E=y-B,C=E*Yt,O=E-C,Q=A.reduce((s,g)=>s+g.referrerCut,0),Y=O+((h==null?void 0:h.amountAfterFee)??0)-v,tt=Jt(A.map(s=>s.percentADay))*100-100;k.push({uuid:Z(),amountBeforeFeeTax:y,withdrawInVFX:h,iteration:p,interests:A,amountAfterFees:O,amountAfterAllDays:$,withdrawFee:B,sellTax:C,days:S,principal:v,referrerCutOfIteration:Q,averagePercent:tt,profit:Y}),n=O<f?O:f}return k}function ue(t){return new Promise(e=>setTimeout(e,t))}let w=!1,D="",W={};self.addEventListener("message",async function(t){const e=Z();w&&(W[D]=!0),D=e,w&&await ue(500),w=!0,console.info(t.data);const n=ae(t.data);W[e]||(self.postMessage(n),w=!1)},!1);
