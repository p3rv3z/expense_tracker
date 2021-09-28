import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Expense from 'App/Models/Expense'

export default class ExpensesController {
  public async index({}: HttpContextContract) {
    return Expense.query().orderBy('id')
  }

  public async store({ request, response }: HttpContextContract) {
    const expenseSchema = schema.create({
      amount: schema.number([
        rules.unsigned(),
      ]),
      category_id: schema.number([
        rules.unsigned(),
        rules.exists({ table: 'categories', column: 'id'})
      ]),
    })
    const payload = await request.validate({ schema: expenseSchema })
    const expense = await Expense.create(payload)
    return response.status(201).send(expense)
  }
}
