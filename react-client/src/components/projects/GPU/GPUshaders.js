//there are some differences in the npm install version of three.js and the one i used
//for hacking around, so this is very basic right now and works at least

export  const fragmentShaders = [
    `
    //basic no nothing frag shader here:
    
    uniform vec3 iResolution;
    uniform float iTime;
    uniform vec4 iMusic;
    
    varying vec2 vUv;
             
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;
        fragColor = vec4(uv,0.0,1.0);
    }
    
    void main() {
        mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    
    `,
    
    `
    //odeToJulia
    precision mediump float;
    varying vec2 vUv;
    uniform vec3  iResolution;
    uniform float iTime;
    uniform vec4  iMusic;
    
    float MAX_ITER=17.;  //if you are at a point that looks random reduce this to 5 or 10
    vec2 invz2( in vec2 z ) {  //1/z^2 here, z being complex
        float xy = z.x*z.y; z*=z;
        float modz2 = 1./max(z.x*z.x + z.y*z.y + 2.*xy*xy, 1e-3);
        z.x = z.x - z.y; z.y = -2.*xy; return modz2*z; }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
    
        vec2 uv = fragCoord.xy / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;
    
        vec2 center = vec2(3.5, 1.7), width  = vec2( 3.5); 
        vec2 final_uv = (uv*width - center);
        float mix_factor=1., infinity=1e5;
    
        vec2 jc = 3.*(-vec2(.5));
        jc.x += jc.y/50.; jc.y = 0.; jc.x -= .5; 
    
        jc = vec2(-.95 -.2*smoothstep(-100.,100.,iMusic.z),0.);
        vec2 iter=final_uv, new_iter;
    
        float escape_value = 0.;
    
        MAX_ITER = iMusic.x; //+=  ((-15.*smoothstep(-100.,100.,iMusic.x))/3.)*3.+1.;    
     
        //why is this behaving like webgl1????
        for ( float i=0.; i<100.; i++ ) {
            if ( i>MAX_ITER) break;    
            new_iter = invz2(iter) + jc; iter = new_iter;
            float distance = new_iter.x*new_iter.x + new_iter.y*new_iter.y;
            if ( distance > infinity ) {
                escape_value = i; break; }       
        }    
    
        if ( escape_value != 0. ) {
            fragColor = vec4( vec3(0.), 1.);
        }
        else {
            vec2 l1 = cos(log(abs(new_iter))*vec2(.3,.15));
            float l2 = cos(atan( new_iter.y/new_iter.x)*.5);
            fragColor = vec4( pow( (vec3( l1, l2)),vec3(8.)), 1. );
        }
    
    }
    
    void main() {
        mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    
    `,
    
    `
    //inspired by gaz from shadertoy.com
    precision mediump float;
    varying vec2 vUv;
    uniform vec3  iResolution;
    uniform float iTime;
    uniform vec4  iMusic;
    
    #define R(p,a,t) mix(a*dot(p,a),p,cos(t))+sin(t)*cross(p,a)
    #define H(h)  (cos( max(1.,(1.1+sin(t)))*1.3*h +vec3(5,25,21)+iMusic.xyz/30. )*.7 + .2 )
    void mainImage( out vec4 O, vec2 C)
    { 
        O=vec4(0.,0.,0.,1.);
        vec3 r=iResolution,c=vec3(0),
        d = normalize(vec3(C-.5*r.xy,r.y))*4.;
        float s,e,g=0.,t=1. + iTime - iMusic.x/5.;
        for(float i=0.;i<115.;i++){
            vec4 p=vec4(g*d,0.);
            p.xyz=R(p.xyz+vec3(0.,0.,-2.5),normalize(H(t*.05)),t);
            s=1.;
            for(float j=0.;j<7.;j++) {  
                p= abs(p)*.621;
                s*=e=max(1./dot(p,p),.3),
                p=abs(p.x<p.y?p.wzxy:p.wzyx)*e - 1.1;  
            }
            g+=e=abs(length(p.yzw*p.x)-.0)/s+.2e-4;
            c+=mix(vec3(1),H(log(1.+abs(s))),.7)*.015/exp(i*i*e*e);
        }
        c*=c*c;
        c=1.-exp(-c);
        O=clamp(  vec4(c,1.),0.,1.);
        O=sqrt(O);
    }
    
    void main() {
        mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    
    `,
    
    `
    //luminescent tiles + refractive sphere
    
    precision mediump float;
    uniform vec3 iResolution;
    uniform float iTime;
    uniform vec4 iMusic;
    varying vec2 vUv;
    
    #define pi  3.14159265
    #define sphr .3
    
    int oct=5;
    
    struct RayInfo  {
      vec3 p1,p2;
      bool hit;
    };
    
    RayInfo RaySphereIntersect(vec3 ro, vec3 rd, vec3 spherepos, float r) {
    
        vec3  a = (spherepos - ro);
        float b = dot(rd, a);
        float c = dot(a,a) - r*r;
        float d = b*b - c;
    
        RayInfo ri; ri.hit=false;
    
        if ( d < 0.0 ) return ri;
    
        float sd = sqrt(d);
        float t1 = b - sd, t2 = b + sd;
    
        ri.p1 = ro + rd * t1;
        ri.p2 = ro + rd * t2;
      
        ri.hit = true;
    
        return ri;
    
    }
    
    float dist_func01(vec3 p) {
        return length(p) - sphr;
    }
    
    vec3 gradient(vec3 p) {
    
        vec2 dpn = vec2(1.,-1.);
        vec2 dp  = .01 * dpn; 
    
        vec3 df = dpn.xxx * dist_func01(p+dp.xxx) +
                  dpn.yyx * dist_func01(p+dp.yyx) +
                  dpn.xyy * dist_func01(p+dp.xyy) +
                  dpn.yxy * dist_func01(p+dp.yxy);
    
        return normalize(df); 
    
    }
    
    float random(vec3 p) {
        //a random modification of the one and only random() func
        return fract( sin( dot( p, vec3(12., 90., -.8)))* 1e5 );
    }
    
    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        float a = random(i + vec3(1.,1.,1.));
        float b = random(i + vec3(1.,-1.,-1.));
        float c = random(i + vec3(-1.,1.,1.));
        float d = random(i + vec3(-1.,1.,-1.));
         vec2 u = f.yz *f.xy*(3.-2.*f.xz);
        
        return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
    
    }
    
    float fbm3d(vec3 p) {
        float v = 0.;
        float a = .5;
      
        for (int i=0; i<50; i++) {
            if (i>=oct) break;
            v += a * noise(p);
            p = p * 2.;
            a *= .7 * (1.+iMusic.y/200.);  //changed from the usual .5
        }
        return v;
    }
    
    mat3 rxz(float an){
        float cc=cos(an),ss=sin(an);
        return mat3(cc,0.,-ss,
                    0.,1.,0.,
                    ss,0.,cc);                
    }
    mat3 ryz(float an){
        float cc=cos(an),ss=sin(an);
        return mat3(1.,0.,0.,
                    0.,cc,-ss,
                    0.,ss,cc);
    }   
    
    vec3 get_color(vec3 p) {
        vec3 q;
        q.x = fbm3d(p);
        q.y = fbm3d(p.yzx);
        q.z = fbm3d(p.zxy);
    
        float f = fbm3d(p + q);
        
        return q*f;
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
     
        vec3 light; 
        float myTime = 10. + iTime; // mod(iTime,120.);
    
        vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;
        vec2 mm; // = (2.*iMouse.xy-iResolution.xy)/iResolution.y/2.;
    
        vec3 rd = normalize( vec3(uv, -2.) );  
        vec3 ro = vec3(0.,0.,0.);
        
        float delta = 2.*pi/10.; //*(1.+iMusic.y/3000.);
     
        mat3 rot = rxz(-2.*delta) * ryz(.2*delta); 
        
        ro -= rot[2]*myTime/4.;
        
        rd = rot * rd;
        
        vec3 p = ro + rd;
        
        vec3 cc = vec3(0.);
    
        float stepsize = .01;
        float totdist = stepsize;
      
        vec3 spherepos = ro + 1.5*rot[2] * (1.-iMusic.x/10.) ;
        //spherepos += iMusic.w/500.*rot[0];
        //spherepos += (iMusic.z/600.-.1)*rot[1];
    
        //if ( iMouse.w != 0. ) 
        //spherepos += -mm.x*rot[0] - mm.y*rot[1];
    
        RayInfo ri = RaySphereIntersect(ro,rd,spherepos,sphr);    
        vec3  nn;
        
        if ( ri.hit ) {  
        
            nn = gradient( ri.p1 );
            vec3 rd2 =  refract( rd, -nn, .1);  //change ray direction
            p+= 1.3*(length(ri.p2-ri.p1))*rd2;   //move the ray to exit  the sphere
            oct = 7;   //make the sphere noisier 
        }
      
        for (int i=0; i<16; i++) {
           vec3 cx = get_color(p);
           p += stepsize*rd;
           float fi = float(i);
           cc += exp(-totdist*totdist*float(i))* cx;
           totdist += stepsize;
           rd = ryz(.4 )*rd;   //yz rotation here
                   
        }
        
        if ( ri.hit ) {
            cc *= .8 ; 
            cc.b += 2.*fbm3d(ri.p2);
        }
        
        cc = .5 + 1.3*(cc-.5); //*(1.-iMusic.y/600.);  //more contrast makes nice shimmering blobs
        cc = pow( cc/15. , vec3(3.));    //play with this
    
        fragColor = vec4(cc,1.0);
           
    }
    
    
    void main() {
        mainImage(gl_FragColor, vUv*iResolution.xy);
    }
    
    `
    
    ]
    
    export  const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;  //uv is a built in attribute
          gl_Position = vec4( position, 1.0 );
        }
    `
    