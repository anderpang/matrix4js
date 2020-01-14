/*! <anderpang@foxmail.com> 2020-01-10 */
/**
 * 3*3矩阵
 */
"use strict";
(function(context,factory){
       typeof module==="object"?
               (exports.__esModule=true,exports=factory()):
                context.Matrix3=factory();
})(this,function(){
    function Matrix3(data){
        this.data=new Float32Array(data||9);
    }

    //静态方法，每一个静态方法都是一个初始化的matrix
    Matrix3.identity=function(){
        return new this([
             1,0,0,
             0,1,0,
             0,0,1
        ]);
     };

     Matrix3.translate=function(tx,ty){
        return new this([
            1,0,0,
            0,1,0,
            tx,ty,1
        ]);
    };

    Matrix3.rotate=function(rad){
        var s=Math.sin(rad),
            c=Math.cos(rad);
        return new this([
            c,s,0,
            -s,c,0,
            0,0,1
        ]);
    };

    Matrix3.scale=function(sx,sy,sz){
        return new this([
            sx,0,0,
            0,sy,0,
            0,0,1
        ]);
    };

    //投影
    Matrix3.projection=function(width,height){
        return new this([
            2/width, 0, 0,
            0, -2/height, 0,
             -1, 1, 1
        ]);
    };
 

    Matrix3.prototype={
        constructor:Matrix3,
        zero:function(){
            var i=9,m=this.data;
            while(i--){
               m[i]=0;
            }
 
            return this;
         },
        identity:function(){
             var m=this.data;
             this.zero();
             m[0]=m[4]=m[8]=1;
             return this;
        },
        copy:function(){
              return new this.constructor(this.data);        
        },
        copyFrom:function(from){
            var i=9,m=this.data,f=from.data;

            while(i--){
                m[i]=f[i];
            }
            return this;
        },
        multiply:function(m){
            var i=0,ii=9,b0,b1,b2,c=this.data,a=c.slice(),b=m.data;

            while(i<ii){
                b0=b[i];b1=b[i+1];b2=b[i+2];
                c[i++] =b0*a[0]+b1*a[3]+b2*a[6];
                c[i++] =b0*a[1]+b1*a[4]+b2*a[7];
                c[i++] =b0*a[2]+b1*a[5]+b2*a[8];
            }    
            return this;
        },
        translate:function(tx,ty){
            return this.multiply(Matrx3.translate(tx,ty));
        },
        rotate:function(rad){
            return this.multiply(Matrx3.rotate(rad));
        },
        scale: function(sx, sy) {
            return this.multiply(Matrix3.scale(sx,sy));
        },
        transpose:function(){
            var m=this.data,
                b=m.slice(),
                l=3,
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

    return Matrix3;
});