/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor, { Monaco } from '@monaco-editor/react';
import { useRef } from 'react';
import * as MonacoTypes from 'monaco-editor';
import syl from 'syllabificate';

const App = () => {
   const editorRef = useRef<MonacoTypes.editor.IStandaloneCodeEditor>();

   const handleEditorWillMount = (monaco: Monaco) => {
      // here is the monaco instance
      // do something before editor is mounted
      // Register a new language
      monaco.languages.register({ id: 'rhymdown' });

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('rhymdown', {
         tokenizer: {
            root: [
               [/\/\/.*/, 'comment'],
               [/#.*/, 'custom-section'],
            ],
         },
      });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme('myCoolTheme', {
         base: 'vs-dark',
         inherit: true,
         rules: [
            { token: 'custom-comment', foreground: '00aa00' },
            { token: 'custom-section', foreground: '4444aa' },

            { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
            { token: 'custom-notice', foreground: 'FFA500' },
            { token: 'custom-date', foreground: '008800' },
         ],
         colors: {
            'editor.foreground': '#dddddd',
         },
      });

      // Register a completion item provider for the new language
      /* monaco.languages.registerCompletionItemProvider('rhymdown', {
         provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordUntilPosition(position);
            const range = {
               startLineNumber: position.lineNumber,
               endLineNumber: position.lineNumber,
               startColumn: word.startColumn,
               endColumn: word.endColumn,
            };
            const suggestions = [
               {
                  label: 'simpleText',
                  kind: monaco.languages.CompletionItemKind.Text,
                  insertText: 'simpleText',
                  range: range,
               },
               {
                  label: 'testing',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'testing(${1:condition})',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  range: range,
               },
               {
                  label: 'ifelse',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'If-Else Statement',
                  range: range,
               },
            ];
            return { suggestions: suggestions };
         },
      }); */
   };

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const handleEditorDidMount = (editor: MonacoTypes.editor.IStandaloneCodeEditor, _monaco: Monaco) => {
      editorRef.current = editor;
      editorRef.current.updateOptions({
         lineNumbers: calculateSyllables,
         fontFamily: 'Inter, sans-serif',
         renderWhitespace: 'none',
         unicodeHighlight: { ambiguousCharacters: false },
         suggest: { showWords: false },
      });
      console.log(editor);
   };

   const calculateSyllables: MonacoTypes.editor.LineNumbersType = (lineNum: number) => {
      const line = editorRef.current?.getValue().split('\n')[lineNum - 1];
      let syllableCount = 0;
      line
         ?.trim()
         .split(' ')
         .forEach((word) => {
            word = word.replace(/[^A-z]+/, '').toLowerCase();
            syllableCount += syllables(word); //word.downcase!
            // if (word.length <= 3 && word.length > 0) {
            //    syllableCount += 1;
            //    return;
            // } //return 1 if word.length <= 3
            // word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
            // word = word.replace(/^y/, ''); //word.sub!(/^y/, '')
            // const wordSyllables: number | undefined = word.match(/[aeiouy]{1,2}/g)?.length;
            // syllableCount += wordSyllables ? wordSyllables : 0;
            // console.log(syllableCount);
         });
      if (line?.trim().startsWith('//') || line?.trim().startsWith('#')) {
         return '';
      }
      return syllableCount == 0 ? '' : syllableCount.toString();
      // return 'balls';
   };

   const syllables = (word: string) => {
      const replacements = [
         {
            word: 'hour',
            syl: 2,
         },
         {
            word: 'creating',
            syl: 3,
         },
         {
            word: 'anyone',
            syl: 3,
         },
      ];
      const replace = replacements.filter((item) => item.word === word)[0];
      return replace ? replace.syl : syl.countSyllables(word);
      // if (replacements)) return syl.countSyllables(word);
   };

   const updateLineNumbers = () => {
      editorRef.current?.updateOptions({
         lineNumbers: calculateSyllables,
      });
   };

   return (
      <>
         <Editor
            height="90vh"
            defaultLanguage="rhymdown"
            defaultValue="// some comment"
            theme="myCoolTheme"
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onChange={updateLineNumbers}
         />
      </>
   );
};

export default App;
