//Anx Translacion0  Sector1 Sector2 Sector3
//-36,02  0,05  -36,02  -156,02 -276,02
//-57,14  0,1 -57,14  -177,14 -297,14
//-78,84  0,2 -78,84  -198,84 -318,84
//-105,48 -1  -105,48 -225,48 -345,48

var totem1X = []
var totem2X = []
var totem3X = []

var positionBuffer, textureCoordBuffer, indexBuffer;

var buffers;
var texture;


  var w = window.innerWidth;
  var h = window.innerHeight;


var rotacionPrimeraPersona;
var translacion = [0, 0, 0, 0];
var rotacion = [0, 0, 0, 0];
var translacionParcial = [0, 0, 0, 0];
var rotacionpParcial = [0, 0, 0, 0];

var audioCogitans ="music/The Do - Dust It Off.mp3"; //Dust it Off
var audioExtensa ="music/Swedish House Mafia - Greyhound.mp3"; //Greyhound
var audioInfinita ="music/The Ember Days - Emergency.mp3"; //Emergency

var limitCogitans = 120;
var limitExtensa = 240;
var limitInfinita = 360; 

var cambioEtapa = "inf";
var audio = new Audio();

var changeTo = "";

var cancion

var ambientR = 0.3;
var ambientG = 0.1;
var ambientB = 0.1;

var velcambiot = 0.5;
var velcambiotr = 1;
var avance = 1;
var avancet = 0.05;
var limit =degToRad(120);
var radioCentr = 8;
var alt = 1.2;

var angAvance = 0;

var gl;
var scene;
var timestamp;

