import React from 'react'

import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import dynamic from 'next/dynamic'

import Paper from '../components/paper'
import { COMMANDS, OPERATORS } from '../search/transactionSearch'
import theme from '../theme'

import Loading from './loading'

const MonacoEditorLoader = () => (
  <Loading size={50} imageStyle={{ margin: `16px auto` }} />
)

const MonacoEditor = dynamic(import('react-monaco-editor'), {
  ssr: false,
  loading: MonacoEditorLoader,
})

const QUERY_LANG_NAME = 'expense-manager-query-lang'
const MONACO_THEME_NAME = 'query-lang-theme'

interface Props {
  onClose: () => void
}

const SearchCodeEditor = (props: Props) => {
  const { onClose } = props
  const [value, setValue] = React.useState('')

  return (
    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={onClose}
        startIcon={<CloseIcon />}
        style={{ alignSelf: 'flex-end' }}
      >
        Close editor
      </Button>

      <Paper style={{ padding: 0 }}>
        <MonacoEditor
          height={'30vh'}
          language={QUERY_LANG_NAME}
          theme={MONACO_THEME_NAME}
          value={value}
          onChange={setValue}
          options={{
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
          }}
          editorWillMount={(monaco) => {
            // Register a new language
            monaco.languages.register({ id: QUERY_LANG_NAME })

            // Register a tokens provider for the language
            monaco.languages.setMonarchTokensProvider(QUERY_LANG_NAME, {
              tokenizer: {
                root: [
                  ...OPERATORS.map((op) => [op.toUpperCase(), 'operator']),
                  ...COMMANDS.map((c) => [c.name.toUpperCase(), 'command']),
                  // the typings are unnecessarily restrictive
                ] as any,
              },
            })

            // Define a new theme that contains only rules that match this language
            monaco.editor.defineTheme(MONACO_THEME_NAME, {
              base: 'vs',
              inherit: false,
              rules: [
                { token: 'command', foreground: theme.palette.primary.main },
                {
                  token: 'operator',
                  foreground: '32b4eb', // light blue
                  fontStyle: 'bold',
                },
              ],
              colors: {},
            })

            // Register a completion item provider for the new language
            monaco.languages.registerCompletionItemProvider(QUERY_LANG_NAME, {
              provideCompletionItems: () => {
                const commands = [...COMMANDS].map((x) => ({
                  label: x.name.toUpperCase(),
                  kind: monaco.languages.CompletionItemKind.Text,
                  insertText: x.name.toUpperCase(),
                }))

                const operators = [...OPERATORS].map((x) => ({
                  label: x.toUpperCase(),
                  kind: monaco.languages.CompletionItemKind.Text,
                  insertText: x.toUpperCase(),
                }))

                return { suggestions: [...commands, ...operators] as any }
              },
            })
          }}
        />
      </Paper>
    </div>
  )
}

export default SearchCodeEditor
