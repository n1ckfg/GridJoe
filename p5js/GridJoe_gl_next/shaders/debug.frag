#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_state;
uniform vec2 u_resolution;
uniform vec2 u_target;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y;

    vec4 state = texture2D(u_state, uv);

    // Show raw state texture - any non-zero values will appear
    vec3 color = state.rgb;

    // Also show target position as a bright spot
    vec2 targetUV = (u_target + u_resolution * 0.5) / u_resolution;
    targetUV.y = 1.0 - targetUV.y;
    float d = distance(uv, targetUV);
    if (d < 0.02) {
        color = vec3(1.0, 0.0, 0.0); // Red dot for target
    }

    // Show a gradient to prove shader is working
    color += vec3(uv.x * 0.1, uv.y * 0.1, 0.0);

    gl_FragColor = vec4(color, 1.0);
}
