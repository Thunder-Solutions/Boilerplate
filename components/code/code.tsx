import css from './code.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useEffect, useState } from 'react';

const Code = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [theme, setTheme] = useState({});
  useEffect(() => {
    const setPrismTheme = async () => {
      const prism = await import('react-syntax-highlighter/dist/esm/styles/prism');
      setTheme(prism.atomDark);
    };
    setPrismTheme();
  }, []);
  return !inline && match
    ? <SyntaxHighlighter
        style={theme}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    : <code className={`${className} ${css.inlineCode}`} {...props}>
        {children}
      </code>;
};

export default Code;
