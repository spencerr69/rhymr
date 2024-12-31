import TextEditor from './components/TextEditor';
import './styles/App.css';

const App = () => {
   return (
      <>
         <div className="main">
            <div className="editor">
               <TextEditor />
            </div>
         </div>
      </>
   );
};

export default App;
