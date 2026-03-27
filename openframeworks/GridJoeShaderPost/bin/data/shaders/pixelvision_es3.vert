
precision highp float;

// these are for the programmable pipeline system
uniform mat4 modelViewProjectionMatrix;
attribute vec4 position;
attribute vec2 texcoord;

varying vec2 varyingtexcoord;

void main()
{
    varyingtexcoord = texcoord;
    gl_Position = modelViewProjectionMatrix * position;
}
