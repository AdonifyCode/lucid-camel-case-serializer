declare module '@ioc:Adonify/LucidCamelCaseSerializer' {
  import { NamingStrategyContract } from '@ioc:Adonis/Lucid/Orm'

  export interface CamelCaseNamingStrategyContract {
    new (): NamingStrategyContract
  }

  const CamelCaseNamingStrategy: CamelCaseNamingStrategyContract

  export default CamelCaseNamingStrategy
}
