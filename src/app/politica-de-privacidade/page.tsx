import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Política de privacidade",
  description: "Como a Pádua Corretora trata os dados pessoais de quem visita o site e pede uma cotação.",
  path: "/politica-de-privacidade",
});

const SECTIONS = [
  {
    title: "1. Quem somos",
    body: [
      `Este site pertence à ${SITE.legalName} (CNPJ ${SITE.cnpj}), responsável pelo tratamento dos dados pessoais descritos nesta política, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).`,
    ],
  },
  {
    title: "2. Quais dados coletamos",
    body: [
      "Formulário de cotação: nome, telefone, cidade e informações sobre o veículo ou a empresa. Esses dados não ficam armazenados no site: ao enviar, eles são levados para uma conversa no WhatsApp com a Pádua, onde a cotação continua.",
      "Navegação: dados de uso coletados por ferramentas de análise (como Google Analytics via Google Tag Manager), por exemplo páginas visitadas, tipo de dispositivo e origem do acesso (incluindo parâmetros de campanha, as UTMs).",
    ],
  },
  {
    title: "3. Para que usamos",
    body: [
      "Preparar e apresentar cotações de seguro, entrar em contato com você sobre o pedido e prestar o atendimento de pós-venda.",
      "Entender como o site é usado e medir o resultado das nossas campanhas, para melhorar a experiência e a comunicação.",
    ],
  },
  {
    title: "4. Com quem compartilhamos",
    body: [
      "Com as seguradoras parceiras, apenas o necessário para cotar e emitir a apólice que você escolher. Com fornecedores de tecnologia que operam o site e as ferramentas de análise. Nunca vendemos seus dados.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "Usamos cookies de análise e de marketing para medir acessos e campanhas. Você pode bloquear ou apagar cookies nas configurações do seu navegador a qualquer momento.",
    ],
  },
  {
    title: "6. Seus direitos",
    body: [
      `Você pode pedir acesso, correção, exclusão ou portabilidade dos seus dados, além de revogar consentimentos, pelo e-mail ${SITE.email}. Respondemos no prazo previsto pela LGPD.`,
    ],
  },
];

export default function PoliticaPage() {
  return (
    <>
      <PageHero breadcrumb="Política de privacidade" eyebrow="Transparência" title="Política de privacidade" />
      <section id="politica" aria-label="Política de privacidade" className="section-y">
        <div className="container-site">
          <article className="flex max-w-3xl flex-col gap-10">
            {SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-navy">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-slate">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
            <p className="border-t border-navy/10 pt-6 text-sm text-slate">Última atualização: outubro de 2026.</p>
          </article>
        </div>
      </section>
    </>
  );
}
