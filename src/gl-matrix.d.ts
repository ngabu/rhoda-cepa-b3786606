// Override gl-matrix types to suppress TS1540 errors from outdated type declarations
declare module 'gl-matrix' {
  const glMatrix: any;
  export default glMatrix;
  export const mat2: any;
  export const mat2d: any;
  export const mat3: any;
  export const mat4: any;
  export const quat: any;
  export const quat2: any;
  export const vec2: any;
  export const vec3: any;
  export const vec4: any;
}
