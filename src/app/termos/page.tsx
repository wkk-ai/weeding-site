import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-wine/60 hover:text-wine">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold text-wine">Termos de Uso</h1>
      <div className="prose mt-8 space-y-4 text-wine/80">
        <p>
          Ao usar o NossoCasamento, você concorda com estes termos. O serviço permite
          criar sites de casamento com RSVP e lista de presentes.
        </p>
        <h2 className="font-semibold text-wine">Planos e pagamentos</h2>
        <p>
          Planos pagos são cobrança única. Taxa da lista de presentes varia por plano
          (3,29% grátis, 2,49% Essencial, 1,99% Completo). Pagamentos via PIX ou cartão
          processados por parceiro certificado.
        </p>
        <h2 className="font-semibold text-wine">Hospedagem</h2>
        <p>
          Plano grátis: 6 meses após publicação. Planos pagos: 12 meses. Arquivo
          permanente disponível por R$39,90.
        </p>
        <h2 className="font-semibold text-wine">Reembolso</h2>
        <p>Garantia de 14 dias para planos pagos, conforme CDC.</p>
      </div>
    </div>
  );
}
