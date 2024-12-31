import Editor, { Monaco } from '@monaco-editor/react';
import { useRef } from 'react';
import * as MonacoTypes from 'monaco-editor';
import syl from 'syllabificate';

const TextEditor = () => {
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
         ],
         colors: {
            'editor.foreground': '#dddddd',
            'editor.background': '#262626',
         },
      });
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
            syllableCount += syllables(word);
         });
      if (line?.trim().startsWith('//') || line?.trim().startsWith('#')) {
         return '';
      }
      return syllableCount == 0 ? '' : syllableCount.toString();
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
         {
            word: 'really',
            syl: 2,
         },
      ];
      const replace = replacements.filter((item) => item.word === word)[0];
      return replace ? replace.syl : syl.countSyllables(word);
   };

   return (
      <Editor
         defaultLanguage="rhymdown"
         defaultValue="// some comment"
         theme="myCoolTheme"
         onMount={handleEditorDidMount}
         beforeMount={handleEditorWillMount}
      />
   );
};

export default TextEditor;
