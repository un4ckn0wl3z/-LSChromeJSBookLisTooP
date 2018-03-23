class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}
class UI {
  addBookToList(book){
    const list = document.getElementById('book-list');  
    // Create <tr>
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = ` 
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);

  }

  showAlert(msg,clazz){

     // Create DIV
  const div = document.createElement('div');
  // Add class name
  div.className = `alert ${clazz}`;
  // Add text node
  div.appendChild(document.createTextNode(msg));
  // Parent
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  // add alert between container and form
  container.insertBefore(div,form);

  // Timeout
  setTimeout(function(){
    document.querySelector('.alert').remove();
  },3000);
  }

  deleteBook(target){

    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
  }

  clearField(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

}
// Local Persistance
class Store{

  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;

  }
  static displayBooks(){
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI();
      // add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach(function(book,index){
     if(book.isbn === isbn){
      books.splice(index,1);
     }
    });
    localStorage.setItem('books',JSON.stringify(books));
  }

}
// DOM Loader

document.addEventListener('DOMContentLoaded',Store.displayBooks());

// Evernt listener
document.getElementById('book-form').addEventListener('submit',function(e){
  // Get form values
  const title = document.getElementById('title').value,author = document.getElementById('author').value,
  isbn = document.getElementById('isbn').value;

  // Instance book
  const book = new Book(title,author,isbn);

  // Instance UI

  const ui = new UI();

  // Validate

  if(title === '' || author === '' || isbn === 'j'){
    // Alert
    ui.showAlert("กรุณากรอกข้อมูลให้ครบถ้วน","error");
  }else{
  // Add book to list

  ui.addBookToList(book);

  // add to local persistance

  Store.addBook(book);


  // Alert
  ui.showAlert("เพิ่มหนังสือเรียบร้อยแล้ว","success");

  // UI clear field
  ui.clearField();
  }



  e.preventDefault();
});

// Event listener for del

document.getElementById('book-list').addEventListener('click',function(e){

  const ui = new UI();
  ui.deleteBook(e.target);

  //Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert('ลบหนังสือเรียบร้อยแล้ว','success');

  e.preventDefault();
});
