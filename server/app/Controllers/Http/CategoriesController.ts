import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class CategoriesController {

  public async index({ request }: HttpContextContract) {

    const categories = Category.query().orderBy('id')

    const type = request.input('type')

    if(type != 'all'){
      await categories.where('type', type)
    }

    return categories
  }

  public async store({ request, response }: HttpContextContract) {
    const categorySchema = schema.create({
      name: schema.string({}, [rules.maxLength(250)]),
      type: schema.enum(['expense', 'income'] as const),
    })
    const payload = await request.validate({ schema: categorySchema, messages: {
      required: 'The {{ field }} field is required.',
      'maxLength': 'The {{ field }} must not be greater than {{ options.maxLength }} characters.',
      enum: 'The value of {{ field }} must be in {{ options.choices }}.'
    } })
    const category = await Category.create(payload)
    return response.status(201).send(category)
  }

  public async update({ params, request }: HttpContextContract) {
    const categorySchema = schema.create({
      name: schema.string({}, [rules.maxLength(250)]),
      type: schema.enum(['expense', 'income'] as const),
    })
    const payload = await request.validate({ schema: categorySchema, messages: {
      required: 'The {{ field }} field is required.',
      'maxLength': 'The {{ field }} must not be greater than {{ options.maxLength }} characters.',
      enum: 'The value of {{ field }} must be in {{ options.choices }}.'
    } })
    const category = await Category.findOrFail(params.id)
    return category.merge(payload).save()
  }

  public async destroy({ params }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return category
  }

  public async rank({ request }: HttpContextContract) {

    const relations = {
      expense: 'expenses',
      income: 'incomes'
    }

    const type = request.input('type')

    const categories = await Category
      .query()
      .where('type', type)
      .select('id', 'name')
      .withAggregate(relations[type], (query) => {
        query.sum('amount').as('total_amount')
      })
      .orderBy('total_amount', 'desc')
    return categories
  }
}
