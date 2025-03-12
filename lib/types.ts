export type User = {
  id: string
  email: string
  name: string
  displayName: string
  phone?: string
  mentorId: number
  avatar?: string
  approved: boolean
  isAdmin?: boolean
  password?: string
  createdAt?: Date
}

export type EA = {
  id: string
  name: string
  createdAt: Date
  createdBy: string
}

export type LicenseKey = {
  id: string
  key: string
  username: string
  eaId: string
  eaName: string
  plan: string
  status: "active" | "inactive" | "expired"
  createdAt: Date
  expiryDate: Date
  createdBy: string
}

export type Stats = {
  totalLicenses: number
  activeSubscriptions: number
  totalEAs: number
  maxLicenses: number
}

