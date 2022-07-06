import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try{
    console.log('PUT to the database');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const request = store.put({id:1,content:content});
    const result = await request;
    console.log('🚀 - data saved to the database', result);
  }catch(err){
    console.error('putDb not implemented')
  }
  
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try{
    console.log('GET all from the database');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    // const request = store.getAll();
    const request = store.get(1);
    const result = await request;
    console.log('result.value', result);
    //if result is true will retrun result.content, false to return nudifined
    //eqaul -> return result ?result.content:result;
    return result && result.content;
    // return result.content;
  }catch(err){
    console.error('getDb not implemented');
  }
}

initdb();
