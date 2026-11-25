# Беклог

Ідеї й задачі живуть у GitHub Issues: https://github.com/PocinovuvachGachi/ostanniy-mayak/issues

- Мітки: «ідея», «баг»; постулати — «дослідження», «поступовість», «баланс», «бій», «графіка», «наратив»;
  «інструменти» — засоби перевірки; «зараз» — беремо найближчим часом; «обговорити» — спершу з автором.
- Переглянути з сесії: `gh api "repos/PocinovuvachGachi/ostanniy-mayak/issues?labels=ідея&state=open" --jq '.[]|"#\(.number) \(.title)"'`
  (GraphQL у сесіях недоступний, тож лише REST: `gh api repos/...`).
- Нова ідея — нова issue з мітками постулатів, яким вона служить. Зроблене — коміт «закриває #N».

## Два розробники
Над грою працюють Claude і ChatGPT — порядок у `docs-dev/TEAM.md`. Мітки виконавця: «claude», «gpt».
Знахідки й пропозиції, які не беремо одразу, — мітка «ревізія»; вирішує автор. Переглянути:
`gh api "repos/PocinovuvachGachi/ostanniy-mayak/issues?labels=ревізія&state=open" --jq '.[]|"#\(.number) \(.title)"'`.