window.onresize = function(event) {
  w = window.innerWidth;
  h = window.innerHeight;

      var c = document.getElementById("rendering-surface");
      c.height = h;
      c.width = w;
 
      var surface = document.getElementById('rendering-surface');
      gl = surface.getContext('experimental-webgl');
      gl.viewport(0,0,surface.width,surface.height);
};


    function degToRad(degrees) 
    {
      return degrees * Math.PI / 180;
    }
    function GetChar (event){
      var chCode = ('key' in event) ? event.key : event.keyCode;
      if(chCode == '1'){
        //Centro
        translacion = [0, 0, 0, 0];
        rotacion = [-361, 0, 0, 0];
      }
      else if(chCode == '2'){
        //Plano General
        translacion = [0, 0, -50, 0];
        rotacion = [-361, -90, 0, 0];
      }
      else if(chCode == '3'){
        //Primera Persona
        translacion = [0, (radioCentr-alt), 0, 0];
        rotacion = [-361, 0, 0, 0];
        angAvance=0;

        changeTo = "cog";
        audio.src= audioCogitans;
        audio.play();

        //audio = new Audio();
      }
      else if(chCode == '4'){
        //Plano General
        translacion = [0, 0, -50, 0];
        rotacion = [-361, 90, 0, 0];
      }
    }

    function keyPressedChar(event){
      var chCode = ('key' in event) ? event.key : event.keyCode;
      if (chCode == 'q'){
        angAvance += avance;
        translacion[2] = (radioCentr-alt)*Math.sin(degToRad(angAvance));
        translacion[1] = (radioCentr-alt)*Math.cos(degToRad(angAvance));
      }
      else if (chCode == 'e'){
        angAvance += avance;
        translacion[2] = (radioCentr-alt)*Math.sin(degToRad(angAvance));
        translacion[1] = (radioCentr-alt)*Math.cos(degToRad(angAvance));
      }
      else if (chCode == 'w'){
        if(rotacion[0]==0){
          rotacion[0]=-360;
        }
        //console.log(rotacion[0]);
        rotacion[0] -= avance;
        //rotacion[0] -= 0.1;
      }
      else if (chCode == 'a'){
        translacion[0]+= avancet;
      }
      else if (chCode == 's'){
        if(rotacion[0]==0){
          rotacion[0]=-360;
        }
        //console.log(rotacion[0]);
        rotacion[0]+=avancet;
      }
      else if (chCode == 'd'){
        translacion[0]-= avancet;
      }
      else if (chCode == 'i'){
        console.log(Rotacion=rotacion);
        console.log(translacion);
      }
      else if (chCode == 'f'){
        rotacion[1] -= avance;
      }
      else if (chCode == 'g'){
        rotacion[1] += avance;
      }
    }

    document.onkeydown = GetChar;
    document.onkeypress = keyPressedChar;

    function render(timestamp,previousTimestamp) {
      var surface = document.getElementById('rendering-surface')
 
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(scene.program);
 
      var delta = (0.025 * Math.PI) / (timestamp - previousTimestamp);
 
      var light = vec3.fromValues( 5,5,-5);
      var lightExtensa = vec3.fromValues(0,0);
      var lightCogitans = vec3.fromValues();
      var lightInfinita = vec3.fromValues();
 
      gl.uniform3fv(scene.program.directionalLightUniform, light);
 
      var projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, 0.9, surface.width/surface.height, 0.1, 200.0 );
      //mat4.perspective(projectionMatrix, Math.PI/2, surface.width/surface.height,0.5, 200);

      if((Math.abs(rotacion[0])%360!=0 && Math.abs(rotacion[0])%360 <limitCogitans)){
        ambientR=1.0;
        ambientG=0.55;
        ambientB=0.0;

        changeTo = "cog";
        if(changeTo != cambioEtapa){
          cambioEtapa = changeTo;
          audio.pause();

          audio.src = audioCogitans;
          audio.play();
        }
      }
      else if(Math.abs(rotacion[0])%360!=0 && Math.abs(rotacion[0])%360 <limitExtensa){
        ambientR=0.0;
        ambientG=0.4;
        ambientB=1;

        changeTo = "ext";
        if(changeTo != cambioEtapa){
          cambioEtapa = changeTo;
          audio.pause();

          audio.src= audioExtensa;
          audio.play();
        }
      }
      else if(Math.abs(rotacion[0])%360 <limitInfinita){
        ambientR=0.294;
        ambientG=0.0;
        ambientB=0.51;

        changeTo = "inf";
        if(changeTo != cambioEtapa){
          cambioEtapa = changeTo;
          audio.pause();

          audio.src = audioInfinita;
          audio.play();
        }
      } 
      //console.log(rotacion[0]);
      var ambientLightColour = vec3.fromValues(ambientR, ambientG, ambientB);
      gl.uniform3fv( scene.program.ambientLightColourUniform, ambientLightColour);
      /*
      for(var i = 0; i <4 ;i++)
      {
        if(translacionParcial[i] > translacion[i])
        {
          translacionParcial[i] -= velcambiot;
          if (translacionParcial[i] < translacion[i])
            translacionParcial[i] = translacion[i];
        }
        else if (translacionParcial[i] < translacion[i])
        {
          translacionParcial[i] += velcambiot;
          if (translacionParcial[i] > translacion[i])
            translacionParcial[i] = translacion[i];
        }
        
        if(rotacionpParcial[i] > rotacion[i])
        {
          rotacionpParcial[i] -= velcambiotr;
          //if (rotacionpParcial[i] < rotacion[i])
          //  rotacionpParcial[i] = rotacion[i];
        }
        else if (rotacionpParcial[i] < rotacion[i])
        {
          rotacionpParcial[i] += velcambiotr;
          //if (rotacionpParcial[i] > rotacion[i])
          //  rotacionpParcial[i] = rotacion[i];
        }
      }*/

      mat4.translate(projectionMatrix,projectionMatrix, translacion);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacion[0]), [1,0,0]);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacion[1]), [0,1,0]);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacion[2]), [0,0,1]);

 
      projectionMatrixUniform = gl.getUniformLocation(scene.program, 'projectionMatrix');
      gl.uniformMatrix4fv(projectionMatrixUniform, gl.FALSE,projectionMatrix);
      gl.uniformMatrix4fv(projectionMatrixUniform, gl.FALSE, projectionMatrix);

      var rotateX = 0.1;
      var rotateY = 0.0;
      var rotateZ = 0.0;
      mat4.rotate( projectionMatrix, projectionMatrix, delta,[rotateX, rotateY, rotateZ]);
      gl.uniformMatrix4fv(
        scene.program.modelMatrixUniform, gl.FALSE,
        scene.object.modelMatrix);
 
      var normalMatrix = mat3.create();
      mat3.normalFromMat4(
        normalMatrix,
        mat4.multiply(
          mat4.create(),
          scene.object.modelMatrix,
          scene.viewMatrix));
      gl.uniformMatrix3fv(
        scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
     
      gl.uniform1f(scene.program.spotLimit, Math.cos(limit));
      //gl.uniform1f(scene.program.spotLimit, limit);
 
      gl.bindBuffer(gl.ARRAY_BUFFER, scene.object.vertexBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, scene.object.vertexCount);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
      gl.useProgram(null);

      gl.useProgram(scene.textureProgram);
      drawTotems();
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);

      requestAnimationFrame(function(time) {
        render(time,timestamp);
      });
    }

    function drawTotems(){

      gl.bindTexture(gl.TEXTURE_2D, texture);

      var stride = (3)*4; //4 bytes per vertex

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      var a_position = gl.getAttribLocation(scene.textureProgram, 'a_position');
      gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_position);


      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      var aTextureCoord = gl.getAttribLocation(scene.textureProgram, 'a_texcoord');
      gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTextureCoord);

      
      gl.drawArrays(gl.TRIANGLE_FAN, 0, positionBuffer.numItems);

      //modelviewMatrix.set(viewMatrix).multiply(modelMatrix);
      //gl.uniformMatrix4fv(u_modelviewMatrix, false, modelviewMatrix.elements);
      //gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix.elements);

    }
 
    function createProgram(gl, shaderSpecs) {
      var program = gl.createProgram();
      for ( var i = 0 ; i < shaderSpecs.length ; i++ ) {
        var spec = shaderSpecs[i];
        var shader = gl.createShader(spec.type);
        gl.shaderSource(
          shader, document.getElementById(spec.container).text
        );
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw gl.getShaderInfoLog(shader);
        }
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw gl.getProgramInfoLog(program);
      }
      return program;
    }
     
    function init(object) {
      var c = document.getElementById("rendering-surface");
      c.height = h;
      c.width = w;
 
      var surface = document.getElementById('rendering-surface');
      gl = surface.getContext('experimental-webgl');
      gl.viewport(0,0,surface.width,surface.height);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
 
      var program = createProgram(
        gl,
        [{container: 'vertex-shader', type: gl.VERTEX_SHADER},
         {container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);

 
      gl.useProgram(program);

      program.positionAttribute = gl.getAttribLocation(program, 'pos');
      gl.enableVertexAttribArray(program.positionAttribute);
      program.normalAttribute = gl.getAttribLocation(program, 'normal');
      gl.enableVertexAttribArray(program.normalAttribute);
 
      var vertexBuffer = gl.createBuffer();
 
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, object.vertices, gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        program.positionAttribute, 3, gl.FLOAT, gl.FALSE, 
        Float32Array.BYTES_PER_ELEMENT * 6, 0);
      gl.vertexAttribPointer(
        program.normalAttribute, 3, gl.FLOAT, gl.FALSE,
        Float32Array.BYTES_PER_ELEMENT * 6,
        Float32Array.BYTES_PER_ELEMENT * 3);
 
      var viewMatrix = mat4.create();
      program.viewMatrixUniform = gl.getUniformLocation(
        program, 'viewMatrix');
      gl.uniformMatrix4fv(
        program.viewMatrixUniform, gl.FALSE, viewMatrix);
 
      var modelMatrix = mat4.create();
      mat4.identity(modelMatrix);
      //mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);
      program.modelMatrixUniform = gl.getUniformLocation(
        program, 'modelMatrix');
      gl.uniformMatrix4fv(
        program.modelMatrixUniform, gl.FALSE, modelMatrix);
 
      var normalMatrix = mat3.create();
      mat3.normalFromMat4(
        normalMatrix, mat4.multiply(
          mat4.create(), modelMatrix, viewMatrix));
      program.normalMatrixUniform = gl.getUniformLocation(
        program, 'normalMatrix');
      gl.uniformMatrix3fv(
        program.normalMatrixUniform, gl.FALSE, normalMatrix);
 
      program.ambientLightColourUniform = gl.getUniformLocation(
        program, 'ambientLightColour');
      program.directionalLightUniform = gl.getUniformLocation(
        program, 'directionalLight');
      program.materialSpecularUniform = gl.getUniformLocation(
        program, 'materialSpecular');
      object.materialAmbientUniform = gl.getUniformLocation(
        program, 'materialAmbient');
      object.materialDiffuseUniform = gl.getUniformLocation(
        program, 'materialDiffuse');
      object.shininessUniform = gl.getUniformLocation(
        program, 'shininess');

     program.spotCogitansDirection = gl.getUniformLocation(program, "spotCogitans");
     program.spotCogitansColor = gl.getUniformLocation(program, "cog_color");

      program.spotLimit = gl.getUniformLocation(program, "u_limit");


      var cogitanslightDirection = vec3.fromValues(0, -1, 0);
      gl.uniform3fv(program.spotCogitansDirection, cogitanslightDirection);

      var cogColor = vec3.fromValues(0.0, 0.0, 0.4);
      gl.uniform3fv(program.spotCogitansColor, cogColor);

      //limit = degToRad(180);
      gl.uniform1f(program.spotLimit, Math.cos(limit));

      var infColor = vec3.fromValues(0.3, 0.0, 0.51);

 
      var ambientLightColour = vec3.fromValues(ambientR, ambientG, ambientB);
      gl.uniform3fv(
        program.ambientLightColourUniform, ambientLightColour);
      var directionalLight = vec3.fromValues(0.5,0.1,0.1);
      gl.uniform3fv(
        program.directionalLightUniform, directionalLight);
      var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
      gl.uniform3fv(
        program.materialSpecularUniform, materialSpecular);
      gl.uniform1f(
        object.shininessUniform, object.material.shininess);
 
      gl.uniform1f(
        object.materialAmbientUniform, object.material.ambient);
      gl.uniform1f(
        object.materialDiffuseUniform, object.material.diffuse);
 
      object.modelMatrix = modelMatrix;
      object.vertexBuffer = vertexBuffer;
 
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);

      //Texture Program-----------
      var textureProgram = createProgram(
        gl,
        [{container: 'vertex-shader-texture', type: gl.VERTEX_SHADER},
         {container: 'fragment-shader-texture', type: gl.FRAGMENT_SHADER}]);
      //Load into textureProgram buffers

//      console.log(program);

      gl.useProgram(textureProgram);

      textureProgram.buffers = buffers;
      textureProgram.positionAttribute = gl.getAttribLocation(textureProgram, 'a_position');
      gl.enableVertexAttribArray(textureProgram.positionAttribute);
      
      textureProgram.textureAttribute = gl.getAttribLocation(textureProgram, 'a_texcoord');
      gl.enableVertexAttribArray(textureProgram.textureAttribute);

      textureProgram.uSampler = gl.getUniformLocation(textureProgram, 'uSampler');

      textureProgram.matrixLocation = gl.getUniformLocation(program, "u_matrix");
      textureProgram.textureLocation = gl.getUniformLocation(program, "u_texture");

      //Totems init ----------------
      initTotemBuffers(gl);

      gl.useProgram(null);

      scene = {
        program: program,
        textureProgram: textureProgram,
        object: object,
        start: Date.now(),
        //projectionMatrix: projectionMatrix,
        viewMatrix: viewMatrix
      };
      
      requestAnimationFrame(function(timestamp) {
        render(gl, scene, timestamp, 0);
      });
    }
 
    function loadMeshData(string) {
      var lines = string.split("\n");
      var positions = [];
      var normals = [];
      var vertices = [];
 
      for ( var i = 0 ; i < lines.length ; i++ ) {
        var parts = lines[i].trimRight().split(' ');
        if ( parts.length > 0 ) {
          switch(parts[0]) {
            case 'v':  positions.push(
              vec3.fromValues(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
              ));
              break;
            case 'vn':
              normals.push(
                vec3.fromValues(
                  parseFloat(parts[1]),
                  parseFloat(parts[2]),
                  parseFloat(parts[3])));
              break;
            case 'f': {
              var f1 = parts[1].split('/');
              var f2 = parts[2].split('/');
              var f3 = parts[3].split('/');
              Array.prototype.push.apply(
                vertices, positions[parseInt(f1[0]) - 1]);
              Array.prototype.push.apply(
                vertices, normals[parseInt(f1[2]) - 1]);
              Array.prototype.push.apply(
                vertices, positions[parseInt(f2[0]) - 1]);
              Array.prototype.push.apply(
                vertices, normals[parseInt(f2[2]) - 1]);
              Array.prototype.push.apply(
                vertices, positions[parseInt(f3[0]) - 1]);
              Array.prototype.push.apply(
                vertices, normals[parseInt(f3[2]) - 1]);
              break;
            }
          }
        }
      }
      console.log(
        "Loaded mesh with " + (vertices.length / 6) + " vertices");
      return {
        primitiveType: 'TRIANGLES',
        vertices: new Float32Array(vertices),
        vertexCount: vertices.length / 6,
        material: {ambient: 0.83, diffuse: 0.6, shininess: 20.0}
      };
    }
 
    function loadMesh(filename) {
      $.ajax({
        url: filename,
        dataType: 'text'
      }).done(function(data) {
        init(loadMeshData(data));
      }).fail(function() {
        alert('Faild to retrieve [' + filename + "]");
      });
    }
 
    $(document).ready(function() {
      //loadMesh('models/monkey.obj')
      //loadMesh('models/memorypalacetriangulated.obj')
      loadMesh('models/memorypalacev2.obj')
    });


