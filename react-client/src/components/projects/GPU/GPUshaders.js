//there are some differences in the npm install version of three.js and the one i used
//for hacking around, so this is very basic right now and works at least

export  const fragmentShaders = [
    `
    //////////////////basic no nothing frag shader here:
    
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
    ///////////////// odeToJulia
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
    ///////////////// inspired by gaz from shadertoy.com
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
        float s,e,g=0.,t=1. + mod(iTime,500.)/5.;
        for(float i=0.;i<115.;i++){
            vec4 p=vec4(g*d,0.);
            p.xyz=R(p.xyz+vec3(5.*cos(iTime/5.),0.,-6.+7.*sin(iTime/5.)),normalize(H(t*.05)),t);
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
    /////////////////// luminescent tiles + refractive sphere
    
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
            a *= .7 * (1.+iMusic.w/10.);  //changed from the usual .5
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
        
        float st = sin(iTime);

        //float delta = iTime/500.;
        float delta = 2.*pi/10.; //*(1.-iMusic.y/600.) - iTime/500.;
     
        mat3 rot = rxz(-2.*delta) * ryz(.2*delta+(iMusic.z-128.)/4000.); 
        
        ro -= rot[2]*myTime/4.;
        
        rd = rot * rd;
        
        vec3 p = ro + rd;
        
        vec3 cc = vec3(0.);
    
        float stepsize = .01;
        float totdist = stepsize;
      
        float nudge = iTime/3. - iMusic.x/5. ;
        vec3 spherepos = ro -1.*rot[2] - rot[2] * .3*cos(nudge) ; //(1.+iMusic.x/15.); // + rot[0]; //2.*rot[2] - rot[0] * (1. + (iMusic.x)/15.) ;

        spherepos += rot[0] * .3*sin(nudge);
        spherepos += rot[1] * .1*sin(iTime/5. + iMusic.y/10.);

        //spherepos.y += (iMusic.y-50.)/200.;
        //spherepos.x += .2 + (iMusic.z-200.)/200.; // * rot[0];
    
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
    
    `,

`
//////////////// d20 Bubbles 
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMusic;

varying vec2 vUv;

#define MAX_RAY_STEPS 100
#define MAX_PRIME_RAY_DIST 10.
#define PI 3.14159265

//hard coded icosahedron vertices for fractal generation
const float sqr5 = sqrt(5.);
const float p1 = 1./sqr5;
const float p2 = 2./sqr5;
const float p3 = sqrt( (5.+sqr5)/10. );
const float p4 = sqrt( (5.-sqr5)/10. );
const float p5 = (5.-sqr5)/10.;
const float p6 = (-5.-sqr5)/10.;
const float p7 = (5.+sqr5)/10.;
const float p8 = (-5.+sqr5)/10.;

vec3[] d20 = vec3[] (
vec3(1.,0.,0.),
vec3(p1, p2, 0.),
vec3(p1, p5, p3),
vec3(p1, p6, p4),
vec3(p1, p6, -p4),
vec3(p1, p5, -p3),
vec3(-1.,0.,0.),
vec3(-p1, -p2, 0.),
vec3(-p1, p8, -p3),
vec3(-p1, p7, -p4),
vec3(-p1, p7, p4),
vec3(-p1, p8, p3)
);


int max_iter = 2;
vec3 ifs_color;
float ifs_scale = 4.;

vec3 ambientL  = vec3(.2,.1,.7);
vec3 diffuseL  = vec3(.5,0.,.6);
vec3 specularL = vec3(.8,.2,0.);
vec3 ambdir    = normalize(vec3(1.,0.,1.));

struct RAYMARCH_RESULT {
    vec3  raypos;
    float dist_from_origin;
    float object_id;
};

vec3  light_pos = vec3(0.,0., 1.);
vec2  myMouse;
vec3  ro,rd;

float sphere_sdf( vec3 pos, float r ) {
    return length(pos) - r;
}

mat3 rot_xz(float an) {
    //an += iMusic.x/20.;
    float cc = cos(an), ss=sin(an);
    return mat3(cc,0.,ss,0.,1.,0.,-ss,0.,cc);

}

vec2 dist_func01(vec3 z) {
    
    vec3 min_vtx;
    vec3 orig_z = z;
    int n=0;
    float min_dist,dist_to_vtx;

    ifs_color = vec3(0.);

    for (int i=0; i<100; i++) {
       
        if ( i > max_iter ) break;

        float w = iTime/3.;
        vec3 dd_0 = rot_xz(w)*d20[0];
        min_vtx = dd_0;
        min_dist=length(z-dd_0);
        for (int j=1; j<12; j++) {
            vec3 ddj = rot_xz(w)*d20[j];
            dist_to_vtx=length(z-ddj); 
            if (dist_to_vtx<min_dist) {min_vtx=ddj; min_dist=dist_to_vtx;}
            
        }
        
        z = min_vtx + ifs_scale*(z-min_vtx);
        
        n++;

        //potentially interesting colors
        /*
        if ( z.x * z.y > 0. ) ifs_color.x ++;
        if ( z.y * z.z > 0. ) ifs_color.y ++;
        if ( z.z * z.x > 0. ) ifs_color.z ++;
        */
        
    }

    //ifs_color /= float(n);

    float dz = pow(ifs_scale, float(n) );
    //dz is simply the constant Scale factor to the power of number of times used

    float scene_dist = length(z) / dz;  
    float objid = 0.;

    //scene_dist = max( scene_dist, -(length(orig_z-ro)-.81) ); //looks cool with this but don't use for now
    return vec2( scene_dist, objid );
}

vec3 estimate_normal_vec( vec3 pos, float neps ) {

    // in other words - the Gradient Vector...
    
    float norm_sign = 1.; 

    vec2  np = norm_sign * normalize(vec2( 1., -1)); //putting the wrong sign here makes a glossy effect

    vec2  dp = vec2( neps, -neps);
   
    vec3 df1 = np.xxx * dist_func01( pos + dp.xxx ).x;
    vec3 df2 = np.xyy * dist_func01( pos + dp.xyy ).x;
    vec3 df3 = np.yxy * dist_func01( pos + dp.yxy ).x;
    vec3 df4 = np.yyx * dist_func01( pos + dp.yyx ).x;
    
    
    return normalize( df1 + df2 + df3 + df4 );

}

RAYMARCH_RESULT raymarch( vec3 ro, vec3 rd, float eps, float initial_object_id ) {

    float dist_from_origin = 0.; 
    vec3 raypos = ro;
    RAYMARCH_RESULT result;
    result.object_id = initial_object_id; 
    result.dist_from_origin = 0.;
   
    float threshold = eps;
    
    for (int i=0; i<MAX_RAY_STEPS && dist_from_origin < MAX_PRIME_RAY_DIST; i++) {
    
        vec3 raypos = ro + dist_from_origin * rd;
        vec2 dist_to_closest = dist_func01(raypos);
        if ( abs(dist_to_closest.x) < threshold ) {
        
            result.object_id = dist_to_closest.y;
            result.raypos = raypos;
            result.dist_from_origin = dist_from_origin;
            
            break;
        }
        

        raypos += dist_from_origin*rd; 

        dist_from_origin += dist_to_closest.x;
        
        threshold *= (1.+dist_from_origin*40.);
        
    }
       
    return result;
    
}

vec3  main_loop( vec3 ro, vec3 rd ) {
    
    RAYMARCH_RESULT prime_ray = raymarch( ro, rd, .00003, 100.);
    
    vec3 color = vec3(0.);
    
    float myTime = iTime ;

    if (prime_ray.object_id > -1. ) { 
    
        vec3 nn = estimate_normal_vec( prime_ray.raypos, .01 );
        
        vec3 lt_pos = light_pos + vec3( 6.*cos(myTime/3.), .5*sin(myTime/5.) , 6.*sin(myTime/2.) );  

        float spec_pow = 17.; 
        float spec_amp = 1.;
        
        vec3 light_dir=normalize(lt_pos-prime_ray.raypos); 
        float diffuse_light = clamp(dot(light_dir, -nn), 0., 1.);
        float ambient_light = (1.+iMusic.x) * 0.5 * dot(nn, normalize(1.+iMusic.xyz) ); //ambdir );
       
        vec3 view_dir= rd;      
        vec3 refl = reflect(-view_dir,nn);      
        float specular_light=pow(max(dot(refl,light_dir),0.0),spec_pow  );
        

        color = ambient_light  * ambientL + 
                diffuse_light  * diffuseL +
                spec_amp*specular_light * specularL ;
             
        color *= exp(-prime_ray.dist_from_origin/20.);
        
        vec3 new_ro = prime_ray.raypos + nn*.01;
        vec3 new_rd = reflect( rd, nn );
        RAYMARCH_RESULT reflection = raymarch( new_ro, new_rd, .00005, 100.);
        
        
        if ( reflection.object_id > -1. ) {
  
            
            vec3 nn2 = estimate_normal_vec( reflection.raypos, .02 ); 
         
            vec3 light_dir2=normalize(lt_pos-reflection.raypos); 
            
            float diffuse_light2 = clamp(dot(light_dir2, -nn2), 0., 1.);
            float ambient_light2 = 0.5 * dot(nn2, ambdir);
    
            vec3 view_dir2 = new_rd;
            vec3 refl2=reflect(-view_dir2,nn);
            float specular_light2 = pow(max(dot(refl2,light_dir2),0.0),spec_pow);
        
            vec3 reflect_color = ambient_light2 * ambientL  +
                                 diffuse_light2 * diffuseL +
                                 spec_amp*specular_light2 * specularL ; 
                                 
            float color_fac = 1.2;
            
            reflect_color *= exp(-reflection.dist_from_origin/30.);

            color += color_fac *  reflect_color;
            
        }                      
    }

    return clamp(color, 0., 1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    float myTime = iTime/5.;
    
    vec2 uv = (2.0*fragCoord - iResolution.xy) / iResolution.y;
    //myMouse = (iMouse.xy*2.0 - iResolution.xy) / iResolution.y;
    
    ifs_scale = 4. - 2.*abs(sin(iTime/60.));
    max_iter = 6 - int(4.*abs(sin(myTime/2.))) ;
    ro = vec3(0.,0.,-1.4 + max(-.9,min(1.1,1.5*(sin(myTime-PI/2.)))) );  //ray origin
    rd = normalize( vec3(uv, 1.8) );  //ray direction
    
    vec3 color = main_loop(ro, rd);
 
    //color = pow( color, vec3(.6) );
    
    fragColor = vec4(color,1.);
}

void main() {
    mainImage(gl_FragColor, vUv*iResolution.xy);
}

`,

`
////////////// mandel exp combination
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMusic;

varying vec2 vUv;

vec2 zz( in vec2 z ) {
    //classic z squared iteration here
    return vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y);
}

vec2 expz( in vec2 z ) {
    //exponential function here
    return vec2( exp(z.x)*cos(z.y), exp(z.x)*sin(z.y) );
}
void mainImage0( out vec4 fragColor, in vec2 fragCoord )
{
    //vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;    
    
    float myTime = iTime;
    
    //we want to start in a particular rectangle in complex plane
    vec2 center = vec2( -1.587+.02*sin(myTime/5.),-.34-.02*sin(myTime/7.)); //-.31000);
    vec2 width  = (1.-.8*sin(myTime/9.))*.5*vec2( .025, .03);
    
    vec2 final_uv = uv * width + center ; 
    
    float max_iter=1100.-iMusic.x*150., mix_factor=.711 , infinity=1.e9;
    vec3  julia_freq = vec3(  9.5  , //+ sin(myTime),
                              10. ,
                              50. ); // + 10.*sin(myTime/5.) ) ;

    julia_freq += (iMusic.zyx - 20.)/5. ;

    vec4 qq = vec4(0.); //counts orbit in 4 quadrants
    
    //mix_factor += .02 * sin(myTime/5.);
    vec2 wgt=vec2(mix_factor, 1.-mix_factor);
    

    vec2 iter=final_uv, new_iter;
    float escape_value = 0.;
    for ( float i=0.; i<max_iter; i++ ) {
    
        new_iter = wgt.x * zz(iter) + wgt.y*expz(iter) + final_uv;
        iter = new_iter;
        
        float distance = new_iter.x*new_iter.x + new_iter.y*new_iter.y;

        //keep track if how many times the orbit is in 
        //the various 4 quadrants (for coloring)
        if (new_iter.x >= 0.0) {
            if (new_iter.y >= 0.0) {
                qq[0] ++;
            }
            else {
                qq[1] ++;
            }
        }
        else {
            if (new_iter.y >= 0.0) {
                qq[2] ++;
            }
            else {
                qq[3] ++;
            }
        }
        
        //the usual distance bigger than some large number check
        //NOT using distance estimator here
        if ( distance > infinity ) {
            escape_value = i;
            break;
        }
         
    }
    
    if ( escape_value != 0. ) {
        vec3 qx = vec3( qq[3]*julia_freq[0], 
                        qq[0]*julia_freq[1],
                        qq[2]*julia_freq[2]
                       );
        
        fragColor = vec4( cos( qx / escape_value ), 1. ); 
    }
    else {
        fragColor = vec4( vec3(0.), 1. );
    }
    

}

//Fabrice Neyret is the man!!!   
//https://shadertoyunofficial.wordpress.com/author/fabriceneyret/
void mainImage(out vec4 O, vec2 U) {
    mainImage0(O,U);
    if ( fwidth(length(O)) > .01 ) {  // difference threshold between neighbor pixels
        vec4 o;
        for (int k=0; k < 9; k+= k==3?2:1 )
          { mainImage0(o,U+vec2(k%3-1,k/3-1)/3.); O += o; }
        O /= 9.;
     // O.r++;                        // uncomment to see where the oversampling occurs
    }
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
    