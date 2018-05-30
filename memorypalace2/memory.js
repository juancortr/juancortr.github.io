    // Modificaciones de camara
var rotacionPrimeraPersona;
var translacion = [0, 0, 0, 0];
var rotacion = [0, 0, 0, 0];
var translacionParcial = [0, 0, 0, 0];
var rotacionpParcial = [0, 0, 0, 0];

var velcambiot = 0.5;
var velcambiotr = 1;
var avance = 1;


    function degToRad(degrees) 
    {
      return degrees * Math.PI / 180;
    }
    function GetChar (event){
      var chCode = ('key' in event) ? event.key : event.keyCode;
      if(chCode == '1'){
        //Centro
        translacion = [0, 0, 0, 0];
        rotacion = [0, 0, 0, 0];
      }
      else if(chCode == '2'){
        //Plano General
        translacion = [0, 0, -100, 0];
        rotacion = [0, -90, 0, 0];
      }
      else if(chCode == '3'){
        //Primera Persona
        translacion = [0, 70, 0, 0];
        rotacion = [0, 180, 0, 0];
      }
      else if(chCode == '4'){
        //Plano General
        translacion = [0, 0, -100, 0];
        rotacion = [0, 90, 0, 0];
      }
    }

    function keyPressedChar(event){
      var chCode = ('key' in event) ? event.key : event.keyCode;      
      if (chCode == 'w'){
        translacion[2]+= avance;
      }
      else if (chCode == 'a'){
        translacion[0]+= avance;
      }
      else if (chCode == 's'){
        translacion[2]-= avance;
      }
      else if (chCode == 'd'){
        translacion[0]-= avance;
      }
    }

    document.onkeydown = GetChar;
    document.onkeypress = keyPressedChar;

    function render(gl,scene,timestamp,previousTimestamp) {
      var surface = document.getElementById('rendering-surface')
 
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(scene.program);
 
      var delta = (0.025 * Math.PI) / (timestamp - previousTimestamp);
 
      var light = vec3.fromValues( 5,5,-5);
      var lightExtensa = vec3.fromValues(0,0);
      var lightCogitans = vec3.fromValues();
      var lightInfinita = vec3.fromValues();
 
      gl.uniform3fv(scene.program.directionalLightUniform, light);
 
      //var rotateX = ($('#rotate-x').val() - 5) / 10;
      //var rotateX = 0.1;
      var rotateX = 0;
      var rotateY = 0; 
      var rotateZ = 0; 
      //var rotateY = ($('#rotate-y').val() - 5) / 10;
      //var rotateZ = ($('#rotate-z').val() - 5) / 10;

      var projectionMatrix = mat4.create();
      //mat4.perspective(projectionMatrix, 0.75, surface.width/surface.height, 0.1, 100.0 );
      mat4.perspective(projectionMatrix, Math.PI/2, surface.width/surface.height,0.1, 200);


      for(var i = 0; i <4 ;i++)
      {
        var signo;
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
          if (rotacionpParcial[i] < rotacion[i])
            rotacionpParcial[i] = rotacion[i];
        }
        else if (rotacionpParcial[i] < rotacion[i])
        {
          rotacionpParcial[i] += velcambiotr;
          if (rotacionpParcial[i] > rotacion[i])
            rotacionpParcial[i] = rotacion[i];
        }
      }

      mat4.translate(projectionMatrix,projectionMatrix, translacionParcial);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacionpParcial[0]), [1,0,0]);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacionpParcial[1]), [0,1,0]);
      mat4.rotate(projectionMatrix,projectionMatrix, degToRad(rotacionpParcial[2]), [0,0,1]);

 
      projectionMatrixUniform = gl.getUniformLocation(scene.program, 'projectionMatrix');
      gl.uniformMatrix4fv(projectionMatrixUniform, gl.FALSE,projectionMatrix);
      gl.uniformMatrix4fv(projectionMatrixUniform, gl.FALSE, projectionMatrix);

      mat4.rotate(
        scene.object.modelMatrix, scene.object.modelMatrix, delta,
        [rotateX, rotateY, rotateZ]);
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
 
      gl.bindBuffer(gl.ARRAY_BUFFER, scene.object.vertexBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, scene.object.vertexCount);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
      gl.useProgram(null);
      requestAnimationFrame(function(time) {
        render(gl,scene,time,timestamp);
      });
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
 
      var surface = document.getElementById('rendering-surface');
      var gl = surface.getContext('experimental-webgl');
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

     program.spotExtensaDirection = gl.getUniformLocation(program, "spotExtensa");
     program.spotExtensaColor = gl.getUniformLocation(program, "ext_color");

      program.spotLimit = gl.getUniformLocation(program, "u_limit");


      var cogitanslightDirection = vec3.fromValues(0, -1, 0);
      gl.uniform3fv(program.spotCogitansDirection, cogitanslightDirection);

      var cogColor = vec3.fromValues(0.0, 0.0, 0.4);
      gl.uniform3fv(program.spotCogitansColor, cogColor);

      var extensalightDirection = vec3.fromValues(0.5, 0, 0);
      gl.uniform3fv(program.spotExtensaDirection, extensalightDirection);

      var extColor = vec3.fromValues(1.0, 0.0, 0.0);
      gl.uniform3fv(program.spotExtensaColor, extColor);

      var limit = degToRad(120);
      gl.uniform1f(program.spotLimit, Math.cos(limit));

      var infColor = vec3.fromValues(0.3, 0.0, 0.51);

 
      var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
      gl.uniform3fv(
        program.ambientLightColourUniform, ambientLightColour);
      var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
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
 
      var scene = {
        program: program,
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
      loadMesh('models/memorypalacetriangulated.obj')
    });


 