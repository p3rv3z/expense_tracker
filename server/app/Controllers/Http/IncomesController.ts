import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Income from 'App/Models/Income'

export default class IncomesController {
  public async index({request}: HttpContextContract) {

    const income = Income.query().orderBy('id')
    const category = request.input('category')

    if(category != null || category != '')
      await income.whereHas('category', query => {
        query.where('name', category).where('type', 'income')
      })

    return income
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
