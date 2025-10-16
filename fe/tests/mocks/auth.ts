import { faker } from '@faker-js/faker'
import type { User } from '@/api'

// Set seed for consistent data in visual tests
faker.seed(123)

export function generateUser(): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }
}

export function generateLoginError() {
  return {
    error: 'Invalid credentials',
    message: 'The email or password you entered is incorrect.'
  }
}
