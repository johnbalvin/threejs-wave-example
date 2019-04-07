let t=0;
class Handler{
    constructor(){
        this.render=this.render.bind(this);
        this.camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BufferGeometry();
        this.amountx=150;
        this.amounty=150;
        this.aplitude=50;
        this.waveLength=20;
        this.frecuency=0.009/1000;
        this.separation=15;
        this.monitorPeriod=0;
        this.sign=1;
        this.phase=0;
        this.particles="";
        this.renderer="";
        this.formula=document.querySelector("#actions .formula .me");
        this.start();
    }
    start(){
        this.calculatePeriod();
        this.camera.position.x =-60;
        this.camera.position.y = 370;
        this.camera.position.z = 1000;
        let canvas = document.querySelector(".here");
        let context = canvas.getContext('webgl2');
        this.renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
        this.controls = new THREE.OrbitControls(this.camera, canvas);
        this.controls.zoomSpeed = 2;
        this.controls.update();

        let numParticles = this.amountx * this.amounty;
        let positions = new Float32Array(numParticles*3);//three coordinates
        let i = 0;
        for ( let ix = 0; ix < this.amountx; ix ++ ) {
            for ( let iy = 0; iy < this.amounty; iy ++ ) {
                positions[ i ] = ix * this.separation - ( ( this.amountx * this.separation ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * this.separation - ( (this.amounty *this.separation ) / 2 ); // z
                i += 3;
            }
        }
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        this.geometry.computeBoundingBox();
        let starsMaterial = new THREE.PointsMaterial( { color: "#E1BEE7",size:15 } );
        this.particles= new THREE.Points( this.geometry , starsMaterial );
        this.scene.add( this.particles );
        
        let grid = new THREE.GridHelper( 3000, 100 ,"#303F9F","#303F9F");
        grid.position.y = 0;
        grid.position.x = 0;
        grid.position.z = 0;
        grid.material.opacity = 0.25;
        grid.material.transparent = true;
        this.scene.add( grid );
        this.listenerAplitude();
        this.listenerPhase();
        this.listenerWaveLength();
        this.listenerVelocity();
        this.listenerSign();
        this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        this.render();
    }
    calculatePeriod(){
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                const start=performance.now();
                requestAnimationFrame(()=>{
                    const end=performance.now();
                    const time=end-start;
                    this.monitorPeriod=time/60;
                });
            });
        });
    }
    render() {
        let positions = this.particles.geometry.attributes.position.array;
        const A=this.aplitude; 
        const phase= this.phase;
        const waveLength=this.waveLength;
        const f=this.frecuency;
        const sign=this.sign;
        let i = 0;
        for ( let x = 0; x < this.amountx; x ++ ) {
            for ( let iy = 0; iy < this.amounty; iy ++ ) {
                const w=2*Math.PI*f;
                positions[ i + 1 ] =  A * Math.sin( x * (2*Math.PI/waveLength)+ sign*w*t+ phase) ;//only move in y axes, other axes remain the same
                i += 3;
                t+=this.monitorPeriod; //the next time, this is how much time monitor "refresh" normally is 60 Hertz, or P=1/60= 0.16667 Seconds
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          this.renderer.setSize(width, height, false);
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
          this.camera.updateProjectionMatrix();
        }
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame( this.render );
    }
    changeFormula(aplitude,waveLength,sign,frecuency,phase){
        let simbol="-";
        if (sign==1){
            simbol="+";
        }
        frecuency=frecuency*1000;
        this.formula.textContent=`${aplitude} * sin(x*(2*PI/${waveLength}) ${simbol} 2*PI*${frecuency}*10^3*t + ${phase})`;
    }
    listenerAplitude(){
        const range=document.querySelector("#actions .amplitude .range");
        const number=document.querySelector("#actions .amplitude .number");
        range.addEventListener("input",()=>{
            let value=parseFloat(range.value);
            this.aplitude=value;
            number.value=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
        number.addEventListener("input",()=>{
            let value=parseFloat(number.value);
            this.aplitude=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
    }
    listenerPhase(){
        const range=document.querySelector("#actions .phase .range");
        const number=document.querySelector("#actions .phase .number");
        range.addEventListener("input",()=>{
            let value=parseFloat(range.value);
            this.phase=value;
            number.value=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
        number.addEventListener("input",()=>{
            let value=parseFloat(number.value);
            this.phase=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
    }
    listenerWaveLength(){
        const range=document.querySelector("#actions .waveLength .range");
        const number=document.querySelector("#actions .waveLength .number");
        range.addEventListener("input",()=>{
            let value=parseFloat(range.value);
            this.waveLength=value;
            number.value=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
        number.addEventListener("input",()=>{
            let value=parseFloat(number.value);
            this.waveLength=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
    }
    listenerVelocity(){
        const range=document.querySelector("#actions .velocity .range");
        const number=document.querySelector("#actions .velocity .number");
        range.addEventListener("input",()=>{
            let value=parseFloat(range.value)/1000;
            this.frecuency=value;
            number.value=range.value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
        number.addEventListener("input",()=>{
            let value=parseFloat(number.value)/1000;
            this.frecuency=value;
            this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
        });
    }
    listenerSign(){
        const select=document.querySelector("#actions .direction select");
        select.addEventListener("input",()=>{
            if(select.value=="l"){
                this.sign=1;
                this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
            }else{
                this.sign=-1;
                this.changeFormula(this.aplitude,this.waveLength,this.sign,this.frecuency,this.phase);
            }
        });
    }
}
let handler=new Handler();