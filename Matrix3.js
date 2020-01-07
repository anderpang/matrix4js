"use strict";
(function(context,factory){
       typeof module==="object"?
                    module.exports=factory():
                    context.Matrix3=factory();
})(this,function(){
    function Matrix3(data){
        this.data=new Float32Array(data||9);
    }

    Matrix3.prototype={
        constructor:Matrix3,
        identity:function(){
             var m=this.data;
             m[0]=m[4]=m[8]=1;
             return this;
        },
        copy:function(){
              return new this.constructor(this.data.slice);        
        },
        copyFrom:function(from){
            var i=9,m=this.data,f=from.data;

            while(i--){
                m[i]=f[i];
            }
            return this;
        },
        translate:function(x,y){
            var m=this.data;
            m[6]=x;
            m[7]=y;

            return this;
        },
        rotate:function(rad){
             var s=Math.sin(rad),
                 c=Math.cos(rad),
                 m=this.data,
                 m0=m[0],
                 m3=m[3];

                m[0]=m0*c+m[1]*s;
                m[3]=m3*c+m[4]*s;
                m[1]=m[1]*c-m0*s;
                m[4]=m[4]*c-m3*s;

             return this;
         },
         scale: function(sx, sy) {
             var m=this.data;
             m[0]*=sx;
             m[4]*=sy;
            
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