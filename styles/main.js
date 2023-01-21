const books = [];
const RENDER_EVENT = 'render-book';
const KUNCI_PENYIMPANAN = 'BOOK_APPS';
const SAVED_EVENT = 'save-book';

function cekStorage(){
    if (typeof(Storage) === undefined){
        alert ("Maaf Browser Anda Tidak Mendukung");
        return false
    }
    return true;
}


function generateId(){
    return +new Date();
}

function generateBookObject(idBuku,judulBuku,pengarangBuku,timestamp,isCompleted){
    return{
        idBuku,
        judulBuku,
        pengarangBuku,
        timestamp,
        isCompleted
    };
}

function addBook(){
    const textJudul = document.getElementById('inputBookTitle').value;
    const textPenulis = document.getElementById('inputBookAuthor').value;
    const timestamp = document.getElementById('inputBookYear').value;
    const bukuSelesaiDiBaca = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textJudul, textPenulis, timestamp,bukuSelesaiDiBaca);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBooks(bookObject){
    const textJudul = document.createElement('h2');
    textJudul.innerText = bookObject.judulBuku;
    
    const textPenulis = document.createElement('h3');
    textPenulis.innerText = bookObject.pengarangBuku;
    
    const timestamp = document.createElement('p');
    timestamp.innerText = bookObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textJudul,textPenulis, timestamp);
   
    const container = document.createElement('div');
    container.classList.add('book_shelf');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function (){
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function (){
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function (){
            removeBookFromCompleted(bookObject.id);
        });


        container.append(checkButton,trashButton);
    }
    
    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBooks(bookItem);
        if(!bookItem.isCompleted)
            uncompletedBookList.append(bookElement);
            else
            completeBookshelfList.append(bookElement);
        
    }
});

document.addEventListener('DOMContentLoaded',function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()){
        loadDataFromStorage();
    }
});

function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    alert("Selamat Anda Sudah Mendapatkan Sebuah Pengetahuan");
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId){
    const bookTerget = findBookIndex(bookId);

    
    if (bookTerget === -1) return;
    let dialog = "Apakah anda Yakin Ingin Menghapus...?"
    if (confirm(dialog) == true){
        books.splice(bookTerget, 1);
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (const index in books){
        if (books[index].id === bookId){
            return index;
        }
    }

    return -1
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(KUNCI_PENYIMPANAN, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist(){
    if (typeof(Storage) === undefined){
        alert ('Browser Anda Tidak Mendukung Local Storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(KUNCI_PENYIMPANAN));
})

function loadDataFromStorage(){
    const serialData = localStorage.getItem(KUNCI_PENYIMPANAN);
    let data = JSON.parse(serialData);

    if (data !== null){
        for (const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}