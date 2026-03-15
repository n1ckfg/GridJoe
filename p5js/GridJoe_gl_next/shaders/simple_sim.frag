#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_state;
uniform vec2 u_resolution;
uniform vec2 u_target;
uniform float u_targetClicked;
uniform float u_time;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y;
    vec2 texel = 1.0 / u_resolution;

    vec4 current = texture2D(u_state, uv);

    // Simple test: just pass through with decay, and light up near target
    vec2 targetUV = (u_target + u_resolution * 0.5) / u_resolution;
    targetUV.y = 1.0 - targetUV.y;

    float d = distance(uv, targetUV);

    float state = current.r * 0.98; // decay
    float colorVal = current.a;

    if (colorVal < 0.01) {
        colorVal = 0.5 + 0.5 * hash(gl_FragCoord.xy);
    }

    // Light up near target when clicked
    if (d < 0.02 && u_targetClicked > 0.5) {
        state = 0.5;
    }

    // Simple spread from neighbors
    vec4 n = texture2D(u_state, uv + vec2(0.0, texel.y));
    vec4 s = texture2D(u_state, uv + vec2(0.0, -texel.y));
    vec4 e = texture2D(u_state, uv + vec2(texel.x, 0.0));
    vec4 w = texture2D(u_state, uv + vec2(-texel.x, 0.0));

    float neighborSum = n.r + s.r + e.r + w.r;
    if (neighborSum > 0.5 && state < 0.1) {
        float roll = hash(gl_FragCoord.xy + vec2(u_time, 0.0));
        if (roll < 0.3) {
            state = 0.5;
        }
    }

    gl_FragColor = vec4(state, 0.0, u_time, colorVal);
}
