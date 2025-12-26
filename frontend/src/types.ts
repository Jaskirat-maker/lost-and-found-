export type Role = 'USER' | 'ADMIN'
export type ItemStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MATCHED'
export type ItemType = 'LOST' | 'FOUND'

export type User = {
  id: number
  name: string
  email: string
  role: Role
}

export type Item = {
  id: number
  itemName: string
  category: string
  description: string
  location: string
  date: string // yyyy-mm-dd
  imageUrl?: string | null
  status: ItemStatus
  type: ItemType
  matchedItemId?: number | null
  reporter?: User | null
  createdAt?: string
}

export type AuthResponse = {
  token: string
  user: User
}

