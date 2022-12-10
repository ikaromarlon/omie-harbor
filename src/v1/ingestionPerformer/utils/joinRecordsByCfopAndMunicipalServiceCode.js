const joinRecordsByCfopAndMunicipalServiceCode = (acc, record, i, records) => {
  const stored = acc.some(e => e.customerId === record.customerId && e.externalId === record.externalId && e.type === record.type && e.departmentId === record.departmentId && e.productServiceId === record.productServiceId && e.cfop === record.cfop && e.municipalServiceCode === record.municipalServiceCode)
  const pending = records.filter(e => e.customerId === record.customerId && e.externalId === record.externalId && e.type === record.type && e.departmentId === record.departmentId && e.productServiceId === record.productServiceId && e.cfop === record.cfop && e.municipalServiceCode === record.municipalServiceCode)
  if (!stored) {
    acc.push({
      ...record,
      ...(pending.reduce((sum, e) => ({
        grossValue: sum.grossValue + e.grossValue,
        netValue: sum.netValue + e.netValue,
        discounts: sum.discounts + e.discounts,
        taxAmount: sum.taxAmount + e.taxAmount,
        taxes: {
          ir: sum.taxes.ir + e.taxes.ir,
          pis: sum.taxes.pis + e.taxes.pis,
          cofins: sum.taxes.cofins + e.taxes.cofins,
          csll: sum.taxes.csll + e.taxes.csll,
          icms: sum.taxes.icms + e.taxes.icms,
          iss: sum.taxes.iss + e.taxes.iss
        }
      }), {
        grossValue: 0,
        netValue: 0,
        discounts: 0,
        taxAmount: 0,
        taxes: {
          ir: 0,
          pis: 0,
          cofins: 0,
          csll: 0,
          icms: 0,
          iss: 0
        }
      }))
    })
  }
  return acc
}

module.exports = joinRecordsByCfopAndMunicipalServiceCode
