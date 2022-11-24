import { LucidModel, ModelRelations, NamingStrategyContract } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@poppinss/utils/build/helpers'

/**
 * Use camel case as the naming strategy for different model properties
 */
export class CamelCaseNamingStrategy implements NamingStrategyContract {
  public tableName(model: LucidModel): string {
    return string.pluralize(string.snakeCase(model.name))
  }

  public columnName(_: LucidModel, attributeName: string): string {
    return string.snakeCase(attributeName)
  }

  public serializedName(_: LucidModel, attributeName: string): string {
    return string.camelCase(attributeName)
  }

  public relationLocalKey(
    relation: ModelRelations['__opaque_type'],
    model: LucidModel,
    relatedModel: LucidModel
  ): string {
    if (relation === 'belongsTo') {
      return relatedModel.primaryKey
    }

    return model.primaryKey
  }

  public relationForeignKey(
    relation: ModelRelations['__opaque_type'],
    model: LucidModel,
    relatedModel: LucidModel
  ): string {
    if (relation === 'belongsTo') {
      return string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`)
    }

    return string.camelCase(`${model.name}_${model.primaryKey}`)
  }

  public relationPivotTable(_: 'manyToMany', model: LucidModel, relatedModel: LucidModel): string {
    return string.snakeCase([relatedModel.name, model.name].sort().join('_'))
  }

  public relationPivotForeignKey(_: 'manyToMany', model: LucidModel): string {
    return string.snakeCase(`${model.name}_${model.primaryKey}`)
  }

  public paginationMetaKeys(): {
    total: string
    perPage: string
    currentPage: string
    lastPage: string
    firstPage: string
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string
    previousPageUrl: string
  } {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    }
  }
}
