import Link from 'components/link/link';
import Code from 'components/code/code';
import ReactMarkdown from 'react-markdown';
import Heading from'components/heading/heading';

const Markdown = ({ children }) => {
  return <ReactMarkdown components={{
    a: Link,
    code: Code,
    h1: ({ children }) => <Heading lv={1}>{children}</Heading>,
    h2: ({ children }) => <Heading>{children}</Heading>,
    h3: ({ children }) => <Heading lv={3}>{children}</Heading>,
    h4: ({ children }) => <Heading lv={4}>{children}</Heading>,
    h5: ({ children }) => <Heading lv={5}>{children}</Heading>,
    h6: ({ children }) => <Heading lv={6}>{children}</Heading>,
  }}>{children}</ReactMarkdown>;
};

export default Markdown;
