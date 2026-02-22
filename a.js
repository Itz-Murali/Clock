function isLight(){ return document.documentElement.classList.contains('light'); }


(function(){
  const c=document.getElementById('particleCanvas'), ctx=c.getContext('2d');
  let particles=[];
  function resize(){c.width=innerWidth;c.height=innerHeight}
  resize(); addEventListener('resize',resize);
  for(let i=0;i<60;i++) particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,size:Math.random()*2+.5,hue:Math.random()*60+170,alpha:Math.random()*.4+.1});
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    const light=isLight();
    for(const p of particles){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;
      if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      const lum=light?35:60;
      const a=light?p.alpha*0.5:p.alpha;
      ctx.fillStyle=`hsla(${p.hue},${light?70:100}%,${lum}%,${a})`;
      ctx.shadowColor=`hsla(${p.hue},${light?70:100}%,${lum}%,${light?0.2:0.4})`;
      ctx.shadowBlur=light?3:6;
      ctx.fill();ctx.shadowBlur=0;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


(function(){
  const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const canvas=document.getElementById('clockCanvas'), ctx=canvas.getContext('2d');
  let dpr=devicePixelRatio||1;
  function resize(){
    dpr=devicePixelRatio||1;
    const vw=innerWidth, vh=innerHeight;
    const base=Math.min(vw,vh);
    const pct = vw < 400 ? 0.62 : vw < 640 ? 0.65 : vw < 1024 ? 0.55 : 0.45;
    const size = base * pct;
    const clamped=Math.max(220,Math.min(size,520));
    canvas.style.width=clamped+'px';canvas.style.height=clamped+'px';
    canvas.width=clamped*dpr;canvas.height=clamped*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize(); addEventListener('resize',resize);

  
  const dark = {
    ambientInner: 'rgba(0,255,255,0.06)', ambientMid: 'rgba(180,0,255,0.03)',
    faceTop: 'rgba(20,20,30,0.9)', faceBot: 'rgba(5,5,10,0.95)',
    borderSat: 100, borderLight: 55, borderAlpha: 0.9, borderWidth: 3,
    outerGlow: 'rgba(0,255,255,0.1)', outerWidth: 8,
    numMain: 'rgba(0,255,255,0.95)', numSub: 'rgba(0,255,255,0.5)',
    numGlow: 'rgba(0,255,255,0.4)', numGlowMain: 10, numGlowSub: 4,
    markMain: 'rgba(0,255,255,0.9)', markSub: 'rgba(0,255,255,0.3)',
    markMin: 'rgba(0,255,255,0.15)',
    hrColor: 'rgba(0,255,255,0.9)', hrGlow: 'rgba(0,255,255,0.6)', hrGlowSize: 15,
    minColor: 'rgba(180,100,255,0.9)', minGlow: 'rgba(180,100,255,0.5)', minGlowSize: 12,
    secColor: 'rgba(255,50,150,0.9)', secGlow: 'rgba(255,50,150,0.6)', secGlowSize: 10,
    centerFill: 'rgba(0,255,255,0.9)', centerGlow: 'rgba(0,255,255,0.8)',
  };
  const light = {
    ambientInner: 'rgba(0,100,180,0.04)', ambientMid: 'rgba(120,60,200,0.02)',
    faceTop: 'rgba(245,248,255,0.92)', faceBot: 'rgba(230,235,248,0.95)',
    borderSat: 75, borderLight: 45, borderAlpha: 0.7, borderWidth: 2.5,
    outerGlow: 'rgba(0,100,180,0.08)', outerWidth: 6,
    numMain: 'rgba(0,70,120,0.9)', numSub: 'rgba(0,70,120,0.45)',
    numGlow: 'rgba(0,80,140,0.15)', numGlowMain: 4, numGlowSub: 1,
    markMain: 'rgba(0,80,140,0.7)', markSub: 'rgba(0,80,140,0.25)',
    markMin: 'rgba(0,80,140,0.1)',
    hrColor: 'rgba(0,90,150,0.85)', hrGlow: 'rgba(0,90,150,0.3)', hrGlowSize: 6,
    minColor: 'rgba(120,60,180,0.85)', minGlow: 'rgba(120,60,180,0.25)', minGlowSize: 5,
    secColor: 'rgba(220,50,100,0.85)', secGlow: 'rgba(220,50,100,0.3)', secGlowSize: 4,
    centerFill: 'rgba(0,90,150,0.85)', centerGlow: 'rgba(0,90,150,0.4)',
  };

  function draw(){
    const T = isLight() ? light : dark;
    const w=canvas.width/dpr,h=canvas.height/dpr,cx=w/2,cy=h/2,r=Math.min(cx,cy)-12;
    ctx.clearRect(0,0,w,h);
    const now=new Date();
    const sec=now.getSeconds()+now.getMilliseconds()/1000;
    const min=now.getMinutes()+sec/60;
    const hr=(now.getHours()%12)+min/60;

    const dd=String(now.getDate()).padStart(2,'0');
    const mm=String(now.getMonth()+1).padStart(2,'0');
    const yyyy=now.getFullYear();
    document.getElementById('dateStr').textContent=`${dd}-${mm}-${yyyy} ${DAYS[now.getDay()]}`;
    document.getElementById('timeStr').textContent=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    
    const ag=ctx.createRadialGradient(cx,cy,r*.3,cx,cy,r*1.4);
    ag.addColorStop(0,T.ambientInner);ag.addColorStop(.5,T.ambientMid);ag.addColorStop(1,'transparent');
    ctx.fillStyle=ag;ctx.fillRect(0,0,w,h);

    ctx.beginPath();ctx.arc(cx,cy,r-4,0,Math.PI*2);
    const fg=ctx.createRadialGradient(cx,cy-r*.3,0,cx,cy,r);
    fg.addColorStop(0,T.faceTop);fg.addColorStop(1,T.faceBot);
    ctx.fillStyle=fg;ctx.fill();

    
    const t=Date.now()/2000;
    for(let i=0;i<360;i++){
      const a=i*Math.PI/180,hue=(i+t*360)%360;
      ctx.beginPath();ctx.arc(cx,cy,r-1,a,a+.025);
      ctx.strokeStyle=`hsla(${hue},${T.borderSat}%,${T.borderLight}%,${T.borderAlpha})`;
      ctx.lineWidth=T.borderWidth;ctx.stroke();
    }

  
    ctx.beginPath();ctx.arc(cx,cy,r+2,0,Math.PI*2);
    ctx.strokeStyle=T.outerGlow;ctx.lineWidth=T.outerWidth;ctx.stroke();


    const nr=r-38,fs=Math.max(12,r*.1);
    ctx.textAlign='center';ctx.textBaseline='middle';
    for(let i=1;i<=12;i++){
      const a=i*Math.PI/6-Math.PI/2,nx=cx+nr*Math.cos(a),ny=cy+nr*Math.sin(a);
      ctx.save();
      ctx.font=`${i%3===0?'bold':'300'} ${fs}px 'Courier New',monospace`;
      ctx.fillStyle=i%3===0?T.numMain:T.numSub;
      ctx.shadowColor=T.numGlow;ctx.shadowBlur=i%3===0?T.numGlowMain:T.numGlowSub;
      ctx.fillText(String(i),nx,ny);ctx.restore();
    }

 
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6-Math.PI/2,m=i%3===0;
      ctx.beginPath();
      ctx.moveTo(cx+(r-(m?24:18))*Math.cos(a),cy+(r-(m?24:18))*Math.sin(a));
      ctx.lineTo(cx+(r-8)*Math.cos(a),cy+(r-8)*Math.sin(a));
      ctx.strokeStyle=m?T.markMain:T.markSub;
      ctx.lineWidth=m?3:1.5;ctx.lineCap='round';ctx.stroke();
    }


    for(let i=0;i<60;i++){
      if(i%5===0)continue;
      const a=i*Math.PI/30-Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx+(r-10)*Math.cos(a),cy+(r-10)*Math.sin(a));
      ctx.lineTo(cx+(r-6)*Math.cos(a),cy+(r-6)*Math.sin(a));
      ctx.strokeStyle=T.markMin;ctx.lineWidth=1;ctx.stroke();
    }

    
    function drawHand(angle,len,width,color,glow,gs){
      const rad=angle-Math.PI/2,x=cx+len*Math.cos(rad),y=cy+len*Math.sin(rad);
      ctx.save();ctx.shadowColor=glow;ctx.shadowBlur=gs;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();ctx.restore();
    }
    drawHand(hr*Math.PI/6,r*.45,4.5,T.hrColor,T.hrGlow,T.hrGlowSize);
    drawHand(min*Math.PI/30,r*.65,3,T.minColor,T.minGlow,T.minGlowSize);
    drawHand(sec*Math.PI/30,r*.75,1.5,T.secColor,T.secGlow,T.secGlowSize);

    ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);
    ctx.fillStyle=T.centerFill;ctx.shadowColor=T.centerGlow;ctx.shadowBlur=12;
    ctx.fill();ctx.shadowBlur=0;

    requestAnimationFrame(draw);
  }
  draw();
})();


