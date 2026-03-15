#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_tex;
uniform vec2 u_resolution;
uniform vec2 u_target;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y;

    vec4 texColor = texture2D(u_tex, uv);

    // Target position
    vec2 targetUV = (u_target + u_resolution * 0.5) / u_resolution;
    targetUV.y = 1.0 - targetUV.y;
    float d = distance(uv, targetUV);

    vec3 color = texColor.rgb;

    if (d < 0.03) {
        color = vec3(1.0, 0.0, 0.0);
    }

    gl_FragColor = vec4(color, 1.0);
}
