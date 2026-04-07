import type { LoginDto, RegisterDto, AuthResponseDto } from './ApiService'

const AUTH_URL = 'http://localhost:5128/api/auth'

export const AuthService = {
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || 'Falha ao realizar login')
    }
    return res.json()
  },

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || 'Falha ao realizar cadastro')
    }
    return res.json()
  },
}
