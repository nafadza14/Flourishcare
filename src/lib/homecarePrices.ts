// Konstanta layanan homecare — dipakai di StepSchedule (picker) dan StepPayment (price lookup).

export type HomecareServiceKey = "bt" | "si" | "ot" | "tw";

export const HOMECARE_SERVICES: Array<{
  key: HomecareServiceKey;
  label: string;
  short: string;
  desc: string;
  priceMode: string; // mode di tabel online_booking_prices
}> = [
  {
    key: "bt",
    label: "Homecare Visit BT Psikolog",
    short: "BT (Behaviour Therapy)",
    desc: "Terapi perilaku oleh psikolog untuk regulasi emosi, kepatuhan, kebiasaan positif.",
    priceMode: "homecare_bt",
  },
  {
    key: "si",
    label: "Homecare Visit SI",
    short: "SI (Sensory Integration)",
    desc: "Terapi integrasi sensori untuk anak dengan tantangan pemrosesan sensorik.",
    priceMode: "homecare_si",
  },
  {
    key: "ot",
    label: "Homecare Visit OT",
    short: "OT (Occupational Therapy)",
    desc: "Terapi okupasi untuk kemandirian aktivitas sehari-hari & motorik halus.",
    priceMode: "homecare_ot",
  },
  {
    key: "tw",
    label: "Homecare Visit TW",
    short: "TW (Terapi Wicara)",
    desc: "Terapi bicara untuk keterlambatan bahasa, artikulasi, komunikasi.",
    priceMode: "homecare_tw",
  },
];

export function getHomecareService(key: string | undefined) {
  return HOMECARE_SERVICES.find((s) => s.key === key);
}
