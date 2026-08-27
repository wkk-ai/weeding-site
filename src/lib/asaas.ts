const BASE_URL =
  process.env.ASAAS_API_URL ?? "https://sandbox.asaas.com/api/v3";

function headers() {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY not configured");
  return {
    "Content-Type": "application/json",
    access_token: key,
  };
}

async function asaasFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email?: string;
}

export interface AsaasPayment {
  id: string;
  status: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCodeId?: string;
  pixCopiaECola?: string;
}

export async function createCustomer(data: {
  name: string;
  email?: string;
  cpfCnpj?: string;
}) {
  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createPixPayment(data: {
  customer: string;
  value: number;
  description: string;
  externalReference?: string;
  split?: Array<{ walletId: string; percentualValue: number }>;
}) {
  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      billingType: "PIX",
      dueDate: new Date().toISOString().split("T")[0],
      ...data,
    }),
  });
}

export async function createCardPayment(data: {
  customer: string;
  value: number;
  description: string;
  externalReference?: string;
  creditCardToken?: string;
}) {
  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      billingType: "CREDIT_CARD",
      dueDate: new Date().toISOString().split("T")[0],
      ...data,
    }),
  });
}

export async function getPayment(id: string) {
  return asaasFetch<AsaasPayment>(`/payments/${id}`);
}

export function estimateProcessingFeeCents(
  amountCents: number,
  method: "pix" | "card",
): number {
  if (method === "pix") {
    return 199; // R$1.99 flat per Asaas
  }
  return Math.round(amountCents * 0.0299 + 49);
}

export function calculatePlatformFeeCents(
  amountCents: number,
  feePercent: number,
): number {
  return Math.round(amountCents * (feePercent / 100));
}
