import { LucidCamelCaseSerializerConfig } from '@ioc:Adonify/LucidCamelCaseSerializer'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class LucidCamelCaseSerializerProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonify/LucidCamelCaseSerializer', () => {
      const { CamelCaseNamingStrategy } = require('../src/Strategies/CamelCaseNamingStrategy')
      return CamelCaseNamingStrategy
    })
  }

  public async boot() {
    const { CamelCaseNamingStrategy } = require('../src/Strategies/CamelCaseNamingStrategy')
    const config: LucidCamelCaseSerializerConfig = this.app.container
      .resolveBinding('Adonis/Core/Config')
      .get('lucid-camel-case-serializer', {})

    if (config.autoSerializeModels) {
      const { BaseModel } = this.app.container.use('Adonis/Lucid/Orm')
      BaseModel.namingStrategy = new CamelCaseNamingStrategy()
    }

    if (config.autoSerializeDatabasePagination) {
      const Database = this.app.container.use('Adonis/Lucid/Database')
      Database.SimplePaginator.namingStrategy = {
        paginationMetaKeys() {
          return new CamelCaseNamingStrategy().paginationMetaKeys()
        },
      }
    }
  }
}
