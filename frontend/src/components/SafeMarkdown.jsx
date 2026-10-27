import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const allowedElements = [
  'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
  'h3', 'h4', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br',
];

function normalizeHeadings() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'heading') {
        node.depth = node.depth <= 2 ? 3 : 4;
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}

function isSafeHref(href) {
  return typeof href === 'string' && /^(https?:\/\/|mailto:)/i.test(href);
}

function SafeMarkdown({ content }) {
  return (
    <div className="space-y-3 text-sm leading-6 text-main [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:border [&_code]:border-line [&_code]:bg-surface [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_p]:text-main [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-line [&_pre]:bg-surface [&_pre]:p-3 [&_table]:min-w-full [&_th]:bg-surface [&_th]:p-2 [&_th]:text-left [&_td]:border-t [&_td]:border-line [&_td]:p-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, normalizeHeadings]}
        allowedElements={allowedElements}
        unwrapDisallowed
        components={{
          h1: ({ children }) => <h3>{children}</h3>,
          h2: ({ children }) => <h3>{children}</h3>,
          h5: ({ children }) => <h4>{children}</h4>,
          h6: ({ children }) => <h4>{children}</h4>,
          table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
          a: ({ href, children }) =>
            isSafeHref(href) ? (
              <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                {children}
              </a>
            ) : (
              <span>{children}</span>
            ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}

export default SafeMarkdown;
