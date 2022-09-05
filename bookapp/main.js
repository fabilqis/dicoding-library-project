/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

const libss = [];
const RENDER_EVENT = 'render-libs';
const SAVED_EVENT = 'saved-libs';
const STORAGE_KEY = 'Book_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, bookYear, isCompleted) {
  return {
    id,
    title,
    author,
    bookYear,
    isCompleted
  };
}

function findBook(libsId) {
  for (const libsItem of libss) {
    if (libsItem.id === libsId) {
      return libsItem;
    }
  }
  return null;
}

function findBookIndex(libsId) {
  for (const index in libss) {
    if (libss[index].id === libsId) {
      return index;
    }
  }
  return -1;
}


function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(libss);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const libs of data) {
      libss.push(libs);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(libsObject) {

  const {id, title, author ,bookYear, isCompleted} = libsObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = bookYear;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `libs-${id}`);

  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.textContent += "Belum selesai dibaca";
    undoButton.classList.add('green');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.textContent += "Mau dihapus";
    trashButton.classList.add('red');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.textContent += "Sudah selesai dibaca";
    checkButton.classList.add('green');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.textContent += "Mau dihapus";
    trashButton.classList.add('red');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById('inputBookTitle').value;
  const authorBook = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isCompleted = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const libsObject = generateBookObject(generatedID, textBook, authorBook, bookYear, isCompleted);
  libss.push(libsObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(libsId) {
  const libsTarget = findBook(libsId);
  if (libsTarget == null) return;
  
  libsTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(libsId) {
  const libsTarget = findBookIndex(libsId);

  if (libsTarget === -1) return;

  libss.splice(libsTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(libsId) {

  const libsTarget = findBook(libsId);
  if (libsTarget == null) return;

  libsTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm  = document.getElementById('inputBook');
  const searchForm  = document.getElementById('searchBook');


  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    findDatabyTitle();

  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('uncomplete-libss');
  const listCompleted = document.getElementById('completed-libss');

  uncompletedBookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const libsItem of libss) {
    const libsElement = makeBook(libsItem);
    if (libsItem.isCompleted) {
      listCompleted.append(libsElement);
    } else {
      uncompletedBookList.append(libsElement);
    }
  }
});

function findDatabyTitle() {
  const searchBookTitle = document.querySelector('#searchBookTitle');
  const find = searchBookTitle.value.toLowerCase();


  const incompleteBookshelfList = document.getElementById('uncomplete-libss');
  const childincomplete = incompleteBookshelfList.getElementsByTagName('div');
  for (let i = 0; i < childincomplete.length; i++) {
    const heading = childincomplete[i].getElementsByTagName('h2')[0];
    console.log(heading)

    let textValue = heading.textContent || heading.innerText;
    if (textValue.toLowerCase().indexOf(find) > -1) {
      childincomplete[i].style.display = '';

    } else {
      childincomplete[i].style.display = 'none';
    }
  }
  const completeBookshelfList = document.getElementById('completed-libss');
  const childcomplete = completeBookshelfList.getElementsByTagName('div');
  for (let i = 0; i < childcomplete.length; i++) {
    const heading = childcomplete[i].getElementsByTagName('h2')[0];
    let textValue = heading.textContent || heading.innerText;
    if (textValue.toLowerCase().indexOf(find) > -1) {
      childcomplete[i].style.display = '';
    } else {
      childcomplete[i].style.display = 'none';
    }
  }
}
