const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./src-OUKUEtN6.js","./vendor-ogl-vHIDfeo9.js","./gsap-C_F2famk.js","./vendor-gsap-dtbWDTxQ.js","./ScrollTrigger-C0K7cnyT.js","./splitting-oi4GEGE6.js","./vendor-splitting-C_XI8yvf.js","./rolldown-runtime-ciTZEWaI.js","./lenis-CfxVH_NU.js","./vendor-lenis-Cm0LW3lU.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-ciTZEWaI.js";import{t}from"./preload-helper-Dbp7xEFQ.js";(()=>{let e=document.getElementById(`preloader`);if(!e)return;let t=e.querySelector(`.preloader-canvas`),n=e.querySelector(`.preloader-pct .num`),r=e.querySelector(`.preloader-bar`),i=matchMedia(`(prefers-reduced-motion: reduce)`).matches,a=document.documentElement.dataset.tier||`high`,o=a===`low`?0:a===`mid`?12:20,s=a===`low`?1:a===`mid`?1.5:2;e.dataset.fontReady=`false`;let c=document.fonts&&document.fonts.load?document.fonts.load(`800 100px "Harmond"`).catch(()=>{}):Promise.resolve();Promise.race([c,new Promise(e=>setTimeout(e,500))]).then(()=>{e.dataset.fontReady=`true`});let l=0,u=[],d=!1,f=null,p=[],m=Array.from(document.querySelectorAll(`link[rel="preload"][as="image"], img[src]`)),h=[],g=new Set;for(let e of m){let t=e.href||e.src;!t||g.has(t)||(g.add(t),h.push(t))}let _=document.fonts?document.fonts.ready:Promise.resolve(),v=h.length+2,y=0,b=0,x=0,S=0,C=0,w=()=>{y=Math.min(v,y+1),x=y/v};h.forEach(e=>{let t=new Image;t.onload=w,t.onerror=w,t.src=e}),_.then(w).catch(w);let T=!1,E=()=>{T||(T=!0,w())};window.__heroShader&&window.__heroShader.ready?E():(window.addEventListener(`hero-shader:ready`,E,{once:!0}),setTimeout(E,2500));let D=0;try{typeof PerformanceObserver<`u`&&new PerformanceObserver(e=>{D+=e.getEntries().length,S=Math.min(.9,D/40)}).observe({type:`resource`,buffered:!0})}catch{}let O=a===`low`?400:a===`mid`?800:1200,k=a===`low`?900:a===`mid`?1600:2400,A=performance.now(),j=0,M=.2;function N(){let e=performance.now()-A,t=Math.min(M,e/400*M),n=Math.min(.85,e/O),r=Math.max(x,S,n)*(1-M),i=Math.min(y>=v?1:.95,t+r);C=Math.min(i,j+.02),j=C}let P=setTimeout(()=>{y=v,x=1,S=1},k);function F(){let e=Math.round(b*100);n&&(n.textContent=String(e).padStart(3,`0`)),r&&r.style.setProperty(`--progress`,b.toFixed(4))}if(i){t.style.display=`none`,(function e(){if(N(),b+=(C-b)*.12,F(),b>=.995&&C>=.999){re();return}l=requestAnimationFrame(e)})();return}let I=[`./assets/petals/petal-1.png`,`./assets/petals/petal-2.png`,`./assets/petals/petal-3.png`],L=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" width="120" height="180">
      <defs>
        <linearGradient id="p1-lit" x1="10%" y1="15%" x2="75%" y2="90%">
          <stop offset="0%"  stop-color="#FFB2BC"/>
          <stop offset="18%" stop-color="#F5586B"/>
          <stop offset="52%" stop-color="#C21B2E"/>
          <stop offset="85%" stop-color="#5A0711"/>
          <stop offset="100%" stop-color="#1E0206"/>
        </linearGradient>
        <linearGradient id="p1-shade" x1="45%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stop-color="#6A0A15" stop-opacity="0"/>
          <stop offset="55%" stop-color="#3A0509" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#15030A" stop-opacity="0.95"/>
        </linearGradient>
        <filter id="p1-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="0.25"/>
        </filter>
      </defs>
      <!-- Main petal silhouette: narrow notch top, widest at 40%, tapers to pointed base.
           Drawn clockwise from left notch tip. -->
      <path filter="url(#p1-soft)" fill="url(#p1-lit)" d="
        M 46 8
        C 50 16, 53 22, 60 30
        C 67 22, 70 16, 74 8
        C 90 14, 104 38, 110 72
        C 114 108, 100 148, 68 170
        C 64 172, 56 172, 52 170
        C 20 148, 6 108, 10 72
        C 16 38, 30 14, 46 8 Z"/>
      <!-- Shadow side layer — right half of petal, gives the folded illusion -->
      <path fill="url(#p1-shade)" d="
        M 60 30
        C 67 22, 70 16, 74 8
        C 90 14, 104 38, 110 72
        C 114 108, 100 148, 68 170
        C 64 172, 60 171, 60 168
        Z"/>
      <!-- Central fold crease — the spine of the petal, subtle but defined -->
      <path stroke="#1A0308" stroke-width="1.4" stroke-linecap="round" opacity="0.55" fill="none" d="
        M 60 30 C 58 70, 60 125, 62 166"/>
      <!-- Faint lateral veins -->
      <path stroke="#2A0207" stroke-width="0.5" stroke-linecap="round" opacity="0.28" fill="none" d="
        M 60 48 C 42 72, 30 120, 34 160
        M 60 48 C 80 72, 92 120, 88 160"/>
      <!-- Thin rim highlight on lit edge -->
      <path stroke="#FFD2D8" stroke-width="1.0" stroke-linecap="round" opacity="0.35" fill="none" d="
        M 46 12 C 30 22, 18 50, 14 82"/>
    </svg>`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180" width="140" height="180">
      <defs>
        <linearGradient id="p2-lit" x1="15%" y1="10%" x2="85%" y2="100%">
          <stop offset="0%"  stop-color="#FF94A2"/>
          <stop offset="22%" stop-color="#E5384A"/>
          <stop offset="58%" stop-color="#A81426"/>
          <stop offset="88%" stop-color="#4A080F"/>
          <stop offset="100%" stop-color="#1A0207"/>
        </linearGradient>
        <linearGradient id="p2-shade" x1="48%" y1="5%" x2="100%" y2="100%">
          <stop offset="0%"  stop-color="#3A0509" stop-opacity="0"/>
          <stop offset="60%" stop-color="#24040A" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#0B0206" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <!-- Camellia petal: rounded tip, wide body, narrow base stem point -->
      <path fill="url(#p2-lit)" d="
        M 70 10
        C 96 14, 120 36, 128 70
        C 134 102, 120 140, 92 162
        C 82 168, 78 170, 72 171
        C 66 170, 62 168, 56 162
        C 24 140, 6 102, 12 70
        C 20 36, 44 14, 70 10 Z"/>
      <!-- Shadow side for folded-paper feel -->
      <path fill="url(#p2-shade)" d="
        M 70 10
        C 96 14, 120 36, 128 70
        C 134 102, 120 140, 92 162
        C 82 168, 78 170, 72 171
        C 71 171, 70 170, 70 168
        L 70 12
        Z"/>
      <!-- Central fold -->
      <path stroke="#140205" stroke-width="1.8" stroke-linecap="round" opacity="0.6" fill="none" d="
        M 70 14 C 68 50, 70 110, 71 167"/>
      <!-- Soft lateral veins -->
      <path stroke="#2A0207" stroke-width="0.5" stroke-linecap="round" opacity="0.22" fill="none" d="
        M 70 32 C 42 60, 22 100, 30 145
        M 70 32 C 98 60, 118 100, 110 145"/>
      <!-- Lit rim highlight -->
      <path stroke="#FFB8C0" stroke-width="1.1" stroke-linecap="round" opacity="0.42" fill="none" d="
        M 54 14 C 30 28, 14 56, 12 84"/>
    </svg>`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 120" width="260" height="120">
      <defs>
        <linearGradient id="p3-lit" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stop-color="#F5586B"/>
          <stop offset="18%" stop-color="#D22034"/>
          <stop offset="55%" stop-color="#8B0F1D"/>
          <stop offset="100%" stop-color="#3A0509"/>
        </linearGradient>
        <linearGradient id="p3-shade" x1="0%" y1="45%" x2="0%" y2="100%">
          <stop offset="0%"  stop-color="#1A0207" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0B0205" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <!-- Base (right) → wavy top edge → recurved hook tip (left) → wavy bottom edge → base -->
      <path fill="url(#p3-lit)" d="
        M 252 62
        Q 240 54, 226 58
        Q 208 62, 192 50
        Q 170 38, 152 46
        Q 128 54, 112 42
        Q 88 28, 66 38
        Q 46 46, 32 32
        Q 14 20, 10 38
        Q 6 54, 22 62
        Q 34 66, 40 58
        Q 48 50, 58 56
        Q 72 66, 92 62
        Q 118 58, 140 68
        Q 164 76, 186 72
        Q 210 68, 228 76
        Q 244 80, 252 70
        Z"/>
      <!-- Lower shadow to give the ribbon a front/back read -->
      <path fill="url(#p3-shade)" d="
        M 252 62
        Q 244 80, 228 76
        Q 210 68, 186 72
        Q 164 76, 140 68
        Q 118 58, 92 62
        Q 72 66, 58 56
        Q 48 50, 40 58
        Q 34 66, 22 62
        L 22 62 L 22 64
        Q 34 68, 40 60
        Q 60 66, 80 66
        Q 120 72, 160 76
        Q 220 82, 252 70
        Z"/>
      <!-- Central spine -->
      <path stroke="#14020A" stroke-width="1.2" stroke-linecap="round" opacity="0.5" fill="none" d="
        M 24 52 Q 60 58, 100 58 Q 160 58, 220 62 Q 244 66, 250 64"/>
      <!-- Recurved hook highlight — lit edge at the tip -->
      <path stroke="#FFB0BA" stroke-width="1.0" stroke-linecap="round" opacity="0.45" fill="none" d="
        M 14 36 Q 24 24, 40 30 M 50 48 Q 70 42, 88 46"/>
      <!-- Wavy edge highlight (suggests scallops) -->
      <path stroke="#F5586B" stroke-width="0.7" stroke-linecap="round" opacity="0.3" fill="none" d="
        M 66 38 Q 88 28, 112 42 Q 128 54, 152 46 Q 170 38, 192 50 Q 208 62, 226 58"/>
    </svg>`];function R(e){return new Promise(t=>{let n=new Image;n.onload=()=>t(n),n.onerror=()=>t(null),n.src=e})}function z(e){return R(`data:image/svg+xml;charset=utf-8,`+encodeURIComponent(e))}async function B(){let e=[];for(let t=0;t<3;t++){let n=await R(I[t]);n||=await z(L[t]),n&&e.push(n)}return e}f=t.getContext(`2d`);let V=Math.min(window.devicePixelRatio||1,s);a!==`high`&&f&&(f.imageSmoothingQuality=`low`);let H=0,U=0;function W(){H=window.innerWidth,U=window.innerHeight,t.width=Math.floor(H*V),t.height=Math.floor(U*V),t.style.width=H+`px`,t.style.height=U+`px`}let G=o;function K(e,t=!1){let n=Math.random()**1.3;return{img:e[Math.floor(Math.random()*e.length)],x:Math.random()*H,y:t?-40-Math.random()*U*.6:Math.random()*U,z:n,scale:.16+n*.72,rot:Math.random()*Math.PI*2,rotV:(Math.random()-.5)*.028,vy:.25+n*1.3+Math.random()*.45,vx:(Math.random()-.5)*.25,phase:Math.random()*Math.PI*2,drift:.35+Math.random()*1.15,alpha:.45+n*.5,hueShift:(Math.random()-.5)*.3,gx:0,gy:0}}function q(e){for(let t=0;t<G;t++)p.push(K(e,!1))}let J={x:-9999,y:-9999,prevX:0,prevY:0,vx:0,vy:0,active:!1};function Y(e){let n=t.getBoundingClientRect(),r=e.clientX-n.left,i=e.clientY-n.top;J.active&&(J.vx=r-J.prevX,J.vy=i-J.prevY),J.prevX=r,J.prevY=i,J.x=r,J.y=i,J.active=!0}function X(){J.active=!1,J.x=-9999,J.y=-9999,J.vx=0,J.vy=0}e.addEventListener(`pointermove`,Y,{passive:!0}),e.addEventListener(`pointerdown`,Y,{passive:!0}),e.addEventListener(`pointerleave`,X,{passive:!0});let Z=performance.now(),ee=0,te=!1;function ne(){let e=(performance.now()-Z)/1e3;N(),b+=(C-b)*.08,te&&(f.setTransform(V,0,0,V,0,0),f.clearRect(0,0,H,U));let t=.25+Math.sin(e*.35)*.5,n=Math.hypot(J.vx,J.vy);if(te)for(let r=0;r<p.length;r++){let i=p[r],a=Math.sin(e*.6+i.phase)*i.drift;if(i.x+=i.vx+a*.35+t*.25*i.z,i.y+=i.vy,i.rot+=i.rotV+t*.002,i.x+=i.gx,i.y+=i.gy,i.gx*=.92,i.gy*=.92,Math.abs(i.gx)<.02&&(i.gx=0),Math.abs(i.gy)<.02&&(i.gy=0),J.active&&n>.5){let e=i.x-J.x,t=i.y-J.y,r=e*e+t*t;if(r<32400&&r>1){let a=Math.sqrt(r),o=1-a/180,s=Math.min(18,n*.25)*o;i.gx+=e/a*s*.6,i.gy+=t/a*s*.3+s*.15,i.rotV+=(Math.random()-.5)*.006*o}}i.y>U+60&&(i.y=-50,i.x=Math.random()*H,i.rot=Math.random()*Math.PI*2),i.x<-80?i.x=H+80:i.x>H+80&&(i.x=-80);let o=i.img;if(!o)continue;f.save(),f.globalAlpha=i.alpha*(.55+b*.45),f.translate(i.x,i.y),f.rotate(i.rot);let s=.85+Math.abs(Math.sin(e*.8+i.phase))*.15;f.scale(i.scale,i.scale*s),f.drawImage(o,-o.width/2,-o.height/2),f.restore()}if(F(),b>=.995&&C>=.999&&(ee||=performance.now(),performance.now()-ee>200)){re();return}l=requestAnimationFrame(ne)}if(a===`low`){t.style.display=`none`,(function e(){let t=performance.now()-A,n=Math.min(M,t/400*M),r=Math.min(.85,t/O),i=Math.max(x,S,r)*(1-M);if(C=Math.min(y>=v?1:.95,n+i),b+=(C-b)*.3,F(),b>=.995&&C>=.999){re();return}l=requestAnimationFrame(e)})();return}W(),window.addEventListener(`resize`,W),l=requestAnimationFrame(ne),B().then(n=>{if(!d){if(!n.length){t.style.display=`none`;return}u=n,q(n),te=!0,requestAnimationFrame(()=>e.classList.add(`is-canvas-ready`))}});function re(){if(d)return;let n=performance.now()-A;if(n<400){setTimeout(re,400-n);return}d=!0,l&&=(cancelAnimationFrame(l),0);let r=e.querySelector(`.preloader-ui`);r&&(r.style.transition=`none`,r.style.opacity=`0`),clearTimeout(P);try{e.removeEventListener(`pointermove`,Y),e.removeEventListener(`pointerdown`,Y),e.removeEventListener(`pointerleave`,X),window.removeEventListener(`resize`,W)}catch{}e.classList.add(`is-done`),window.dispatchEvent(new CustomEvent(`preloader:done`)),setTimeout(()=>{try{f&&(f.setTransform(1,0,0,1,0,0),f.clearRect(0,0,t.width,t.height)),t.width=0,t.height=0}catch{}for(let e=0;e<p.length;e++)p[e].img=null;p.length=0,u.length=0,e.remove()},650)}})(),(()=>{if(!new URLSearchParams(location.search).has(`perf`))return;let e=3e4,t=[],n=[],r=Array(60).fill(0),i=0,a=0,o=0;function s(c){if(o===0){o=c,requestAnimationFrame(s);return}let l=c-o;if(o=c,l<=0){requestAnimationFrame(s);return}r[i]=l,i=(i+1)%60,a<60&&a++;let u=0;for(let e=0;e<a;e++)u+=r[e];let d=a>0?1e3*a/u:0;for(t.push({t:c,fps:d}),n.push({t:c,dt:l});t.length>0&&c-t[0].t>e;)t.shift();for(;n.length>0&&c-n[0].t>e;)n.shift();p(d),requestAnimationFrame(s)}let c=[];if(typeof PerformanceObserver<`u`)try{new PerformanceObserver(e=>{for(let t of e.getEntries())c.push({t:Math.round(t.startTime),duration:Math.round(t.duration),name:t.name}),l.push({type:`longtask-${t.duration|0}ms`,t:t.startTime}),m()}).observe({entryTypes:[`longtask`]})}catch{}let l=[];function u(e,n={}){let r={type:e,t:performance.now(),...n};l.push(r),m(),setTimeout(()=>{r.fpsWindow=t.filter(e=>e.t>=r.t-500&&e.t<=r.t+1500).map(e=>({dt:Math.round(e.t-r.t),fps:Math.round(e.fps)})),m()},1800)}let d=document.createElement(`div`);d.id=`perf-overlay`,d.style.cssText=[`position:fixed`,`bottom:8px`,`left:8px`,`z-index:2147483647`,`background:rgba(0,0,0,.88)`,`color:#fff`,`font:11px/1.4 ui-monospace,"JetBrains Mono",Consolas,monospace`,`padding:8px 10px`,`border-radius:6px`,`border:1px solid rgba(255,255,255,.2)`,`max-width:340px`,`pointer-events:none`,`user-select:text`,`box-shadow:0 4px 16px rgba(0,0,0,.4)`].join(`;`),d.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
      <strong id="po-fps" style="font-size:15px;letter-spacing:.02em">— fps</strong>
      <button id="po-copy" type="button" style="margin-left:auto;font:inherit;padding:2px 7px;background:#B91729;color:#fff;border:0;border-radius:3px;cursor:pointer;pointer-events:auto">Copy JSON</button>
      <button id="po-clr"  type="button" style="font:inherit;padding:2px 7px;background:#333;color:#fff;border:0;border-radius:3px;cursor:pointer;pointer-events:auto">Clear</button>
    </div>
    <div id="po-sum" style="color:#999;font-size:10px;margin-bottom:4px">min — · p10 — · med — · p90 — · max —</div>
    <div id="po-log" style="max-height:240px;overflow-y:auto;border-top:1px solid rgba(255,255,255,.1);padding-top:4px;font-size:10px"></div>
  `;let f=e=>document.getElementById(e);function p(e){let n=f(`po-fps`);if(!n)return;n.textContent=`${e.toFixed(0)} fps`,n.style.color=e<50?`#ff5a5a`:e<90?`#ffa64d`:`#7ee8c4`;let r=t.slice(-300);if(r.length>10){let e=r.map(e=>e.fps).sort((e,t)=>e-t),t=t=>Math.round(e[Math.floor(e.length*t)]||0),n=f(`po-sum`);n&&(n.textContent=`min ${t(0)} · p10 ${t(.1)} · med ${t(.5)} · p90 ${t(.9)} · max ${t(.99)}`)}}function m(){let e=f(`po-log`);e&&(e.innerHTML=l.slice(-16).reverse().map(e=>{let t=`<span style="color:#666">…</span>`;if(e.fpsWindow&&e.fpsWindow.length){let n=e.fpsWindow.map(e=>e.fps),r=Math.min(...n),i=Math.max(...n);t=`<span style="color:${r<50?`#ff5a5a`:r<90?`#ffa64d`:`#7ee8c4`}">${r}–${i}</span>`}let n=[];e.maxVelocityPxPerS!=null&&n.push(`v=${e.maxVelocityPxPerS}`),e.durationMs!=null&&n.push(`${e.durationMs}ms`),e.deltaY!=null&&n.push(`Δy=${e.deltaY}`);let r=n.length?` <span style="color:#666">(${n.join(`, `)})</span>`:``;return`<div style="padding:1px 0"><span style="color:#7ee8c4">${(e.t/1e3).toFixed(1)}s</span> ${e.type} ${t}fps${r}</div>`}).join(``))}function h(){let e=t.map(e=>e.fps).sort((e,t)=>e-t),r=t=>e.length?Math.round(e[Math.floor(e.length*t)]):0;return{meta:{ua:navigator.userAgent,dpr:window.devicePixelRatio,screen:{w:screen.width,h:screen.height},viewport:{w:innerWidth,h:innerHeight},hwConcurrency:navigator.hardwareConcurrency||null,deviceMemory:navigator.deviceMemory||null,url:location.href,recordedAt:new Date().toISOString(),sessionDurationMs:Math.round(performance.now()),tier:document.documentElement.dataset.tier||null},perfMarks:performance.getEntriesByType(`mark`).filter(e=>e.name.startsWith(`hero-shader:`)).map(e=>({name:e.name,t:Math.round(e.startTime*10)/10})),fpsStats:e.length>10?{count:e.length,min:r(0),p10:r(.1),median:r(.5),p90:r(.9),max:r(.99)}:null,fpsTimeline:t.filter((e,t)=>t%10==0).map(e=>({t:Math.round(e.t),fps:Math.round(e.fps)})),slowFrames:n.filter(e=>e.dt>20).map(e=>({t:Math.round(e.t),dt:Math.round(e.dt)})),longTasks:c,events:l}}async function g(){let e=JSON.stringify(h(),null,2),t=f(`po-copy`);try{await navigator.clipboard.writeText(e),t.textContent=`Copied!`,setTimeout(()=>t.textContent=`Copy JSON`,1500)}catch{t.textContent=`See console`,console.log(`%c[perf-overlay] Report:`,`color:#B91729;font-weight:bold`),console.log(e),setTimeout(()=>t.textContent=`Copy JSON`,2e3)}}function _(){let e=document.getElementById(`portrait-stage`);return e?(e.addEventListener(`pointerenter`,()=>u(`hover-enter-hero`)),e.addEventListener(`pointerleave`,()=>u(`hover-leave-hero`)),!0):!1}function v(){let e=document.getElementById(`btn-menu`),t=document.getElementById(`site-drawer`);return e&&e.addEventListener(`click`,()=>u(`nav-click`)),t&&new MutationObserver(e=>{for(let n of e)n.attributeName===`aria-hidden`&&u(t.getAttribute(`aria-hidden`)===`false`?`nav-open`:`nav-close`)}).observe(t,{attributes:!0,attributeFilter:[`aria-hidden`]}),!!(e||t)}function y(){let e=0,t=0,n=0,r=0,i=0,a=window.scrollY;window.addEventListener(`scroll`,()=>{let o=performance.now(),s=window.scrollY;if(r||(e=o,t=s,n=0,u(`scroll-start`)),i){let e=Math.abs(s-a)/Math.max(1,o-i)*1e3;e>n&&(n=e)}i=o,a=s,clearTimeout(r),r=setTimeout(()=>{u(`scroll-end`,{durationMs:Math.round(o-e),deltaY:Math.round(s-t),maxVelocityPxPerS:Math.round(n)}),r=0},250)},{passive:!0})}function b(){if(document.body.appendChild(d),f(`po-copy`).addEventListener(`click`,g),f(`po-clr`).addEventListener(`click`,()=>{l.length=0,m()}),!_()){let e=10,t=()=>{_()||--e<=0||setTimeout(t,300)};t()}v(),y(),u(`session-start`),window.addEventListener(`preloader:done`,()=>u(`preloader-done`)),window.addEventListener(`hero-shader:ready`,()=>u(`hero-shader-ready`))}document.body?b():document.addEventListener(`DOMContentLoaded`,b),requestAnimationFrame(s)})(),(()=>{let e=document.getElementById(`theme-audio`),t=document.getElementById(`audio-toggle`);if(!e||!t)return;let n=matchMedia(`(prefers-reduced-motion: reduce)`).matches,r=`mm:audio:muted`,i=sessionStorage.getItem(r),a=i===null?n:i===`1`;e.volume=0,e.muted=a,o();function o(){t.setAttribute(`aria-pressed`,String(!a)),t.classList.toggle(`is-muted`,a)}let s=.1;function c(t,n){let r=e.volume,i=performance.now();cancelAnimationFrame(e._fadeRaf||0),(function a(){let o=Math.min(1,(performance.now()-i)/n);e.volume=r+(t-r)*o,o<1&&(e._fadeRaf=requestAnimationFrame(a))})()}let l=!1;function u(){if(l)return;l=!0,e.muted=a;let t=e.play();t&&typeof t.catch==`function`&&t.catch(()=>{l=!1}),a||c(s,2500)}let d=[`pointerdown`,`touchstart`,`keydown`,`click`];function f(e){d.forEach(t=>{e.addEventListener(t,u,{once:!0,passive:!0,capture:!0})})}f(window),t.addEventListener(`click`,t=>{t.stopPropagation(),a=!a,sessionStorage.setItem(r,a?`1`:`0`),e.muted=a,a?c(0,400):(u(),c(s,800)),o()});let p=0;function m(t,n,r){clearInterval(p);let i=e.volume,a=Math.ceil(n/50),o=0;p=setInterval(()=>{o++;let n=Math.min(1,o/a);e.volume=i+(t-i)*n,n>=1&&(clearInterval(p),r&&r())},50)}document.addEventListener(`visibilitychange`,()=>{!l||a||(document.hidden?(cancelAnimationFrame(e._fadeRaf||0),m(0,500,()=>{document.hidden&&e.pause()})):(clearInterval(p),e.play(),c(s,2500)))})})();var n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,r=window.matchMedia(`(hover: none)`).matches,i=document.documentElement.dataset.tier||`high`,a=document.getElementById(`portrait-stage`),o=document.getElementById(`hero-fx`),s=a.querySelector(`.hover-zones .zone`);window.__heroShader=window.__heroShader||{ready:!1};var c=()=>{if(!window.__heroShader.ready){window.__heroShader.ready=!0;try{window.dispatchEvent(new CustomEvent(`hero-shader:ready`))}catch{}}},l=new URLSearchParams(location.search).has(`perf`),u=e=>{if(l)try{performance.mark(e)}catch{}},d=(e,t,n=performance.now())=>{l&&console.log(`[hero-shader] ${e}: ${(n-t).toFixed(1)}ms`)},f=i===`low`?1:i===`mid`?1.5:2,p=i===`low`?`mediump`:`highp`,m=i===`high`?.75:i===`mid`?.35:0,h=i===`high`?.65:i===`mid`?.35:0,g=i===`high`?.65:i===`mid`?.35:0,_=[],v=!1,y=()=>{v=!1;for(let e=0;e<_.length;e++)_[e]()};window.addEventListener(`scroll`,()=>{v||(v=!0,requestAnimationFrame(y))},{passive:!0});var b=e=>_.push(e);if(new URLSearchParams(location.search).has(`fps`)){let e=document.createElement(`div`);e.style.cssText=`position:fixed;bottom:8px;left:8px;z-index:9999;padding:4px 8px;font:12px/1 JetBrains Mono,monospace;color:#fff;background:rgba(0,0,0,.65);border:1px solid rgba(255,255,255,.15);border-radius:4px;pointer-events:none;letter-spacing:.02em;`,document.addEventListener(`DOMContentLoaded`,()=>document.body.appendChild(e));let t=new Float32Array(60),n=0,r=0,i=performance.now(),a=o=>{let s=o-i;i=o,t[n]=s,n=(n+1)%t.length,r<t.length&&r++;let c=0;for(let e=0;e<r;e++)c+=t[e];e.textContent=`${(r>0?1e3*r/c:0).toFixed(1)} fps · ${(c/r).toFixed(2)} ms`,requestAnimationFrame(a)};requestAnimationFrame(a)}var x=document.querySelector(`.hero`);function S(e,t=.96){if(!e)return;let n=e.classList.contains(`fit-line--bleed`),r=n?document.documentElement:e.closest(`section, .hero, main`)||document.body,i=r.clientWidth;if(!n){let e=getComputedStyle(r);i-=(parseFloat(e.paddingLeft)||0)+(parseFloat(e.paddingRight)||0)}let a=i*t,o=e.style.width;e.style.width=`max-content`,e.style.fontSize=`100px`;let s=e.getBoundingClientRect().width;e.style.width=o,s>0&&(e.style.fontSize=100*a/s+`px`)}function C(){let e=document.querySelector(`.big-name`);e&&S(e,.96),document.querySelectorAll(`.fit-line`).forEach(e=>{S(e,e.classList.contains(`fit-line--bleed`)?.96:.94)})}if(document.fonts&&document.fonts.ready?document.fonts.ready.then(C):window.addEventListener(`load`,C),C(),window.addEventListener(`resize`,C),typeof ResizeObserver<`u`&&x&&new ResizeObserver(C).observe(x),n||i===`low`)o.style.display=`none`,c();else try{let e=performance.now();u(`hero-shader:init:start`);let n=a.querySelector(`.samurai-wings`),i=-1,l=NaN,h=NaN,{Renderer:g,Program:_,Mesh:v,Triangle:y,Texture:S,RenderTarget:C}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}=await import(`./src-OUKUEtN6.js`);return{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}},__vite__mapDeps([0,1]),import.meta.url),w=new g({canvas:o,alpha:!0,dpr:Math.min(window.devicePixelRatio,f),powerPreference:`high-performance`}),T=w.gl;T.clearColor(0,0,0,0);let E=new y(T),D=`
          precision ${p} float;

          uniform sampler2D uModern;
          uniform sampler2D uSamurai;
          uniform sampler2D uDepth;
          uniform sampler2D uNoiseTex;        // baked fbm field — see bake pass below
          uniform float uModernAspect;
          uniform float uSamuraiAspect;
          uniform float uDepthAspect;
          uniform float uHasDepth;
          uniform float uParallaxStrength;
          uniform vec2 uMouse;
          uniform float uHover;
          uniform float uBlobSize;
          uniform float uAspect;
          uniform float uTime;
          uniform vec2 uResolution;

          varying vec2 vUv;

          // object-fit: contain, center-anchored. Returns UV to sample and a 0/1 "inside" mask.
          vec2 fitUV(vec2 uv, float imgAspect, out float inside) {
            vec2 scale = vec2(1.0);
            if (uAspect > imgAspect) {
              scale.x = uAspect / imgAspect;   // pillarbox on X
            } else {
              scale.y = imgAspect / uAspect;   // letterbox on Y
            }
            vec2 iuv = (uv - 0.5) * scale + 0.5;
            vec2 edge = step(vec2(0.0), iuv) * step(iuv, vec2(1.0));
            inside = edge.x * edge.y;
            return clamp(iuv, 0.0, 1.0);
          }

          // hash() is retained for the grain pass only. The fbm / noise
          // functions that used to live here have been replaced by a
          // pre-baked RGBA8 noise texture (see the bake pass in JS below).
          // That drops the per-pixel cost from ~64 sin() calls to 2 texture
          // samples, matching the pattern the cullenwebber/three-skull
          // repo uses for its fluid-mask displacement field.
          float hash(vec2 p) {
            highp float d = dot(p, vec2(12.9898, 78.233));
            return fract(sin(d) * 43758.5453);
          }

          void main() {
            vec2 uv = vUv;

            // Hover mask (core / halo / contour). Previously wrapped in an
            // idle-skip branch on uHover to dodge the fbm warp cost. That
            // branch was the source of the 500ms FPS dip on every state
            // transition — the Apple Metal driver sees a workload change on
            // the branch edge and ramps GPU frequency over ~500ms, and the
            // ICache cools during idle periods and has to re-warm on hover.
            // Running fbm unconditionally gives Metal one workload profile
            // with no transitions. uHover still scales every output below,
            // so idle frames produce zero visual effect. Research summary:
            //   Three.js compileAsync, PlayCanvas, Babylon all poll
            //   KHR_parallel_shader_compile but never issue a warmup draw;
            //   Metal PSO compile (newRenderPipelineStateWithDescriptor) is
            //   synchronous and deferred to first draw regardless, so a
            //   canvas-matching warmup is required to hide cold-boot cost.
            vec2 p = (uv - uMouse);
            p.x *= uAspect;
            vec2 pn = vec2(p.x, p.y * 0.72);
            vec2 flow = vec2(0.0, -uTime * 0.15);

            // Domain warp via two texture samples. The baked noise texture
            // stores four fbm evaluations across its RGBA channels (see
            // bake pass in JS):
            //   R = fbm(p),  G = fbm(p + vec2(5.2, 1.3))
            //   B = fbm(p + vec2(8.3, 2.8)),  A = unused
            // Divide by 8.0 to match the bake's vUv*8.0 scale so a unit in
            // warp-input space maps to a unit in bake space. REPEAT wrapping
            // on the texture makes any UV (positive or negative) valid.
            // q.xy reads (R, G) → matches original fbm(p), fbm(p + 5.2,1.3).
            // r.xy reads (R, B) at the warped offset → matches original
            // fbm(q_offset), fbm(q_offset + 8.3,2.8). Same tendril character.
            vec4 s1 = texture2D(uNoiseTex, (pn * 1.8 + flow) * 0.125);
            vec2 q = s1.rg;
            vec4 s2 = texture2D(uNoiseTex, (pn * 1.8 + 3.6 * q + flow) * 0.125);
            vec2 r = vec2(s2.r, s2.b);

            float d = length(p + 0.22 * (r - 0.5));

            // halo reads the pre-uHover core shape, so compute coreRaw once.
            float coreRaw = 1.0 - smoothstep(uBlobSize * 0.75, uBlobSize * 1.05, d);
            float core = coreRaw * uHover;
            float halo = (1.0 - smoothstep(uBlobSize * 1.05, uBlobSize * 1.55, d))
                       * (1.0 - coreRaw) * uHover * 0.45;
            float line = smoothstep(uBlobSize * 0.985, uBlobSize * 1.000, d)
                       * (1.0 - smoothstep(uBlobSize * 1.000, uBlobSize * 1.018, d))
                       * uHover;

            // --- depth-map parallax: single-sample offset ---
            // Background (depth~0) stays put; near (depth~1) shifts toward/away from pointer.
            float inD;
            vec2 uvD = fitUV(uv, uDepthAspect, inD);
            float depth = texture2D(uDepth, uvD).r * inD;
            float depthCentered = (depth - 0.5) * uHasDepth;
            vec2 parallaxDir = (uMouse - vec2(0.5, 0.5));
            vec2 pOff = parallaxDir * depthCentered * uParallaxStrength;
            vec2 uvParallax = uv - pOff;

            // sample each texture with its natural aspect ratio preserved (object-fit: contain)
            float inS, inM;
            vec2 uvS = fitUV(uvParallax, uSamuraiAspect, inS);
            vec2 uvM = fitUV(uvParallax, uModernAspect,  inM);
            vec4 base   = texture2D(uSamurai, uvS) * inS;
            vec4 reveal = texture2D(uModern,  uvM) * inM;

            // composite
            vec4 col = mix(base, reveal, core);

            // ghost halo: desaturated, slightly darker echo of the base behind the core
            float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
            vec3 ghost = mix(vec3(luma), base.rgb, 0.35) * 0.6;
            col.rgb = mix(col.rgb, ghost, halo);

            // vermillion contour line on the core boundary
            col.rgb += vec3(0.73, 0.09, 0.11) * line * 0.65;

            // film grain (full frame, subtle)
            float grain = hash(uv * uResolution * 0.5 + uTime * 60.0);
            col.rgb += (grain - 0.5) * 0.055;

            gl_FragColor = col;
          }
        `,O=e=>new Promise((t,n)=>{let r=new Image;r.crossOrigin=`anonymous`,r.onload=()=>{let e=new S(T,{image:r,generateMipmaps:!1});e.aspect=r.naturalWidth/r.naturalHeight,t(e)},r.onerror=n,r.src=e}),[k,A]=await Promise.all([O(`./assets/mina-samurai.webp`),O(`./assets/mina-modern.webp`)]),j=await O(`./assets/depth-map.webp`).catch(()=>null),{bakeNoiseTexture:M}=await t(async()=>{let{bakeNoiseTexture:e}=await import(`./_bake-noise-CJ5n157n.js`);return{bakeNoiseTexture:e}},[],import.meta.url),N=M(w,{Renderer:g,Program:_,Mesh:v,Triangle:y,Texture:S,RenderTarget:C}),P=new _(T,{vertex:`
          precision mediump float;
          attribute vec2 uv;
          attribute vec2 position;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `,fragment:D,uniforms:{uModern:{value:A},uSamurai:{value:k},uDepth:{value:j||k},uNoiseTex:{value:N},uModernAspect:{value:A.aspect||.75},uSamuraiAspect:{value:k.aspect||.75},uDepthAspect:{value:j?j.aspect:.75},uHasDepth:{value:+!!j},uParallaxStrength:{value:.035},uMouse:{value:[.5,.5]},uHover:{value:0},uBlobSize:{value:.28},uAspect:{value:1},uTime:{value:0},uResolution:{value:[1,1]}},transparent:!0}),F=new v(T,{geometry:E,program:P}),I=a.getBoundingClientRect(),L=window.innerWidth,R=window.innerHeight;function z(){I=a.getBoundingClientRect(),L=window.innerWidth,R=window.innerHeight,w.setSize(I.width,I.height),P.uniforms.uResolution.value[0]=I.width,P.uniforms.uResolution.value[1]=I.height,P.uniforms.uAspect.value=I.height>0?I.width/I.height:1}window.addEventListener(`resize`,z),window.addEventListener(`load`,z),b(()=>{I=a.getBoundingClientRect()}),typeof ResizeObserver<`u`&&new ResizeObserver(z).observe(a),z();let B={x:.5,y:.5,tx:.5,ty:.5},V={t:0,target:0},H=0,U=0,W=0,G=0,K=0,q=m;window.addEventListener(`pointermove`,e=>{r&&(K=performance.now()),B.tx=Math.max(0,Math.min(1,(e.clientX-I.left)/I.width)),B.ty=1-Math.max(0,Math.min(1,(e.clientY-I.top)/I.height));let t=e.clientX/L*2-1;W=-(e.clientY/R*2-1)*1.5,G=t*2.25},{passive:!0}),r?(a.addEventListener(`pointerdown`,e=>{V.target=1,K=performance.now();try{a.setPointerCapture(e.pointerId)}catch{}B.tx=Math.max(0,Math.min(1,(e.clientX-I.left)/I.width)),B.ty=1-Math.max(0,Math.min(1,(e.clientY-I.top)/I.height))}),a.addEventListener(`pointerup`,e=>{K=performance.now();try{a.releasePointerCapture(e.pointerId)}catch{}}),a.addEventListener(`pointercancel`,()=>{K=performance.now()})):(a.addEventListener(`pointerenter`,()=>{V.target=1}),a.addEventListener(`pointerleave`,()=>{V.target=0})),s.addEventListener(`focus`,()=>{V.target=1,B.tx=.5,B.ty=.5}),s.addEventListener(`blur`,()=>{V.target=0});let J=P.uniforms.uMouse.value,Y=!0,X=0;new IntersectionObserver(e=>{Y=e[0].isIntersecting,Y&&!X&&(X=requestAnimationFrame(Z))},{threshold:0}).observe(x||a);function Z(e){if(X=0,r&&performance.now()-K>1200){let t=e*.001;B.tx=.5+.28*Math.sin(t*.52),B.ty=.55+.18*Math.sin(t*.77+1.2),V.target=q,W=0,G=0}if(B.x+=(B.tx-B.x)*.18,B.y+=(B.ty-B.y)*.18,V.t+=(V.target-V.t)*.041666666666666664,H+=(W-H)*.06,U+=(G-U)*.06,(Math.abs(H-l)>.02||Math.abs(U-h)>.02)&&(l=H,h=U,a.style.transform=`translateX(-50%) translateY(${H*-.8}px) rotateX(${H}deg) rotateY(${U}deg)`),J[0]=B.x,J[1]=B.y,P.uniforms.uHover.value=V.t,P.uniforms.uTime.value=e*.001,n){let e=1-V.t;Math.abs(e-i)>.005&&(i=e,n.style.opacity=e.toFixed(3))}w.render({scene:F}),Y&&(X=requestAnimationFrame(Z))}if(u(`hero-shader:link:poll:start`),T.getExtension(`KHR_parallel_shader_compile`)){let e=performance.now();await new Promise(t=>{let n=()=>{try{if(T.getProgramParameter(P.program,37297))return t()}catch{return t()}if(performance.now()-e>500)return t();requestAnimationFrame(n)};n()}),d(`link poll`,e)}u(`hero-shader:link:poll:end`),u(`hero-shader:warmup:start`);let ee=performance.now();o.style.opacity=`0`,P.uniforms.uHover.value=1,J[0]=.5,J[1]=.5,P.uniforms.uTime.value=0,w.render({scene:F}),w.render({scene:F}),w.render({scene:F}),T.finish(),d(`warmup (incl. gl.finish)`,ee),u(`hero-shader:warmup:end`),a.classList.add(`webgl-on`),a.querySelector(`.portrait-fallback`).style.opacity=`0`,P.uniforms.uHover.value=0,u(`hero-shader:firstDraw:start`);let te=performance.now();Z(performance.now()),d(`first draw`,te),u(`hero-shader:firstDraw:end`),o.style.opacity=``,d(`hero-shader total init`,e),c()}catch(e){console.warn(`[hero] WebGL shader failed, using CSS fallback.`,e),c()}if(!n&&i!==`low`){let e=document.getElementById(`dragon-stage`),n=document.getElementById(`dragon-fx`),i=e&&e.querySelector(`.dragon-hover-zone`);if(e&&n&&i){let a=async()=>{try{let{Renderer:a,Program:o,Mesh:s,Triangle:c,Texture:l,RenderTarget:u}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}=await import(`./src-OUKUEtN6.js`);return{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}},__vite__mapDeps([0,1]),import.meta.url),{bakeNoiseTexture:d}=await t(async()=>{let{bakeNoiseTexture:e}=await import(`./_bake-noise-CJ5n157n.js`);return{bakeNoiseTexture:e}},[],import.meta.url),m=new a({canvas:n,alpha:!0,dpr:Math.min(window.devicePixelRatio,f),powerPreference:`high-performance`}),g=m.gl;g.clearColor(0,0,0,0);let _=d(m,{Renderer:a,Program:o,Mesh:s,Triangle:c,Texture:l,RenderTarget:u}),v=new c(g),y=`
            precision ${p} float;

            uniform sampler2D uSketch;
            uniform sampler2D uFilled;
            uniform sampler2D uNoiseTex;        // baked fbm — see _bake-noise.mjs
            uniform float uSketchAspect;
            uniform float uFilledAspect;
            uniform vec2  uMouse;
            uniform float uHover;
            uniform float uBlobSize;
            uniform float uAspect;
            uniform float uTime;
            uniform vec2  uResolution;

            varying vec2 vUv;

            // object-fit: contain, center-anchored (matches CSS object-position: center center)
            vec2 fitUV(vec2 uv, float imgAspect, out float inside) {
              vec2 scale = vec2(1.0);
              if (uAspect > imgAspect) {
                scale.x = uAspect / imgAspect;
              } else {
                scale.y = imgAspect / uAspect;
              }
              vec2 iuv = (uv - vec2(0.5, 0.5)) * scale + vec2(0.5, 0.5);
              vec2 edge = step(vec2(0.0), iuv) * step(iuv, vec2(1.0));
              inside = edge.x * edge.y;
              return clamp(iuv, 0.0, 1.0);
            }

            // hash() retained for grain only. fbm/noise removed — now sampled
            // from the baked uNoiseTex (see _bake-noise.mjs for channel layout).
            float hash(vec2 p) {
              highp float d = dot(p, vec2(12.9898, 78.233));
              return fract(sin(d) * 43758.5453);
            }

            void main() {
              vec2 uv = vUv;

              // --- Pyramid-style domain-warped blob mask via baked fbm.
              // Always run the warp (no uHover gate) so GPU workload is
              // constant across frames — prevents transition dips on hover
              // edges. uHover scales outputs so idle produces zero effect.
              vec2 p = (uv - uMouse);
              p.x *= uAspect;
              vec2 pn = vec2(p.x, p.y * 0.72);
              vec2 flow = vec2(0.0, -uTime * 0.15);

              vec4 s1 = texture2D(uNoiseTex, (pn * 1.8 + flow) * 0.125);
              vec2 q = s1.rg;
              vec4 s2 = texture2D(uNoiseTex, (pn * 1.8 + 3.6 * q + flow) * 0.125);
              vec2 r = vec2(s2.r, s2.b);

              float d = length(p + 0.22 * (r - 0.5));

              float coreRaw = 1.0 - smoothstep(uBlobSize * 0.75, uBlobSize * 1.05, d);
              float core = coreRaw * uHover;
              float halo = (1.0 - smoothstep(uBlobSize * 1.05, uBlobSize * 1.55, d))
                         * (1.0 - coreRaw) * uHover * 0.45;
              float line = smoothstep(uBlobSize * 0.985, uBlobSize * 1.000, d)
                         * (1.0 - smoothstep(uBlobSize * 1.000, uBlobSize * 1.018, d))
                         * uHover;

              // --- sample base (sketch) and reveal (filled). Right-anchored contain fit. ---
              float inS, inF;
              vec2 uvS = fitUV(uv, uSketchAspect, inS);
              vec2 uvF = fitUV(uv, uFilledAspect, inF);
              vec4 base   = texture2D(uSketch, uvS) * inS;
              vec4 reveal = texture2D(uFilled, uvF) * inF;

              // --- dim the base layer to ~70% so sketch reads as ambient, not dominant ---
              base *= 0.7;

              // --- composite: sketch everywhere, filled replaces it inside core ---
              vec4 col = mix(base, reveal, core);

              // --- ghost halo: desaturated, dimmed echo of the base just outside core ---
              float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
              vec3 ghost = mix(vec3(luma), base.rgb, 0.35) * 0.6;
              col.rgb = mix(col.rgb, ghost, halo);

              // --- vermillion contour on the blob boundary ---
              col.rgb += vec3(0.73, 0.09, 0.11) * line * 0.65;
              // Bump alpha on the contour so the line reads outside the dragon silhouette too.
              col.a   += line * 0.55;

              // --- film grain (subtle, full frame) ---
              float grain = hash(uv * uResolution * 0.5 + uTime * 60.0);
              col.rgb += (grain - 0.5) * 0.045;

              gl_FragColor = col;
            }
          `,x=e=>new Promise((t,n)=>{let r=new Image;r.crossOrigin=`anonymous`,r.onload=()=>{let e=new l(g,{image:r,generateMipmaps:!1});e.aspect=r.naturalWidth/r.naturalHeight,t(e)},r.onerror=n,r.src=e}),[S,C]=await Promise.all([x(`./assets/dragon-skitched.webp`),x(`./assets/dragon-filled.webp`)]),w=new o(g,{vertex:`
            precision mediump float;
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `,fragment:y,uniforms:{uSketch:{value:S},uFilled:{value:C},uNoiseTex:{value:_},uSketchAspect:{value:S.aspect||1.5},uFilledAspect:{value:C.aspect||1.5},uMouse:{value:[.5,.5]},uHover:{value:0},uBlobSize:{value:.32},uAspect:{value:1},uTime:{value:0},uResolution:{value:[1,1]}},transparent:!0}),T=new s(g,{geometry:v,program:w}),E=e.getBoundingClientRect();function D(){E=e.getBoundingClientRect(),!(E.width<=0||E.height<=0)&&(m.setSize(E.width,E.height),w.uniforms.uResolution.value[0]=E.width,w.uniforms.uResolution.value[1]=E.height,w.uniforms.uAspect.value=E.width/E.height)}window.addEventListener(`resize`,D),window.addEventListener(`load`,D),b(()=>{E=e.getBoundingClientRect()}),typeof ResizeObserver<`u`&&new ResizeObserver(D).observe(e),D();let O={x:.5,y:.5,tx:.5,ty:.5},k={t:0,target:0},A=w.uniforms.uMouse.value,j=0,M=h,N=i.getBoundingClientRect(),P=()=>{N=i.getBoundingClientRect()};window.addEventListener(`resize`,P),b(P),typeof ResizeObserver<`u`&&new ResizeObserver(P).observe(e);let F=(e,t,n)=>!!n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom,I=e=>{r&&(j=performance.now()),F(e.clientX,e.clientY,N)?(O.tx=Math.max(0,Math.min(1,(e.clientX-E.left)/E.width)),O.ty=1-Math.max(0,Math.min(1,(e.clientY-E.top)/E.height)),k.target=1):k.target=0};window.addEventListener(`pointermove`,I,{passive:!0}),window.addEventListener(`pointerdown`,I,{passive:!0}),r&&i.addEventListener(`pointercancel`,()=>{j=performance.now()});let L=!1,R=0;new IntersectionObserver(e=>{for(let t of e)L=t.isIntersecting&&t.intersectionRatio>0;L&&!R&&(R=requestAnimationFrame(z))},{threshold:[0,.05]}).observe(e);function z(e){if(r&&performance.now()-j>1200)if(L){let t=e*.001;O.tx=.5+.12*Math.sin(t*.48),O.ty=.5+.18*Math.sin(t*.71+.9),k.target=M}else k.target=0;O.x+=(O.tx-O.x)*.12,O.y+=(O.ty-O.y)*.12,k.t+=(k.target-k.t)*.08,A[0]=O.x,A[1]=O.y,w.uniforms.uHover.value=k.t,w.uniforms.uTime.value=e*.001,m.render({scene:T}),R=L||k.t>.001?requestAnimationFrame(z):0}e.classList.add(`webgl-on`),R=requestAnimationFrame(z)}catch(e){console.warn(`[dragon] WebGL shader failed, using CSS fallback.`,e)}},o=!1,s=new IntersectionObserver(e=>{!o&&e.some(e=>e.isIntersecting)&&(o=!0,s.disconnect(),a())},{rootMargin:`100% 0% 100% 0%`});s.observe(e)}}if(!n&&i!==`low`){let e=document.getElementById(`liberty-stage`),n=document.getElementById(`liberty-fx`),i=e&&e.querySelector(`.liberty-hover-zone`);if(e&&n&&i){let a=async()=>{try{let{Renderer:a,Program:o,Mesh:s,Triangle:c,Texture:l,RenderTarget:u}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}=await import(`./src-OUKUEtN6.js`);return{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}},__vite__mapDeps([0,1]),import.meta.url),{bakeNoiseTexture:d}=await t(async()=>{let{bakeNoiseTexture:e}=await import(`./_bake-noise-CJ5n157n.js`);return{bakeNoiseTexture:e}},[],import.meta.url),m=new a({canvas:n,alpha:!0,dpr:Math.min(window.devicePixelRatio,f),powerPreference:`high-performance`}),h=m.gl;h.clearColor(0,0,0,0);let _=d(m,{Renderer:a,Program:o,Mesh:s,Triangle:c,Texture:l,RenderTarget:u}),v=new c(h),y=`
            precision ${p} float;

            uniform sampler2D uSketch;
            uniform sampler2D uFilled;
            uniform sampler2D uNoiseTex;        // baked fbm — see _bake-noise.mjs
            uniform float uSketchAspect;
            uniform float uFilledAspect;
            uniform vec2  uMouse;
            uniform float uHover;
            uniform float uBlobSize;
            uniform float uAspect;
            uniform float uTime;
            uniform vec2  uResolution;

            varying vec2 vUv;

            vec2 fitUV(vec2 uv, float imgAspect, out float inside) {
              vec2 scale = vec2(1.0);
              if (uAspect > imgAspect) {
                scale.x = uAspect / imgAspect;
              } else {
                scale.y = imgAspect / uAspect;
              }
              vec2 iuv = (uv - vec2(0.5, 0.5)) * scale + vec2(0.5, 0.5);
              vec2 edge = step(vec2(0.0), iuv) * step(iuv, vec2(1.0));
              inside = edge.x * edge.y;
              return clamp(iuv, 0.0, 1.0);
            }

            // hash() retained for grain only. fbm/noise removed — sampled
            // from baked uNoiseTex. See _bake-noise.mjs for channel layout.
            float hash(vec2 p) {
              highp float d = dot(p, vec2(12.9898, 78.233));
              return fract(sin(d) * 43758.5453);
            }

            void main() {
              vec2 uv = vUv;

              // Always-on domain warp via baked fbm (no uHover branch → no
              // workload transition on hover edges). uHover scales outputs.
              vec2 p = (uv - uMouse);
              p.x *= uAspect;
              vec2 pn = vec2(p.x, p.y * 0.72);
              vec2 flow = vec2(0.0, -uTime * 0.15);

              vec4 s1 = texture2D(uNoiseTex, (pn * 1.8 + flow) * 0.125);
              vec2 q = s1.rg;
              vec4 s2 = texture2D(uNoiseTex, (pn * 1.8 + 3.6 * q + flow) * 0.125);
              vec2 r = vec2(s2.r, s2.b);

              float d = length(p + 0.22 * (r - 0.5));

              float coreRaw = 1.0 - smoothstep(uBlobSize * 0.75, uBlobSize * 1.05, d);
              float core = coreRaw * uHover;
              float halo = (1.0 - smoothstep(uBlobSize * 1.05, uBlobSize * 1.55, d))
                         * (1.0 - coreRaw) * uHover * 0.45;
              float line = smoothstep(uBlobSize * 0.985, uBlobSize * 1.000, d)
                         * (1.0 - smoothstep(uBlobSize * 1.000, uBlobSize * 1.018, d))
                         * uHover;

              float inS, inF;
              vec2 uvS = fitUV(uv, uSketchAspect, inS);
              vec2 uvF = fitUV(uv, uFilledAspect, inF);
              vec4 base   = texture2D(uSketch, uvS) * inS;
              vec4 reveal = texture2D(uFilled, uvF) * inF;

              base *= 0.7;

              vec4 col = mix(base, reveal, core);

              float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
              vec3 ghost = mix(vec3(luma), base.rgb, 0.35) * 0.6;
              col.rgb = mix(col.rgb, ghost, halo);

              col.rgb += vec3(0.73, 0.09, 0.11) * line * 0.65;
              col.a   += line * 0.55;

              float grain = hash(uv * uResolution * 0.5 + uTime * 60.0);
              col.rgb += (grain - 0.5) * 0.045;

              gl_FragColor = col;
            }
          `,x=e=>new Promise((t,n)=>{let r=new Image;r.crossOrigin=`anonymous`,r.onload=()=>{let e=new l(h,{image:r,generateMipmaps:!1});e.aspect=r.naturalWidth/r.naturalHeight,t(e)},r.onerror=n,r.src=e}),[S,C]=await Promise.all([x(`./assets/liberty-sketch.webp`),x(`./assets/liberty-filled.webp`)]),w=new o(h,{vertex:`
            precision mediump float;
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `,fragment:y,uniforms:{uSketch:{value:S},uFilled:{value:C},uNoiseTex:{value:_},uSketchAspect:{value:S.aspect||1.5},uFilledAspect:{value:C.aspect||1.5},uMouse:{value:[.5,.5]},uHover:{value:0},uBlobSize:{value:.32},uAspect:{value:1},uTime:{value:0},uResolution:{value:[1,1]}},transparent:!0}),T=new s(h,{geometry:v,program:w}),E=e.getBoundingClientRect();function D(){E=e.getBoundingClientRect(),!(E.width<=0||E.height<=0)&&(m.setSize(E.width,E.height),w.uniforms.uResolution.value[0]=E.width,w.uniforms.uResolution.value[1]=E.height,w.uniforms.uAspect.value=E.width/E.height)}window.addEventListener(`resize`,D),window.addEventListener(`load`,D),b(()=>{E=e.getBoundingClientRect()}),typeof ResizeObserver<`u`&&new ResizeObserver(D).observe(e),D();let O={x:.5,y:.5,tx:.5,ty:.5},k={t:0,target:0},A=w.uniforms.uMouse.value,j=0,M=g;window.addEventListener(`pointermove`,e=>{r&&(j=performance.now());let t=(e.clientX-E.left)/E.width,n=(e.clientY-E.top)/E.height;O.tx=Math.max(0,Math.min(1,t)),O.ty=1-Math.max(0,Math.min(1,n)),r||(k.target=+(t>.08&&t<.92&&n>.06&&n<.94))},{passive:!0}),r?(i.addEventListener(`pointerdown`,e=>{k.target=1,j=performance.now();try{i.setPointerCapture(e.pointerId)}catch{}O.tx=Math.max(0,Math.min(1,(e.clientX-E.left)/E.width)),O.ty=1-Math.max(0,Math.min(1,(e.clientY-E.top)/E.height))}),i.addEventListener(`pointerup`,e=>{j=performance.now();try{i.releasePointerCapture(e.pointerId)}catch{}}),i.addEventListener(`pointercancel`,()=>{j=performance.now()})):(window.addEventListener(`pointerleave`,()=>{k.target=0}),i.addEventListener(`pointerenter`,()=>{k.target=1}),i.addEventListener(`pointerleave`,()=>{k.target=0}));let N=!1,P=0;new IntersectionObserver(e=>{for(let t of e)N=t.isIntersecting&&t.intersectionRatio>0;N&&!P&&(P=requestAnimationFrame(F))},{threshold:[0,.05]}).observe(e);function F(e){if(r&&performance.now()-j>1200)if(N){let t=e*.001;O.tx=.5+.22*Math.sin(t*.46),O.ty=.5+.18*Math.sin(t*.69+1.4),k.target=M}else k.target=0;O.x+=(O.tx-O.x)*.12,O.y+=(O.ty-O.y)*.12,k.t+=(k.target-k.t)*.08,A[0]=O.x,A[1]=O.y,w.uniforms.uHover.value=k.t,w.uniforms.uTime.value=e*.001,m.render({scene:T}),P=N||k.t>.001?requestAnimationFrame(F):0}e.classList.add(`webgl-on`),P=requestAnimationFrame(F)}catch(e){console.warn(`[liberty] WebGL shader failed, using CSS fallback.`,e)}},o=!1,s=new IntersectionObserver(e=>{!o&&e.some(e=>e.isIntersecting)&&(o=!0,s.disconnect(),a())},{rootMargin:`100% 0% 100% 0%`});s.observe(e)}}var w=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,T=document.documentElement.dataset.tier||`high`,E=T===`high`;if(w)document.documentElement.classList.remove(`js-enabled`);else try{let n=T!==`low`,[{gsap:r},{ScrollTrigger:i},a,o]=await Promise.all([t(()=>import(`./gsap-C_F2famk.js`),__vite__mapDeps([2,3]),import.meta.url),t(()=>import(`./ScrollTrigger-C0K7cnyT.js`),__vite__mapDeps([4,3]),import.meta.url),t(()=>import(`./splitting-oi4GEGE6.js`).then(t=>e(t.default,1)),__vite__mapDeps([5,6,7]),import.meta.url),n?t(()=>import(`./lenis-CfxVH_NU.js`),__vite__mapDeps([8,9]),import.meta.url):Promise.resolve({default:null})]);r.registerPlugin(i);let s=a.default||a,c=null;n&&(c=new(o.default||o)({lerp:.1,smoothWheel:!0,wheelMultiplier:1,touchMultiplier:1.2}),window.lenis=c,c.on(`scroll`,i.update),r.ticker.add(e=>{c.raf(e*1e3)}),r.ticker.lagSmoothing(0)),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[href^="#"]`);if(!t)return;let n=t.getAttribute(`href`);if(!n||n===`#`)return;let r=document.querySelector(n);r&&(e.preventDefault(),c?c.scrollTo(r,{offset:0,duration:1.2}):r.scrollIntoView({behavior:`smooth`,block:`start`}))}),document.querySelectorAll(`.mq`).forEach((e,t)=>{let n=e.querySelector(`.mq-track`);n.innerHTML+=n.innerHTML;let i=28+t*4,a=t%2==0?-1:1;r.fromTo(n,{xPercent:a<0?0:-50},{xPercent:a<0?-50:0,duration:i,ease:`none`,repeat:-1})}),document.querySelectorAll(`.cta-mq`).forEach((e,t)=>{let n=e.querySelector(`.cta-mq-track`);n.innerHTML+=n.innerHTML;let i=t%2==0?-1:1;r.fromTo(n,{xPercent:i<0?0:-50},{xPercent:i<0?-50:0,duration:44+t*8,ease:`none`,repeat:-1})});let l=(e,t,n)=>{Array.from(e).forEach(e=>{let r=document.createElement(t);r.className=n,e.parentNode.insertBefore(r,e),r.appendChild(e)})};function u(e,t,n,i){switch(t){case`char-variation-1`:e.fromTo(n,E?{skewX:-30,filter:`blur(10px) brightness(0%)`,willChange:`filter, transform`}:{skewX:-30,opacity:0,willChange:`opacity, transform`},E?{skewX:0,filter:`blur(0px) brightness(100%)`,duration:.5,stagger:.05,ease:`none`}:{skewX:0,opacity:1,duration:.5,stagger:.05,ease:`none`});break;case`char-variation-2`:e.fromTo(n,E?{scaleY:.1,scaleX:1.8,filter:`blur(10px) brightness(50%)`,willChange:`filter, transform`}:{scaleY:.1,scaleX:1.8,opacity:.3,willChange:`opacity, transform`},E?{scaleY:1,scaleX:1,filter:`blur(0px) brightness(100%)`,duration:.5,stagger:.05,ease:`none`}:{scaleY:1,scaleX:1,opacity:1,duration:.5,stagger:.05,ease:`none`});break;case`char-variation-3`:e.fromTo(n,{willChange:`opacity, transform`,opacity:0,xPercent:()=>r.utils.random(-200,200),yPercent:()=>r.utils.random(-150,150)},{ease:`power1.inOut`,opacity:1,xPercent:0,yPercent:0,stagger:{each:.05,grid:`auto`,from:`random`}});break;case`char-variation-4`:l(n,`span`,`char-wrap`),e.fromTo(n,{willChange:`transform`,xPercent:-250,rotationZ:45,scaleX:6,transformOrigin:`100% 50%`},{duration:1,ease:`power2`,xPercent:0,rotationZ:0,scaleX:1,stagger:.06});break;case`char-variation-5`:l(n,`span`,`char-wrap`),e.fromTo(n,{willChange:`transform`,transformOrigin:`0% 50%`,xPercent:105},{duration:1.35,ease:`expo.out`,xPercent:0,stagger:.06});break;case`char-variation-6`:e.fromTo(n,{willChange:`transform`,transformOrigin:`50% 100%`,scaleY:0},{ease:`power3.in`,opacity:1,scaleY:1,stagger:.05});break;case`word-variation-1`:e.fromTo(i,E?{willChange:`opacity`,opacity:0,filter:`blur(20px)`}:{willChange:`opacity, transform`,opacity:0,yPercent:10},E?{duration:.55,ease:`power2.out`,opacity:1,filter:`blur(0px)`,stagger:{each:.025,from:`random`}}:{duration:.55,ease:`power2.out`,opacity:1,yPercent:0,stagger:{each:.025,from:`random`}});break;case`word-variation-2`:e.fromTo(i,{willChange:`transform`,transformOrigin:`50% 0%`,scaleY:0,overflow:`hidden`},{ease:`back.out(1.4)`,opacity:1,scaleY:1,yPercent:0,stagger:.035,duration:.5});break;case`word-variation-3`:i.forEach(e=>r.set(e.parentNode,{perspective:1e3})),e.fromTo(i,{willChange:`opacity, transform`,z:()=>r.utils.random(500,950),opacity:0,xPercent:()=>r.utils.random(-100,100),yPercent:()=>r.utils.random(-10,10),rotationX:()=>r.utils.random(-90,90)},{ease:`expo`,opacity:1,rotationX:0,rotationY:0,xPercent:0,yPercent:0,duration:2,z:0,stagger:{each:.1,from:`random`}});break}}function d(e){return e.classList.contains(`js-split`)?{chars:e.querySelectorAll(`.char`),words:e.querySelectorAll(`.word`)}:(e.classList.add(`js-split`),s({target:e,by:`chars`}),e.style.visibility=``,{chars:e.querySelectorAll(`.char`),words:e.querySelectorAll(`.word`)})}function f(e,{scrollTrigger:t}={}){if(!e)return;let n=e.dataset.textEffect;if(!n)return;let{chars:a,words:o}=d(e);if((!a||!a.length)&&(!o||!o.length))return;let s=r.timeline({paused:!0});u(s,n,a,o),s.pause(0),t?i.create({trigger:t.trigger||e,start:t.start||`top 70%`,once:!0,onEnter:()=>s.play()}):s.play()}if(document.fonts&&document.fonts.ready)try{await document.fonts.ready}catch{}document.querySelectorAll(`.hero [data-text-effect]`).forEach(e=>f(e)),document.querySelectorAll(`main > section.chapter [data-text-effect]`).forEach(e=>{f(e,{scrollTrigger:{trigger:e.closest(`section.chapter`),start:`top 70%`}})}),document.querySelectorAll(`[data-scroll-reveal]`).forEach(e=>{let{words:t}=d(e);!t||!t.length||(e.classList.add(`is-scroll-reveal`),r.set(t,{clipPath:`inset(-10% 100% -10% 0%)`,opacity:.18,skewX:-8,...E?{filter:`blur(14px) saturate(0)`}:{},willChange:E?`opacity, filter, transform, clip-path`:`opacity, transform, clip-path`}),r.to(t,{clipPath:`inset(-10% 0% -10% 0%)`,opacity:1,skewX:0,...E?{filter:`blur(0px) saturate(1)`}:{},ease:`power2.out`,duration:1.3,stagger:{each:.5,from:`start`},scrollTrigger:{trigger:e,start:`top 85%`,end:`bottom 40%`,scrub:1.2}}))}),i.refresh(),document.querySelectorAll(`main > section.chapter`).forEach(e=>{let t=e.querySelectorAll(`:scope > .ch-head, :scope > .ch-sub, :scope > .about-grid > *, :scope > .stat-grid .stat, :scope > .work-list .work-row, :scope > .work-all, :scope > .road-rail, :scope > .manifesto-list li, :scope > .contact-socials li, :scope > .site-foot`);t.length&&r.to(t,{opacity:1,y:0,duration:.55,ease:`power3.out`,stagger:.04,scrollTrigger:{trigger:e,start:`top 78%`,once:!0}})}),document.querySelectorAll(`.stat-value[data-count]`).forEach(e=>{let t=parseInt(e.dataset.count,10),n=e.innerHTML.includes(`sup`)?`<sup>+</sup>`:``,i={v:0};r.to(i,{v:t,duration:1.8,ease:`power2.out`,onUpdate:()=>{e.innerHTML=Math.round(i.v)+n},scrollTrigger:{trigger:e,start:`top 85%`,once:!0}})})}catch(e){console.warn(`[chapters] GSAP/ScrollTrigger failed to load.`,e),document.documentElement.classList.remove(`js-enabled`)}(function(){let e=Array.from(document.querySelectorAll(`.chapter-rail li`)),t=Array.from(document.querySelectorAll(`main > section`));if(!e.length||!t.length||typeof IntersectionObserver>`u`)return;let n=new IntersectionObserver(n=>{n.forEach(n=>{if(!n.isIntersecting)return;let r=t.indexOf(n.target);r<0||e.forEach((e,t)=>e.classList.toggle(`is-active`,t===r))})},{rootMargin:`-45% 0px -45% 0px`,threshold:0});t.forEach(e=>n.observe(e))})();var D=241,O=e=>`./assets/kitsune-frames/frame_${String(e).padStart(4,`0`)}.webp`,k=32,A=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,j=document.querySelector(`.kitsune-runway`),M=document.querySelector(`.kitsune-canvas-wrap`),N=document.getElementById(`kitsune-canvas`),P=document.querySelector(`.kitsune-outro`),F=Array.from(document.querySelectorAll(`.kitsune-chapter`));if(j&&M&&N){let e=N.getContext(`2d`,{alpha:!0}),n=Array(D).fill(null),r=-1,i=0,a=0,o=()=>Math.max(1,Math.min(2,window.devicePixelRatio||1)),s=()=>{let t=M.getBoundingClientRect(),n=o(),i=Math.round(t.width*n),a=Math.round(t.height*n);N.width===i&&N.height===a||(N.width=i,N.height=a,e.setTransform(n,0,0,n,0,0),r=-1,u())};typeof ResizeObserver<`u`&&new ResizeObserver(()=>s()).observe(M);let c=t=>{let r=n[t];if(!r||!r.complete||r.naturalWidth===0)return;let i=o(),a=N.width/i,s=N.height/i;e.clearRect(0,0,a,s);let c=Math.min(a/r.naturalWidth,s/r.naturalHeight),l=r.naturalWidth*c,u=r.naturalHeight*c;e.drawImage(r,(a-l)/2,(s-u)/2,l,u)},l=e=>{let t=n[e];if(t&&t.complete&&t.naturalWidth>0)return e;for(let t=1;t<D;t++){let r=e-t;if(r>=0){let e=n[r];if(e&&e.complete&&e.naturalWidth>0)return r}let i=e+t;if(i<D){let e=n[i];if(e&&e.complete&&e.naturalWidth>0)return i}}return 0},u=()=>{let e=l(Math.max(0,Math.min(D-1,Math.round(i))));e!==r&&(c(e),r=e)},d=()=>new Promise(e=>{let t=0,r=!1,i=!1,a=Math.min(k,D),o=()=>{t++,!r&&t>=a&&(r=!0,e())};for(let e=0;e<D;e++){let t=new Image;t.decoding=`async`,e===0?t.fetchPriority=`high`:e>=k&&(t.fetchPriority=`low`),t.onload=()=>{n[e]=t,e===0&&(M.classList.add(`is-ready`),c(0)),e<k&&o()},t.onerror=()=>{e<k&&o()},n[e]=t,e<k&&(t.src=O(e+1))}let s=()=>{if(!i){i=!0;for(let e=k;e<D;e++){let t=n[e];t&&!t.src&&(t.src=O(e+1))}}};try{typeof IntersectionObserver<`u`?new IntersectionObserver((e,t)=>{for(let n of e)if(n.isIntersecting){s(),t.disconnect();break}},{rootMargin:`150% 0px`}).observe(j):setTimeout(s,2500)}catch{setTimeout(s,2500)}}),f=()=>{let e=j.getBoundingClientRect(),t=window.innerHeight||document.documentElement.clientHeight,n=e.height-t;return n<=0?0:Math.max(0,Math.min(1,-e.top/n))};if(A){let e=new Image;e.onload=()=>{n[0]=e,M.classList.add(`is-ready`),s()},e.src=O(1)}else Promise.all([t(()=>import(`./gsap-C_F2famk.js`),__vite__mapDeps([2,3]),import.meta.url),t(()=>import(`./ScrollTrigger-C0K7cnyT.js`),__vite__mapDeps([4,3]),import.meta.url)]).then(([{gsap:e},{ScrollTrigger:t}])=>{e.registerPlugin(t);let n=document.getElementById(`ch-numbers`),r=document.getElementById(`ch-kitsune`);if(n&&r){let i=Array.from(n.querySelectorAll(`.stat-value`)).filter(e=>!e.closest(`.stat-inf`)),a=n.querySelectorAll(`.stat-label`),o=n.querySelectorAll(`.stat-note`),s=n.querySelectorAll(`.stat`),c=n.querySelector(`.stat-grid`),l=n.querySelector(`.ch-kicker`),u=n.querySelector(`.ch-meta`),d=e.timeline({paused:!0}),f=.7,p=`power2.inOut`;d.to(n,{backgroundColor:`#FBF7F0`,duration:f,ease:p},0).to(s,{backgroundColor:`#FBF7F0`,duration:f,ease:p},0).to(i,{color:`#0A0A0A`,duration:f,ease:p},0).to(a,{color:`#0A0A0A`,duration:f,ease:p},0).to(o,{color:`rgba(10, 10, 10, 0.62)`,duration:f,ease:p},0),l&&d.to(l,{color:`#0A0A0A`,duration:f,ease:p},0),u&&d.to(u,{color:`rgba(10, 10, 10, 0.38)`,duration:f,ease:p},0),c&&d.to(c,{backgroundColor:`rgba(10, 10, 10, 0.08)`,borderColor:`rgba(10, 10, 10, 0.08)`,duration:f,ease:p},0),t.create({trigger:r,start:`top bottom`,end:`bottom top`,animation:d,toggleActions:`play reverse play reverse`})}let o=F.map(e=>{let t=e.querySelector(`.k-side-left`),n=e.querySelector(`.k-side-right`);return{left:t,right:n,leftLines:Array.from(t?t.querySelectorAll(`.k-line-inner`):[]),rightLines:Array.from(n?n.querySelectorAll(`.k-line-inner`):[])}});o.forEach(({left:t,right:n,leftLines:r,rightLines:i})=>{t&&e.set(t,{autoAlpha:0,x:-60}),n&&e.set(n,{autoAlpha:0,x:60}),e.set(r,{yPercent:110}),e.set(i,{yPercent:110})});let c=-1,l=-1,p=!1,m=()=>{if(p||c===l)return;p=!0;let t=c,n=l;c=n;let r=e.timeline({onComplete:()=>{p=!1,c!==l&&m()}});if(t>=0){let{left:e,right:n,leftLines:i,rightLines:a}=o[t];r.to([...i,...a],{yPercent:-110,duration:.5,ease:`power3.in`,stagger:{amount:.16,from:`end`}},0),e&&r.to(e,{x:-60,autoAlpha:0,duration:.45,ease:`power2.in`},.1),n&&r.to(n,{x:60,autoAlpha:0,duration:.45,ease:`power2.in`},.1),r.set([...i,...a],{yPercent:110})}if(n>=0){let{left:e,right:t,leftLines:i,rightLines:a}=o[n];r.set([...i,...a],{yPercent:110}),e&&r.set(e,{x:-60,autoAlpha:0}),t&&r.set(t,{x:60,autoAlpha:0}),e&&r.to(e,{x:0,autoAlpha:1,duration:.7,ease:`power3.out`},`+=0.05`),t&&r.to(t,{x:0,autoAlpha:1,duration:.7,ease:`power3.out`},`<`),r.to([...i,...a],{yPercent:0,duration:.85,ease:`power3.out`,stagger:{amount:.32,from:`start`}},`<+=0.12`)}},h=e=>{l=e,m()},g=e=>{for(let t=0;t<F.length;t++){let n=parseFloat(F[t].dataset.show),r=parseFloat(F[t].dataset.hide);if(e>=n&&e<=r)return t}return-1},_=t=>{let n=Math.max(0,Math.min(1,t/.06)),r=Math.max(0,Math.min(1,(t-.92)/.08)),i=(.88+.12*n)*(1-.06000000000000005*r),a=(.3+.7*n)*(1-.3*r);e.set(M,{scale:i,autoAlpha:a}),P&&e.set(P,{autoAlpha:.3+.7*r})},v=()=>{a=0;let e=f();i=e*(D-1),u(),_(e),h(g(e))},y=()=>{a||=requestAnimationFrame(v)};d().then(()=>{s(),y()}),window.addEventListener(`scroll`,y,{passive:!0}),window.addEventListener(`resize`,()=>{s(),y()},{passive:!0})}).catch(()=>{d().then(()=>{s();let e=()=>{a=0,i=f()*(D-1),u()},t=()=>{a||=requestAnimationFrame(e)};window.addEventListener(`scroll`,t,{passive:!0}),window.addEventListener(`resize`,()=>{s(),t()},{passive:!0}),t()})})}var I=383,L=e=>`./assets/inspiration-frames/frame_${String(e).padStart(4,`0`)}.webp`,R=32,z=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,B=document.querySelector(`.hitomi-runway`),V=document.querySelector(`.hitomi-canvas-wrap`),H=document.getElementById(`hitomi-canvas`),U=document.querySelector(`.hitomi-outro`),W=Array.from(document.querySelectorAll(`.hitomi-chapter`));if(B&&V&&H){let e=H.getContext(`2d`,{alpha:!0}),n=Array(I).fill(null),r=-1,i=0,a=0,o=()=>Math.max(1,Math.min(2,window.devicePixelRatio||1)),s=()=>{let t=V.getBoundingClientRect(),n=o(),i=Math.round(t.width*n),a=Math.round(t.height*n);H.width===i&&H.height===a||(H.width=i,H.height=a,e.setTransform(n,0,0,n,0,0),r=-1,d())};typeof ResizeObserver<`u`&&new ResizeObserver(()=>s()).observe(V);let c=window.matchMedia(`(max-width: 900px)`),l=t=>{let r=n[t];if(!r||!r.complete||r.naturalWidth===0)return;let i=o(),a=H.width/i,s=H.height/i;e.clearRect(0,0,a,s);let l=(c.matches?Math.min:Math.max)(a/r.naturalWidth,s/r.naturalHeight),u=r.naturalWidth*l,d=r.naturalHeight*l,f=(a-u)/2,p=(s-d)/2;e.drawImage(r,f,p,u,d)},u=e=>{let t=n[e];if(t&&t.complete&&t.naturalWidth>0)return e;for(let t=1;t<I;t++){let r=e-t;if(r>=0){let e=n[r];if(e&&e.complete&&e.naturalWidth>0)return r}let i=e+t;if(i<I){let e=n[i];if(e&&e.complete&&e.naturalWidth>0)return i}}return 0},d=()=>{let e=u(Math.max(0,Math.min(I-1,Math.round(i))));e!==r&&(l(e),r=e)},f=()=>new Promise(e=>{let t=0,r=!1,i=!1,a=Math.min(R,I),o=()=>{t++,!r&&t>=a&&(r=!0,e())};for(let e=0;e<I;e++){let t=new Image;t.decoding=`async`,e===0?t.fetchPriority=`high`:e>=R&&(t.fetchPriority=`low`),t.onload=()=>{n[e]=t,e===0&&(V.classList.add(`is-ready`),l(0)),e<R&&o()},t.onerror=()=>{e<R&&o()},n[e]=t,e<R&&(t.src=L(e+1))}let s=()=>{if(!i){i=!0;for(let e=R;e<I;e++){let t=n[e];t&&!t.src&&(t.src=L(e+1))}}};try{typeof IntersectionObserver<`u`?new IntersectionObserver((e,t)=>{for(let n of e)if(n.isIntersecting){s(),t.disconnect();break}},{rootMargin:`150% 0px`}).observe(B):setTimeout(s,2500)}catch{setTimeout(s,2500)}}),p=()=>{let e=B.getBoundingClientRect(),t=window.innerHeight||document.documentElement.clientHeight,n=e.height-t;return n<=0?0:Math.max(0,Math.min(1,-e.top/n))};if(z){let e=new Image;e.onload=()=>{n[0]=e,V.classList.add(`is-ready`),s()},e.src=L(1)}else Promise.all([t(()=>import(`./gsap-C_F2famk.js`),__vite__mapDeps([2,3]),import.meta.url),t(()=>import(`./ScrollTrigger-C0K7cnyT.js`),__vite__mapDeps([4,3]),import.meta.url)]).then(([{gsap:e},{ScrollTrigger:t}])=>{e.registerPlugin(t);let n=W.map(e=>{let t=e.querySelector(`.h-side-left`),n=e.querySelector(`.h-side-right`);return{left:t,right:n,leftLines:Array.from(t?t.querySelectorAll(`.h-line-inner`):[]),rightLines:Array.from(n?n.querySelectorAll(`.h-line-inner`):[])}});n.forEach(({left:t,right:n,leftLines:r,rightLines:i})=>{t&&e.set(t,{autoAlpha:0,x:-60}),n&&e.set(n,{autoAlpha:0,x:60}),e.set(r,{yPercent:110}),e.set(i,{yPercent:110})});let r=-1,o=-1,c=!1,l=()=>{if(c||r===o)return;c=!0;let t=r,i=o;r=i;let a=e.timeline({onComplete:()=>{c=!1,r!==o&&l()}});if(t>=0){let{left:e,right:r,leftLines:i,rightLines:o}=n[t];a.to([...i,...o],{yPercent:-110,duration:.5,ease:`power3.in`,stagger:{amount:.16,from:`end`}},0),e&&a.to(e,{x:-60,autoAlpha:0,duration:.45,ease:`power2.in`},.1),r&&a.to(r,{x:60,autoAlpha:0,duration:.45,ease:`power2.in`},.1),a.set([...i,...o],{yPercent:110})}if(i>=0){let{left:e,right:t,leftLines:r,rightLines:o}=n[i];a.set([...r,...o],{yPercent:110}),e&&a.set(e,{x:-60,autoAlpha:0}),t&&a.set(t,{x:60,autoAlpha:0}),e&&a.to(e,{x:0,autoAlpha:1,duration:.7,ease:`power3.out`},`+=0.05`),t&&a.to(t,{x:0,autoAlpha:1,duration:.7,ease:`power3.out`},`<`),a.to([...r,...o],{yPercent:0,duration:.85,ease:`power3.out`,stagger:{amount:.32,from:`start`}},`<+=0.12`)}},u=e=>{o=e,l()},m=e=>{for(let t=0;t<W.length;t++){let n=parseFloat(W[t].dataset.show),r=parseFloat(W[t].dataset.hide);if(e>=n&&e<=r)return t}return-1},h=t=>{let n=Math.max(0,Math.min(1,t/.06)),r=Math.max(0,Math.min(1,(t-.92)/.08)),i=(.96+.040000000000000036*n)*(1-.020000000000000018*r),a=(.3+.7*n)*(1-.25*r);e.set(V,{scale:i,autoAlpha:a}),U&&e.set(U,{autoAlpha:.3+.7*r})},g=()=>{a=0;let e=p();i=e*(I-1),d(),h(e),u(m(e))},_=()=>{a||=requestAnimationFrame(g)};f().then(()=>{s(),_()}),window.addEventListener(`scroll`,_,{passive:!0}),window.addEventListener(`resize`,()=>{s(),_()},{passive:!0})}).catch(()=>{f().then(()=>{s();let e=()=>{a=0,i=p()*(I-1),d()},t=()=>{a||=requestAnimationFrame(e)};window.addEventListener(`scroll`,t,{passive:!0}),window.addEventListener(`resize`,()=>{s(),t()},{passive:!0}),t()})})}{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=window.matchMedia(`(hover: none)`).matches,r=document.documentElement.dataset.tier||`high`,i=document.getElementById(`ch-countries`),a=i&&i.querySelector(`.countries-stick`),o=document.getElementById(`countries-stage`),s=document.getElementById(`countries-fx`),c=document.getElementById(`countries-progress`),l=c&&c.querySelector(`.countries-progress__fill`),u=i?Array.from(i.querySelectorAll(`.country-story`)):[],d=o?Array.from(o.querySelectorAll(`.countries-fallback__img`)):[],f=i?Array.from(i.querySelectorAll(`.cultural-bg-layer`)):[];if(i&&a&&o&&s&&c&&l){let p=r===`low`?1:r===`mid`?1.5:2,m=r===`low`?2:4,h=r===`low`?`mediump`:`highp`,g=[{fromIdx:0,toIdx:1,startP:0,endP:.5},{fromIdx:1,toIdx:2,startP:.5,endP:1}],_=[.5],v=[{name:`anubis`,img:`./assets/anubis/anubis.webp`,depth:`./assets/anubis/anubis-depthmap.webp`},{name:`liberty`,img:`./assets/liberty/liberty.webp`,depth:`./assets/liberty/liberty-depth-map.webp`},{name:`kangaroo`,img:`./assets/kangaro/kangaro.webp`,depth:`./assets/kangaro/kangaro-depth-map.webp`}],y=!1,b=[],x=()=>{y=!1;for(let e=0;e<b.length;e++)b[e]()};window.addEventListener(`scroll`,()=>{y||(y=!0,requestAnimationFrame(x))},{passive:!0});let S=e=>b.push(e),C=i.getBoundingClientRect(),w=window.innerHeight,T=()=>{C=i.getBoundingClientRect(),w=window.innerHeight};window.addEventListener(`resize`,T,{passive:!0}),S(T);let E=()=>{let e=C.height-w;return e<=0?0:-C.top/e},D=e=>{let t=0;for(let n=0;n<_.length;n++)e>=_[n]&&(t=n+1);let n=g[t],r=(e-n.startP)/(n.endP-n.startP);return{transIdx:t,fromIdx:n.fromIdx,toIdx:n.toIdx,mix:Math.max(0,Math.min(1,r))}},O=e=>{for(let t=0;t<d.length;t++)d[t].classList.toggle(`is-active`,t===e)},k=(e,t,n)=>{for(let r=0;r<f.length;r++){let i=0;r===e&&r===t?i=1:r===e?i=1-n:r===t&&(i=n),f[r].style.opacity=(i*.16).toFixed(3)}},A=[{in:.02,out:.38},{in:.52,out:.72},{in:.86,out:1.01}],j=e=>{for(let t=0;t<u.length&&t<A.length;t++){let n=A[t];u[t].style.opacity=e>=n.in&&e<n.out?`1`:`0`}},M=(e,t,n)=>{if(e===t)return n<e?0:1;let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)},N=(e,t)=>{c.classList.toggle(`is-visible`,t);let n=Math.max(0,Math.min(1,e));l.parentElement.style.setProperty(`--progress`,n.toFixed(4))};if(e||r===`low`){s.style.display=`none`,O(0);let e=()=>{let e=E();N(e,e>-.02&&e<1.02);let t=Math.max(0,Math.min(1,e));j(t);let n=D(t);O(n.mix>.5?n.toIdx:n.fromIdx),k(n.fromIdx,n.toIdx,n.mix)};S(e),window.addEventListener(`load`,e),e()}else (async()=>{try{let{Renderer:e,Program:i,Mesh:c,Triangle:l,Texture:d}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i}=await import(`./src-OUKUEtN6.js`);return{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i}},__vite__mapDeps([0,1]),import.meta.url),f=new e({canvas:s,alpha:!0,dpr:Math.min(window.devicePixelRatio,p),powerPreference:`high-performance`}),g=f.gl;g.clearColor(0,0,0,0);let _=new l(g),y=`
            precision ${h} float;

            uniform sampler2D uTexA;
            uniform sampler2D uTexB;
            uniform sampler2D uDepthA;
            uniform sampler2D uDepthB;
            uniform float uAspectA;
            uniform float uAspectB;
            uniform float uDepthAspectA;
            uniform float uDepthAspectB;
            uniform float uHasDepthA;
            uniform float uHasDepthB;
            // Per-slot zoom — >1 samples a tighter central region of the
            // image, effectively cropping transparent padding so a subject
            // that's small in its source PNG (e.g. kangaroo) fills the
            // frame. Updated from JS when the viewport breakpoint crosses.
            uniform float uZoomA;
            uniform float uZoomB;
            uniform float uMix;
            uniform vec2  uMouse;
            uniform float uHover;
            uniform float uAspect;
            uniform float uTime;
            uniform vec2  uResolution;

            varying vec2 vUv;

            // object-fit: contain, bottom-anchored (portraits stand on the base)
            vec2 fitUV(vec2 uv, float imgAspect, out float inside) {
              vec2 scale = vec2(1.0);
              if (uAspect > imgAspect) {
                scale.x = uAspect / imgAspect;
              } else {
                scale.y = imgAspect / uAspect;
              }
              vec2 iuv = (uv - vec2(0.5, 0.0)) * scale + vec2(0.5, 0.0);
              vec2 edge = step(vec2(0.0), iuv) * step(iuv, vec2(1.0));
              inside = edge.x * edge.y;
              return clamp(iuv, 0.0, 1.0);
            }

            float hash(vec2 p) {
              highp float d = dot(p, vec2(12.9898, 78.233));
              return fract(sin(d) * 43758.5453);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
              return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
            }

            float fbm(vec2 p) {
              float v = 0.0;
              float a = 0.55;
              for (int i = 0; i < ${m}; i++) {
                v += a * noise(p);
                p = p * 2.07 + vec2(17.3, 9.1);
                a *= 0.55;
              }
              return v;
            }

            /** Cursor-driven depth parallax.
             *  hero uses vec2(mouse - 0.5) * (depth - 0.5) * strength; we do
             *  the same but weighted by uHover so the shift fades with the
             *  pointer leaving the stage.
             *
             *  Returns uvT + inT via out params so the chroma-aberration
             *  path can reuse them (Phase 2 opt — avoids 4 extra depth
             *  samples + fitUV passes per edge pixel).
             *
             *  Strength lowered 0.055 -> 0.025 (Phase 6) so cursor travel
             *  no longer pushes uv samples past the portrait silhouette,
             *  which was stretching depth-map edges into visible artifacts. */
            vec4 samplePortrait(sampler2D tex, sampler2D depthTex,
                                float imgAspect, float depthAspect,
                                float hasDepth, vec2 uv,
                                out vec2 outUvT, out float outInT) {
              float inD;
              vec2 uvD = fitUV(uv, depthAspect, inD);
              float depth = texture2D(depthTex, uvD).r * inD;

              vec2 cursor = (uMouse - vec2(0.5, 0.5)) * uHover;
              vec2 off = cursor * (depth - 0.5) * hasDepth * 0.025;

              vec2 uvT = fitUV(uv - off, imgAspect, outInT);
              outUvT = uvT;
              // Premultiply rgb by the texture's own alpha so transparent
              // pixels always output rgb=0. PNG/WebP store RGB independently
              // of alpha — transparent texels carry arbitrary bleed colours
              // from the exporter. Without premult, the letterboxed area
              // next to the portrait inherits that bleed; the downstream
              // alpha bump (fire glow) then exposes it as coloured streaks.
              vec4 t = texture2D(tex, uvT);
              return vec4(t.rgb * t.a, t.a) * outInT;
            }

            /** Apply grain + smoke to the composed colour. Pulled out so
             *  both the dwell fast path (Phase 1) and the full transition
             *  path share one code site.
             *
             *  Phase 3: the smoke fbm is gated to uv.y < 0.48. Above that,
             *  wispReach = smoothstep(0.48, 0.02, uv.y) is already 0, so
             *  the fbm result is discarded — we just skip computing it and
             *  save one 4-octave fbm for every top-half pixel.
             *
             *  Grain is multiplied by col.a so the additive noise doesn't
             *  leak into transparent pixels — under premultiplied-alpha
             *  compositing, stray rgb on zero-alpha pixels shows up as
             *  bright artefacts against the page background. */
            vec4 finalize(vec4 col, vec2 uv) {
              float grain = hash(uv * uResolution * 0.5 + uTime * 60.0);
              col.rgb += (grain - 0.5) * 0.05 * col.a;

              float smoke = smoothstep(0.22, 0.0, uv.y);
              if (uv.y < 0.48) {
                vec2  wispUV    = uv * vec2(2.4, 1.7) + vec2(uTime * 0.05, -uTime * 0.07);
                float wisp      = fbm(wispUV);
                wisp            = smoothstep(0.44, 0.82, wisp);
                float wispReach = smoothstep(0.48, 0.02, uv.y);
                smoke           = clamp(smoke + wisp * wispReach * 0.8, 0.0, 1.0);
              }
              col.rgb *= (1.0 - smoke * 0.96);
              col.a   *= (1.0 - smoke * 0.88);
              return col;
            }

            void main() {
              vec2 uv = vUv;
              vec4 col;

              // --- Phase 1: dwell fast path ---
              // When uMix is past either endpoint, the fbm-perturbed mask
              // would already be flat 0 or flat 1 everywhere (the
              // smoothstep band sits entirely outside every pixel's t_p
              // range given paddedMix=-0.25/1.25 and w≈0.02). Skip the
              // pyramid warp, second texture pair, chroma band, and edge
              // glow — output is byte-identical at the endpoints, so the
              // user sees no transition. JS snaps state.mix to exact 0/1
              // so this fires reliably during idle frames.
              if (uMix < 0.002) {
                vec2 uvTa; float inTa;
                col = samplePortrait(uTexA, uDepthA, uAspectA, uDepthAspectA,
                                     uHasDepthA, uv, uvTa, inTa);
              } else if (uMix > 0.998) {
                vec2 uvTb; float inTb;
                col = samplePortrait(uTexB, uDepthB, uAspectB, uDepthAspectB,
                                     uHasDepthB, uv, uvTb, inTb);
              } else {
                // --- Pyramid fbm domain-warped "shape noise" (hero pattern) ---
                // Scale by uAspect so shapes stay round on non-square canvases.
                vec2 p = uv;
                p.x *= uAspect;
                vec2 flow = vec2(0.0, -uTime * 0.18);
                vec2 pn = vec2(p.x * 0.95, p.y * 0.72);

                vec2 q = vec2(
                  fbm(pn * 1.6 + flow),
                  fbm(pn * 1.6 + flow + vec2(5.2, 1.3))
                );
                vec2 r = vec2(
                  fbm(pn * 1.6 + 3.6 * q + flow),
                  fbm(pn * 1.6 + 3.6 * q + flow + vec2(8.3, 2.8))
                );

                // --- Per-pixel "passage time" t_p ---
                float t_p = (1.0 - uv.x)
                          + 0.26 * (r.x - 0.5)
                          + 0.12 * (r.y - 0.5);

                // --- Transition zone thickness (w). ---
                float w = 0.16 * smoothstep(0.0, 0.15, uMix) * smoothstep(1.0, 0.85, uMix) + 0.02;

                // Pad uMix past [0,1] so every pixel's t_p fully clears the
                // band at both ends (total t_p range is [-0.19, 1.19]).
                float paddedMix = mix(-0.25, 1.25, uMix);

                // Mask: 0 → A fully, 1 → B fully, with organic fbm edge between.
                float mask = smoothstep(t_p - w, t_p + w, paddedMix);

                // --- Transition envelope: 0 at endpoints, 1 mid-transition.
                float envelope = smoothstep(0.0, 0.08, uMix) * smoothstep(1.0, 0.92, uMix);

                // Edge band: peaks where mask is mid-transition.
                float edgeBand = 4.0 * mask * (1.0 - mask) * envelope;

                // --- Sample A and B with cursor-driven depth parallax ---
                vec2 uvTa, uvTb; float inTa, inTb;
                vec4 colA = samplePortrait(uTexA, uDepthA, uAspectA, uDepthAspectA,
                                           uHasDepthA, uv, uvTa, inTa);
                vec4 colB = samplePortrait(uTexB, uDepthB, uAspectB, uDepthAspectB,
                                           uHasDepthB, uv, uvTb, inTb);

                // --- Chromatic aberration in the edge band ---
                // Phase 2: reuse base uvT + inT instead of re-running
                // samplePortrait at uv±chroma. Depth delta across a 0.009
                // offset is negligible (sub-pixel) so the sampled color is
                // identical to running the full depth warp again — we just
                // skip 4 depth fetches and 4 fitUV passes per edge pixel.
                //
                // Each sampled .r / .b is also multiplied by the sampled
                // alpha (same premultiplication we do in samplePortrait)
                // so the channel swap doesn't leak bleed colours when the
                // chroma offset crosses into a transparent PNG region.
                if (edgeBand > 0.01) {
                  float chroma = 0.009 * edgeBand;
                  vec2 dir = vec2(1.0, 0.0);
                  vec4 aR = texture2D(uTexA, uvTa + dir * chroma);
                  vec4 aB = texture2D(uTexA, uvTa - dir * chroma);
                  vec4 bR = texture2D(uTexB, uvTb + dir * chroma);
                  vec4 bB = texture2D(uTexB, uvTb - dir * chroma);
                  colA.r = aR.r * aR.a * inTa;
                  colA.b = aB.b * aB.a * inTa;
                  colB.r = bR.r * bR.a * inTb;
                  colB.b = bB.b * bB.a * inTb;
                }

                // --- Mix A and B by the fbm-warped mask ---
                col = mix(colA, colB, mask);

                // Combined portrait silhouette — 1 inside either source,
                // 0 in empty space. Used below to add an emissive boost
                // for the glow only where the buffer's alpha can carry
                // extra rgb without breaking premultiplied-alpha output.
                float silhouette = max(colA.a, colB.a);

                // --- Vermillion edge glow ---
                // Split into two contributions:
                //   baseGlow — rgb premultiplied by the same alpha bump,
                //              so rgb ≤ alpha everywhere (including the
                //              transparent area around the portrait).
                //              This is what makes the fire edge sweep
                //              correctly across the full viewport without
                //              painting bright rectangular streaks.
                //   emissiveBoost — extra rgb on top, gated by silhouette
                //              so it only fires on the portrait where the
                //              sampled alpha is already high enough to
                //              carry the extra brightness. Preserves the
                //              original vivid-red edge look on the face.
                float glow = pow(edgeBand, 2.0);
                float glowAlpha = glow * 0.6;
                col.rgb += vec3(0.73, 0.09, 0.11) * glowAlpha;
                col.rgb += vec3(0.73, 0.09, 0.11) * glow * 0.3 * silhouette;
                col.a = max(col.a, glowAlpha);

                // --- Ghost halo on the leading side of the wipe (A→B) ---
                // No silhouette gate needed: outside the portrait colA is
                // transparent so luma=0 and ghost=0, meaning mix() only
                // darkens col.rgb proportionally — premult stays valid.
                float leading = step(0.5, mask) * edgeBand;
                float luma = dot(colA.rgb, vec3(0.299, 0.587, 0.114));
                vec3 ghost = mix(vec3(luma), colA.rgb, 0.35) * 0.55;
                col.rgb = mix(col.rgb, ghost, leading * 0.28);
              }

              gl_FragColor = finalize(col, uv);
            }
          `,b=e=>new Promise(t=>{let n=new Image;n.crossOrigin=`anonymous`,n.onload=()=>{let e=new d(g,{image:n,generateMipmaps:!1});e.aspect=n.naturalWidth/n.naturalHeight,t(e)},n.onerror=()=>t(null),n.src=e}),x=await Promise.all(v.map(async e=>{let[t,n]=await Promise.all([b(e.img),b(e.depth)]);return{tex:t,depth:n}}));if(x.some(e=>!e.tex)){console.warn(`[countries] missing portrait texture — CSS fallback retained`);return}let C=new i(g,{vertex:`
            precision mediump float;
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `,fragment:y,uniforms:{uTexA:{value:x[0].tex},uTexB:{value:x[1].tex},uDepthA:{value:x[0].depth||x[0].tex},uDepthB:{value:x[1].depth||x[1].tex},uAspectA:{value:x[0].tex.aspect},uAspectB:{value:x[1].tex.aspect},uDepthAspectA:{value:(x[0].depth||x[0].tex).aspect},uDepthAspectB:{value:(x[1].depth||x[1].tex).aspect},uHasDepthA:{value:+!!x[0].depth},uHasDepthB:{value:+!!x[1].depth},uMix:{value:0},uMouse:{value:[.5,.5]},uHover:{value:0},uAspect:{value:1},uTime:{value:0},uResolution:{value:[1,1]}},transparent:!0}),w=new c(g,{geometry:_,program:C}),T=o.getBoundingClientRect(),A=new Float32Array(u.length);function j(){for(let e=0;e<u.length;e++){let t=u[e].getBoundingClientRect();A[e]=T.width>0?(t.left+t.width/2-T.left)/T.width:.5}}function P(){T=o.getBoundingClientRect(),!(T.width<=0||T.height<=0)&&(f.setSize(T.width,T.height),C.uniforms.uResolution.value[0]=T.width,C.uniforms.uResolution.value[1]=T.height,C.uniforms.uAspect.value=T.width/T.height,j())}window.addEventListener(`resize`,P),window.addEventListener(`load`,P),S(()=>{T=o.getBoundingClientRect()}),typeof ResizeObserver<`u`&&new ResizeObserver(P).observe(o),P();let F=0,I=0,L=1,R=(e,t)=>{let n=x[t];e===`A`?(C.uniforms.uTexA.value=n.tex,C.uniforms.uDepthA.value=n.depth||n.tex,C.uniforms.uAspectA.value=n.tex.aspect,C.uniforms.uDepthAspectA.value=(n.depth||n.tex).aspect,C.uniforms.uHasDepthA.value=+!!n.depth,I=t):(C.uniforms.uTexB.value=n.tex,C.uniforms.uDepthB.value=n.depth||n.tex,C.uniforms.uAspectB.value=n.tex.aspect,C.uniforms.uDepthAspectB.value=(n.depth||n.tex).aspect,C.uniforms.uHasDepthB.value=+!!n.depth,L=t)},z={x:.5,y:.5,tx:.5,ty:.5},B={t:0,target:0},V=C.uniforms.uMouse.value,H=0,U=r===`high`?.6:.3,W=.55,G=(e,t)=>{let n=Math.max(0,Math.min(1,e)),r=Math.max(0,Math.min(1,t));z.tx=.5+(n-.5)*W,z.ty=1-(.5+(r-.5)*W)};window.addEventListener(`pointermove`,e=>{n&&(H=performance.now());let t=(e.clientX-T.left)/T.width,r=(e.clientY-T.top)/T.height;G(t,r),n||(B.target=+(t>-.15&&t<1.15&&r>-.15&&r<1.15))},{passive:!0}),n&&a.addEventListener(`pointerdown`,e=>{B.target=1,H=performance.now(),G((e.clientX-T.left)/T.width,(e.clientY-T.top)/T.height)});let K={mix:0,targetMix:0,fromIdx:0,toIdx:1},q=new Float32Array(u.length).fill(-1),J=!1,Y=0;new IntersectionObserver(e=>{for(let t of e)J=t.isIntersecting&&t.intersectionRatio>0;J&&!Y&&(Y=requestAnimationFrame(Z))},{threshold:[0,.01,.5]}).observe(a);function X(){let e=E(),t=e>-.05&&e<1.05,n=Math.max(0,Math.min(1,e));N(e,t);let r=D(n),i=r.transIdx!==F;F=r.transIdx,I!==r.fromIdx&&R(`A`,r.fromIdx),L!==r.toIdx&&R(`B`,r.toIdx),K.targetMix=r.mix,K.fromIdx=r.fromIdx,K.toIdx=r.toIdx,i&&(K.mix=r.mix),O(r.mix>.5?r.toIdx:r.fromIdx)}S(X),window.addEventListener(`load`,X),X();function Z(e){if(Y=0,n&&J&&performance.now()-H>1200){let t=e*.001;z.tx=.5+.22*Math.sin(t*.48),z.ty=.55+.14*Math.sin(t*.71+1.1),B.target=U}z.x+=(z.tx-z.x)*.14,z.y+=(z.ty-z.y)*.14,B.t+=(B.target-B.t)*.08,K.mix+=(K.targetMix-K.mix)*.18,K.targetMix===0&&K.mix<.0015?K.mix=0:K.targetMix===1&&K.mix>.9985&&(K.mix=1),V[0]=z.x,V[1]=z.y,C.uniforms.uHover.value=B.t,C.uniforms.uMix.value=K.mix,C.uniforms.uTime.value=e*.001;let t=(z.y-.5)*1.2*B.t,r=(z.x-.5)*-1.8*B.t;o.style.transform=`perspective(900px) rotateX(${t.toFixed(3)}deg) rotateY(${r.toFixed(3)}deg)`;let i=-.25+1.5*K.mix,a=.12;for(let e=0;e<u.length;e++){let t=u[e],n=0;if(e===K.fromIdx&&e===K.toIdx)n=1;else if(e===K.fromIdx){let t=1-A[e];n=1-M(t-a,t+a,i)}else if(e===K.toIdx){let t=1-A[e];n=M(t-a,t+a,i)}Math.abs(n-q[e])>.005&&(t.style.opacity=n.toFixed(3),t.style.filter=`blur(${((1-n)*4).toFixed(2)}px)`,q[e]=n)}k(K.fromIdx,K.toIdx,K.mix),f.render({scene:w});let s=Math.abs(K.targetMix-K.mix)>5e-4||Math.abs(z.tx-z.x)>.002||Math.abs(B.target-B.t)>.002;(J||s)&&(Y=requestAnimationFrame(Z))}o.classList.add(`webgl-on`),o.style.setProperty(`--shader`,`1`),Y=requestAnimationFrame(Z)}catch(e){console.warn(`[countries] WebGL failed, CSS fallback retained.`,e)}})()}}var G=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,K=window.matchMedia(`(hover: none)`).matches,q=document.documentElement.dataset.tier||`high`,J=document.getElementById(`ch-contact`),Y=document.getElementById(`contact-fx`),X=q===`low`?.75:q===`mid`?1:1.25,Z=q===`low`?1:2,ee=`mediump`,te=q===`low`?0:q===`mid`?4:8,ne=1e3/(q===`low`?24:q===`mid`?30:40);!J||!Y||(G||q===`low`?Y.style.display=`none`:re().catch(e=>{console.warn(`[contact] underwater shader failed, SVG fallback retained.`,e)}));async function re(){let{Renderer:e,Program:n,Mesh:r,Triangle:i}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r}=await import(`https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm`);return{Renderer:e,Program:t,Mesh:n,Triangle:r}},[],import.meta.url),a=new e({canvas:Y,alpha:!0,dpr:Math.min(window.devicePixelRatio||1,X),powerPreference:`high-performance`,premultipliedAlpha:!0}),o=a.gl;o.clearColor(0,0,0,0);let s=new i(o),c=`
    precision ${ee} float;

    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uAspect;
    uniform vec2  uMouse;          // smoothed pointer in canvas uv (y up)
    uniform float uHover;
    uniform vec3  uColSurface;     // bright vermillion near surface
    uniform vec3  uColMid;         // oxblood mid-depth
    uniform vec3  uColAbyss;       // near-black deep
    uniform vec3  uColCaustic;     // bright pinkish-red light rays
    uniform vec3  uColParticle;    // suspended-blood specks
    // Animated "drop" ripples — same ring buffer pattern as the heightfield.
    uniform vec3  uRipples[6];     // .xy origin in canvas uv (y up), .z age (s)
    uniform float uRippleStrength[6];
    varying vec2 vUv;

    // ---- noise / fbm primitives ----
    float hash(vec2 p) {
      highp float d = dot(p, vec2(12.9898, 78.233));
      return fract(sin(d) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.55;
      for (int i = 0; i < ${Z}; i++) {
        v += a * noise(p);
        p = p * 2.07 + vec2(17.3, 9.1);
        a *= 0.55;
      }
      return v;
    }

    // ---- ripple sum ----
    // Each cursor drop emits an expanding ring whose amplitude decays in time
    // (~3 s lifetime). The ring distorts the caustic + fog UV so waves read
    // as travelling pressure fronts, not just colour shifts.
    vec2 rippleOffset(vec2 p) {
      vec2 off = vec2(0.0);
      for (int i = 0; i < 6; i++) {
        vec3 r = uRipples[i];
        float age = r.z;
        if (age < 0.0) continue;
        float strength = uRippleStrength[i];
        if (strength < 0.001) continue;
        vec2 d = p - r.xy;
        d.x *= uAspect;
        float dist = length(d);
        float ampDecay = exp(-age * 0.9);
        float radial = exp(-dist * dist * 24.0);
        float wave = sin(dist * 38.0 - age * 9.0);
        off += normalize(d + 1e-5) * strength * ampDecay * radial * wave * 0.012;
      }
      return off;
    }

    // ---- caustic light rays ----
    // Aspect-aware scaling so the same visual density holds on wide
    // desktop bands and narrow mobile viewports. We bias the X scale by
    // sqrt(aspect) so a tall canvas doesn't end up with cramped vertical
    // wave bands.
    float causticField(vec2 uv, float scaleX, float scaleY, vec2 flow) {
      float aspectScale = max(0.4, min(1.6, sqrt(uAspect)));
      vec2 p = uv * vec2(scaleX * aspectScale, scaleY) + flow;
      float n = fbm(p);
      return 1.0 - abs(n - 0.5) * 2.0;
    }
    float caustics(vec2 uv) {
      // Two octaves only — the third was perceptually marginal at the cost
      // of a full extra fbm() call per pixel. Compensate by widening the
      // smoothstep so the remaining ridges still feel sharp.
      float a = causticField(uv, 3.6, 2.2, vec2(uTime * 0.07, -uTime * 0.045));
      float b = causticField(uv, 5.6, 3.6, vec2(-uTime * 0.05, uTime * 0.06));
      float mesh = a * b;
      return pow(smoothstep(0.16, 0.58, mesh), 2.0);
    }

    // ---- vertical god-ray shafts ----
    // Anchored at the top of the canvas, fanning slightly downward. A few
    // discrete rays at evenly-spaced X positions, each slowly drifting and
    // breathing in intensity. These read as distinct shafts piercing the
    // murk, complementing the diffuse caustic mesh above.
    float godRays(vec2 uv) {
      // Cone-projection: shaft origin is at uv.y=1, fans out toward the bottom.
      // Project current uv to a "ceiling-relative" coordinate.
      float fromTop = 1.0 - uv.y;
      // Skew x as a function of y to get diagonal shafts.
      float xSkew = uv.x + fromTop * 0.18;
      // Repeating sin wave at multiple frequencies = several shafts.
      float bands = sin(xSkew * 14.0 + uTime * 0.35)
                  + sin(xSkew * 23.0 - uTime * 0.27) * 0.6
                  + sin(xSkew * 41.0 + uTime * 0.5)  * 0.35;
      // Threshold to keep only the brightest peaks — narrow shafts.
      float shafts = smoothstep(0.65, 1.6, bands);
      // Falls off with depth — shafts only exist near the surface.
      float depthFall = pow(uv.y, 1.3);
      return shafts * depthFall;
    }

    // ---- volumetric blood fog ----
    // Two-frequency fbm for a layered drift; vertical bias keeps the densest
    // fog in the middle where suspended matter settles in real blood.
    float volumetric(vec2 uv) {
      // Single fbm() — the layered drift was masked by the 0.62 fog threshold
      // anyway, so the second sample contributed almost nothing visible.
      vec2 p = uv * vec2(1.4, 2.0) + vec2(uTime * 0.018, uTime * 0.040);
      float v = fbm(p);
      float bias = 1.0 - abs(uv.y - 0.50) * 1.2;
      return v * max(0.0, bias);
    }

    // ---- bubble / particle layer ----
    // Bigger, brighter specks with motion-blur tails so they read as RISING
    // through the fluid, not stuck in place. Each particle has a vertical
    // streak (gaussian elongated in Y) plus a bright core. Count, size, and
    // glow are all bumped vs the v1 pass so the layer reads at a glance.
    float particles(vec2 uv) {
      float total = 0.0;
      for (int i = 0; i < ${te}; i++) {
        float fi = float(i);
        // Base x — pseudo-random, slow horizontal drift.
        float bx = fract(0.111 * fi + 0.367)
                 + 0.05 * sin(uTime * 0.3 + fi * 1.7);
        // y rises continuously and wraps.
        float speed = 0.030 + 0.020 * fract(0.71 * fi);
        float by = fract(uTime * speed + fi * 0.137);
        vec2 c = vec2(fract(bx), by);
        vec2 d = uv - c;
        d.x *= uAspect;
        // Particle "core" — small bright spot.
        float coreSize = 2200.0 + 900.0 * c.y;
        float core = exp(-dot(d, d) * coreSize);
        // Vertical streak — thin gaussian elongated downward (motion trail).
        float trailY = clamp(d.y * -1.0, 0.0, 0.04);   // only below the core
        float streak = exp(-(d.x * d.x * 8000.0 + trailY * trailY * 2200.0))
                     * (1.0 - smoothstep(0.0, 0.04, max(0.0, d.y * -1.0)));
        total += core * 1.0 + streak * 0.45;
      }
      return total;
    }

    void main() {
      vec2 uv = vUv;

      // Apply ripple distortion to the layers that should bend with cursor
      // pressure (caustics, fog, god-rays, surface). Particles intentionally
      // aren't distorted — they read as solid debris floating through.
      vec2 ripUv = uv + rippleOffset(uv);

      // ===== Layer 1: deep vertical gradient =====
      // y=0 (bottom) = abyss; y=1 (top) = surface. Sharper transition so the
      // depth contrast is unmistakable: light surface, deep darkness below.
      float depth = 1.0 - uv.y;                 // 0 at top, 1 at deepest
      vec3 base = mix(uColSurface, uColMid, smoothstep(0.0, 0.35, depth));
      base = mix(base, uColAbyss, smoothstep(0.45, 0.95, depth));

      // ===== Layer 2: volumetric fog (very subtle) =====
      // The fog was previously washing everything red. Now it only shows up
      // as sparse darker pockets so the section bg stays near-black.
      float fog = volumetric(ripUv);
      // Threshold so only the densest fog peaks contribute, and only as a
      // faint red tint — most of the canvas remains the base near-black.
      float fogPeak = pow(smoothstep(0.62, 0.98, fog), 2.0);
      base += uColCaustic * fogPeak * 0.10 * (0.4 + uv.y * 0.6);

      // ===== Layer 3: caustic mesh — the main "liquid reflect" =====
      // Sharp ridges of red light, only where the mesh peaks. Threshold
      // sharper than before so we see narrow red glints on a dark surface
      // rather than a soft red glow everywhere.
      float caus = caustics(ripUv);
      caus = pow(caus, 1.6);                   // sharpen further
      caus *= smoothstep(0.0, 0.55, uv.y);
      base += uColCaustic * caus * 0.45;
      // Hottest pixels brighten slightly — still strict red.
      base += vec3(0.90, 0.16, 0.20) * pow(caus, 3.0) * 0.18;

      // ===== Layer 4: vertical god-ray shafts =====
      float shafts = godRays(ripUv);
      shafts *= 0.5 + 0.5 * caus;
      base += uColCaustic * shafts * 0.20;
      base += vec3(0.80, 0.13, 0.17) * pow(shafts, 4.0) * 0.12;

      // ===== Layer 5: surface ceiling =====
      // Subtle dark-red wavy line, not a luminous edge. Wave frequencies
      // scale with sqrt(aspect) so a portrait/mobile viewport doesn't end
      // up with a crazy-busy waveline.
      float ws = max(0.45, min(1.4, sqrt(uAspect)));
      float surfWave =
          0.030 * sin(uv.x * 12.0 * ws + uTime * 1.4)
        + 0.020 * sin(uv.x * 6.5  * ws - uTime * 0.85)
        + 0.012 * sin(uv.x * 22.0 * ws + uTime * 2.4)
        + 0.008 * sin(uv.x * 41.0 * ws - uTime * 3.1);
      float surfaceY = 0.92 + surfWave;
      float belowSurface = smoothstep(surfaceY + 0.008, surfaceY - 0.03, uv.y);
      float rimWide = exp(-pow((uv.y - surfaceY) * 35.0, 2.0)) * 0.30;
      float rimCore = exp(-pow((uv.y - surfaceY) * 130.0, 2.0)) * 0.40;
      base += uColCaustic * rimWide * (0.45 + 0.55 * caus);
      base += vec3(0.65, 0.09, 0.13) * rimCore;
      // Foam dialled way back — only the tallest crests show a thin red dot.
      float foamMask = smoothstep(0.025, 0.045, surfWave + 0.030)
                     * exp(-pow((uv.y - surfaceY) * 60.0, 2.0));
      base += vec3(0.55, 0.08, 0.11) * foamMask * 0.18;

      // ===== Layer 6: suspended particles =====
      float p = particles(ripUv);
      base += uColParticle * p * 0.55;
      base += vec3(0.50, 0.07, 0.10) * pow(p, 2.0) * 0.20;

      // ===== Layer 7: cursor proximity glow =====
      vec2 mp = uv - uMouse;
      mp.x *= uAspect;
      float prox = exp(-dot(mp, mp) * 16.0) * uHover;
      base += uColCaustic * prox * 0.30;
      base += vec3(0.55, 0.07, 0.11) * pow(prox, 2.0) * 0.18;

      // ===== Atmospheric absorption =====
      // Aggressive depth dimming so the lower 60% reads pure black.
      base = base * (1.0 - depth * 0.80);

      // ===== Subtle film grain to break banding =====
      float grain = hash(uv * uResolution * 0.5 + uTime * 60.0);
      base += (grain - 0.5) * 0.025;

      // ===== Alpha — fade above the surface line so page bg shows through =====
      float alpha = belowSurface;
      // Bottom half: pure opaque so the abyss is solid.
      alpha = max(alpha, 1.0 - smoothstep(0.40, 1.0, uv.y));

      gl_FragColor = vec4(base * alpha, alpha);
    }
  `,l=[],u=[];for(let e=0;e<6;e++)l.push([0,0,-1]),u.push(0);let d=new n(o,{vertex:`
    precision mediump float;
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,fragment:c,uniforms:{uTime:{value:0},uResolution:{value:[1,1]},uAspect:{value:1},uMouse:{value:[.5,.5]},uHover:{value:0},uColSurface:{value:[.03,.005,.01]},uColMid:{value:[.012,.003,.006]},uColAbyss:{value:[.003,.001,.002]},uColCaustic:{value:[.55,.07,.11]},uColParticle:{value:[.45,.06,.1]},uRipples:{value:l},uRippleStrength:{value:u}},transparent:!0,depthTest:!1,depthWrite:!1}),f=new r(o,{geometry:s,program:d}),p=J.getBoundingClientRect();function m(){p=J.getBoundingClientRect(),!(p.width<=0||p.height<=0)&&(a.setSize(p.width,p.height),d.uniforms.uResolution.value[0]=p.width,d.uniforms.uResolution.value[1]=p.height,d.uniforms.uAspect.value=p.width/p.height)}window.addEventListener(`resize`,m),window.addEventListener(`scroll`,()=>{p=J.getBoundingClientRect()},{passive:!0}),typeof ResizeObserver<`u`&&new ResizeObserver(m).observe(J),m();let h={x:.5,y:.5,tx:.5,ty:.5},g={t:0,target:0},_=d.uniforms.uMouse.value,v=0,y=0;function b(e,t,n){let r=v%6,i=l[r];i[0]=e,i[1]=t,i[2]=0,u[r]=n,v++}function x(e,t){return[(e-p.left)/p.width,1-(t-p.top)/p.height]}window.addEventListener(`pointermove`,e=>{let[t,n]=x(e.clientX,e.clientY);h.tx=t,h.ty=n;let r=t>-.05&&t<1.05&&n>-.05&&n<1.05;if(g.target=+!!r,!r)return;let i=performance.now();i-y>180&&(b(t,n,.6),y=i)},{passive:!0}),J.addEventListener(`pointerdown`,e=>{let t=e.target;if(t&&t.closest&&t.closest(`a, button, iframe, .book-frame`))return;let[n,r]=x(e.clientX,e.clientY);b(n,r,1.6)});let S=0,C=!1,w=0,T=!1,E=performance.now()-7e3;new IntersectionObserver(e=>{for(let t of e)C=t.isIntersecting&&t.intersectionRatio>0;C&&!w&&(w=requestAnimationFrame(k))},{threshold:[0,.05,.5],rootMargin:`10% 0%`}).observe(J);let D=performance.now(),O=0;function k(e){if(w=0,e-O<ne-1){C&&(w=requestAnimationFrame(k));return}O=e;let t=Math.min(.066,Math.max(.001,(e-D)/1e3));if(D=e,h.x+=(h.tx-h.x)*.18,h.y+=(h.ty-h.y)*.18,g.t+=(g.target-g.t)*.08,K&&e-S>1700){let t=(e-E)*.001;b(.5+.32*Math.sin(t*.4),.5+.18*Math.sin(t*.61+1.3),.8),S=e}let n=0;for(let e=0;e<6;e++){let r=l[e];r[2]>=0&&(r[2]+=t,r[2]>4.5?(r[2]=-1,u[e]=0):n++)}_[0]=h.x,_[1]=h.y,d.uniforms.uHover.value=g.t,d.uniforms.uTime.value=(e-E)*.001,a.render({scene:f}),T||(T=!0,requestAnimationFrame(()=>{J.classList.add(`webgl-on`)}));let r=n>0||Math.abs(g.target-g.t)>.005||Math.abs(h.tx-h.x)>.002;(C||r)&&(w=requestAnimationFrame(k))}w=requestAnimationFrame(k)}(function(){let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=document.documentElement.dataset.tier||`high`,r=n===`low`?1:n===`mid`?1.25:1.5,i=document.getElementById(`site-drawer`),a=document.getElementById(`drawer-scrim`),o=document.getElementById(`drawer-content`),s=document.getElementById(`drawer-mask`),c=document.getElementById(`btn-menu`),l=document.getElementById(`drawer-close`);if(!i||!c)return;let u=e=>1-(1-e)**4,d={open:!1,progress:0,animStart:0,animFrom:0,animTo:0,animDur:620,raf:0,shaderInit:!1,shaderFailed:!1,tickHandle:0,lastFocused:null,program:null,renderer:null,mesh:null,mx:.5,my:.5,tmx:.5,tmy:.5,hover:0,tHover:0},f=`a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])`;function p(e){if(!d.open||e.key!==`Tab`)return;let t=Array.from(o.querySelectorAll(f));if(!t.length)return;let n=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),n.focus())}function m(e){if(d.open){if(e.key===`Escape`){e.preventDefault(),y();return}p(e)}}async function h(){if(!(d.shaderInit||d.shaderFailed||e||n===`low`)){d.shaderInit=!0;try{let{Renderer:e,Program:n,Mesh:i,Triangle:a,Texture:o,RenderTarget:c}=await t(async()=>{let{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}=await import(`./src-OUKUEtN6.js`);return{Renderer:e,Program:t,Mesh:n,Triangle:r,Texture:i,RenderTarget:a}},__vite__mapDeps([0,1]),import.meta.url),{bakeNoiseTexture:l}=await t(async()=>{let{bakeNoiseTexture:e}=await import(`./_bake-noise-CJ5n157n.js`);return{bakeNoiseTexture:e}},[],import.meta.url),u=new e({canvas:s,alpha:!0,dpr:Math.min(window.devicePixelRatio,r),powerPreference:`high-performance`}),f=u.gl;f.clearColor(0,0,0,0);let p=l(u,{Renderer:e,Program:n,Mesh:i,Triangle:a,Texture:o,RenderTarget:c}),m=new a(f),h=()=>+!!window.matchMedia(`(max-width: 768px)`).matches,g=new n(f,{vertex:`
          precision mediump float;
          attribute vec2 uv;
          attribute vec2 position;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `,fragment:`
          precision highp float;

          uniform float uTime;
          uniform float uProgress;     // 0..1 open state
          uniform float uWidth;        // drawer width in uv (0.65 desktop, 1.0 mobile)
          uniform float uHeight;       // drawer height in uv (0.88)
          uniform float uMobile;       // 1.0 kills left-edge wave
          uniform vec2  uResolution;
          uniform vec2  uMouse;        // pointer in uv (0..1), smoothed
          uniform float uHover;        // 0..1 pointer-inside strength
          uniform vec2  uGrainScale;   // precomputed uResolution * 0.5 (grain)
          uniform float uGrainTime;    // precomputed uTime * 60.0 (grain)
          uniform sampler2D uNoiseTex; // baked fbm — see scripts/_bake-noise.mjs

          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.55;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p = p * 2.0 + vec2(17.3, 9.1);
              a *= 0.55;
            }
            return v;
          }

          // Two-level pyramid domain warp via baked noise — matches the hero
          // shader's tendril character. Original had additional per-call
          // offsets (1.7, 9.2) that aren't present in our 3-channel bake;
          // the warp already decorrelates r.x from r.y through the 3.6*q
          // shift, so the visual output is effectively identical.
          float warpOffset(vec2 px) {
            vec4 s1 = texture2D(uNoiseTex, px * 0.125);
            vec2 q = s1.rg;
            vec4 s2 = texture2D(uNoiseTex, (px + 3.6 * q) * 0.125);
            vec2 r = vec2(s2.r, s2.b);
            return texture2D(uNoiseTex, (px + 1.8 * r) * 0.125).r - 0.5;
          }

          void main() {
            vec2 uv = vUv;                         // 0..1, origin bottom-left in OGL Triangle
            float p = smoothstep(0.0, 1.0, uProgress);

            // drawer occupies top-right of viewport, growing from corner (1,1)
            float reachW = uWidth  * p;
            float reachH = uHeight * p;

            float leftEdge   = 1.0 - reachW;        // uv.x boundary
            float bottomEdge = 1.0 - reachH;        // uv.y boundary (top of screen = uv.y=1)

            // Amplitude scales with progress. Large excursion so the tendrils travel
            // well across the edge, matching the hero's warped-blob character.
            float amp = 0.085 * p;

            // --- Safely-outside early discard (runs BEFORE the two warpOffset
            // calls so we never pay for fbm in transparent pixels).
            // Max |wave*amp| ≈ 0.085 * 0.61 ≈ 0.052, plus smoothstep lower edge
            // at (l - 0.002). A pixel with uv.x < leftEdge - 0.055 can never
            // produce nonzero left smoothstep regardless of wave; likewise for
            // uv.y < bottomEdge - 0.055 on the bottom axis. Output bit-identical
            // to the previous path since final alpha = 0 there.
            if (uv.x < leftEdge - 0.055 || uv.y < bottomEdge - 0.055) {
              gl_FragColor = vec4(0.0);
              return;
            }

            // Fade constants (named so they're easy to trace in the bounds math).
            float leftFade   = 0.07;
            float bottomFade = 0.008;

            // --- Safely-inside shortcut: for pixels far enough from both wavy
            // edges, edgeAlpha is guaranteed 1.0 and seam is guaranteed 0
            // regardless of wave value — so the 2x warpOffset (=10 fbm = 160
            // hashes) can be skipped entirely. Bounds:
            //   edgeAlpha=1 requires uv.x > l + leftFade where l <= leftEdge + amp*0.61
            //     -> uv.x > leftEdge + 0.052 + 0.07  -> 0.125 safety
            //   seam zone is |uv.x - l| < 0.018, upper bound leftEdge + 0.070
            //     -> covered by the 0.125 margin above
            //   bottom axis: uv.y > bottomEdge + amp*0.61 + bottomFade -> 0.060 safety
            // Uniform-ish branch; adjacent pixels decide together except on a
            // thin boundary, so GPUs take the fast path coherently.
            float leftWave;
            float bottomWave;
            float l;
            float b;
            float edgeAlpha;
            vec3 surface = vec3(0.039, 0.039, 0.043);

            if (uv.x > leftEdge + 0.125 && uv.y > bottomEdge + 0.060) {
              leftWave   = 0.0;
              bottomWave = 0.0;
              l = leftEdge;
              b = bottomEdge;
              edgeAlpha = 1.0;
              // seam is 0 in this region (uv.x > l + 0.018 always) — no add.
            } else {
              // Edge zone: compute full wave.
              float tDrift = uTime * 0.11;
              leftWave   = warpOffset(vec2(uv.y * 0.9, tDrift));
              bottomWave = warpOffset(vec2(uv.x * 0.9, tDrift + 11.3));
              // mobile kills the left wave (no left edge visually)
              leftWave *= (1.0 - uMobile);
              l = leftEdge   + leftWave   * amp;
              b = bottomEdge + bottomWave * amp;
              edgeAlpha =
                  smoothstep(l - 0.002, l + leftFade,   uv.x) *
                  smoothstep(b - 0.001, b + bottomFade, uv.y);
              // Edge-zone re-check: pixels that end up with ~0 alpha after wave
              // shift contribute nothing; bail before blob/grain.
              if (edgeAlpha < 0.001) {
                gl_FragColor = vec4(0.0);
                return;
              }
              // vermillion seam kissing the left wavy edge
              float seam = smoothstep(0.018, 0.0, abs(uv.x - l)) * 0.5 * (1.0 - uMobile);
              surface += vec3(0.73, 0.09, 0.11) * seam;
            }

            // ---- pointer-reactive fire-tendril rim (mirrors hero hover) ----
            // Inline fbm domain warp instead of baked texture — the
            // RenderTarget texture binding produces constant values in
            // the drawer's separate GL context, giving a perfect circle.
            // Guarded by hover + distance: zero cost when idle, and only
            // pixels within warp reach of the blob pay the fbm cost.
            vec2 mp = uv - uMouse;
            mp.x *= uResolution.x / max(uResolution.y, 1.0);
            float mpLen = length(mp);

            if (uHover > 0.001 && mpLen < 0.60) {
              vec2 mpn = vec2(mp.x, mp.y * 0.72);
              vec2 mflow = vec2(0.0, -uTime * 0.15);
              vec2 domIn = mpn * 1.8 + mflow;
              vec2 mq = vec2(fbm(domIn), fbm(domIn + vec2(5.2, 1.3)));
              vec2 domIn2 = domIn + 3.6 * mq;
              vec2 mr = vec2(fbm(domIn2), fbm(domIn2 + vec2(8.3, 2.8)));
              float md = length(mp + 0.22 * (mr - 0.5));
              float blobSize = 0.28;
              float coreRaw = 1.0 - smoothstep(blobSize * 0.75, blobSize * 1.05, md);
              float blobCore = coreRaw * uHover;
              float blobHalo = (1.0 - smoothstep(blobSize * 1.05, blobSize * 1.55, md))
                             * (1.0 - coreRaw) * uHover * 0.45;
              float blobLine = smoothstep(blobSize * 0.985, blobSize * 1.000, md)
                             * (1.0 - smoothstep(blobSize * 1.000, blobSize * 1.018, md))
                             * uHover;
              float insideDrawer = smoothstep(l + 0.002, l + 0.04, uv.x);
              blobCore *= insideDrawer;
              blobHalo *= insideDrawer;
              blobLine *= insideDrawer;
              surface += vec3(0.55, 0.10, 0.14) * (blobCore * 0.28 + blobHalo * 0.22);
              surface += vec3(0.73, 0.09, 0.11) * blobLine * 0.65;
            }

            // film grain, subtle (tied to the same hash + time idiom as hero)
            float grain = hash(uv * uGrainScale + uGrainTime);
            surface += (grain - 0.5) * 0.045;

            // solid alpha inside, falls to zero across the gradient-fade zone
            float a = edgeAlpha * 0.96;

            gl_FragColor = vec4(surface * a, a);
          }
        `,uniforms:{uTime:{value:0},uProgress:{value:0},uWidth:{value:h()?1:.65},uHeight:{value:1},uMobile:{value:h()},uResolution:{value:[1,1]},uMouse:{value:[.5,.5]},uHover:{value:0},uGrainScale:{value:[.5,.5]},uGrainTime:{value:0},uNoiseTex:{value:p}},transparent:!0}),_=new i(f,{geometry:m,program:g});u.autoClear=!1;let v=1,y=1;function b(){let e=window.innerWidth,t=window.innerHeight;u.setSize(e,t),v=f.drawingBufferWidth,y=f.drawingBufferHeight,g.uniforms.uResolution.value[0]=e,g.uniforms.uResolution.value[1]=t,g.uniforms.uGrainScale.value[0]=e*.5,g.uniforms.uGrainScale.value[1]=t*.5;let n=h();g.uniforms.uMobile.value=n,g.uniforms.uWidth.value=n?1:.65}b(),window.addEventListener(`resize`,b),d.renderer=u,d.program=g,d.mesh=_;let x=g.uniforms.uMouse.value;function S(){f.disable(f.SCISSOR_TEST),f.clear(f.COLOR_BUFFER_BIT);let e=d.progress;if(e<=.001)return;let t=g.uniforms.uWidth.value,n=e*e*(3-2*e),r=Math.max(0,1-t*n-.06),i=Math.floor(r*v),a=Math.max(1,v-i);f.enable(f.SCISSOR_TEST),f.scissor(i,0,a,y),u.render({scene:_}),f.disable(f.SCISSOR_TEST)}function C(e){d.mx+=(d.tmx-d.mx)*.16,d.my+=(d.tmy-d.my)*.16,d.hover+=(d.tHover-d.hover)*.09;let t=e*.001;g.uniforms.uTime.value=t,g.uniforms.uGrainTime.value=t*60,g.uniforms.uProgress.value=d.progress,x[0]=d.mx,x[1]=d.my,g.uniforms.uHover.value=d.hover*d.progress,S(),d.open||d.progress>.001||d.hover>.001?d.tickHandle=requestAnimationFrame(C):(f.disable(f.SCISSOR_TEST),f.clear(f.COLOR_BUFFER_BIT),d.tickHandle=0)}d.renderWithScissor=S,d.tickHandle=requestAnimationFrame(C)}catch(e){console.warn(`[drawer] WebGL unavailable — using CSS fallback.`,e),d.shaderFailed=!0,i.classList.add(`drawer--no-webgl`)}}}function g(){if(!(d.shaderFailed||e)&&!d.tickHandle&&d.program&&d.renderer&&d.mesh){let{renderer:e,program:t,mesh:n,renderWithScissor:r}=d,i=t.uniforms.uMouse.value,a=o=>{d.mx+=(d.tmx-d.mx)*.16,d.my+=(d.tmy-d.my)*.16,d.hover+=(d.tHover-d.hover)*.09;let s=o*.001;t.uniforms.uTime.value=s,t.uniforms.uGrainTime.value=s*60,t.uniforms.uProgress.value=d.progress,i[0]=d.mx,i[1]=d.my,t.uniforms.uHover.value=d.hover*d.progress,r?r():e.render({scene:n}),d.open||d.progress>.001||d.hover>.001?d.tickHandle=requestAnimationFrame(a):d.tickHandle=0};d.tickHandle=requestAnimationFrame(a)}}function _(e,t){cancelAnimationFrame(d.raf),d.animFrom=d.progress,d.animTo=e,d.animStart=performance.now(),d.animDur=t;let n=e=>{let t=Math.min(1,(e-d.animStart)/d.animDur);d.progress=d.animFrom+(d.animTo-d.animFrom)*u(t),t<1?d.raf=requestAnimationFrame(n):(d.progress=d.animTo,d.raf=0,d.open||(i.setAttribute(`aria-hidden`,`true`),a.hidden=!0))};d.raf=requestAnimationFrame(n)}function v(){d.open||(d.open=!0,d.lastFocused=document.activeElement,i.dataset.open=`true`,i.setAttribute(`aria-hidden`,`false`),a.hidden=!1,requestAnimationFrame(()=>{a.dataset.open=`true`}),c.setAttribute(`aria-expanded`,`true`),document.body.style.overflow=`hidden`,e?d.progress=1:(h().then(g),_(1,620),g()),setTimeout(()=>{let e=o.querySelector(f);e&&e.focus({preventScroll:!0})},e?0:260))}function y(){d.open&&(d.open=!1,i.dataset.open=`false`,delete a.dataset.open,c.setAttribute(`aria-expanded`,`false`),document.body.style.overflow=``,e?(d.progress=0,i.setAttribute(`aria-hidden`,`true`),a.hidden=!0):(_(0,520),g()),d.lastFocused&&typeof d.lastFocused.focus==`function`&&d.lastFocused.focus({preventScroll:!0}))}c.addEventListener(`click`,()=>{d.open?y():v()}),l&&l.addEventListener(`click`,y),a.addEventListener(`click`,y),document.addEventListener(`keydown`,m),o.addEventListener(`click`,e=>{let t=e.target.closest(`a[href^="#"]`);if(!t)return;let n=t.getAttribute(`href`);!n||n===`#`||document.querySelector(n)&&y()});function b(e){let t=window.innerWidth,n=window.innerHeight;d.tmx=Math.max(0,Math.min(1,e.clientX/Math.max(t,1))),d.tmy=1-Math.max(0,Math.min(1,e.clientY/Math.max(n,1)))}if(i.addEventListener(`pointermove`,b,{passive:!0}),i.addEventListener(`pointerenter`,e=>{d.tHover=1,b(e),g()}),i.addEventListener(`pointerleave`,()=>{d.tHover=0,g()}),!e&&n!==`low`){let e=()=>{let e=()=>{d.shaderInit||h().then(()=>{if(!d.program||!d.renderer||!d.mesh)return;let e=d.renderer.gl;d.program.uniforms.uProgress.value=.5,d.program.uniforms.uHover.value=.5,d.program.uniforms.uTime.value=0,d.program.uniforms.uGrainTime.value=0,d.program.uniforms.uMouse.value[0]=.5,d.program.uniforms.uMouse.value[1]=.5,e.disable(e.SCISSOR_TEST),e.clear(e.COLOR_BUFFER_BIT),d.renderer.render({scene:d.mesh}),d.renderer.render({scene:d.mesh}),e.finish(),d.program.uniforms.uProgress.value=0,d.program.uniforms.uHover.value=0,e.clear(e.COLOR_BUFFER_BIT)}).catch(()=>{})};typeof requestIdleCallback==`function`?requestIdleCallback(e,{timeout:2e3}):setTimeout(e,300)};window.addEventListener(`preloader:done`,e,{once:!0}),setTimeout(()=>{d.shaderInit||e()},3e3)}})();async function ie(e,n){let[{gsap:r},{ScrollTrigger:i}]=await Promise.all([t(()=>import(`./gsap-C_F2famk.js`),__vite__mapDeps([2,3]),import.meta.url),t(()=>import(`./ScrollTrigger-C0K7cnyT.js`),__vite__mapDeps([4,3]),import.meta.url)]);r.registerPlugin(i);let{swordGroup:a,targetRef:o}=n,s=r.quickTo(a.position,`x`,{duration:.6,ease:`power3.out`}),c=r.quickTo(a.position,`y`,{duration:.6,ease:`power3.out`}),l=r.quickTo(a.position,`z`,{duration:.6,ease:`power3.out`}),u=r.quickTo(a.rotation,`x`,{duration:.6,ease:`power3.out`}),d=r.quickTo(a.rotation,`y`,{duration:.6,ease:`power3.out`}),f=r.quickTo(a.rotation,`z`,{duration:.6,ease:`power3.out`});n.setEaser(()=>{s(o.x),c(o.y),l(o.z),u(o.rx),d(o.ry),f(o.rz)});function p(e){let t=.18*m(0,.5,e),n=.55*Math.exp(-(((e-.5)/.06)**2)),r=.22*m(.5,.62,e)*(1-m(.9,1,e));return Math.min(1,t+n+r)}function m(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}i.create({trigger:e,start:`top top`,end:`bottom bottom`,scrub:!0,onUpdate:e=>{n.setProgress(e.progress),n.setShake(p(e.progress))}});let h=e.querySelector(`.samurai-marquee`),g=[{el:e.querySelector(`.samurai-row--top`),drift:-260},{el:e.querySelector(`.samurai-row--mid`),drift:380},{el:e.querySelector(`.samurai-row--bot`),drift:-560}].filter(e=>e.el),_=e=>-(e.scrollWidth-window.innerWidth)/2;if(g.forEach(({el:t,drift:n})=>{r.set(t,{x:_(t),opacity:0,y:60}),r.to(t,{x:_(t)+n,ease:`none`,scrollTrigger:{trigger:e,start:`top top`,end:`bottom bottom`,scrub:!0,invalidateOnRefresh:!0}})}),g.length&&r.to(g.map(e=>e.el),{opacity:(e,t)=>t.classList.contains(`samurai-row--bot`)?.55:1,y:0,duration:1.4,ease:`power3.out`,stagger:.18,scrollTrigger:{trigger:e,start:`top 70%`,once:!0}}),h){let t=r.quickTo(h,`skewY`,{duration:.55,ease:`power3.out`});i.create({trigger:e,start:`top bottom`,end:`bottom top`,onUpdate:e=>{let n=e.getVelocity();t(Math.max(-6,Math.min(6,n/-250)))}})}let v=e.querySelectorAll(`.samurai-quote__line`),y=e.querySelector(`.samurai-quote__attr`);if(v.length){let t=e.querySelectorAll(`.samurai-quote__line .k-line-inner, .samurai-quote__attr .k-line-inner`);r.set(t,{yPercent:110});let n=r.timeline({scrollTrigger:{trigger:e,start:`top top`,end:`bottom bottom`,scrub:1}}),i=[{in:.05,out:.18},{in:.18,out:.31},{in:.31,out:.45},{in:.45,out:.6},{in:.6,out:.73},{in:.73,out:.86},{in:.86,out:1}];if(v.forEach((e,t)=>{let r=i[t];if(!r)return;let a=e.querySelector(`.k-line-inner`);if(!a)return;let o=t===v.length-1;n.to(a,{yPercent:0,duration:.06,ease:`power3.out`},r.in),o||n.to(a,{yPercent:-110,duration:.05,ease:`power3.in`},r.out-.05)}),y){let e=y.querySelector(`.k-line-inner`);e&&n.to(e,{yPercent:0,duration:.06,ease:`power3.out`},.92)}n.to({},{duration:.001},1)}console.log(`[samurai] motion wired`)}var Q=(e,t)=>{let n=`[samurai] ${e}`+(t?` `+JSON.stringify(t):``);console.log(n),window.__samurai=window.__samurai||{log:[]},window.__samurai.log.push({t:performance.now().toFixed(0),msg:e,extra:t})};Q(`entry-stub running`);var $=document.getElementById(`samurai-slash`);if(window.__samurai={...window.__samurai||{},section:!!$},Q(`section found`,{found:!!$}),$){let e=matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=document.documentElement.dataset.tier||`high`;if(Q(`flags`,{reduceMotion:e,tier:n}),!e&&n!==`low`){let e=$.querySelector(`.samurai-stick`);if(Q(`stick found`,{found:!!e}),e){let r=document.createElement(`canvas`);r.className=`samurai-stage`,r.setAttribute(`aria-hidden`,`true`),e.insertBefore(r,e.firstChild),Q(`canvas injected`,{cssW:r.clientWidth,cssH:r.clientHeight}),window.__samurai.canvas=r;let i=null,a=new IntersectionObserver(async e=>{let o=e.some(e=>e.isIntersecting);if(Q(`ioLoad fired`,{visible:o,intersectionRatio:e[0]?.intersectionRatio}),o){a.disconnect(),Q(`lazy import starting`);try{let e=await t(()=>import(`./scene-CodDTYkg.js`),[],import.meta.url);Q(`lazy import resolved`,{hasCreateScene:typeof e.createScene}),i=await e.createScene({canvas:r,tier:n,swordUrl:`./assets/mina-samo.glb`}),window.__samurai.sceneApi=i,await ie($,i),new URLSearchParams(location.search).has(`tweak`)&&((await t(()=>import(`./tweak-panel-BKq0Qcdp.js`),[],import.meta.url)).mountTweakPanel(i.tweak),Q(`tweak panel mounted`)),Q(`scene created`,{cssW:r.clientWidth,cssH:r.clientHeight,internalW:r.width,internalH:r.height}),new IntersectionObserver(e=>{let t=e.some(e=>e.isIntersecting);Q(`ioRun toggle`,{active:t}),i?.setActive(t)},{threshold:0}).observe($)}catch(e){Q(`scene init FAILED`,{error:String(e),stack:e?.stack}),r.remove()}}},{rootMargin:`200% 0%`,threshold:0});a.observe($),Q(`ioLoad observing`)}}else Q(`skipped (reduced-motion or low tier)`)}