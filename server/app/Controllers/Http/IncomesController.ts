import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Income from 'App/Models/Income'

export default class IncomesController {
  public async index({}: HttpContextContract) {
    return Income.query().orderBy('id')
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
    const payload = await request.validate({ schema: incomeSchema })
    const income = await Income.create(payload)
    return response.status(201).send(income)
  }
}
