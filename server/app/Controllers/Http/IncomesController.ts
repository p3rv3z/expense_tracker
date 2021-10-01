import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Income from 'App/Models/Income'

export default class IncomesController {
  public async index({request}: HttpContextContract) {

    const incomes = Income.query().preload('category').orderBy('id')
    const category_id = request.input('category_id')

    if(category_id != 'all')
      await incomes.where('category_id', category_id)

    return incomes
  }

  public async store({ request, response }: HttpContextContract) {
    const incomeSchema = schema.create({
      amount: schema.number([
        rules.unsigned(),
      ]),
      category_id: schema.number([
        rules.unsigned(),
        rules.exists({ table: 'categories', column: 'id'})
      ]),
    })

    const payload = await request.validate({ schema: incomeSchema, messages: {
      required: 'The {{ field }} field is required.',
      number: 'The {{ field }} field should be a number.',
      exists: 'The {{ field}} should be exist in categories table.'
    } })

    const data = await Income.create(payload)
    const income = await Income.query().where('id', data.id).preload('category').first()
    return response.status(201).send(income)
  }
}
