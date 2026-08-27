import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-wine/60 hover:text-wine">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold text-wine">
        Política de Privacidade (LGPD)
      </h1>
      <div className="prose mt-8 space-y-4 text-wine/80">
        <p>
          O NossoCasamento trata dados pessoais em conformidade com a Lei Geral de
          Proteção de Dados (Lei 13.709/2018).
        </p>
        <h2 className="font-semibold text-wine">Dados coletados</h2>
        <ul className="list-disc pl-6">
          <li>Casais: nome, e-mail, data do casamento, conteúdo do site</li>
          <li>Convidados: nome, e-mail, respostas de RSVP</li>
          <li>Pagamentos: processados por Asaas — não armazenamos dados de cartão</li>
        </ul>
        <h2 className="font-semibold text-wine">Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção ou exclusão dos seus dados pelo e-mail{" "}
          <a href="mailto:privacidade@nossocasamento.com.br" className="text-wine underline">
            privacidade@nossocasamento.com.br
          </a>
        </p>
        <h2 className="font-semibold text-wine">Retenção</h2>
        <p>
          Dados são mantidos enquanto o site estiver ativo e por até 12 meses após o
          casamento, salvo solicitação de exclusão.
        </p>
      </div>
    </div>
  );
}
