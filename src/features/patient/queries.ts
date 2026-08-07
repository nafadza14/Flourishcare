import { supabase } from "@/lib/supabase";

export type PatientBooking = {
  id: string;
  code: string;
  parent_name: string;
  child_name: string;
  child_dob: string;
  mode: "online" | "homecare";
  psychologist_id: string;
  scheduled_at: string;
  duration_min: number;
  amount: number;
  status: string;
  consultation_topic: string;
  homecare_address: string | null;
  created_at: string;
};

export type PatientPayment = {
  id: string;
  booking_id: string;
  amount: number;
  fee: number | null;
  status: string;
  payment_method: string;
  payment_url: string | null;
  paid_at: string | null;
  created_at: string;
  expires_at: string | null;
};

export type PatientProgressNote = {
  id: string;
  child_id: string;
  title: string;
  summary: string;
  metrics: Record<string, unknown> | null;
  created_at: string;
};

export type PatientChild = {
  id: string;
  rm_number: string;
  full_name: string;
  nickname: string | null;
  dob: string;
  gender: "L" | "P";
  primary_condition: string | null;
};

export async function fetchPatientBookings() {
  const { data, error } = await supabase
    .from("online_bookings")
    .select("*")
    .order("scheduled_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PatientBooking[];
}

export async function fetchPatientPayments() {
  const { data, error } = await supabase
    .from("online_payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PatientPayment[];
}

export async function fetchPatientChildren() {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PatientChild[];
}

export async function fetchPatientProgressNotes() {
  const { data, error } = await supabase
    .from("progress_notes")
    .select("*")
    .eq("is_shared", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PatientProgressNote[];
}

export async function fetchPatientSummary() {
  const { data, error } = await supabase.rpc("patient_portal_summary");
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return (row ?? { total_bookings: 0, total_paid_amount: 0, upcoming_count: 0, completed_count: 0 }) as {
    total_bookings: number;
    total_paid_amount: number;
    upcoming_count: number;
    completed_count: number;
  };
}

export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
