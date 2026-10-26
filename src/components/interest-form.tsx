'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';

const establishmentTypes = ['Barbearia','Salão de beleza','Estúdio de unhas e sobrancelhas','Centro de estética','Profissional autônomo','Outro negócio de autocuidado'];
type Field = 'name' | 'email' | 'establishmentType' | 'whatsapp';
type Errors = Partial<Record<Field, string>>;

export function InterestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [checked, setChecked] = useState(false);

  function validate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (field: Field) => String(data.get(field) ?? '').trim();
    const next: Errors = {};
    if (value('name').length < 2) next.name = 'Informe seu nome com pelo menos 2 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) next.email = 'Informe um e-mail válido, como nome@exemplo.com.';
    if (!establishmentTypes.includes(value('establishmentType'))) next.establishmentType = 'Selecione o tipo do seu negócio.';
    const digits = value('whatsapp').replace(/\D/g, '');
    if (value('whatsapp') && (!/^[+\d\s().-]+$/.test(value('whatsapp')) || !/^(?:55)?\d{10,11}$/.test(digits))) next.whatsapp = 'Informe DDD e telefone, com 10 ou 11 dígitos. O código +55 é opcional.';
    setErrors(next);
    setChecked(Object.keys(next).length === 0);
    const first = Object.keys(next)[0];
    if (first) formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${first}"]`)?.focus();
  }

  const fieldProps = (field: Field) => ({ 'aria-invalid': !!errors[field], 'aria-describedby': `${field}-hint${errors[field] ? ` ${field}-error` : ''}` });
  const error = (field: Field) => errors[field] ? <span className="field-error" id={`${field}-error`}>{errors[field]}</span> : null;

  return <form ref={formRef} className="interest-form" noValidate onSubmit={validate} onChange={() => setChecked(false)} aria-describedby="demo-notice contact-purpose">
    <div className="demo-notice" id="demo-notice"><Info size={18}/><p><b>Formulário de demonstração</b>Você pode testar os campos. Os dados não serão enviados nem armazenados.</p></div>
    <div className="form-grid"><div className="field"><label htmlFor="name">Seu nome <span>*</span></label><input id="name" name="name" autoComplete="name" maxLength={100} required placeholder="Como podemos chamar você?" {...fieldProps('name')}/><span className="sr-only" id="name-hint">Obrigatório. Pelo menos 2 caracteres.</span>{error('name')}</div>
    <div className="field"><label htmlFor="email">E-mail <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="voce@exemplo.com" {...fieldProps('email')}/><span className="sr-only" id="email-hint">Obrigatório. Informe um endereço de e-mail válido.</span>{error('email')}</div>
    <div className="field"><label htmlFor="establishmentType">Tipo de estabelecimento <span>*</span></label><select id="establishmentType" name="establishmentType" required defaultValue="" {...fieldProps('establishmentType')}><option value="" disabled>Selecione seu tipo de negócio</option>{establishmentTypes.map(type => <option key={type}>{type}</option>)}</select><span className="sr-only" id="establishmentType-hint">Obrigatório.</span>{error('establishmentType')}</div>
    <div className="field"><label htmlFor="whatsapp">WhatsApp <span className="optional">(opcional)</span></label><input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" maxLength={25} placeholder="(11) 99999-9999" {...fieldProps('whatsapp')}/><span className="sr-only" id="whatsapp-hint">DDD e número brasileiro, com código +55 opcional.</span>{error('whatsapp')}</div></div>
    <p id="contact-purpose" className="contact-purpose">Na versão ativa, essas informações servirão para entrar em contato sobre o Zelora. Este teste não cadastra seu interesse nem autoriza mensagens de marketing.</p>
    <button type="submit" className="button form-submit">Quero conhecer o Zelora <ArrowUpRight size={18}/></button>
    <p className="form-caption">Demonstração: o botão apenas valida os campos.</p>
    <div role="status" aria-live="polite" className={checked ? 'validation-notice' : 'sr-only'}>{checked ? 'Campos validados nesta demonstração. Nenhum dado foi enviado ou armazenado. O cadastro de interesse ainda não está disponível.' : ''}</div>
  </form>;
}
