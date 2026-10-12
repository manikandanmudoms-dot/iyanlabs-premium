import { Fragment, type ElementType, type ReactNode } from 'react';

interface Props {
  /** Text; wrap words in {braces} to set them in the editorial serif accent. */
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Skip the global reveal (component animates it itself). */
  manual?: boolean;
}

/**
 * Renders a heading as masked words so GSAP can reveal them line by line.
 * The real text stays in the DOM, so it is readable without JS and by assistive tech.
 */
export function Split({ text, as: Tag = 'h2', className, id, manual }: Props) {
  const parts = text.split(/(\{[^}]+\})/g).filter(Boolean);
  const out: ReactNode[] = [];
  let key = 0;
  parts.forEach((part) => {
    const accent = part.startsWith('{');
    const words = (accent ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean);
    words.forEach((w) => {
      if (out.length) out.push(' ');
      out.push(
        <span className="w" key={key++}>
          <span className={`w__i${accent ? ' accent' : ''}`}>{w}</span>
        </span>,
      );
    });
  });
  return (
    <Tag id={id} className={className} data-split="" data-manual={manual ? '' : undefined}>
      {out.map((n, i) => <Fragment key={i}>{n}</Fragment>)}
    </Tag>
  );
}
