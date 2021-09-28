import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class CategoriesController {

  public async index({ params }: HttpContextContract) {
    return Category.query().where('type', params.type).orderBy('name')
  }

  public async store({ request, response }: HttpContextContract) {
    const categorySchema = schema.create({
      name: schema.string({}, [rules.maxLength(250)]),
      type: schema.enum(['expense', 'income'] as const),
    })
    const payload = await request.validate({ schema: categorySchema })
    const category = await Category.create(payload)
    return response.status(201).send(category)
  }

  public async update({ params, request }: HttpContextContract) {
    const categorySchema = schema.create({
      name: schema.string({}, [rules.maxLength(250)]),
      type: schema.enum(['expense', 'income'] as const),
    })
    const payload = await request.validate({ schema: categorySchema })
    const category = await Category.findOrFail(params.id)
    return category.merge(payload).save()
  }

  public async destroy({ params }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return category
  }
}
