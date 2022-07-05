// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');
    console.log("default localData",localData);

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });
    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.log("begining data",data);
      console.log("begining localData",localData);
      if(!data || !localData){
        this.editor.setValue(header);
      }
      console.info('Loaded data from IndexedDB, injecting into editor');
      // this.editor.setValue( data || localData || header);
      // this.editor.setValue( header || data || localData);
      // this.editor.setValue( localData || data[0].content || header);
      this.editor.setValue( localData?data[0].content:header);

      // Set the cursor at the end function
      this.editor.focus();
      // Set the cursor at the end of existing content
      this.editor.setCursor(this.editor.lineCount(), 0);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
      // console.log("new data --change",localStorage.getItem('content'));
      putDb(localStorage.getItem('content'));
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      // console.log("new data --blur",localStorage.getItem('content'));
      putDb(localStorage.getItem('content'));
    });
  }
}