function limitSliderChange(value){
  limit = degToRad(value);
      console.log(Math.cos(limit));
}

document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        //var canvasHMax = 
        //rotacion[0] += (0.2*(event.pageY)/h);
        if(rotacion[0]==0){
          //rotacion[0]=-360;
        }
        //console.log(rotacion[0]);
        rotacion[0] -= (0.2*(h-event.pageY)/h);
        var corrimiento = (0.04*(event.pageX)/w)-0.02;
        if(translacion[0]>-1.9 && corrimiento>0){
          translacion[0]-= corrimiento;
        }
        if(translacion[0]<1.9 && corrimiento<0){
          translacion[0]-= corrimiento;
        }
        /**if (rotacion[1]<=10 && rotacion[1]>=-10)
          rotacion[1] += (2*(event.pageX)/w)-1;
        else if(rotacion[1]>10){
          rotacion[1]=10;
        }
        else if(rotacion[1]<-10){
          rotacion[1]=-10;
        }*/
        //rotacion[0] += (2*(event.pageY)/600)-1;
        //console.log(event.pageX + ' '+event.pageY);
      }

function initTotemBuffers(gl){

      var positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0 ];

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      positionBuffer.itemSize = 3;
      positionBuffer.numItems = positions.length / 3;


      textureCoordinates = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0 ];

      textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
      textureCoordBuffer.itemSize = 2;
      textureCoordBuffer.numItems = textureCoordinates.length / 2;

      indices = [
        0,  1,  2,      0,  2,  3 ];    // front

      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);
      indexBuffer.itemSize = 1;
      indexBuffer.numItems = indices.length;

      texture = loadTexture(gl, 'models/coke.jpg');

      /*
      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
      };*/
}
function setGeometry(gl) {
  var positions = new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  /*
  var matrix = m4.identity();// m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }*/

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}


//Give the Audio element a stop function
HTMLAudioElement.prototype.stop = function()
{
    this.pause();
    this.currentTime = 0.0;
}
Audio.prototype.stop = function()
{
    this.pause();
    this.currentTime = 0.0;
}


//Texture load
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  console.log("Texture loaded "+url);

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
 