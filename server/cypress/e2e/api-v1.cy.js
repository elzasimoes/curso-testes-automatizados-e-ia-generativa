/// <reference types="cypress" />

describe('GET /customers API', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should return default paginated customers and pageInfo', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').and.to.be.an('array');
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');
      expect(response.body.pageInfo.currentPage).to.eq(1);
    });
  });

  it('should return correct number of customers per page', () => {
    cy.request(`${baseUrl}?limit=5`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.customers.length).to.be.at.most(5);
    });
  });

  it('should filter by size', () => {
    cy.request(`${baseUrl}?size=Medium`).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Medium');
      });
    });
  });

  it('should filter by industry', () => {
    cy.request(`${baseUrl}?industry=Technology`).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer.industry).to.eq('Technology');
      });
    });
  });

  it('should filter by size and industry', () => {
    cy.request(`${baseUrl}?size=Enterprise&industry=Finance`).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Enterprise');
        expect(customer.industry).to.eq('Finance');
      });
    });
  });

  it('should paginate results correctly', () => {
    cy.request(`${baseUrl}?page=2&limit=3`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.pageInfo.currentPage).to.eq(2);
      expect(response.body.customers.length).to.be.at.most(3);
    });
  });

  it('should return 400 for invalid page or limit', () => {
    cy.request({
      url: `${baseUrl}?page=-1&limit=0`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 for unsupported size', () => {
    cy.request({
      url: `${baseUrl}?size=Gigantic`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 for unsupported industry', () => {
    cy.request({
      url: `${baseUrl}?industry=Food`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  it('should allow null for contactInfo and address', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.property('contactInfo');
        expect(customer).to.have.property('address');
      });
    });
  });
});
