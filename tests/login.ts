import '@testing-library/jest-dom/extend-expect'
import { expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

export const renderFormLogin = () => {
  expect(screen.getByText('ยินดีต้อนรับ')).toBeInTheDocument()
}

export const clickButtonLogin = () => {
  fireEvent.click(screen.getByText('เข้าสู่ระบบ'))
  expect(screen.getByText('โปรดป้อนข้อมูลให้ครบ')).toBeInTheDocument()
}

export const loginSubmit = () => {
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'dev' } })
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'dev' } })

  fireEvent.click(screen.getByText('เข้าสู่ระบบ'))
  // expect(screen.getByText('Wrong user or password!!')).toBeInTheDocument()
}