The package has been configured successfully. If you opted to not auto serialize your models and pagination, make sure to register the naming strategy manually for your use cases. 

There are a few ways you can do this in your Adonis JS app.

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

Choosing to auto serialize will essentially do this for you in the package provider.

### Create a base model your models will extend and register the strategy

```ts
import CamelCaseNamingStrategy from "@ioc:Adonify/LucidCamelCaseSerializer";


export default class AppBaseModel extends BaseModel {
 public static namingStrategy = new CamelCaseNamingStrategy() // 👈 set as naming strategy
}
```

This will serialize your models but not paginated calls directly to the Database module.

### Adding the serializer to the Database paginator directly

```ts
import CamelCaseNamingStrategy from "@ioc:Adonify/LucidCamelCaseSerializer";
import Database from '@ioc:Adonis/Lucid/Database'

Database.SimplePaginator.namingStrategy = new CamelCaseNamingStrategy()
```