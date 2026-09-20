"""Gera planilha editável de viabilidade NossoCasamento."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.formatting.rule import FormulaRule
from openpyxl.workbook.defined_name import DefinedName
from pathlib import Path

wb = Workbook()

thin = Border(
    left=Side(style="thin", color="D7C4AA"),
    right=Side(style="thin", color="D7C4AA"),
    top=Side(style="thin", color="D7C4AA"),
    bottom=Side(style="thin", color="D7C4AA"),
)
head = PatternFill("solid", fgColor="3B2F28")
head_font = Font(bold=True, color="F4ECE6")
input_fill = PatternFill("solid", fgColor="FFF8EE")
good = PatternFill("solid", fgColor="E8F3E8")
warn = PatternFill("solid", fgColor="FBE8D8")
title_font = Font(name="Calibri", size=16, bold=True, color="3B2F28")
label_font = Font(name="Calibri", size=11, color="3B2F28")
muted = Font(name="Calibri", size=10, italic=True, color="8A746C")
money = 'R$ #,##0.00'
pct = "0.00%"
num = "#,##0.00"
intn = "#,##0"

# --- Motor ---
ws = wb.active
ws.title = "Motor"

ws["A1"] = "NossoCasamento — motor de viabilidade"
ws["A1"].font = title_font
ws.merge_cells("A1:D1")
ws["A2"] = "Células creme são editáveis. Os três cenários leem estas linhas. Não apague as fórmulas amarelas."
ws["A2"].font = muted
ws.merge_cells("A2:D2")

headers = ["Parâmetro", "Conservador", "Base", "Agressivo"]
for i, h in enumerate(headers, 1):
    c = ws.cell(4, i, h)
    c.fill = head
    c.font = head_font
    c.alignment = Alignment(horizontal="center")

rows = [
    ("Impressões / mês", 80000, 150000, 400000, intn, "Google Ads + Meta. Volume comprado, não orgânico."),
    ("CTR do anúncio", 0.025, 0.04, 0.055, pct, "Casamento no Brasil: 2,5%–5,5% é faixa honesta."),
    ("CPC (R$)", 3.60, 2.80, 2.10, money, "Pesquisa 2026 BR para 'site de casamento' / RSVP."),
    ("Conversão da página → cadastro", 0.03, 0.05, 0.08, pct, "SaaS landing mediana ~3,8% (Unbounce). 5% é otimista com demo."),
    ("Cadastro → casal ativo com PIX", 0.35, 0.50, 0.65, pct, "Quem termina o site e coloca chave PIX."),
    ("Mix Grátis / Essencial / Completo", "70/25/5", "55/35/10", "40/40/20", None, "Só o texto. A receita de plano usa % abaixo."),
    ("% no Grátis", 0.70, 0.55, 0.40, pct, ""),
    ("% no Essencial (R$49)", 0.25, 0.35, 0.40, pct, ""),
    ("% no Completo (R$99)", 0.05, 0.10, 0.20, pct, ""),
    ("GMV presente / casal ativo (R$)", 1800, 3200, 5500, money, "Soma da lista que realmente entra. Atraso ~6 meses."),
    ("Meses até o GMV médio", 7, 6, 5, num, "Presente não cai no mês do anúncio."),
    ("Taxa média da plataforma", 0.028, 0.024, 0.021, pct, "Blended Grátis 3,29 / Essencial 2,49 / Completo 1,99."),
    ("Asaas come da taxa (R$ por PIX médio)", 1.99, 1.99, 1.99, money, "PIX fixo Asaas. Cartão é pior: 0,49+2,99%."),
    ("Ticket médio de um PIX (R$)", 180, 220, 280, money, "Para estimar quantos PIX por casal."),
    ("Orçamento Ads / mês (R$)", 2000, 3000, 8000, money, "Mídia paga. Não inclui salário."),
]

# data starts row 5
for i, (name, a, b, c, fmt, note) in enumerate(rows, 5):
    ws.cell(i, 1, name).font = label_font
    for col, val in ((2, a), (3, b), (4, c)):
        cell = ws.cell(i, col, val)
        cell.fill = input_fill
        cell.border = thin
        if fmt:
            cell.number_format = fmt
    ws.cell(i, 5, note).font = muted

# computed block
ws["A22"] = "Resultado do funil (fórmulas — não edite)"
ws["A22"].font = Font(bold=True, color="3B2F28")

comp = [
    (23, "Cliques", '=B5*B6', '=C5*C6', '=D5*D6', intn),
    (24, "Gasto Ads implícito (cliques×CPC)", '=B23*B7', '=C23*C7', '=D23*D7', money),
    (25, "Cadastros", '=B23*B8', '=C23*C8', '=D23*D8', intn),
    (26, "Casais ativos", '=B25*B9', '=C25*C9', '=D25*D9', intn),
    (27, "CAC pago (Ads / ativos)", '=B19/B26', '=C19/C26', '=D19/D26', money),
    (28, "Receita plano / casal", '=B12*49+B13*99', '=C12*49+C13*99', '=D12*49+D13*99', money),
    (29, "PIX por casal (GMV/ticket)", '=B14/B18', '=C14/C18', '=D14/D18', num),
    (30, "Custo Asaas / casal", '=B29*B17', '=C29*C17', '=D29*D17', money),
    (31, "Take bruto / casal (GMV×taxa)", '=B14*B16', '=C14*C16', '=D14*D16', money),
    (32, "Take líquido / casal", '=B31-B30', '=C31-C30', '=D31-D30', money),
    (33, "LTV (plano + take líquido)", '=B28+B32', '=C28+C32', '=D28+D32', money),
    (34, "LTV : CAC", '=B33/B27', '=C33/C27', '=D33/D27', '0.00'),
    (35, "Payback Ads (meses, com atraso GMV)", '=B15+(B19/(B26*B28+0.0001))', '=C15+(C19/(C26*C28+0.0001))', '=D15+(D19/(D26*D28+0.0001))', num),
    (36, "Receita mês 1 (só planos)", '=B26*B28', '=C26*C28', '=D26*D28', money),
    (37, "Receita mês 7 (planos + take do cohort)", '=B36+B26*B32', '=C36+C26*C32', '=D36+D26*D32', money),
    (38, "Lucro mês 7 após Ads", '=B37-B19', '=C37-C19', '=D37-D19', money),
]

for r, name, fa, fb, fc, fmt in comp:
    ws.cell(r, 1, name).font = label_font
    for col, f in ((2, fa), (3, fb), (4, fc)):
        cell = ws.cell(r, col, f)
        cell.number_format = fmt
        cell.border = thin

ws["A40"] = "Leitura: LTV:CAC acima de 3 é saudável. Abaixo de 1,5 o anúncio queima caixa. Take só existe depois do atraso de presentes."
ws["A40"].font = muted
ws.merge_cells("A40:E40")

for col, w in enumerate([42, 16, 16, 16, 72], 1):
    ws.column_dimensions[get_column_letter(col)].width = w
ws.row_dimensions[1].height = 24
ws.freeze_panes = "A5"

# --- Custos ---
custo = wb.create_sheet("Custos iniciais")
custo["A1"] = "Caixa para abrir — 3 meses de pista"
custo["A1"].font = title_font
custo.merge_cells("A1:C1")
custo["A2"] = "Valores em R$. Dólar 5,1451 (18 set 2026). Edite a coluna Valor."
custo["A2"].font = muted

for i, h in enumerate(["Item", "Valor (R$)", "Nota"], 1):
    cell = custo.cell(4, i, h)
    cell.fill = head
    cell.font = head_font

custos = [
    ("CNPJ MEI + DAS 3 meses", 86.05 * 3, "DAS serviços 2026 ~R$86,05/mês"),
    ("Registro.br domínio .com.br", 40, "1 ano"),
    ("Vercel Pro 3 meses", 20 * 5.1451 * 3, "US$20 × 5,1451"),
    ("Supabase Pro 3 meses", 25 * 5.1451 * 3, "US$25 × 5,1451"),
    ("Asaas (sem mensalidade mínima)", 0, "Paga por transação"),
    ("Conta Google Ads (depósito)", 3000, "Igual ao orçamento Base do Motor"),
    ("Conta Meta Ads (opcional)", 1500, "Pode zerar se só Google"),
    ("Design/fotos de estoque", 400, "Já temos ensaio próprio; reserva"),
    ("Contingência 15%", None, "Fórmula = 15% da soma acima"),
]
r = 5
for name, val, note in custos:
    custo.cell(r, 1, name)
    if val is None:
        custo.cell(r, 2, f"=SUM(B5:B{r-1})*0.15")
    else:
        custo.cell(r, 2, round(val, 2))
    custo.cell(r, 2).number_format = money
    custo.cell(r, 2).fill = input_fill
    custo.cell(r, 2).border = thin
    custo.cell(r, 3, note).font = muted
    r += 1
total_row = r
custo.cell(total_row, 1, "TOTAL para 3 meses").font = Font(bold=True)
custo.cell(total_row, 2, f"=SUM(B5:B{total_row-1})")
custo.cell(total_row, 2).number_format = money
custo.cell(total_row, 2).font = Font(bold=True)
custo.cell(total_row, 2).fill = good

custo["A16"] = "Payback desta caixa = TOTAL / lucro mês 7 do cenário Base (Motor!C38). Se C38 for negativo, a caixa não se paga com Ads neste tamanho."
custo["A16"].font = muted
custo.merge_cells("A16:C16")
custo["A17"] = "Payback (meses)"
custo["B17"] = f'=IF(Motor!C38<=0,"não se paga",B{total_row}/Motor!C38)'
custo["B17"].number_format = num
custo["B17"].fill = warn

for col, w in enumerate([42, 16, 48], 1):
    custo.column_dimensions[get_column_letter(col)].width = w

# --- Comparativo ---
cmp_ = wb.create_sheet("Versus concorrência")
cmp_["A1"] = "Taxa da lista — o que o casal perde"
cmp_["A1"].font = title_font
for i, h in enumerate(["Plataforma", "Taxa lista", "Em R$2.000 de presentes", "Nota"], 1):
    cell = cmp_.cell(3, i, h)
    cell.fill = head
    cell.font = head_font
data = [
    ("Casar.com", 0.0389, "Público 2024–26 ~3,89%"),
    ("iCasei", 0.0369, "Faixa 3,69%–3,89%"),
    ("NossoCasamento Grátis", 0.0329, "Quem não paga o site"),
    ("NossoCasamento Essencial", 0.0249, "R$49 único"),
    ("NossoCasamento Completo", 0.0199, "R$99 único"),
]
for i, (name, taxa, note) in enumerate(data, 4):
    cmp_.cell(i, 1, name)
    cmp_.cell(i, 2, taxa).number_format = pct
    cmp_.cell(i, 3, f"=2000*B{i}").number_format = money
    cmp_.cell(i, 4, note).font = muted
for col, w in enumerate([32, 14, 28, 36], 1):
    cmp_.column_dimensions[get_column_letter(col)].width = w

# --- Fontes ---
fontes = wb.create_sheet("Fontes")
fontes["A1"] = "De onde vieram os números (set 2026)"
fontes["A1"].font = title_font
fontes["A3"] = "Asaas PIX R$1,99 / cartão R$0,49+2,99% — asaas.com.br/precos-e-taxas"
fontes["A4"] = "Unbounce Conversion Benchmark 2026 — landing SaaS ~3,8%"
fontes["A5"] = "Google Ads CPC Brasil 2026 — faixas Adlega / CentSight / contas reais de casamento"
fontes["A6"] = "Casar.com 3,89% e iCasei 3,69–3,89% — páginas de preço públicas"
fontes["A7"] = "USD/BRL 5,1451 em 18 set 2026"
fontes["A8"] = "MEI DAS serviços ~R$86,05 (2026)"
fontes["A9"] = "Registro.br .com.br R$40/ano"
fontes["A10"] = "Vercel Pro US$20 · Supabase Pro US$25"
fontes["A11"] = "Planos NossoCasamento: Grátis 3,29% · Essencial R$49 / 2,49% · Completo R$99 / 1,99%"
fontes.column_dimensions["A"].width = 100

out = Path("/Users/kazuo/Documents/Empresas/business/weeding-site/docs/nossocasamento-modelo-financeiro.xlsx")
out.parent.mkdir(parents=True, exist_ok=True)
wb.save(out)
print(out, out.stat().st_size)
