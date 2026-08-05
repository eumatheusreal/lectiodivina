'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type InvoiceItem = {
  id: string;
  code: string;
  barcode: string;
  description: string;
  expectedQuantity: number;
  receivedQuantity: number;
  unit: string;
};

type InvoiceSummary = {
  number: string;
  supplier: string;
  issueDate: string;
  accessKey: string;
};

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
});

function textFrom(element: Element, tagName: string) {
  return element.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
}

function parseNumber(value: string) {
  return Number.parseFloat(value.replace(',', '.')) || 0;
}

function parseNfeXml(xmlContent: string) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlContent, 'text/xml');

  if (xml.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Não foi possível ler o XML. Confira se o arquivo é uma NF-e válida.');
  }

  const invoiceNode = xml.getElementsByTagName('ide')[0];
  const supplierNode = xml.getElementsByTagName('emit')[0];
  const infNfeNode = xml.getElementsByTagName('infNFe')[0];
  const itemNodes = Array.from(xml.getElementsByTagName('det'));

  if (itemNodes.length === 0) {
    throw new Error('Nenhum item foi encontrado no XML da nota.');
  }

  const summary: InvoiceSummary = {
    number: textFrom(invoiceNode, 'nNF') || 'Sem número',
    supplier: textFrom(supplierNode, 'xNome') || 'Fornecedor não identificado',
    issueDate: textFrom(invoiceNode, 'dhEmi') || textFrom(invoiceNode, 'dEmi') || 'Data não informada',
    accessKey: infNfeNode?.getAttribute('Id')?.replace(/^NFe/, '') ?? 'Chave não encontrada',
  };

  const items: InvoiceItem[] = itemNodes.map((itemNode, index) => {
    const productNode = itemNode.getElementsByTagName('prod')[0];
    const commercialBarcode = textFrom(productNode, 'cEAN');
    const taxableBarcode = textFrom(productNode, 'cEANTrib');

    return {
      id: itemNode.getAttribute('nItem') ?? String(index + 1),
      code: textFrom(productNode, 'cProd') || `item-${index + 1}`,
      barcode: commercialBarcode && commercialBarcode !== 'SEM GTIN' ? commercialBarcode : taxableBarcode,
      description: textFrom(productNode, 'xProd') || 'Produto sem descrição',
      expectedQuantity: parseNumber(textFrom(productNode, 'qCom')),
      receivedQuantity: 0,
      unit: textFrom(productNode, 'uCom') || 'un',
    };
  });

  return { summary, items };
}

export default function Home() {
  const [invoice, setInvoice] = useState<InvoiceSummary | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [scanCode, setScanCode] = useState('');
  const [message, setMessage] = useState('Importe o XML da NF-e para iniciar a conferência.');

  const totals = useMemo(() => {
    const expected = items.reduce((sum, item) => sum + item.expectedQuantity, 0);
    const received = items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    const completed = items.filter((item) => item.receivedQuantity >= item.expectedQuantity).length;

    return { expected, received, completed };
  }, [items]);

  function handleXmlUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = parseNfeXml(String(reader.result));
        setInvoice(result.summary);
        setItems(result.items);
        setMessage(`XML importado com ${result.items.length} item(ns). Agora leia os códigos de barras.`);
      } catch (error) {
        setInvoice(null);
        setItems([]);
        setMessage(error instanceof Error ? error.message : 'Erro ao importar XML.');
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  function registerScan() {
    const normalizedCode = scanCode.trim();
    if (!normalizedCode) return;

    const itemIndex = items.findIndex(
      (item) => item.barcode === normalizedCode || item.code === normalizedCode,
    );

    if (itemIndex < 0) {
      setMessage(`Código ${normalizedCode} não encontrado na nota.`);
      setScanCode('');
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item, index) =>
        index === itemIndex
          ? { ...item, receivedQuantity: item.receivedQuantity + 1 }
          : item,
      ),
    );
    setMessage(`Conferido: ${items[itemIndex].description}`);
    setScanCode('');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Recebimento físico</p>
          <h1 className="mt-3 text-4xl font-bold">Conferência de NF-e por código de barras</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Importe o XML da nota fiscal, leia o código de barras dos produtos recebidos e acompanhe divergências entre quantidade faturada e quantidade recebida.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl bg-white p-6 text-slate-950 shadow-xl">
            <h2 className="text-2xl font-bold">1. Importar XML da NF-e</h2>
            <input className="mt-4 w-full rounded-xl border border-slate-300 p-3" type="file" accept=".xml,text/xml" onChange={handleXmlUpload} />

            {invoice && (
              <div className="mt-6 space-y-2 rounded-2xl bg-slate-100 p-4 text-sm">
                <p><strong>Nota:</strong> {invoice.number}</p>
                <p><strong>Fornecedor:</strong> {invoice.supplier}</p>
                <p><strong>Emissão:</strong> {invoice.issueDate}</p>
                <p className="break-all"><strong>Chave:</strong> {invoice.accessKey}</p>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-emerald-400 p-6 text-slate-950 shadow-xl">
            <h2 className="text-2xl font-bold">2. Ler código de barras</h2>
            <p className="mt-2 text-sm">Use um leitor USB/Bluetooth configurado como teclado ou digite o EAN/código interno.</p>
            <div className="mt-4 flex gap-3">
              <input
                className="min-w-0 flex-1 rounded-xl border-0 p-4 text-lg shadow-inner"
                placeholder="Bipe ou digite o código"
                value={scanCode}
                onChange={(event) => setScanCode(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && registerScan()}
              />
              <button className="rounded-xl bg-slate-950 px-5 font-bold text-white" onClick={registerScan}>Conferir</button>
            </div>
            <p className="mt-4 rounded-xl bg-emerald-100 p-3 font-medium">{message}</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 p-5"><span className="text-slate-400">Qtd. na nota</span><strong className="block text-3xl">{numberFormatter.format(totals.expected)}</strong></div>
          <div className="rounded-2xl bg-slate-900 p-5"><span className="text-slate-400">Qtd. recebida</span><strong className="block text-3xl">{numberFormatter.format(totals.received)}</strong></div>
          <div className="rounded-2xl bg-slate-900 p-5"><span className="text-slate-400">Itens completos</span><strong className="block text-3xl">{totals.completed}/{items.length}</strong></div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white text-slate-950 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr><th className="p-4">Produto</th><th className="p-4">Código</th><th className="p-4">EAN</th><th className="p-4">Nota</th><th className="p-4">Recebido</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const difference = item.receivedQuantity - item.expectedQuantity;
                  const status = difference === 0 ? 'OK' : difference > 0 ? `Sobra ${numberFormatter.format(difference)}` : `Falta ${numberFormatter.format(Math.abs(difference))}`;
                  return (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="p-4 font-medium">{item.description}</td>
                      <td className="p-4">{item.code}</td>
                      <td className="p-4">{item.barcode || 'Sem GTIN'}</td>
                      <td className="p-4">{numberFormatter.format(item.expectedQuantity)} {item.unit}</td>
                      <td className="p-4">{numberFormatter.format(item.receivedQuantity)} {item.unit}</td>
                      <td className="p-4"><span className={difference === 0 ? 'text-emerald-700' : 'text-amber-700'}>{status}</span></td>
                    </tr>
                  );
                })}
                {items.length === 0 && <tr><td className="p-6 text-center text-slate-500" colSpan={6}>Nenhum XML importado.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
