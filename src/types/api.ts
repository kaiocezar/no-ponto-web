// ── Padrões de resposta da API ────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string | null
  phone_number: string | null
  full_name: string
  avatar_url: string | null
  birth_date?: string | null
  role: 'client' | 'provider' | 'admin' | 'staff'
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RequestOTPPayload {
  phone: string
}

export interface VerifyOTPPayload {
  phone: string
  code: string
}

export interface VerifyOTPResponse extends AuthTokens {
  is_new_user: boolean
}

export interface CompleteProfilePayload {
  full_name: string
}

export interface UpdateMePayload {
  email?: string
  birth_date?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    next_cursor: string | null
    previous_cursor: string | null
    count: number
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// ── Entidades base ────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show'
  | 'awaiting_payment'

export type AppointmentOrigin = 'online' | 'whatsapp' | 'phone' | 'walk_in' | 'imported'

export type UserRole = 'client' | 'provider' | 'admin' | 'staff'

export type StaffRole = 'owner' | 'manager' | 'practitioner'

export interface TokenResponse {
  access: string
  refresh: string
  is_new_user?: boolean
}

// ── Provider ──────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string
  name: string
  icon: string | null
  slug: string
}

export interface ProviderProfile {
  id: string
  slug: string
  business_name: string
  bio: string | null
  specialty: string | null
  category: ServiceCategory | null
  logo_url: string | null
  cover_url: string | null
  address_street: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  timezone: string
  default_appointment_duration: number
  whatsapp_number: string | null
  instagram_handle: string | null
  website_url: string | null
  is_published: boolean
  average_rating: number | null
  rating_average: number | null
  total_reviews: number
  services?: Service[]
  created_at: string
  updated_at: string
}

// ── Service ───────────────────────────────────────────────────────────────────

export interface CreateServicePayload {
  name: string
  description?: string
  price: string  // decimal como string, ex: "150.00"
  duration_minutes: number  // minutos
  is_active?: boolean
}

export interface Service {
  id: string
  provider: string
  name: string
  description: string
  price: string | null
  duration_minutes: number
  color: string | null
  currency: string
  requires_deposit: boolean
  deposit_amount: string | null
  max_clients: number
  buffer_after: number
  is_active: boolean
  is_online: boolean
  staff: Pick<Staff, 'id' | 'name' | 'role' | 'avatar_url'>[]
  created_at: string
  updated_at: string
}

export interface InviteData {
  provider_name: string
  staff_name: string
  role: string
  invite_email: string
}

// ── Staff ─────────────────────────────────────────────────────────────────────

export interface Staff {
  id: string
  name: string
  avatar_url: string | null
  role: StaffRole
  is_active: boolean
  invite_email: string | null
  user: { id: string; name: string } | null
}

// ── Appointment ───────────────────────────────────────────────────────────────

export interface Appointment {
  id: string
  public_id: string
  provider: string
  service: Service
  staff: Staff | null
  client_name: string
  client_phone: string
  client_email: string | null
  start_datetime: string // ISO 8601
  end_datetime: string
  status: AppointmentStatus
  origin: AppointmentOrigin
  notes: string | null
  internal_notes: string | null
  price_at_booking: string | null
  deposit_paid: boolean
  created_at: string
}

export interface CreateAppointmentPayload {
  provider_slug: string
  service_id: string
  staff_id?: string
  start_datetime: string
  client_name: string
  client_phone: string
  client_email?: string
  notes?: string
}

export interface AppointmentPublicBookingResponse {
  public_id: string
  status: AppointmentStatus
  start_datetime: string
  end_datetime: string
  service: { id: string; name: string; duration_minutes: number }
  provider: { slug: string; business_name: string }
}

/** Lista / detalhe em `/providers/me/appointments/` (painel prestador) */
export interface ProviderAppointmentServiceBrief {
  id: string
  name: string
  duration_minutes: number
  color?: string | null
}

export interface ProviderAppointmentListRow {
  id: string
  public_id: string
  client_name: string
  client_phone: string
  service: ProviderAppointmentServiceBrief
  status: AppointmentStatus
  start_datetime: string
  end_datetime: string
  origin: AppointmentOrigin
}

export interface ProviderAppointmentDetail extends ProviderAppointmentListRow {
  client_email: string
  notes: string
  internal_notes: string
  cancelled_by: string | null
  cancellation_reason: string | null
  created_at: string
}

export interface ProviderManualBookingPayload {
  service_id: string
  start_datetime: string
  client_name: string
  client_phone: string
  origin: 'phone' | 'walk_in'
  notes?: string
  internal_notes?: string
}

export interface AppointmentLookup {
  id: string
  public_id: string
  status: AppointmentStatus
  start_datetime: string
  end_datetime: string
  can_cancel?: boolean
  cancel_deadline?: string | null
  client_name: string
  service: { id: string; name: string; duration_minutes: number }
  provider: { slug: string; business_name: string }
  notes: string | null
  price_at_booking: string | null
}

export interface CancelAppointmentPayload {
  public_id: string
  phone: string
  reason?: string
}

export interface RescheduleOption {
  start_datetime: string
  end_datetime: string
}

export interface RescheduleOptionsResponse {
  slots: RescheduleOption[]
  message?: string
}

export interface RescheduleAppointmentPayload {
  phone: string
  start_datetime: string
}

export interface RescheduleConflictError {
  code: 'slot_taken'
  available_slots: RescheduleOption[]
}

// ── Working Hours ─────────────────────────────────────────────────────────────

/** 0 = domingo, 1 = segunda … 6 = sábado */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

export interface WorkingHours {
  id: string
  weekday: Weekday
  start_time: string  // HH:MM
  end_time: string    // HH:MM
  is_active: boolean
}

export interface WorkingHoursPayload {
  weekday: Weekday
  start_time: string
  end_time: string
  is_active: boolean
}

export interface WorkingHoursBulkPayload {
  working_hours: WorkingHoursPayload[]
}

// ── Schedule Blocks ───────────────────────────────────────────────────────────

export interface ScheduleBlock {
  id: string
  start_datetime: string // ISO 8601
  end_datetime: string
  reason: string | null
  is_recurring: boolean
  recurrence_rule: string
  created_at: string
}

export interface ScheduleBlockPayload {
  start_datetime: string
  end_datetime: string
  reason?: string
  is_recurring?: boolean
  recurrence_rule?: string
}

export interface ScheduleBlockFilters {
  from?: string
  until?: string
}

// ── Availability ──────────────────────────────────────────────────────────────

export interface AvailableSlot {
  start: string // ISO 8601
  end: string
  staff_id: string | null
}

// ── Review ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string | null
  client_name: string
  provider_reply: string | null
  replied_at: string | null
  created_at: string
}
