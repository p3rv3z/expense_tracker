import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Expense from 'App/Models/Expense'

export default class ExpensesController {
  public async index({ request }: HttpContextContract) {
    const expenses = Expense.query().preload('category').orderBy('id')
    const category_id = request.input('category_id')

    if (category_id != 'all')
      await expenses.where('category_id', category_id)

    return expenses
  }

  public async store({ request, response }: HttpContextContract) {
    const expenseSchema = schema.create({
      amount: schema.number([
        rules.unsigned(),
      ]),
      category_id: schema.number([
        rules.unsigned(),
        rules.exists({ table: 'incomes', column: 'id' })
      ]),
    })
    const payload = await request.validate({
      schema: expenseSchema, messages: {
        required: 'The {{ field }} field is required.',
        number: 'The {{ field }} field should be a number.',
        exists: 'The {{ field}} should be exist in categories table.'
      }
    })

    const data = await Expense.create(payload)
    const expense = await Expense.query().where('id', data.id).preload('category').first()

    return response.status(201).send(expense)
  }
}
