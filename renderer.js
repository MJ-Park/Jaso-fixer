// renderer.js

function toast(string) {
  const toast = document.getElementById("toast");

  toast.classList.contains("reveal") ?
      (clearTimeout(removeToast), removeToast = setTimeout(function () {
          document.getElementById("toast").classList.remove("reveal")
      }, 1000)) :
      removeToast = setTimeout(function () {
          document.getElementById("toast").classList.remove("reveal")
      }, 1000)
  toast.classList.add("reveal"),
      toast.innerText = string
}
let removeToast;

const { ipcRenderer } = require('electron');

const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();

  const files = event.dataTransfer.files;
  Array.from(files).forEach(file => {
    const filePath = file.path;
    ipcRenderer.send('ondrop', filePath);
  });

  toast("변환이 완료되었습니다.");
});

dropArea.addEventListener('dragstart', (event) => {
  const filePath = event.target.getAttribute('data-filepath');
  
  event.dataTransfer.setData('text/plain', filePath);
  ipcRenderer.send('ondragstart', filePath);
});


// // renderer.js

// const { ipcRenderer } = require('electron');

// const dropArea = document.getElementById('drop-area');

// dropArea.addEventListener('dragover', (event) => {
//   event.preventDefault();
// });

// dropArea.addEventListener('drop', (event) => {
//   event.preventDefault();

//   const filePath = event.dataTransfer.files[0].path;

//   ipcRenderer.send('ondrop', filePath);
// });

// dropArea.addEventListener('dragstart', (event) => {
//   const filePath = event.target.getAttribute('data-filepath');
  
//   event.dataTransfer.setData('text/plain', filePath);
//   ipcRenderer.send('ondragstart', filePath);
// });