(function(){
  const icons={0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",71:"🌨️",73:"🌨️",75:"❄️",80:"🌦️",81:"🌧️",82:"⛈️",95:"⛈️",96:"⛈️",99:"⛈️"};
  function getLabel(c){if(c===0)return"Clear Sky";if(c<=3)return"Partly Cloudy";if(c<=48)return"Foggy";if(c<=55)return"Light Drizzle";if(c<=65)return"Rainy";if(c<=75)return"Snowy";if(c<=82)return"Showers";return"Thunderstorm"}
  function getIcon(c){if(icons[c])return icons[c];const k=Object.keys(icons).map(Number).sort((a,b)=>a-b);for(let i=k.length-1;i>=0;i--)if(c>=k[i])return icons[k[i]];return"🌡️"}

  function showWeather(lat,lon,city){
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then(r=>r.json()).then(d=>{
        const w=d.current_weather;
        document.getElementById('weatherIcon').textContent=getIcon(w.weathercode);
        document.getElementById('weatherTemp').textContent=Math.round(w.temperature)+"°C";
        document.getElementById('weatherCondition').textContent=getLabel(w.weathercode);
        document.getElementById('weatherCity').textContent=city?"📍 "+city:"";
        document.getElementById('weatherWidget').style.display='flex';
      }).catch(()=>{});
  }

  function ipFallback(){
    fetch('https://ipapi.co/json/')
      .then(r=>r.json())
      .then(d=>showWeather(d.latitude,d.longitude,d.city||d.region||""))
      .catch(()=>{
        const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
        const city=tz.split("/").pop().replace(/_/g," ")||"";
        if(tz.includes("Kolkata")||tz.includes("Calcutta")) showWeather(22.57,88.36,city);
        else if(tz.includes("Mumbai")) showWeather(19.07,72.87,city);
        else showWeather(28.61,77.23,city||"New Delhi");
      });
  }

  navigator.geolocation.getCurrentPosition(
    p=>{
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p.coords.latitude}&lon=${p.coords.longitude}&format=json`)
        .then(r=>r.json())
        .then(d=>{
          const city=d.address.city||d.address.town||d.address.village||d.address.state||"";
          showWeather(p.coords.latitude,p.coords.longitude,city);
        })
        .catch(()=>showWeather(p.coords.latitude,p.coords.longitude,""));
    },
    ()=>ipFallback(),
    {timeout:5000}
  );
})();


(function(){
  const root = document.documentElement;
  const knob = document.getElementById('toggleKnob');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') { root.classList.add('light'); knob.textContent = '☀️'; }

  document.getElementById('themeToggle').addEventListener('click', () => {
    root.classList.toggle('light');
    const l = root.classList.contains('light');
    knob.textContent = l ? '☀️' : '🌙';
    localStorage.setItem('theme', l ? 'light' : 'dark');
  });
})();