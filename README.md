# broto.digital · landing de teste

Protótipo navegável da landing page da Broto (job J26-012 do Bova Studio), para o cliente testar no celular e no computador.

- HTML, CSS e JS puros, sem build. Publicado pelo GitHub Pages a partir da raiz de `main`.
- Design system da Apple, medido no apple.com em 2026-09-25; só a cor é da Broto. Regras no vault: `Studio™/Bova Studio/Broto/Site Apple DS Broto 2026-09-25.md` (a estrutura anterior, medida no itscraft.com, está em `Site Reference Broto 2026-09-18.md`).
- `noindex` enquanto for protótipo. O telefone do WhatsApp é de exemplo. Fotos de criadores e logos de marcas pertencem aos donos e estão aqui só para teste.
- `/assinatura/`: gerador da assinatura de e-mail (layout aprovado no Figma, opção A). As imagens da assinatura moram em `assets/signature/` e precisam ficar públicas, porque o e-mail carrega do site.
- Rodar local: `python3 -m http.server 4173`.
