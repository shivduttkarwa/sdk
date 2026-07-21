// Verbatim port of the original "Selected Work — scroll-driven WebGL showcase (5 slides)"
// inline-<script> IIFE (index.original.html lines 839–1288). Every shader byte, number,
// draw call, listener, IntersectionObserver, and rAF cadence is preserved exactly. The
// ONLY additions vs the original are (a) tracked handles (named window-listener consts,
// captured inner GL resize + gl context, the `disposed` guard) and (b) the returned
// disposer that tears everything down. No GSAP is used by this unit. TypeScript-only
// adjustments: minimal param annotations, DOM/GL handles cast to their concrete non-null
// types (the runtime `if (!… ) return`/`throw` guards are kept verbatim as runtime checks).

export function mountSelectedWork(): () => void {
      const section = document.getElementById('work');
      const runway = document.getElementById('sdk-work-runway') as HTMLElement;
      const sticky = document.getElementById('sdk-work-sticky');
      const stage = document.getElementById('sdk-work-stage') as HTMLElement;
      const canvas = document.getElementById('sdk-work-fx') as HTMLCanvasElement;
      const progress = document.getElementById('sdk-work-progress') as HTMLElement;
      const fallbackImgs = [...document.querySelectorAll('.sdk-work__img')];
      const stories = [...document.querySelectorAll('.sdk-work-story')] as HTMLElement[];
      const patterns = [...document.querySelectorAll('.sdk-work__pattern')] as HTMLElement[];

      if (!section || !runway || !sticky || !stage || !canvas || !progress) return () => {};

      const items = [
        { image: 'assets/images/hero-showcase-bg.jpg' },
        { image: 'assets/images/code-1.jpg' },
        { image: 'assets/images/2.jpg' },
        { image: 'assets/images/bg-sdk1.jpg' },
        { image: 'assets/images/hero-main-bg.jpg' }
      ];

      const total = items.length;

      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const smoothstep = (a: number, b: number, v: number) => {
        const t = clamp((v - a) / (b - a));
        return t * t * (3 - 2 * t);
      };

      // Story visibility windows generated from item count so this scales to any N.
      const storyWindows = items.map((_, i) => {
        const c = i / (total - 1);
        return { in: c - 0.12, out: c + 0.12 };
      });

      let runwayRect = runway.getBoundingClientRect();
      let viewportH = window.innerHeight || document.documentElement.clientHeight;
      let targetProgress = 0;
      let smoothProgress = 0;
      let sectionVisible = false;
      let renderer: any = null;
      let raf = 0;
      let disposed = false;
      let glResize: (() => void) | undefined;
      let glRef: WebGLRenderingContext | undefined;
      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, thover: 0 };

      function measure() {
        runwayRect = runway.getBoundingClientRect();
        viewportH = window.innerHeight || document.documentElement.clientHeight;
      }

      function rawProgress() {
        const travel = Math.max(1, runway.offsetHeight - viewportH);
        return -runwayRect.top / travel;
      }

      function getState(p: number) {
        const scaled = clamp(p) * (total - 1);
        let from = Math.floor(scaled);
        let to = Math.min(total - 1, from + 1);
        let mix = scaled - from;
        if (p >= 0.999) {
          from = total - 2;
          to = total - 1;
          mix = 1;
        }
        return { from, to, mix, active: mix < 0.5 ? from : to };
      }

      function setFallback(active: number) {
        fallbackImgs.forEach((img, i) => img.classList.toggle('is-active', i === active));
      }

      function setPatterns(from: number, to: number, mix: number) {
        patterns.forEach((el, i) => {
          let opacity = 0;
          if (i === from && i === to) opacity = 1;
          else if (i === from) opacity = 1 - mix;
          else if (i === to) opacity = mix;
          el.style.opacity = (opacity * 0.5).toFixed(3);
        });
      }

      function updateStories(p: number) {
        stories.forEach((story, i) => {
          const w = storyWindows[i];
          const opacity = smoothstep(w.in, w.in + 0.05, p) * (1 - smoothstep(w.out - 0.05, w.out, p));
          story.style.opacity = opacity.toFixed(3);
          story.style.filter = `blur(${((1 - opacity) * 5).toFixed(2)}px)`;
          const push = (1 - opacity) * 2;
          const dir = story.dataset.side === 'right' ? push : -push;
          story.style.setProperty('--shift', `${dir.toFixed(2)}rem`);
        });
      }

      function updateDom(p: number, raw: number) {
        const state = getState(p);
        progress.classList.toggle('is-visible', raw > -0.02 && raw < 1.02);
        progress.style.setProperty('--progress', clamp(raw).toFixed(4));
        setFallback(state.active);
        setPatterns(state.from, state.to, state.mix);
        updateStories(p);
      }

      function loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      function createShader(gl: any, type: number, source: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
      }

      function createProgram(gl: any, vertex: string, fragment: string) {
        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertex));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program));
        }
        return program;
      }

      async function initWebGL() {
        if (reduceMotion) throw new Error('Reduced motion enabled');

        const gl = canvas.getContext('webgl', {
          alpha: true,
          antialias: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          powerPreference: 'low-power'
        }) as WebGLRenderingContext;
        if (!gl) throw new Error('WebGL unavailable');

        const loaded = await Promise.all(items.map(item => loadImage(item.image)));

        const vertex = `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `;

        const fragment = `
          precision highp float;

          uniform sampler2D u_tex0;
          uniform sampler2D u_tex1;
          uniform sampler2D u_tex2;
          uniform sampler2D u_tex3;
          uniform sampler2D u_tex4;
          uniform float u_from;
          uniform float u_to;
          uniform float u_mix;
          uniform float u_time;
          uniform float u_aspect;
          uniform float u_imgAspect;
          uniform vec2 u_resolution;
          uniform vec2 u_mouse;
          uniform float u_hover;

          varying vec2 v_uv;

          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);
            return fract(p.x * p.y);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            mat2 r = mat2(1.62, 1.12, -1.12, 1.62);
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p = r * p + 17.0;
              a *= 0.55;
            }
            return v;
          }

          float smoother(float x) {
            x = clamp(x, 0.0, 1.0);
            return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
          }

          vec4 getTex(float id, vec2 uv) {
            if (id < 0.5) return texture2D(u_tex0, uv);
            if (id < 1.5) return texture2D(u_tex1, uv);
            if (id < 2.5) return texture2D(u_tex2, uv);
            if (id < 3.5) return texture2D(u_tex3, uv);
            return texture2D(u_tex4, uv);
          }

          // Cover-fit: fill the canvas with the image, cropping the overflow axis.
          vec2 fitCover(vec2 uv) {
            vec2 s = vec2(1.0);
            if (u_aspect > u_imgAspect) {
              s.y = u_imgAspect / u_aspect;
            } else {
              s.x = u_aspect / u_imgAspect;
            }
            vec2 iuv = (uv - 0.5) * s + 0.5;
            return clamp(iuv, 0.0, 1.0);
          }

          vec4 sampleImage(float id, vec2 uv) {
            vec2 cursor = (u_mouse - vec2(0.5)) * u_hover;
            vec2 offset = cursor * 0.022;
            return getTex(id, fitCover(uv - offset));
          }

          vec4 finish(vec4 col, vec2 uv) {
            float grain = hash(uv * u_resolution * 0.45 + u_time * 42.0);
            col.rgb += (grain - 0.5) * 0.04;

            // Cinematic vignette + bottom fade to seat the frame on the dark stage.
            float vig = smoothstep(1.15, 0.35, distance(uv, vec2(0.5)));
            col.rgb *= mix(0.72, 1.0, vig);
            float bottom = smoothstep(0.0, 0.28, uv.y);
            col.rgb *= mix(0.35, 1.0, bottom);
            return col;
          }

          void main() {
            vec2 uv = v_uv;
            float m = smoother(u_mix);
            vec4 col;

            if (m < 0.002) {
              col = sampleImage(u_from, uv);
            } else if (m > 0.998) {
              col = sampleImage(u_to, uv);
            } else {
              vec2 p = uv;
              p.x *= u_aspect;
              vec2 flow = vec2(0.0, -u_time * 0.18);
              vec2 pn = vec2(p.x * 0.95, p.y * 0.72);

              vec2 q = vec2(
                fbm(pn * 1.6 + flow),
                fbm(pn * 1.6 + flow + vec2(5.2, 1.3))
              );
              vec2 r = vec2(
                fbm(pn * 1.6 + 3.6 * q + flow),
                fbm(pn * 1.6 + 3.6 * q + flow + vec2(8.3, 2.8))
              );

              float passage = (1.0 - uv.x) + 0.26 * (r.x - 0.5) + 0.12 * (r.y - 0.5);
              float width = 0.16 * smoothstep(0.0, 0.15, m) * (1.0 - smoothstep(0.85, 1.0, m)) + 0.02;
              float paddedMix = mix(-0.25, 1.25, m);
              float mask = smoothstep(passage - width, passage + width, paddedMix);
              float envelope = smoothstep(0.0, 0.08, m) * (1.0 - smoothstep(0.92, 1.0, m));
              float edge = 4.0 * mask * (1.0 - mask) * envelope;

              vec4 a = sampleImage(u_from, uv);
              vec4 b = sampleImage(u_to, uv);

              col = mix(a, b, mask);
              float glow = pow(edge, 2.0);
              col.rgb += vec3(1.0, 0.12, 0.08) * glow * 0.55;
              col.rgb += vec3(1.0, 0.36, 0.16) * pow(edge, 4.0) * 0.45;
              col.a = 1.0;

              float leading = step(0.5, mask) * edge;
              float luma = dot(a.rgb, vec3(0.299, 0.587, 0.114));
              vec3 ghost = mix(vec3(luma), a.rgb, 0.32) * 0.62;
              col.rgb = mix(col.rgb, ghost, leading * 0.2);
            }

            col.a = 1.0;
            gl_FragColor = finish(col, uv);
          }
        `;

        const program = createProgram(gl, vertex, fragment);
        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1, -1, 1, -1, -1, 1,
          -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        function makeTexture(img: HTMLImageElement, unit: number) {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          return tex;
        }

        loaded.forEach((img, i) => makeTexture(img, i));

        for (let i = 0; i < total; i++) {
          gl.uniform1i(gl.getUniformLocation(program, 'u_tex' + i), i);
        }

        // Reference image aspect (landscape screenshots) for cover-fit.
        const first = loaded[0];
        const imgAspect = first && first.height ? first.width / first.height : 1.6;

        const uniforms = {
          from: gl.getUniformLocation(program, 'u_from'),
          to: gl.getUniformLocation(program, 'u_to'),
          mix: gl.getUniformLocation(program, 'u_mix'),
          time: gl.getUniformLocation(program, 'u_time'),
          aspect: gl.getUniformLocation(program, 'u_aspect'),
          imgAspect: gl.getUniformLocation(program, 'u_imgAspect'),
          resolution: gl.getUniformLocation(program, 'u_resolution'),
          mouse: gl.getUniformLocation(program, 'u_mouse'),
          hover: gl.getUniformLocation(program, 'u_hover')
        };

        gl.uniform1f(uniforms.imgAspect, imgAspect);

        function resize() {
          const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
          const rect = canvas.getBoundingClientRect();
          const w = Math.max(2, Math.floor(rect.width * dpr));
          const h = Math.max(2, Math.floor(rect.height * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
          }
          gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
          gl.uniform1f(uniforms.aspect, canvas.width / Math.max(1, canvas.height));
        }

        function render(time: number, p: number) {
          const state = getState(p);
          resize();
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);
          gl.uniform1f(uniforms.from, state.from);
          gl.uniform1f(uniforms.to, state.to);
          gl.uniform1f(uniforms.mix, state.mix);
          gl.uniform1f(uniforms.time, time * 0.001);
          gl.uniform2f(uniforms.mouse, mouse.x, 1 - mouse.y);
          gl.uniform1f(uniforms.hover, mouse.hover);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        window.addEventListener('resize', resize, { passive: true });
        stage.classList.add('webgl-on');
        glResize = resize;
        glRef = gl;
        return { render };
      }

      const observer = new IntersectionObserver(entries => {
        sectionVisible = entries.some(entry => entry.isIntersecting);
        if (sectionVisible && !raf) raf = requestAnimationFrame(animate);
      }, { threshold: [0, 0.01], rootMargin: '120px 0px' });
      observer.observe(runway);

      const onResize = () => {
        measure();
        if (!raf) raf = requestAnimationFrame(animate);
      };
      window.addEventListener('resize', onResize, { passive: true });

      const onScroll = () => {
        measure();
        targetProgress = clamp(rawProgress());
        if (!raf) raf = requestAnimationFrame(animate);
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onPointerMove = (event: PointerEvent) => {
        const rect = stage.getBoundingClientRect();
        mouse.tx = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
        mouse.ty = clamp((event.clientY - rect.top) / Math.max(1, rect.height));
        mouse.thover = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom ? 1 : 0;
        if (!raf) raf = requestAnimationFrame(animate);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      function animate(time: number) {
        if (disposed) { raf = 0; return; }
        raf = 0;
        measure();
        const raw = rawProgress();
        targetProgress = clamp(raw);
        smoothProgress = lerp(smoothProgress, targetProgress, 0.12);
        mouse.x = lerp(mouse.x, mouse.tx, 0.12);
        mouse.y = lerp(mouse.y, mouse.ty, 0.12);
        mouse.hover = lerp(mouse.hover, mouse.thover, 0.08);
        updateDom(smoothProgress, raw);

        if (renderer && sectionVisible) {
          renderer.render(time, smoothProgress);
          const moving = Math.abs(targetProgress - smoothProgress) > 0.0008 ||
            Math.abs(mouse.tx - mouse.x) > 0.002 ||
            Math.abs(mouse.thover - mouse.hover) > 0.002;
          if (moving || sectionVisible) raf = requestAnimationFrame(animate);
        } else if (sectionVisible || Math.abs(targetProgress - smoothProgress) > 0.0008) {
          raf = requestAnimationFrame(animate);
        }
      }

      measure();
      updateDom(0, rawProgress());

      initWebGL()
        .then(result => {
          renderer = result;
          if (!raf) raf = requestAnimationFrame(animate);
        })
        .catch(err => {
          console.warn('Work WebGL unavailable. Using image fallback.', err);
          canvas.style.display = 'none';
          if (!raf) raf = requestAnimationFrame(animate);
        });

      return () => {
        disposed = true;
        observer.disconnect();
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onPointerMove);
        if (glResize) window.removeEventListener('resize', glResize);
        try { glRef?.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
      };
}
