// const { sortArray } = require('../../../common/helpers')

// const deleteAll = async ({ company, omieDepartments, successes, errors }) => {
//   const toDelete = omieDepartments.filter(e => e.estrutura.length > 7).sort(sortArray('estrutura', 'desc'))

//   for (let i = 0; i < toDelete.length; i++) {
//     try {
//       await omieService.deleteDepartment(company.credentials, { externalId: toDelete[i].codigo }, true)

//       // await repositories.departments.deleteOne({ companyId: company._id, externalId: toDelete[i].codigo })

//       successes.push({ record: toDelete[i] })

//       if (process.env.VSCODE_IPC_HOOK_CLI) console.log(`${i + 1} of ${toDelete.length} deleted`)
//     } catch (error) {
//       if (error?.data?.message?.toLowerCase()?.indexOf('timeout') >= 0 || error?.data?.response?.data?.faultcode === 'SOAP-ENV:Server') {
//         throw error
//       }
//       errors.push({ record: toDelete[i], message: error.message })
//     }
//   }

//   if (errors.length) {
//     return {
//       message: `${successes.length} record(s) were deleted successfully, but ${errors.length} record(s) has been failed.`,
//       errors
//     }
//   }

//   return {
//     success: true,
//     message: `All ${successes.length} record(s) were deleted successfully!`
//   }
// }

module.exports = async ({ data, userId, company, omieService, repositories, omieMappings, errors, successes }) => {
  const insertFlow = async ({ record, i, records, omieDepartments, action }) => {
    if (record.id) {
      errors.push({ ...record, action, message: 'Record with "insert" action should not have id field' })
      return
    }

    const parentOmieDepartment = omieDepartments.find(e => e.estrutura.length === (record.structure.length - 4) && record.structure.indexOf(e.estrutura) === 0)

    if (!parentOmieDepartment) {
      errors.push({ ...record, action, message: 'Parent not found' })
      return
    }

    try {
      const createdDepartment = await omieService.createDepartment(
        company.credentials,
        {
          externalParentId: String(parentOmieDepartment.codigo),
          description: record.description
        },
        true
      )

      const department = omieMappings.department({
        omieDepartment: createdDepartment,
        companyId: company._id
      })

      department.createdBy = userId
      department.updatedBy = userId

      await repositories.departments.createOrUpdateOne({ companyId: company._id, externalId: department.externalId }, department)

      omieDepartments.push(createdDepartment)

      successes.push({ ...record, action })

      if (process.env.VSCODE_IPC_HOOK_CLI) console.log(`${i + 1} of ${records.length} processed`)
    } catch (error) {
      if (error?.data?.message?.toLowerCase()?.indexOf('timeout') >= 0 || error?.data?.response?.data?.faultcode === 'SOAP-ENV:Server') {
        throw error
      }
      errors.push({ ...record, action, message: error.message })
    }
  }

  const updateFlow = async ({ record, i, records, omieDepartments, action }) => {
    if (!record.id) {
      errors.push({ ...record, action, message: 'Record with "update" action requires id field' })
      return
    }

    const department = await repositories.departments.findOne({ _id: record.id })

    if (!department) {
      errors.push({ ...record, action, message: 'Record not found' })
      return
    }

    try {
      department.description = record.description

      const updatedDepartment = await omieService.updateDepartment(company.credentials, department, true)

      department.updatedBy = userId
      department.updatedAt = new Date()

      await repositories.departments.createOrUpdateOne({ _id: record.id }, department)

      const depIndex = omieDepartments.findIndex(e => String(e.codigo) === department.externalId)
      omieDepartments[depIndex] = updatedDepartment

      successes.push({ ...record, action })

      if (process.env.VSCODE_IPC_HOOK_CLI) console.log(`${i + 1} of ${records.length} processed`)
    } catch (error) {
      if (error?.data?.message?.toLowerCase()?.indexOf('timeout') >= 0 || error?.data?.response?.data?.faultcode === 'SOAP-ENV:Server') {
        throw error
      }
      errors.push({ ...record, action, message: error.message })
    }
  }

  const deleteFlow = async ({ record, i, records, omieDepartments, action }) => {
    if (!record.id) {
      errors.push({ ...record, action, message: 'Record with "delete" action requires id field' })
      return
    }

    const department = await repositories.departments.findOne({ _id: record.id })

    if (!department) {
      errors.push({ ...record, action, message: 'Record not found' })
      return
    }

    try {
      await omieService.deleteDepartment(company.credentials, department, true)

      await repositories.departments.deleteOne({ _id: record.id })

      const depIndex = omieDepartments.findIndex(e => String(e.codigo) === department.externalId)
      delete omieDepartments[depIndex]

      successes.push({ ...record, action })

      if (process.env.VSCODE_IPC_HOOK_CLI) console.log(`${i + 1} of ${records.length} processed`)
    } catch (error) {
      if (error?.data?.message?.toLowerCase()?.indexOf('timeout') >= 0 || error?.data?.response?.data?.faultcode === 'SOAP-ENV:Server') {
        throw error
      }
      errors.push({ ...record, action, message: error.message })
    }
  }

  const omieDepartments = (await omieService.getDepartments(company.credentials, {}, true))

  const records = data
  // .filter(e => !omieDepartments.some(dep => dep.estrutura === e.structure))

  const flows = {
    insert: insertFlow,
    update: updateFlow,
    delete: deleteFlow
  }

  for (let i = 0; i < records.length; i++) {
    const { action, ...record } = records[i]
    await flows[action]({ record, i, records, omieDepartments, action })
  }
}
