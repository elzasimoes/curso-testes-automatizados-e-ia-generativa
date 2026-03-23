/// <reference types="cypress" />

describe('GET /customers API', () => {
  const baseUrl = Cypress.env('API_URL')

  it('retorna clientes paginados e pageInfo por padrão', () => {
    cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
      const { customers, pageInfo } = body
      expect(status).to.eq(200)
      expect(customers).to.be.an('array')
      expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
      expect(pageInfo.currentPage).to.eq(1)
    })
  })

  it('limita o número de clientes por página', () => {
    cy.request('GET', `${baseUrl}/customers?limit=5`).then(({ status, body }) => {
      const { customers } = body
      expect(status).to.eq(200)
      expect(customers.length).to.be.at.most(5)
    })
  })

  it('filtra clientes por size', () => {
    cy.request('GET', `${baseUrl}/customers?size=Medium`).then(({ status, body }) => {
      const { customers } = body
      expect(status).to.eq(200)
      customers.forEach(({ size }) => {
        expect(size).to.eq('Medium')
      })
    })
  })

  it('filtra clientes por industry', () => {
    cy.request('GET', `${baseUrl}/customers?industry=Technology`).then(({ status, body }) => {
      const { customers } = body
      expect(status).to.eq(200)
      customers.forEach(({ industry }) => {
        expect(industry).to.eq('Technology')
      })
    })
  })

  it('filtra clientes por size e industry', () => {
    cy.request('GET', `${baseUrl}/customers?size=Enterprise&industry=Finance`).then(({ status, body }) => {
      const { customers } = body
      expect(status).to.eq(200)
      customers.forEach(({ size, industry }) => {
        expect(size).to.eq('Enterprise')
        expect(industry).to.eq('Finance')
      })
    })
  })

  it('paginacao funciona corretamente', () => {
    cy.request('GET', `${baseUrl}/customers?page=2&limit=3`).then(({ status, body }) => {
      const { pageInfo, customers } = body
      expect(status).to.eq(200)
      expect(pageInfo.currentPage).to.eq(2)
      expect(customers.length).to.be.at.most(3)
    })
  })

  it('retorna 400 para page ou limit inválidos', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?page=-1&limit=0`,
      failOnStatusCode: false
    }).then(({ status, body }) => {
      const { error } = body
      expect(status).to.eq(400)
      expect(error).to.exist
    })
  })

  it('retorna 400 para size não suportado', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?size=Gigantic`,
      failOnStatusCode: false
    }).then(({ status, body }) => {
      const { error } = body
      expect(status).to.eq(400)
      expect(error).to.exist
    })
  })

  it('retorna 400 para industry não suportado', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?industry=Food`,
      failOnStatusCode: false
    }).then(({ status, body }) => {
      const { error } = body
      expect(status).to.eq(400)
      expect(error).to.exist
    })
  })

  it('contactInfo e address podem ser nulos', () => {
    cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
      const { customers } = body
      expect(status).to.eq(200)
      customers.forEach(({ contactInfo, address }) => {
        expect(contactInfo === null || typeof contactInfo === 'object').to.be.true
        expect(address === null || typeof address === 'object').to.be.true
      })
    })
  })
})