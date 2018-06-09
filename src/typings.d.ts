/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "*.json" {
  const value: any = {
    abi: any,
    bytecode: any
  }

  export default value
}
