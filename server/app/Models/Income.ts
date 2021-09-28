import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'

export default class Income extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: number

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>
}
