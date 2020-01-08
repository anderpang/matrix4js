"use strict";
(function(context,factory){
       typeof module==="object"?
                    module.exports=factory():
                    context.Matrix4=factory();
})(this,function(){
    function Matrix4(data){
        this.data=new Float32Array(data||16);
    }

    Matrix4.prototype={
        constructor:Matrix4,
        identity:function(){
             var m=this.data;
             m[0]=m[5]=m[10]=m[15]=1;
             return this;
        },
        copy:function(){
              return new this.constructor(this.data);        
        },
        copyFrom:function(from){
            var i=16,m=this.data,f=from.data;

            while(i--){
                m[i]=f[i];
            }
            return this;
        },
        perspective:function(fovy,aspect,n,f){
             var t=1/Math.tan(fovy*Math.PI/360),
                d=f-n,
                m=this.data;
             /*
            return new Float32Array([
                t/aspect,0,0,0,
                0,t,0,0,
                0,0,-(f+n)/d,-1,
                0,0,-2*f*n/d,0            
            ]);
            */
            m[0]=t/aspect;
            m[5]=t;
            m[10]=-(f+n)/d;
            m[11]=-1;
            m[14]=-2*f*n/d;

            return this;
         },
         lookAt:function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
          var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz,m=this.data;

          fx = centerX - eyeX;
          fy = centerY - eyeY;
          fz = centerZ - eyeZ;

          // Normalize f.
          rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
          fx *= rlf;
          fy *= rlf;
          fz *= rlf;

          // Calculate cross product of f and up.
          sx = fy * upZ - fz * upY;
          sy = fz * upX - fx * upZ;
          sz = fx * upY - fy * upX;

          // Normalize s.
          rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
          sx *= rls;
          sy *= rls;
          sz *= rls;

          // Calculate cross product of s and f.
          ux = sy * fz - sz * fy;
          uy = sz * fx - sx * fz;
          uz = sx * fy - sy * fx;

          // Set to this.
          /*
          e = new Float32Array([
              sx,ux,-fx,0,
              sy,uy,-fy,0,
              sz,uz,-fz,0,
              -eyeX,-eyeY,-eyeZ,1
           ]);
           */
          m[0] = sx;
          m[1] = ux;
          m[2] = -fx;

          m[4] = sy;
          m[5] = uy;
          m[6] = -fy;

          m[8] = sz;
          m[9] = uz;
          m[10] = -fz;

          m[15] = 1;
          // Translate.
          //return this.translate(-eyeX, -eyeY, -eyeZ);
          return this;
        },
        translate:function(x,y,z){
            var m=this.data;
            m[12]=x;
            m[13]=y;
            m[14]=z;

            return this;
        },
        rotateX:function(rad){
             var s=Math.sin(rad),
                 c=Math.cos(rad),
                 m=this.data;
       
             var m1=m[1],m5=m[5],m9=m[9];
             m[1]=m1*c+m[2]*s;
             m[5]=m5*c+m[6]*s;
             m[9]=m9*c+m[10]*s;

             m[2]=m[2]*c-m1*s;
             m[6]=m[6]*c-m5*s;
             m[10]=m[10]*c-m9*s;
             return this;
         },
         rotateY:function(rad){
            var s=Math.sin(rad),
                c=Math.cos(rad),
                m=this.data,
                m0=m[0],m4=m[4],m8=m[8];

            m[0]=m0*c+m[2]*s;
            m[4]=m4*c+m[6]*s;
            m[8]=m8*c+m[10]*s;

            m[2]=m[2]*c-m0*s;
            m[6]=m[6]*c-m4*s;
            m[10]=m[10]*c-m8*s;

            return this;
        },
        rotateZ:function(rad){
            var s=Math.sin(rad),
                c=Math.cos(rad),
                m=this.data,
                m0=m[0],m4=m[4],m8=m[8];

            m[0]=m0*c+m[1]*s;
            m[4]=m4*c+m[5]*s;
            m[8]=m8*c+m[9]*s;

            m[1]=m[1]*c-m0*s;
            m[5]=m[5]*c-m4*s;
            m[9]=m[9]*c-m8*s;

            return this;
        },
        multiply:function(m){
            var i=0,ii=16,b0,b1,b2,b3,c=this.data,a=c.slice(),b=m.data;

            while(i<ii){
                b0=b[i];b1=b[i+1];b2=b[i+2];b3=b[i+3];
                c[i++] =b0*a[0]+b1*a[4]+b2*a[8] +b3*a[12];
                c[i++] =b0*a[1]+b1*a[5]+b2*a[9] +b3*a[13];
                c[i++] =b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];
                c[i++] =b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];
            }    
            return this;
        },
        invert:function(){
          var m=this.data,
              a=m.slice();
          var a00 = a[0],
              a01 = a[1],
              a02 = a[2],
              a03 = a[3];
          var a10 = a[4],
              a11 = a[5],
              a12 = a[6],
              a13 = a[7];
          var a20 = a[8],
              a21 = a[9],
              a22 = a[10],
              a23 = a[11];
          var a30 = a[12],
              a31 = a[13],
              a32 = a[14],
              a33 = a[15];

          var b00 = a00 * a11 - a01 * a10;
          var b01 = a00 * a12 - a02 * a10;
          var b02 = a00 * a13 - a03 * a10;
          var b03 = a01 * a12 - a02 * a11;
          var b04 = a01 * a13 - a03 * a11;
          var b05 = a02 * a13 - a03 * a12;
          var b06 = a20 * a31 - a21 * a30;
          var b07 = a20 * a32 - a22 * a30;
          var b08 = a20 * a33 - a23 * a30;
          var b09 = a21 * a32 - a22 * a31;
          var b10 = a21 * a33 - a23 * a31;
          var b11 = a22 * a33 - a23 * a32;

          // Calculate the determinant
          var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

          if (!det) {
            return null;
          }
          det = 1.0 / det;

          m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
          m[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
          m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
          m[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
          m[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
          m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
          m[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
          m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
          m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
          m[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
          m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
          m[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
          m[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
          m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
          m[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
          m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

          return this;
        },
        transpose:function(){
            var m=this.data,
                b=m.slice(),
                l=4,
                y=0,
                x;
            for(;y<l;y++){
                for(x=0;x<l;x++){
                    m[x*l+y]=b[y*l+x];
                }
            }

            return this;
        }
    };

    return Matrix4;
});