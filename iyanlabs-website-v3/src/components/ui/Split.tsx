import { Fragment, type ElementType, type ReactNode } from 'react';

interface Props {
  /** Text; wrap words in {braces} to render them in animated gradient text. */
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Skip the global reveal (component animates it itself). */
  manual?: boolean;
}

/** Heading split into masked words so GSAP can reveal it; real text stays in the DOM. */
export function Split({ text, as: Tag = 'h2', className, id, manual }: Props) {
  const out: ReactNode[] = [];
  let key = 0;
  text.split(/(\{[^}]+\})/g).filter(Boolean).forEach((part) => {
    const accent = part.startsWith('{');
    (accent ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).forEach((word) => {
      if (out.length) out.push(' ');
      out.push(<span className="w" key={key++}><span className={`w__i${accent ? ' grad' : ''}`}>{word}</span></span>);
    });
  });
  return (
    <Tag id={id} className={className} data-split="" data-manual={manual ? '' : undefined}>
      {out.map((n, i) => <Fragment key={i}>{n}</Fragment>)}
    </Tag>
  );
}
