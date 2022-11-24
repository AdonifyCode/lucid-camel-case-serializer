# Lucid Camel Case Serializer
> Serialize your lucid models as camel cased with the minimal effort possible.

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

## Introduction

By default, AdonisJS serializes Lucid models as snake case 🐍 

This is fine for some API's, but changing that behaviour to camel case should be simple. 

This package does just that without having to write a single line of code 🐪

## Installation

```bash
npm i @adonify/lucid-camel-case-serializer

# Or using Yarn

yarn add @adonify/lucid-camel-case-serializer
```

## Configuration 
```bash
node ace configure @adonify/lucid-camel-case-serializer
```

## Usage

If you opted in to auto serialize models and database pagination during the configuration step, then you're already done!

This will attach the camel case naming strategy to the Database module and Lucid BaseModel class.

```ts
class Todo extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public thingToDo: string
}

const todo = await Todo.create({ thingToDo: 'Stop coding and walk the dog 🐕' })
console.log(todo.serialize()) // 👈 serialization results in camel case
```

Before adding this package: 
```json 
{
  id: 1,
  thing_to_do: "Stop coding and walk the dog 🐕"
}
```

After adding this package 🎉
```json 
{
  id: 1,
  thingToDo: "Stop coding and walk the dog 🐕"
}
```

Camel cased serialization will be applied to pagination on the models and the Database module as well.

```ts
const todos = await Todo.query().paginate(1, 50)
console.log(todos.serialize()) // 👈 paginated serialization 
```

Results in: 

```json
{
	meta: {
		total: 1,
		perPage: 50,
		currentPage: 1,
		lastPage: 1,
		firstPage: 1,
		firstPageUrl: "/?page=1",
		lastPageUrl: "/?page=1",
		nextPageUrl: null,
		previousPageUrl: null
	},
	data: [ { id: 1, thingToDo: "Stop coding and walk the dog 🐕" } ]
}
```

### Manually using the naming strategy

There are a few ways you can do this in your AdonisJS app.

### In a provider (suggested method)

```ts

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { default: CamelCaseNamingStrategy } = await import('@ioc:Adonify/LucidCamelCaseSerializer')

    // Registers the naming strategy on the base model
    const { BaseModel } = this.app.container.use('Adonis/Lucid/Orm')
    BaseModel.namingStrategy = new CamelCaseNamingStrategy()

    // Registers the naming strategy on the database paginator
    const Database = this.app.container.use('Adonis/Lucid/Database')
    Database.SimplePaginator.namingStrategy = {
      paginationMetaKeys() {
        return new CamelCaseNamingStrategy().paginationMetaKeys()
      },
    }
  }
}

```

Choosing to auto serialize in the configuration step will essentially do this for you in the package provider.

### Create a base model your models will extend and register the strategy

```ts
import CamelCaseNamingStrategy from "@ioc:Adonify/LucidCamelCaseSerializer";


export default class AppBaseModel extends BaseModel {
 public static namingStrategy = new CamelCaseNamingStrategy() // 👈 set as naming strategy
}
```

This will serialize your models but not paginated calls directly to the Database module.

### Add the naming strategy to specific models

```ts
import CamelCaseNamingStrategy from "@ioc:Adonify/LucidCamelCaseSerializer";

class Todo extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy() // 👈 set as naming strategy

  @column({ isPrimary: true })
  public id: number;

  @column()
  public thingToDo: string
}
```

### Adding the serializer to the Database paginator directly

```ts
import CamelCaseNamingStrategy from "@ioc:Adonify/LucidCamelCaseSerializer";
import Database from '@ioc:Adonis/Lucid/Database'

Database.SimplePaginator.namingStrategy = new CamelCaseNamingStrategy()
```

### Adding the paginator on the fly

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const paginator = await Database.from('todos').paginate()
paginator.namingStrategy = new CamelCaseNamingStrategy()

return paginator.toJSON()
```

## Issues

If you have a question or found a bug, feel free to [open an issue](https://github.com/AdonifyCode/lucid-camel-case-serializer/issues).

[npm-image]: https://img.shields.io/npm/v/lucid-camel-case-serializer.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/lucid-camel-case-serializer "npm"

[license-image]: https://img.shields.io/npm/l/lucid-camel-case-serializer?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
