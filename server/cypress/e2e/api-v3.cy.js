/// <reference types="cypress" />

describe('GET /customers API', () => {
  const baseUrl = Cypress.env('API_URL')

  context('Requisições bem-sucedidas', () => {
    it('retorna estrutura correta e tipos padrão', () => {
      // Arrange
      // (nenhuma preparação necessária para defaults)

      // Act
      cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
        // Assert
        const { customers, pageInfo } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ id, name, employees, contactInfo, size, industry, address }) => {
          expect(id).to.be.a('number')
          expect(name).to.be.a('string')
          expect(employees).to.be.a('number')
          expect(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']).to.include(size)
          expect(['Logistics', 'Retail', 'Technology', 'HR', 'Finance']).to.include(industry)
          expect(!!(contactInfo === null || (typeof contactInfo === 'object' && contactInfo.name && contactInfo.email))).to.be.true
          expect(!!(address === null || (typeof address === 'object' && address.street && address.city && address.state && address.zipCode && address.country))).to.be.true
        })
        expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
        expect(pageInfo.currentPage).to.be.a('number')
        expect(pageInfo.totalPages).to.be.a('number')
        expect(pageInfo.totalCustomers).to.be.a('number')
      })
    })

    it('retorna apenas clientes do tipo Medium ao filtrar por size', () => {
      // Arrange
      const size = 'Medium'

      // Act
      cy.request('GET', `${baseUrl}/customers?size=${size}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ size, employees }) => {
          expect(size).to.eq('Medium')
          expect(employees).to.be.gte(100)
          expect(employees).to.be.lt(1000)
        })
      })
    })

    it('retorna apenas clientes do tipo Enterprise ao filtrar por size', () => {
      // Arrange
      const size = 'Enterprise'

      // Act
      cy.request('GET', `${baseUrl}/customers?size=${size}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ size, employees }) => {
          expect(size).to.eq('Enterprise')
          expect(employees).to.be.gte(1000)
          expect(employees).to.be.lt(10000)
        })
      })
    })

    it('retorna apenas clientes do setor Technology ao filtrar por industry', () => {
      // Arrange
      const industry = 'Technology'

      // Act
      cy.request('GET', `${baseUrl}/customers?industry=${industry}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ industry }) => {
          expect(industry).to.eq('Technology')
        })
      })
    })

    it('retorna apenas clientes do setor HR ao filtrar por industry', () => {
      // Arrange
      const industry = 'HR'

      // Act
      cy.request('GET', `${baseUrl}/customers?industry=${industry}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ industry }) => {
          expect(industry).to.eq('HR')
        })
      })
    })

    it('retorna apenas clientes do tipo Large Enterprise ao filtrar por size', () => {
      // Arrange
      const size = 'Large Enterprise'

      // Act
      cy.request('GET', `${baseUrl}/customers?size=${size}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ size, employees }) => {
          expect(size).to.eq('Large Enterprise')
          expect(employees).to.be.gte(10000)
          expect(employees).to.be.lt(50000)
        })
      })
    })

    it('retorna apenas clientes do tipo Very Large Enterprise ao filtrar por size', () => {
      // Arrange
      const size = 'Very Large Enterprise'

      // Act
      cy.request('GET', `${baseUrl}/customers?size=${size}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        customers.forEach(({ size, employees }) => {
          expect(size).to.eq('Very Large Enterprise')
          expect(employees).to.be.gte(50000)
        })
      })
    })

    it('retorna clientes paginados corretamente', () => {
      // Arrange
      const page = 2

      // Act
      cy.request('GET', `${baseUrl}/customers?page=${page}`).then(({ status, body }) => {
        // Assert
        const { pageInfo } = body
        expect(status).to.eq(200)
        expect(pageInfo.currentPage).to.eq(page)
      })
    })

    it('retorna o número correto de clientes por página', () => {
      // Arrange
      const limit = 5

      // Act
      cy.request('GET', `${baseUrl}/customers?limit=${limit}`).then(({ status, body }) => {
        // Assert
        const { customers } = body
        expect(status).to.eq(200)
        expect(Array.isArray(customers)).to.be.true
        expect(customers.length).to.be.at.most(limit)
      })
    })
  })

  context('Cenários de erro', () => {
    it('retorna 400 para page igual a 0', () => {
      // Arrange
      const page = 0

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?page=${page}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })

    it('retorna 400 para page igual a -1', () => {
      // Arrange
      const page = -1

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?page=${page}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })

    it('retorna 400 para limit igual a 0', () => {
      // Arrange
      const limit = 0

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?limit=${limit}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })

    it('retorna 400 para limit igual a -1', () => {
      // Arrange
      const limit = -1

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?limit=${limit}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })

    it('retorna 400 para size não suportado', () => {
      // Arrange
      const size = 'Gigantic'

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?size=${size}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })

    it('retorna 400 para industry não suportado', () => {
      // Arrange
      const industry = 'Food'

      // Act
      cy.request({ method: 'GET', url: `${baseUrl}/customers?industry=${industry}`, failOnStatusCode: false }).then(({ status, body }) => {
        // Assert
        const { error } = body
        expect(status).to.eq(400)
        expect(error).to.exist
      })
    })
  })
})