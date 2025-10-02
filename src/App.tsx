import React, { useEffect, useMemo, useState, type JSX } from 'react';
import figlet from 'figlet';
import Standard from 'figlet/importable-fonts/Standard.js';

export default function App(): JSX.Element {
  const [text, setText] = useState<string>('Hola, Figlet!');
  const [ascii, setAscii] = useState<string>('');

  // Registra la font només un cop
  useEffect(() => {
    figlet.parseFont('Standard', Standard);
  }, []);

  // Debounce senzill amb useMemo + setTimeout
  const debouncedText = useDebounce(text, 150);

  useEffect(() => {
    let cancelled = false;

    figlet.text(
      debouncedText || ' ',
      { font: 'Standard', horizontalLayout: 'default', verticalLayout: 'default' },
      (err, result) => {
        if (cancelled) return;
        if (err) {
          setAscii(`(Error) ${String(err)}`);
          return;
        }
        setAscii(result ?? '');
      }
    );

    return () => { cancelled = true; };
  }, [debouncedText]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">PoC Bun + Vite en Github pages</h1>

        <label htmlFor="figletText" className="block text-sm font-medium mb-2">
          Escriu un text:
        </label>
        <input
          id="figletText"
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escriu aquí…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="rounded-2xl bg-black text-green-400 p-4 overflow-auto">
          <pre className="whitespace-pre leading-4">{ascii}</pre>
        </div>
      </div>
    </div>
  );
}

/** Hook de debounce simple */
function useDebounce(value: string, delayMs: number): string {
  const [v, setV] = useState<string>(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return v;
}
