/*! <anderpang@foxmail.com> 2020-01-10 */
/**
 * 4*4矩阵
 */
"use strict";
(function(context,factory){
       typeof exports==="object"?
                    (exports.__esModule=true,exports=factory()):
                    context.Matrix4=factory();
})(this,function(){

    function Matrix4(data){
        this.data=new Float32Array(data||16);
    }

    //静态方法，每一个静态方法都是一个初始化的matrix
    Matrix4.identity=function(){
       return new this([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
       ]);
    };

    Matrix4.translate=function(tx,ty,tz){
        return new this([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            tx,ty,tz,1
        ]);
    };

    Matrix4.rotateX=function(rad){
        var s=Math.sin(rad),
            c=Math.cos(rad);
        return new this([
            1,0,0,0,
            0,c,s,0,
            0,-s,c,0,
            0,0,0,1
        ]);
    };

    Matrix4.rotateY=function(rad){
        var s=Math.sin(rad),
            c=Math.cos(rad);
        return new this([
            c,0,s,0,
            0,1,0,0,
            -s,0,c,0,
            0,0,0,1
        ]);
    };

    Matrix4.rotateZ=function(rad){
        var s=Math.sin(rad),
            c=Math.cos(rad);
        return new this([
            c,s,0,0,
            -s,c,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    };

    Matrix4.scale=function(sx,sy,sz){
        return new this([
            sx,0,0,0,
            0,sy,0,0,
            0,0,sz,0,
            0,0,0,1
        ]);
    };

    //投影
    Matrix4.perspective=function(fovy,aspect,n,f){
        var t=1/Math.tan(fovy*Math.PI/360),  //等价Math.tan(Math.PI * 0.5 - 0.5 * fovy*Math.PI/180);
           d=1/(n-f);
    
       return new this([
           t/aspect,0,0,0,
           0,t,0,0,
           0,0,(f+n)*d,-1,
           0,0,2*f*n*d,0            
       ]);
    };

    //方向
    Matrix4.lookAt=function(eye,target,up) {
        var eyeX=eye[0], eyeY=eye[1], eyeZ=eye[2], 
            upX=up[0], upY=up[1], upZ=up[2],
            fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz,f2;

        fx = eyeX - target[0];
        fy = eyeY - target[1];
        fz = eyeZ - target[2];

        f2=fx*fx + fy*fy + fz*fz;
        if(f2===0){
            return this.identity();
        }

        // Normalize f.
        rlf = 1 / Math.sqrt(f2);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        // Calculate cross product of up and f.
        sx = upY*fz - upZ*fy;
        sy = upZ*fx - upX*fz;
        sz = upX*fy - upY*fx;

        // Normalize s.
        rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;

        // Calculate cross product of f and s.
        ux = fy*sz - fz*sy;
        uy = fz*sx - fx*sz;
        uz = fx*sy - fy*sx;

        // Set to this.
        return new this([
            sx,sy,sz,0,
            ux,uy,uz,0,
            fx,fy,fz,0,
            eyeX,eyeY,eyeZ,1
         ]);

        // Translate.
        //return this.translate(eyeX, eyeY, eyeZ);
    };

    Matrix4.prototype={
        constructor:Matrix4,
        zero:function(){
           var i=16,m=this.data;
           while(i--){
              m[i]=0;
           }

           return this;
        },
        identity:function(){
             var m=this.data;
             this.zero();
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
        multiply:function(t){
            var i=0,ii=16,b0,b1,b2,b3,m=this.data,a=m.slice(),b=t.data;

            while(i<ii){
                b0=b[i];b1=b[i+1];b2=b[i+2];b3=b[i+3];
                m[i++] =b0*a[0]+b1*a[4]+b2*a[8] +b3*a[12];
                m[i++] =b0*a[1]+b1*a[5]+b2*a[9] +b3*a[13];
                m[i++] =b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];
                m[i++] =b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];
            }    
            return this;
        },
        translate:function(tx,ty,tz){
            return this.multiply(Matrix4.translate(tx,ty,tz));
        },
        rotateX:function(rad){
             return this.multiply(Matrix4.rotateX(rad));
         },
         rotateY:function(rad){
            return this.multiply(Matrix4.rotateY(rad));
        },
        rotateZ:function(rad){
            return this.multiply(Matrix4.rotateZ(rad));
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