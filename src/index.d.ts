declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
// declare module "*.scss";
// declare module "*.sass";
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
