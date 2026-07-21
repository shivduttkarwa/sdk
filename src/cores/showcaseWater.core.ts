// Verbatim port of the original `initShowcaseWater` IIFE (script.js lines 1792–1947):
// second raw-WebGL float-FBO fluid sim on the existing `.sdk-showcase__canvas`.
// Every shader byte, number, FBO, draw call and listener is unchanged. The ONLY
// additions vs the original are the tracked handles (named mouse handlers,
// ResizeObserver var, rAF id, disposed guard) and the returned disposer.

export function mountShowcaseWater(): () => void {
  // `section` typed `any` so its DOM access stays noise-free; `canvas` is cast to
  // HTMLCanvasElement | null (runtime-identical to the original `&&` expression).
  const section: any = document.querySelector('.sdk-showcase');
  const canvas  = (section && section.querySelector('.sdk-showcase__canvas')) as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const SIM_W = 256, SIM_H = 144;

  const gl: any = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
  if (!gl) { canvas.remove(); return () => {}; }
  if (!gl.getExtension('OES_texture_float')) { canvas.remove(); return () => {}; }
  gl.getExtension('OES_texture_float_linear');

  const VS = `attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0.,1.); }`;

  const SPLAT_FS = `precision highp float;
    uniform sampler2D u_src; uniform vec2 u_point, u_aspect; uniform vec3 u_color; uniform float u_radius; varying vec2 v_uv;
    void main(){
      vec2 p=(v_uv-u_point)*u_aspect; float d=exp(-dot(p,p)/u_radius);
      gl_FragColor=vec4(texture2D(u_src,v_uv).rgb+u_color*d,1.); }`;

  const ADVECT_FS = `precision highp float;
    uniform sampler2D u_velocity,u_quantity; uniform vec2 u_texelSize; uniform float u_dt,u_dissipation; varying vec2 v_uv;
    void main(){
      vec2 coord=v_uv-u_dt*texture2D(u_velocity,v_uv).xy*u_texelSize;
      gl_FragColor=u_dissipation*texture2D(u_quantity,coord); }`;

  const CURL_FS = `precision highp float;
    uniform sampler2D u_velocity; uniform vec2 u_texelSize; varying vec2 v_uv;
    void main(){
      float L=texture2D(u_velocity,v_uv-vec2(u_texelSize.x,0.)).y, R=texture2D(u_velocity,v_uv+vec2(u_texelSize.x,0.)).y,
            T=texture2D(u_velocity,v_uv+vec2(0.,u_texelSize.y)).x, B=texture2D(u_velocity,v_uv-vec2(0.,u_texelSize.y)).x;
      gl_FragColor=vec4(0.5*(R-L-(T-B)),0.,0.,1.); }`;

  const VORTICITY_FS = `precision highp float;
    uniform sampler2D u_velocity,u_curl; uniform vec2 u_texelSize; uniform float u_curl_strength,u_dt; varying vec2 v_uv;
    void main(){
      float L=texture2D(u_curl,v_uv-vec2(u_texelSize.x,0.)).x, R=texture2D(u_curl,v_uv+vec2(u_texelSize.x,0.)).x,
            T=texture2D(u_curl,v_uv+vec2(0.,u_texelSize.y)).x,  B=texture2D(u_curl,v_uv-vec2(0.,u_texelSize.y)).x,
            C=texture2D(u_curl,v_uv).x;
      vec2 force=normalize(vec2(abs(T)-abs(B),abs(R)-abs(L))+0.0001)*u_curl_strength*C;
      gl_FragColor=vec4(texture2D(u_velocity,v_uv).xy+force*u_dt,0.,1.); }`;

  const DIVERGENCE_FS = `precision highp float;
    uniform sampler2D u_velocity; uniform vec2 u_texelSize; varying vec2 v_uv;
    void main(){
      float L=texture2D(u_velocity,v_uv-vec2(u_texelSize.x,0.)).x, R=texture2D(u_velocity,v_uv+vec2(u_texelSize.x,0.)).x,
            T=texture2D(u_velocity,v_uv+vec2(0.,u_texelSize.y)).y,  B=texture2D(u_velocity,v_uv-vec2(0.,u_texelSize.y)).y;
      gl_FragColor=vec4(0.5*(R-L+T-B),0.,0.,1.); }`;

  const PRESSURE_FS = `precision highp float;
    uniform sampler2D u_pressure,u_divergence; uniform vec2 u_texelSize; varying vec2 v_uv;
    void main(){
      float L=texture2D(u_pressure,v_uv-vec2(u_texelSize.x,0.)).x, R=texture2D(u_pressure,v_uv+vec2(u_texelSize.x,0.)).x,
            T=texture2D(u_pressure,v_uv+vec2(0.,u_texelSize.y)).x,  B=texture2D(u_pressure,v_uv-vec2(0.,u_texelSize.y)).x,
            div=texture2D(u_divergence,v_uv).x;
      gl_FragColor=vec4((L+R+T+B-div)*0.25,0.,0.,1.); }`;

  const GRADIENT_FS = `precision highp float;
    uniform sampler2D u_pressure,u_velocity; uniform vec2 u_texelSize; varying vec2 v_uv;
    void main(){
      float pL=texture2D(u_pressure,v_uv-vec2(u_texelSize.x,0.)).x, pR=texture2D(u_pressure,v_uv+vec2(u_texelSize.x,0.)).x,
            pT=texture2D(u_pressure,v_uv+vec2(0.,u_texelSize.y)).x,  pB=texture2D(u_pressure,v_uv-vec2(0.,u_texelSize.y)).x;
      gl_FragColor=vec4(texture2D(u_velocity,v_uv).xy-0.5*vec2(pR-pL,pT-pB),0.,1.); }`;

  const RENDER_FS = `precision highp float;
    uniform sampler2D u_dye,u_bg; varying vec2 v_uv;
    void main(){
      float dye=clamp(texture2D(u_dye,v_uv).r,0.,1.);
      vec3 bg=texture2D(u_bg,v_uv).rgb*0.92;
      gl_FragColor=vec4(bg,smoothstep(0.018,0.22,dye)); }`;

  function mkShader(type: any,src: any){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; }
  function mkProg(fs: any){ const p=gl.createProgram(); gl.attachShader(p,mkShader(gl.VERTEX_SHADER,VS)); gl.attachShader(p,mkShader(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); return p; }
  function mkFBO(w: any,h: any,float: any){
    const tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,float?gl.FLOAT:gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const fbo=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null); return {tex,fbo,w,h}; }

  const splatProg=mkProg(SPLAT_FS), advectProg=mkProg(ADVECT_FS), curlProg=mkProg(CURL_FS),
        vortProg=mkProg(VORTICITY_FS), divProg=mkProg(DIVERGENCE_FS),
        pressureProg=mkProg(PRESSURE_FS), gradProg=mkProg(GRADIENT_FS), renderProg=mkProg(RENDER_FS);

  let vel0=mkFBO(SIM_W,SIM_H,true), vel1=mkFBO(SIM_W,SIM_H,true);
  let pre0=mkFBO(SIM_W,SIM_H,true), pre1=mkFBO(SIM_W,SIM_H,true);
  let dye0=mkFBO(SIM_W,SIM_H,true), dye1=mkFBO(SIM_W,SIM_H,true);
  const divFBO=mkFBO(SIM_W,SIM_H,true), curlFBO=mkFBO(SIM_W,SIM_H,true);

  const quad=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,quad);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),gl.STATIC_DRAW);

  const bgTex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,bgTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([5,3,10,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  fetch('assets/hero-showcase-bg.png',{mode:'cors'}).then(r=>r.blob())
    .then(b=>createImageBitmap(b,{imageOrientation:'flipY',premultiplyAlpha:'none'}))
    .then(bmp=>{ gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D,bgTex); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,bmp); bmp.close(); }).catch(()=>{});

  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  function blit(fbo: any,prog: any,fn: any){
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbo?fbo.fbo:null);
    gl.viewport(0,0,fbo?fbo.w:(canvas!.width||1),fbo?fbo.h:(canvas!.height||1));
    gl.useProgram(prog); gl.bindBuffer(gl.ARRAY_BUFFER,quad);
    const loc=gl.getAttribLocation(prog,'a_pos'); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0); fn(prog); gl.drawArrays(gl.TRIANGLES,0,6); }
  function u1i(p: any,n: any,v: any){gl.uniform1i(gl.getUniformLocation(p,n),v);}
  function u1f(p: any,n: any,v: any){gl.uniform1f(gl.getUniformLocation(p,n),v);}
  function u2f(p: any,n: any,x: any,y: any){gl.uniform2f(gl.getUniformLocation(p,n),x,y);}
  function u3f(p: any,n: any,x: any,y: any,z: any){gl.uniform3f(gl.getUniformLocation(p,n),x,y,z);}
  function tex(unit: any,t: any){gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,t);}

  const TXS=[1/SIM_W,1/SIM_H];
  let mx=0.5,my=0.5,dmx=0,dmy=0,hasMouse=false;

  function onMouseMove(e: MouseEvent){
    const r=section.getBoundingClientRect();
    const nx=(e.clientX-r.left)/r.width, ny=1-(e.clientY-r.top)/r.height;
    dmx+=nx-mx; dmy+=ny-my; mx=nx; my=ny; hasMouse=true; }
  function onMouseLeave(){ hasMouse=false; dmx=0; dmy=0; }
  section.addEventListener('mousemove',onMouseMove);
  section.addEventListener('mouseleave',onMouseLeave);

  function resize(){ canvas!.width=section.clientWidth; canvas!.height=section.clientHeight; }
  resize(); const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(section);

  const SPLAT_RADIUS=0.002, SPLAT_FORCE=5000, CURL_STR=28, VEL_DISS=0.992, DYE_DISS=0.953, PRESSURE_ITS=25;

  let last=0;
  let disposed=false;
  let raf=0;
  (function render(t: number){
    if (disposed) return;
    raf = requestAnimationFrame(render);
    const dt=Math.min((t-last)*0.001,0.016); last=t;
    if(hasMouse&&Math.abs(dmx)+Math.abs(dmy)>0.0001){
      const ar=(canvas!.width||1)/(canvas!.height||1);
      blit(vel1,splatProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_src',0);u2f(p,'u_point',mx,my);u2f(p,'u_aspect',ar,1.);u3f(p,'u_color',dmx*SPLAT_FORCE,dmy*SPLAT_FORCE,0.);u1f(p,'u_radius',SPLAT_RADIUS); });
      [vel0,vel1]=[vel1,vel0];
      blit(dye1,splatProg,(p: any)=>{ tex(0,dye0.tex);u1i(p,'u_src',0);u2f(p,'u_point',mx,my);u2f(p,'u_aspect',ar,1.);u3f(p,'u_color',1.,1.,1.);u1f(p,'u_radius',SPLAT_RADIUS); });
      [dye0,dye1]=[dye1,dye0]; }
    dmx=0; dmy=0;
    blit(curlFBO,curlProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_velocity',0);u2f(p,'u_texelSize',TXS[0],TXS[1]); });
    blit(vel1,vortProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_velocity',0);tex(1,curlFBO.tex);u1i(p,'u_curl',1);u2f(p,'u_texelSize',TXS[0],TXS[1]);u1f(p,'u_curl_strength',CURL_STR);u1f(p,'u_dt',dt); });
    [vel0,vel1]=[vel1,vel0];
    blit(divFBO,divProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_velocity',0);u2f(p,'u_texelSize',TXS[0],TXS[1]); });
    gl.bindFramebuffer(gl.FRAMEBUFFER,pre0.fbo); gl.viewport(0,0,SIM_W,SIM_H); gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
    for(let i=0;i<PRESSURE_ITS;i++){ blit(pre1,pressureProg,(p: any)=>{ tex(0,pre0.tex);u1i(p,'u_pressure',0);tex(1,divFBO.tex);u1i(p,'u_divergence',1);u2f(p,'u_texelSize',TXS[0],TXS[1]); }); [pre0,pre1]=[pre1,pre0]; }
    blit(vel1,gradProg,(p: any)=>{ tex(0,pre0.tex);u1i(p,'u_pressure',0);tex(1,vel0.tex);u1i(p,'u_velocity',1);u2f(p,'u_texelSize',TXS[0],TXS[1]); }); [vel0,vel1]=[vel1,vel0];
    blit(vel1,advectProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_velocity',0);tex(1,vel0.tex);u1i(p,'u_quantity',1);u2f(p,'u_texelSize',TXS[0],TXS[1]);u1f(p,'u_dt',dt);u1f(p,'u_dissipation',VEL_DISS); }); [vel0,vel1]=[vel1,vel0];
    blit(dye1,advectProg,(p: any)=>{ tex(0,vel0.tex);u1i(p,'u_velocity',0);tex(1,dye0.tex);u1i(p,'u_quantity',1);u2f(p,'u_texelSize',TXS[0],TXS[1]);u1f(p,'u_dt',dt);u1f(p,'u_dissipation',hasMouse?DYE_DISS:0.55); }); [dye0,dye1]=[dye1,dye0];
    gl.bindFramebuffer(gl.FRAMEBUFFER,null); gl.viewport(0,0,canvas!.width||1,canvas!.height||1);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    blit(null,renderProg,(p: any)=>{ tex(0,dye0.tex);u1i(p,'u_dye',0);tex(5,bgTex);u1i(p,'u_bg',5); });
  })(0);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    section.removeEventListener('mousemove', onMouseMove);
    section.removeEventListener('mouseleave', onMouseLeave);
    resizeObserver.disconnect();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
