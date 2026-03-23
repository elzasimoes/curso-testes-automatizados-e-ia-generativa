import { test, expect } from '@playwright/test'

const baseUrl = process.env.API_URL

test.describe('GET /customers API', () => {
  test.describe('Requisições bem-sucedidas', () => {
    test('retorna estrutura correta e tipos padrão', async ({ request }) => {
      // Arrange
      // (nenhuma preparação necessária para defaults)

      // Act
      const response = await request.get(`${baseUrl}/customers`)
      const body = await response.json()

      // Assert
      const { customers, pageInfo } = body
      expect(response.status()).toBe(200)
      expect(Array.isArray(customers)).toBeTruthy()
      customers.forEach(({ id, name, employees, contactInfo, size, industry, address }) => {
        expect(typeof id).toBe('number')
        expect(typeof name).toBe('string')
        expect(typeof employees).toBe('number')
        expect(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']).toContain(size)
        expect(['Logistics', 'Retail', 'Technology', 'HR', 'Finance']).toContain(industry)
        expect(contactInfo === null || (typeof contactInfo === 'object' && contactInfo.name && contactInfo.email)).toBeTruthy()
        expect(address === null || (typeof address === 'object' && address.street && address.city && address.state && address.zipCode && address.country)).toBeTruthy()
      })
      expect(pageInfo).toHaveProperty('currentPage')
      expect(pageInfo).toHaveProperty('totalPages')
      expect(pageInfo).toHaveProperty('totalCustomers')
      expect(typeof pageInfo.currentPage).toBe('number')
      expect(typeof pageInfo.totalPages).toBe('number')
      expect(typeof pageInfo.totalCustomers).toBe('number')
    })

    test('retorna apenas clientes do tipo Medium ao filtrar por size', async ({ request }) => {
      // Arrange
      const size = 'Medium'

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ size, employees }) => {
        expect(size).toBe('Medium')
        expect(employees).toBeGreaterThanOrEqual(100)
        expect(employees).toBeLessThan(1000)
      })
    })

    test('retorna apenas clientes do tipo Enterprise ao filtrar por size', async ({ request }) => {
      // Arrange
      const size = 'Enterprise'

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ size, employees }) => {
        expect(size).toBe('Enterprise')
        expect(employees).toBeGreaterThanOrEqual(1000)
        expect(employees).toBeLessThan(10000)
      })
    })

    test('retorna apenas clientes do setor Technology ao filtrar por industry', async ({ request }) => {
      // Arrange
      const industry = 'Technology'

      // Act
      const response = await request.get(`${baseUrl}/customers?industry=${industry}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ industry }) => {
        expect(industry).toBe('Technology')
      })
    })

    test('retorna apenas clientes do setor HR ao filtrar por industry', async ({ request }) => {
      // Arrange
      const industry = 'HR'

      // Act
      const response = await request.get(`${baseUrl}/customers?industry=${industry}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ industry }) => {
        expect(industry).toBe('HR')
      })
    })

    test('retorna apenas clientes do tipo Large Enterprise ao filtrar por size', async ({ request }) => {
      // Arrange
      const size = 'Large Enterprise'

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ size, employees }) => {
        expect(size).toBe('Large Enterprise')
        expect(employees).toBeGreaterThanOrEqual(10000)
        expect(employees).toBeLessThan(50000)
      })
    })

    test('retorna apenas clientes do tipo Very Large Enterprise ao filtrar por size', async ({ request }) => {
      // Arrange
      const size = 'Very Large Enterprise'

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      customers.forEach(({ size, employees }) => {
        expect(size).toBe('Very Large Enterprise')
        expect(employees).toBeGreaterThanOrEqual(50000)
      })
    })

    test('retorna clientes paginados corretamente', async ({ request }) => {
      // Arrange
      const page = 2

      // Act
      const response = await request.get(`${baseUrl}/customers?page=${page}`)
      const { pageInfo } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(pageInfo.currentPage).toBe(page)
    })

    test('retorna o número correto de clientes por página', async ({ request }) => {
      // Arrange
      const limit = 5

      // Act
      const response = await request.get(`${baseUrl}/customers?limit=${limit}`)
      const { customers } = await response.json()

      // Assert
      expect(response.status()).toBe(200)
      expect(customers.length).toBeLessThanOrEqual(limit)
    })
  })

  test.describe('Cenários de erro', () => {
    test('retorna 400 para page igual a 0', async ({ request }) => {
      // Arrange
      const page = 0

      // Act
      const response = await request.get(`${baseUrl}/customers?page=${page}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })

    test('retorna 400 para page igual a -1', async ({ request }) => {
      // Arrange
      const page = -1

      // Act
      const response = await request.get(`${baseUrl}/customers?page=${page}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })

    test('retorna 400 para limit igual a 0', async ({ request }) => {
      // Arrange
      const limit = 0

      // Act
      const response = await request.get(`${baseUrl}/customers?limit=${limit}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })

    test('retorna 400 para limit igual a -1', async ({ request }) => {
      // Arrange
      const limit = -1

      // Act
      const response = await request.get(`${baseUrl}/customers?limit=${limit}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })

    test('retorna 400 para size não suportado', async ({ request }) => {
      // Arrange
      const size = 'Gigantic'

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })

    test('retorna 400 para industry não suportado', async ({ request }) => {
      // Arrange
      const industry = 'Food'

      // Act
      const response = await request.get(`${baseUrl}/customers?industry=${industry}`)
      const { error } = await response.json()

      // Assert
      expect(response.status()).toBe(400)
      expect(error).toBeTruthy()
    })
  })
})
