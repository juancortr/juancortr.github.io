var textureProgram = createProgram(
        gl,
        [{container: 'vertex-shader-texture', type: gl.VERTEX_SHADER},
         {container: 'fragment-shader-texture', type: gl.FRAGMENT_SHADER}]);
      //Load into textureProgram buffers
      textureProgram.buffers = buffers;
      textureProgram.positionAttribute = gl.getAttribLocation(textureProgram, 'a_position');
      gl.enableVertexAttribArray(textureProgram.positionAttribute);
      
      textureProgram.textureAttribute = gl.getAttribLocation(textureProgram, 'a_texcoord');
      gl.enableVertexAttribArray(textureProgram.textureAttribute);

      textureProgram.uSampler = gl.getUniformLocation(textureProgram, 'uSampler');
      






// Fill the buffer with texture coordinates for the F.
function setTexcoords(gl) {
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
        // left column front
        0, 0,
        0, 1,
        1, 1,
        0, 1
       ]),
       gl.STATIC_DRAW);
}






      //Add texture shader
      gl.useProgram(scene.textureProgram);
      //Totem drawing
      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute
      {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.textureProgram.buffers.position);
        gl.vertexAttribPointer(
            scene.textureProgram.positionAttribute,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(scene.textureProgram.positionAttribute);
      }
      //console.log(scene.textureProgram.buffers.position);
      //console.log(scene.textureProgram.positionAttribute);

      // Tell WebGL how to pull out the texture coordinates from
      // the texture coordinate buffer into the textureCoord attribute.
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            scene.textureProgram.textureAttribute,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(scene.textureProgram.textureAttribute);
      }

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
/*
      // Tell WebGL to use our program when drawing

      gl.useProgram(programInfo.program);

      // Set the shader uniforms

      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix);

      // Specify the texture to map onto the faces.
*/
      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);

      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(scene.textureProgram.uSampler, 0);

      {
        const vertexCount = 4;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
      
      gl.useProgram(null);