import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { LucidCamelCaseSerializerConfig } from '@ioc:Adonify/LucidCamelCaseSerializer'
import { join } from 'path'

type InstructionsState = LucidCamelCaseSerializerConfig

function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

function makeConfig(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic,
  state: InstructionsState
) {
  const configDirectory = app.directoriesMap.get('config') || 'config'
  const configPath = join(configDirectory, 'lucid-camel-case-serializer.ts')

  const template = new sink.files.MustacheFile(
    projectRoot,
    configPath,
    getStub('config/lucid-camel-case-serializer.txt')
  )

  if (template.exists()) {
    sink.logger.action('create').skipped(`${configPath} file already exists`)
  } else {
    template.apply(state).commit()

    sink.logger.action('create').succeeded(configPath)
  }
}

async function getAutoSerializeModels(sink: typeof sinkStatic) {
  return sink
    .getPrompt()
    .confirm('Do you want to auto serialize all Lucid models to camelCase?', { default: true })
}

async function getAutoSerializeDatabasePagination(sink: typeof sinkStatic) {
  return sink
    .getPrompt()
    .confirm('Do you want to auto serialize all Database module pagination to camelCase?', {
      default: true,
    })
}

export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  const state: InstructionsState = {
    autoSerializeModels: true,
    autoSerializeDatabasePagination: true,
  }

  state.autoSerializeModels = await getAutoSerializeModels(sink)
  state.autoSerializeDatabasePagination = await getAutoSerializeDatabasePagination(sink)

  makeConfig(projectRoot, app, sink, state)
}
