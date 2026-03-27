
precision highp float;

uniform sampler2D tex0;
uniform vec2 texSize;

varying vec2 varyingtexcoord;

const float gamma = 1.2;
const float posterizeLevels = 90.0;

const float kernel0 = 0.10;
const float kernel1 = 0.20;
const float kernel2 = 0.40;
const float kernel3 = 0.20;
const float kernel4 = 0.10;

float getLuminance(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

// https://github.com/dmnsgn/glsl-tone-map
float tone_map_aces(float x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

float map(float s, float a1, float a2, float b1, float b2) {
    return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
}

vec3 adjustGamma(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}

void main() {
    vec2 uv = varyingtexcoord;
    vec2 texelSize = vec2(1.0 / texSize.x, 1.0 / texSize.y);

    vec3 centerColor = texture2D(tex0, uv).xyz;
    vec3 leftColor = texture2D(tex0, uv - vec2(texelSize.x, 0.0)).xyz;
    vec3 rightColor = texture2D(tex0, uv + vec2(texelSize.x, 0.0)).xyz;
    vec3 topColor = texture2D(tex0, uv + vec2(0.0, texelSize.y)).xyz;
    vec3 bottomColor = texture2D(tex0, uv - vec2(0.0, texelSize.y)).xyz;

    vec3 blurredColor = topColor * kernel0 + leftColor * kernel1 + centerColor * kernel2 + rightColor * kernel3 + bottomColor * kernel4;
    vec3 sharpenedColor = blurredColor * 5.0 - (leftColor + rightColor + topColor + bottomColor);
    vec3 posterizedColor = floor(sharpenedColor * posterizeLevels) / posterizeLevels;

    float luminance0 = tone_map_aces(getLuminance(posterizedColor));
    float luminance1 = pow(map(luminance0, 0.05, 0.95, 0.0, 1.0), 1.0 / gamma);

    gl_FragColor = vec4(luminance1, luminance1, luminance1 + 0.1, 1.0);
}
