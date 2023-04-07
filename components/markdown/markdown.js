import Link from 'components/link/link';
import Code from 'components/code/code';
import ReactMarkdown from 'react-markdown';
import Title from 'components/title/title';

const Markdown = ({ children }) => {
  return <ReactMarkdown components={{
    a: Link,
    code: Code,
    h1: ({ children }) => <Title lv={1}>{children}</Title>,
    h2: ({ children }) => <Title>{children}</Title>,
    h3: ({ children }) => <Title lv={3}>{children}</Title>,
    h4: ({ children }) => <Title lv={4}>{children}</Title>,
    h5: ({ children }) => <Title lv={5}>{children}</Title>,
    h6: ({ children }) => <Title lv={6}>{children}</Title>,
  }}>{children}</ReactMarkdown>;
};

export default Markdown;
