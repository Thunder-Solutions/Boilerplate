function react-component {
  set -e
  [[ -z "$2" ]] && REL_PATH="src/components" || REL_PATH="$2"
  [[ -z "$3" ]] && ROOT_FILE="$PWD/src/components/index.js" || ROOT_FILE="$3"
  CUR_PATH="$PWD/$REL_PATH/$1"
  mkdir -p "$CUR_PATH"
  JS_FILE="$CUR_PATH/$1.js"
  CSS_FILE="$CUR_PATH/$1.module.css"
  touch "$JS_FILE"
  echo "import css from './$1.module.css'" >> "$JS_FILE"
  echo "" >> "$JS_FILE"
  echo "const ${1^} = ({ children, className = '', ...props }) => {" >> "$JS_FILE"
  echo "" >> "$JS_FILE"
  echo "  const $1Class = \`\${className} \${css.$1}\`" >> "$JS_FILE"
  echo "" >> "$JS_FILE"
  echo "  return (" >> "$JS_FILE"
  echo "    <div {...props} className={$1Class}>{children}</div>" >> "$JS_FILE"
  echo "  )" >> "$JS_FILE"
  echo "}" >> "$JS_FILE"
  echo "" >> "$JS_FILE"
  echo "export default ${1^}" >> "$JS_FILE"
  touch "$CSS_FILE"
  echo ".$1 {" >> "$CSS_FILE"
  echo "  " >> "$CSS_FILE"
  echo "}" >> "$CSS_FILE"
  [[ $REL_PATH =~ \/components$ ]] && IMPORT_PATH="./$1/$1" || IMPORT_PATH="$REL_PATH/$1/$1"
  echo "export { default as ${1^} } from '${IMPORT_PATH}'" >> "$ROOT_FILE"
}

function next-component {
  set -e
  [[ -z "$2" ]] && REL_PATH="components" || REL_PATH="$2"
  [[ -z "$3" ]] && ROOT_FILE="$PWD/components/index.js" || ROOT_FILE="$3"
  react-component $1 $REL_PATH $ROOT_FILE
}

alias rc="react-component"
alias nc="next-component"
