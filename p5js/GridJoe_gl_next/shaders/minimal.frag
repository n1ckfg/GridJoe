#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_target;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Target position
    vec2 targetUV = (u_target + u_resolution * 0.5) / u_resolution;

    float d = distance(uv, targetUV);

    vec3 color = vec3(0.0);

    // Red dot at target
    if (d < 0.03) {
        color = vec3(1.0, 0.0, 0.0);
    }

    // Gradient background
    color += vec3(uv.x * 0.2, uv.y * 0.2, 0.0);

    gl_FragColor = vec4(color, 1.0);
}
